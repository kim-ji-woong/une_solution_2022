import React, { Component } from 'react';
import styles from '../css/calendar.module.css';
import { CalendarColumn } from './calendarColumn';
import { CalendarDay } from './calendarDay';

export class Calendar extends Component {
    static WeekdayIndex = [0, 1, 2, 3, 4, 5, 6];
    static Weekday = ["일", "월", "화", "수", "목", "금", "토"];
    static EmptyDay = 0;
    static AllDay = 1;
    static HalfAM = 2;
    static HalfPM = 3;

    static getWeekday(index) {
        return Calendar.Weekday[index];
    }

    static getEmptyDay() {
        return Calendar.EmptyDay;
    }

    static getAllDay() {
        return Calendar.AllDay;
    }

    static getHalfAM() {
        return Calendar.HalfAM;
    }

    static getHalfPM() {
        return Calendar.HalfPM;
    }

    static getFromToCalendar(loginUser) {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1 + loginUser.reservationMonth;

        if (month > 12) {
            month -= 12;
            year++;
        }

        return {
            from: {
                year: loginUser.startYear,
                month: loginUser.startMonth
            },
            to: {
                year: year,
                month: month
            }
        };
    }

    lastDayofMonth(year, month) {
        return 32 - new Date(year, month - 1, 32).getDate();
    }

    getRowCount(year, month) {
        const monthDay = this.lastDayofMonth(year, month);
        const dateFirst = new Date(year, month - 1, 1);
        const firstWeekDay = dateFirst.getDay();
        let rowCount = 0;

        if (firstWeekDay === 0) {
            if (monthDay === 28) {
                rowCount = 4;
            }
            else {
                rowCount = 5;
            }
        }
        else if (firstWeekDay >= 1 && firstWeekDay <= 4) {
            rowCount = 5;
        }
        else if (firstWeekDay === 5) {
            if (monthDay <= 30) {
                rowCount = 5;
            }
            else {
                rowCount = 6;
            }
        }
        else// if (firstWeekDay === 6)
        {
            if (monthDay <= 29) {
                rowCount = 5;
            }
            else {
                rowCount = 6;
            }
        }

        return [rowCount, firstWeekDay, monthDay];
    }

    getLeftDateClassName(year, month) {
        const fromDate = this.props.fromTo.from.year * 100 + this.props.fromTo.from.month;
        const thisDate = year * 100 + month;

        if (thisDate <= fromDate) {
            return styles.btnDate + " " + styles.disabled;
        }

        return styles.btnDate;
    }

    getRightDateClassName(year, month) {
        const toDate = this.props.fromTo.to.year * 100 + this.props.fromTo.to.month;
        const thisDate = year * 100 + month;

        if (thisDate >= toDate) {
            return styles.btnDate + " " + styles.disabled;
        }

        return styles.btnDate;
    }

    makeFromToDate() {
        const date = new Date();

        // 오늘날짜 기준
        const fromTo = {
            from:
            {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            },
            to:
            {
                year: this.props.fromTo.to.year,
                month: this.props.fromTo.to.month,
                day: date.getDate()
            }
        }

        return fromTo;
    }

    setInitDayTypes(year, month) {
        const none = CalendarDay.getNone();
        const waiting = CalendarDay.getWaitingDay();
        const reservation = CalendarDay.getReservation();
        const used = CalendarDay.getUsedDay();

        const dayTypes = {};

        for (let i = 1; i <= 31; i++) {
            dayTypes[i] = [none, none];
        }

        if (!this.props.vacations || !year || !month) {
            return dayTypes;
        }

        const thisDate = new Date();
        const today = thisDate.getFullYear() * 10000 + (thisDate.getMonth() + 1) * 100 + thisDate.getDate();
        const thisHour = thisDate.getHours();

        const vacationCount = this.props.vacations.length;

        for (let i = 0; i < vacationCount; i++) {
            const vacation = this.props.vacations[i];
            const dateCount = vacation.dates.length;

            for (let j = 0; j < dateCount; j++) {
                const date = vacation.dates[j];

                if (date.year !== year || date.month !== month) {
                    continue;
                }

                const dateNumber = date.year * 10000 + date.month * 100 + date.day;
                const [amType, pmType] = dayTypes[date.day];

                if (date.type === Calendar.HalfAM) {
                    if (vacation.isPermitted) {
                        if (dateNumber < today) {
                            dayTypes[date.day] = [used, pmType];
                        }
                        else if (dateNumber > today) {
                            dayTypes[date.day] = [reservation, pmType];
                        }
                        else {
                            dayTypes[date.day] = [used, pmType];
                        }
                    }
                    else {
                        dayTypes[date.day] = [waiting, pmType];
                    }
                }
                else if (date.type === Calendar.HalfPM) {
                    if (vacation.isPermitted) {
                        if (dateNumber < today) {
                            dayTypes[date.day] = [amType, used];
                        }
                        else if (dateNumber > today) {
                            dayTypes[date.day] = [amType, reservation];
                        }
                        else {
                            if (thisHour < 12) {
                                dayTypes[date.day] = [amType, reservation];
                            }
                            else {
                                dayTypes[date.day] = [amType, used];
                            }
                        }
                    }
                    else {
                        dayTypes[date.day] = [amType, waiting];
                    }
                }
                else {
                    if (vacation.isPermitted) {
                        if (dateNumber < today) {
                            dayTypes[date.day] = [used, used];
                        }
                        else if (dateNumber > today) {
                            dayTypes[date.day] = [reservation, reservation];
                        }
                        else {
                            if (thisHour < 12) {
                                dayTypes[date.day] = [used, reservation];
                            }
                            else {
                                dayTypes[date.day] = [used, used];
                            }
                        }
                    }
                    else {
                        dayTypes[date.day] = [waiting, waiting];
                    }
                }
            }
        }

        return dayTypes;
    }

    render() {
        const year = this.props.year;
        const month = this.props.month;
        const [rowCount, firstWeekDay, monthDay] = this.getRowCount(year, month);

        let calendarAreaClassName = styles.calendarArea;

        if (rowCount === 4) {
            calendarAreaClassName += " " + styles._4;
        }
        else if (rowCount === 6) {
            calendarAreaClassName += " " + styles._6;
        }

        //const date = `${year}년 ${month}월`;
        const editable = this.props.editable ? this.props.editable === "true" : false;

        const fromTo = this.makeFromToDate();
        const dayTypes = this.setInitDayTypes(year, month);

        return (
            <div className={calendarAreaClassName}>
                <div className={styles.date}>
                    <div className={styles.dateLeft}>
                        <div className={this.getLeftDateClassName(year, month)} onClick={() => this.props.onChangeMonth(false)}>
                            <i className="fas fa-chevron-left"></i>
                        </div>
                    </div>
                    <div className={styles.dateCenter}>
                        <span>{`${year}년`}</span>
                        <span>{` ${month}월`}</span>
                    </div>
                    <div className={styles.dateRight}>
                        <div className={this.getRightDateClassName(year, month)} onClick={() => this.props.onChangeMonth(true)}>
                            <i className="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </div>
                <div className={styles.dateItems}>
                {
                    Calendar.WeekdayIndex.map(day => (
                        <CalendarColumn key={day} fromTo={fromTo} year={year} month={month} firstDay={day - firstWeekDay + 1} weekDay={day} monthDay={monthDay} rowCount={rowCount} editable={editable} dayTypes={dayTypes} onClickDay={this.props.onClickDay}/>
                    ))
                }
                </div>
            </div>
        );
    }
}