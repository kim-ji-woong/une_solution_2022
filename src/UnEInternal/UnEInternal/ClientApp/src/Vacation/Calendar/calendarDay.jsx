import React, { Component } from 'react';
import { Calendar } from './calendar';
import styles from '../css/calendar.module.css';

export class CalendarDay extends Component {
    static None = 0;
    // 승인 대기중
    static WaitingDay = 1;
    // 승인 완료된 휴가
    static Rerservation = 2;
    // 사용된 휴가
    static UsedDay = 3;

    static getNone() {
        return CalendarDay.None;
    }

    static getWaitingDay() {
        return CalendarDay.WaitingDay;
    }

    static getReservation() {
        return CalendarDay.Rerservation;
    }

    static getUsedDay() {
        return CalendarDay.UsedDay;
    }

    refLeft = React.createRef();
    refRight = React.createRef();

    onHalfDayClick = (halfDay, editable) => {
        if (editable) {
            const element = halfDay.current;
            let dayType = halfDay === this.refLeft ? Calendar.getHalfAM() : Calendar.getHalfPM();
            let isActive = false;

            if (element.classList.contains(styles.active)) {
                element.classList.remove(styles.active);
                isActive = false;
            }
            else {
                element.classList.add(styles.active);
                isActive = true;
            }

            this.props.onClickDay(this.props.year, this.props.month, this.props.day, dayType, isActive);
        }
    }

    getClassName() {
        let className = styles.day;

        if (this.props.day <= 0 || this.props.day > this.props.monthDay) {
            className = styles.day + " " + styles.inactive;
            return className;
        }

        if (this.props.holiday && this.props.day > 0 && this.props.day <= this.props.monthDay) {
            className = styles.day + " " + styles.holiday;
        }
        /*else {
            const fromDate = this.props.fromTo.from.year * 10000 + this.props.fromTo.from.month * 100 + this.props.fromTo.from.day;
            const toDate = this.props.fromTo.to.year * 10000 + this.props.fromTo.to.month * 100 + this.props.fromTo.to.day;
            const thisDate = this.props.year * 10000 + this.props.month * 100 + this.props.day;

            if (thisDate < fromDate || thisDate > toDate) {
                className = styles.day + " " + styles.holiday;
            }
        }*/

        return className;
    }

    getEditable() {
        if (this.props.editable) {
            if (this.props.day > 0 && this.props.day <= this.props.monthDay) {
                const fromDate = this.props.fromTo.from.year * 10000 + this.props.fromTo.from.month * 100 + this.props.fromTo.from.day;
                const toDate = this.props.fromTo.to.year * 10000 + this.props.fromTo.to.month * 100 + this.props.fromTo.to.day;
                const thisDate = this.props.year * 10000 + this.props.month * 100 + this.props.day;

                if (thisDate >= fromDate && thisDate <= toDate) {
                    return true;
                }
            }
        }

        return false;
    }

    getAddName(dayType, editable, isAm) {
        if (editable && isAm) {
            const now = new Date();

            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const hour = now.getHours();

            if (this.props.year === year && this.props.month === month && this.props.day === day) {
                if (hour >= 12) {
                    editable = false;
                }
            }
        }

        if (dayType === CalendarDay.WaitingDay) {
            return " " + styles.waiting;
        }
        else if (dayType === CalendarDay.Rerservation) {
            return " " + styles.reservation;
        }
        else if (dayType === CalendarDay.UsedDay) {
            return " " + styles.used;
        }

        return editable ? " " + styles.enabled : "";
    }

    getHalfEditable(dayType, editable, isAm) {
        if (dayType === CalendarDay.WaitingDay) {
            return false;
        }
        else if (dayType === CalendarDay.Rerservation) {
            return false;
        }
        else if (dayType === CalendarDay.UsedDay) {
            return false;
        }

        if (editable && isAm) {
            const now = new Date();

            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const hour = now.getHours();

            if (this.props.year === year && this.props.month === month && this.props.day === day) {
                if (hour >= 12) {
                    editable = false;
                }
            }
        }

        return editable;
    }

    render() {
        const day = this.props.day <= 0 || this.props.day > this.props.monthDay ? "" : this.props.day.toString();
        const editable = this.getEditable();
        //const editable = this.props.editable && this.props.day > 0 && this.props.day <= this.props.monthDay;
        //const halfAddName = editable ? " " + styles.enabled : "";

        const [amType, pmType] = this.props.dayType;
        const halfAMName = this.getAddName(amType, editable, true);
        const halfPMName = this.getAddName(pmType, editable, false);
        const leftEditable = this.getHalfEditable(amType, editable, true);
        const rightEditable = this.getHalfEditable(pmType, editable, false);
        let className = this.getClassName();

        //vacations = { this.props.vacations };

        return (
            <div className={className}>
                <span className={styles.dayText}>{day}</span>
                <div className={styles.halfDays}>
                    <div ref={this.refLeft} className={styles.halfDay + halfAMName} onClick={() => this.onHalfDayClick(this.refLeft, leftEditable)} />
                    <div ref={this.refRight} className={styles.halfDay + halfPMName} onClick={() => this.onHalfDayClick(this.refRight, rightEditable)} />
                </div>
            </div>
        );
    }
}