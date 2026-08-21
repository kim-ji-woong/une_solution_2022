import React, { Component } from 'react';
import { Calendar } from './calendar';
import styles from '../css/teamCalendar.module.css';
import { CalendarDay } from './calendarDay';

export class TeamCalendarDay extends CalendarDay {
    static AndSoOn = "외...";

    setMembers(srcMembers, trgMembers, color, colors, show) {
        if (show) {
            const count = srcMembers.length;

            for (let i = 0; i < count; i++) {
                colors.push(color);
                trgMembers.push(srcMembers[i].name);
            }

            return count;
        }

        return 0;
    }

    set3Members(members, colors, waitCount, permitCount, usedCount) {
        const waitMember = waitCount >= 2 ? members[0] + TeamCalendarDay.AndSoOn : members[0];
        const permitMember = permitCount >= 2 ? members[waitCount] + TeamCalendarDay.AndSoOn : members[waitCount];
        const usedMember = usedCount >= 2 ? members[waitCount + usedCount] + TeamCalendarDay.AndSoOn : members[waitCount + usedCount];

        members.splice(0, members.length);
        colors.splice(0, colors.length);

        members.push(waitMember)
        members.push(permitMember);
        members.push(usedMember);

        colors.push(styles.waiting);
        colors.push(styles.reservation);
        colors.push(styles.used);
    }

    set2Members(members, colors, type1Count, type2Count) {
        if (type1Count >= 2 && type2Count >= 2) {
            const type1Member = members[0];
            const type1_1Member = type1Count >= 3 ? members[1] + TeamCalendarDay.AndSoOn : members[1];
            const type2Member = members[type1Count] + TeamCalendarDay.AndSoOn;

            const type1Color = colors[0];
            const type1_1Color = colors[1];
            const type2Color = colors[type1Count];

            members.splice(0, members.length);
            colors.splice(0, colors.length);

            members.push(type1Member);
            members.push(type1_1Member);
            members.push(type2Member);

            colors.push(type1Color);
            colors.push(type1_1Color);
            colors.push(type2Color);
        }
        else if (type1Count >= 2) {
            const type1Member = members[0];
            const type1_1Member = type1Count >= 3 ? members[1] + TeamCalendarDay.AndSoOn : members[1];
            const type2Member = members[type1Count];

            const type1Color = colors[0];
            const type1_1Color = colors[1];
            const type2Color = colors[type1Count];

            members.splice(0, members.length);
            colors.splice(0, colors.length);

            members.push(type1Member);
            members.push(type1_1Member);
            members.push(type2Member);

            colors.push(type1Color);
            colors.push(type1_1Color);
            colors.push(type2Color);
        }
        else if (type2Count >= 2) {
            const type1Member = members[0];
            const type2Member = members[type1Count];
            const type2_1Member = type2Count >= 3 ? members[type1Count] + TeamCalendarDay.AndSoOn : members[type1Count];

            const type1Color = colors[0];
            const type2Color = colors[type1Count];
            const type2_1Color = colors[type1Count + 1];

            members.splice(0, members.length);
            colors.splice(0, colors.length);

            members.push(type1Member);
            members.push(type2Member);
            members.push(type2_1Member);

            colors.push(type1Color);
            colors.push(type2Color);
            colors.push(type2_1Color);
        }
        else {
            const type1Member = members[0];
            const type2Member = members[type1Count];

            const type1Color = colors[0];
            const type2Color = colors[type1Count];

            members.splice(0, members.length);
            colors.splice(0, colors.length);

            members.push(type1Member);
            members.push(type2Member);

            colors.push(type1Color);
            colors.push(type2Color);
        }
    }

    set1Members(members, colors) {
        members.splice(3, members.length - 3);
        colors.splice(3, colors.length - 3);
        members[2] = members[2] + TeamCalendarDay.AndSoOn;
    }

    getMembers(index) {
        const [waitingMembers, permitMembers, usedMembers] = this.props.dailyMembers;

        if (!waitingMembers || !permitMembers || !usedMembers) {
            return [[], []];
        }

        const members = [];
        const colors = [];

        const waitCount = this.setMembers(waitingMembers[index], members, styles.waiting, colors, this.props.showWait);
        const permitCount = this.setMembers(permitMembers[index], members, styles.reservation, colors, this.props.showReservation);
        const usedCount = this.setMembers(usedMembers[index], members, styles.used, colors, this.props.showUsed);

        if (waitCount + permitCount + usedCount > 3) {
            if (waitCount > 0) {
                if (permitCount > 0) {
                    if (usedCount > 0) {
                        this.set3Members(members, colors, waitCount, permitCount, usedCount);
                    }
                    else {
                        this.set2Members(members, colors, waitCount, permitCount);
                    }
                }
                else {
                    if (usedCount > 0) {
                        this.set2Members(members, colors, waitCount, usedCount);
                    }
                    else {
                        this.set1Members(members, colors);
                    }
                }
            }
            else {
                if (permitCount > 0) {
                    if (usedCount > 0) {
                        this.set2Members(members, colors, permitCount, usedCount);
                    }
                    else {
                        this.set1Members(members, colors);
                    }
                }
                else {
                    this.set1Members(members, colors);
                }
            }
        }

        return [members, colors];
    }

    getMember(index, members) {
        if (index < members.length) {
            return members[index];
        }

        return "";
    }

    getColor(index, colors) {
        if (index < colors.length) {
            return " " + colors[index];
        }

        return "";
    }

    render() {
        const day = this.props.day <= 0 || this.props.day > this.props.monthDay ? "" : this.props.day.toString();
        const editable = false;

        const [leftMembers, leftColors] = this.getMembers(0);
        const [rightMembers, rightColors] = this.getMembers(1);
        
        const [amType, pmType] = this.props.dayType;
        const halfAMName = this.getAddName(amType, editable);
        const halfPMName = this.getAddName(pmType, editable);
        const leftEditable = this.getHalfEditable(amType, editable);
        const rightEditable = this.getHalfEditable(pmType, editable);
        let className = this.getClassName();

        //dailyMembers

        return (
            <div className={className}>
                <span className={styles.dayText}>{day}</span>
                <div className={styles.halfDays}>
                    <div ref={this.refLeft} className={styles.halfDay + halfAMName} onClick={() => this.onHalfDayClick(this.refLeft, leftEditable)}>
                        <span className={styles.memberName + this.getColor(0, leftColors)}>{this.getMember(0, leftMembers)}</span>
                        <span className={styles.memberName + this.getColor(1, leftColors)}>{this.getMember(1, leftMembers)}</span>
                        <span className={styles.memberName + this.getColor(2, leftColors)}>{this.getMember(2, leftMembers)}</span>
                    </div>
                    <div ref={this.refRight} className={styles.halfDay + halfPMName} onClick={() => this.onHalfDayClick(this.refRight, rightEditable)}>
                        <span className={styles.memberName + this.getColor(0, rightColors)}>{this.getMember(0, rightMembers)}</span>
                        <span className={styles.memberName + this.getColor(1, rightColors)}>{this.getMember(1, rightMembers)}</span>
                        <span className={styles.memberName + this.getColor(2, rightColors)}>{this.getMember(2, rightMembers)}</span>
                    </div>
                </div>
            </div>
        );
    }
}