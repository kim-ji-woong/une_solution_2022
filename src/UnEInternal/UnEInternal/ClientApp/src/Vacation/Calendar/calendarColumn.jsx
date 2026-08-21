import React, { Component } from 'react';
import { Calendar } from './calendar';
import { CalendarDay } from './calendarDay';
import styles from '../css/calendar.module.css';

export class CalendarColumn extends Component {
    getDays() {
        const days = [];

        for (let i = 0; i < this.props.rowCount; i++) {
            if (i === 0) {
                days.push(this.props.firstDay);
            }
            else {
                days.push(i * 7 + this.props.firstDay);
            }
        }

        return days;
    }

    getDayType(day) {
        if (day <= 0 || day > 31) {
            return [0, 0];
        }

        const dayType = this.props.dayTypes[day];
        return dayType;
        //return this.props.dayTypes[day];
    }

    render() {
        let columnClassName = styles.column;

        if (this.props.rowCount === 4) {
            columnClassName += " " + styles._4;
        }
        else if (this.props.rowCount === 6) {
            columnClassName += " " + styles._6;
        }

        const days = this.getDays();

        // 토,일요일은 제외
        const holiday = this.props.weekDay === 0 || this.props.weekDay === 6;
        let editable = this.props.editable && holiday === false;

        return (
            <div className={columnClassName}>
                <div className={styles.weekday}>{Calendar.getWeekday(this.props.weekDay)}</div>
                {
                    days.map(day => (
                        <CalendarDay key={this.props.year * 10000 + this.props.month * 100 + day} fromTo={this.props.fromTo} year={this.props.year} month={this.props.month} day={day} monthDay={this.props.monthDay} holiday={holiday} editable={editable} dayType={this.getDayType(day)} onClickDay={this.props.onClickDay}/>
                        ))
                }
            </div>
        );
    }
}