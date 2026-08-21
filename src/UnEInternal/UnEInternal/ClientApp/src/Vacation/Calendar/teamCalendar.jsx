import React from 'react';
import styles from '../css/teamCalendar.module.css';
import { CalendarColumn } from './calendarColumn';
import { Calendar } from './calendar';
import { CalendarDay } from './calendarDay';
import { TeamCalendarColumn } from './teamCalendarColumn';

export class TeamCalendar extends Calendar {
    setInitDayTypes(year, month) {
        const none = CalendarDay.getNone();

        const dayTypes = {};

        for (let i = 1; i <= 31; i++) {
            dayTypes[i] = [none, none];
        }

        return dayTypes;
    }

    getEmptyMembers() {
        const members = {};

        for (let i = 1; i <= 31; i++) {
            members[i] = [[], []];
        }

        return members;
    }

    setMember(members, date, member, dayType) {
        const am = Calendar.getHalfAM();
        const pm = Calendar.getHalfPM();

        if (dayType === null) {
            if (date.type === am) {
                members[date.day][0].push(member);
            }
            else if (date.type === pm) {
                members[date.day][1].push(member);
            }
            else {
                members[date.day][0].push(member);
                members[date.day][1].push(member);
            }
        }
        else {
            if (dayType === am) {
                members[date.day][0].push(member);
            }
            else if (dayType === pm) {
                members[date.day][1].push(member);
            }
            else {
                members[date.day][0].push(member);
                members[date.day][1].push(member);
            }
        }
    }

    getDailyMembers(year, month) {
        const waitingMembers = this.getEmptyMembers();
        const permitMembers = this.getEmptyMembers();
        const usedMembers = this.getEmptyMembers();

        const am = Calendar.getHalfAM();
        const pm = Calendar.getHalfPM();

        const today = new Date();
        const todayNumber = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const thisHour = today.getHours();

        const memberCount = this.props.memberDatas.length;

        for (let i = 0; i < memberCount; i++) {
            const member = this.props.memberDatas[i];
            let memberHistory = this.props.membersHistory.memberHistories[member.id];

            if (memberHistory) {
                if (memberHistory.year === year - 1) {
                    memberHistory = this.props.membersHistory.memberHistoriesNextYear[member.id];
                }
                else if (memberHistory.year === year + 1) {
                    memberHistory = this.props.membersHistory.memberHistoriesLastYear[member.id];
                }
            }

            if (!memberHistory) {
                continue;
            }

            const vacationCount = memberHistory.usedVacations.length;

            for (let j = 0; j < vacationCount; j++) {
                const vacation = memberHistory.usedVacations[j];
                const dateCount = vacation.dates.length;

                for (let k = 0; k < dateCount; k++) {
                    const date = vacation.dates[k];

                    if (date.year !== year || date.month !== month) {
                        continue;
                    }

                    const dateNumber = date.year * 10000 + date.month * 100 + date.day;

                    if (vacation.isPermitted) {
                        if (dateNumber < todayNumber) {
                            this.setMember(usedMembers, date, member, null);
                        }
                        else if (dateNumber === todayNumber) {
                            if (thisHour < 12) {
                                if (date.type === am) {
                                    this.setMember(usedMembers, date, member, null);
                                }
                                else if (date.type === pm) {
                                    this.setMember(permitMembers, date, member, null);
                                }
                                else {
                                    this.setMember(usedMembers, date, member, am);
                                    this.setMember(permitMembers, date, member, pm);
                                }
                            }
                            else {
                                this.setMember(usedMembers, date, member, null);
                            }
                        }
                        else {
                            this.setMember(permitMembers, date, member, null);
                        }
                    }
                    else {
                        if (dateNumber < todayNumber) {
                            continue;
                        }
                        else if (dateNumber === todayNumber) {
                            if (thisHour < 12) {
                                if (date.type === am) {
                                    continue;
                                }
                                else if (date.type === pm) {
                                    this.setMember(waitingMembers, date, member, null);
                                }
                                else {
                                    this.setMember(waitingMembers, date, member, pm);
                                }
                            }
                            else {
                                continue;
                            }
                        }
                        else {
                            this.setMember(waitingMembers, date, member, null);
                        }
                    }
                }
            }
        }

        return [waitingMembers, permitMembers, usedMembers];
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

        const fromTo = this.makeFromToDate();
        const dayTypes = this.setInitDayTypes(year, month);

        const dailyMembers = this.getDailyMembers(year, month);

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
                        <TeamCalendarColumn key={day} fromTo={fromTo} year={year} month={month} firstDay={day - firstWeekDay + 1} weekDay={day} monthDay={monthDay} rowCount={rowCount} dayTypes={dayTypes} onClickDay={this.props.onClickDay} dailyMembers={dailyMembers} showReservation={this.props.showReservation} showUsed={this.props.showUsed} showWait={this.props.showWait}/>
                    ))
                }
                </div>
            </div>
        );
    }
}