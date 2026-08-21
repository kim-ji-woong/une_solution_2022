import React from 'react';
import { Calendar } from './calendar';
import { TeamCalendarDay } from './teamCalendarDay';
import styles from '../css/teamCalendar.module.css';
import { CalendarColumn } from './calendarColumn';

export class TeamCalendarColumn extends CalendarColumn {
    getDailyMembers(day) {
        return [this.props.dailyMembers[0][day], this.props.dailyMembers[1][day], this.props.dailyMembers[2][day]];
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

        return (
            <div className={columnClassName}>
                <div className={styles.weekday}>{Calendar.getWeekday(this.props.weekDay)}</div>
                {
                    days.map(day => (
                        <TeamCalendarDay key={this.props.year * 10000 + this.props.month * 100 + day} fromTo={this.props.fromTo} year={this.props.year} month={this.props.month} day={day} monthDay={this.props.monthDay} holiday={holiday} dayType={this.getDayType(day)} dailyMembers={this.getDailyMembers(day)} onClickDay={this.props.onClickDay} showReservation={this.props.showReservation} showUsed={this.props.showUsed} showWait={this.props.showWait}/>
                        ))
                }
            </div>
        );
    }
}