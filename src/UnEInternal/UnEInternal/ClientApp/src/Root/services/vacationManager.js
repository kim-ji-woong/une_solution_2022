import { Calendar } from '../../Vacation/Calendar/calendar';

export class VacationManager {
    // 소수점 한자리까지만 표시한다.
    static floatString(data) {
        const str = data.toFixed(1);

        if (str.endsWith(".0")) {
            return str.substring(0, str.length - 2);
        }

        return str;
    }

    static getDay(date) {
        const allDay = Calendar.getAllDay();

        if (date.type === allDay) {
            return 1;
        }

        return 0.5;
    }

    static getHistoryData(history) {
        const detailCount = history.usedVacations.length;

        let usedDays = 0;
        let waitingDays = 0;
        let reservationDays = 0;

        const am = Calendar.getHalfAM();
        const pm = Calendar.getHalfPM();

        const date = new Date();
        const thisYear = date.getFullYear();
        const thisMonth = date.getMonth() + 1;
        const thisDay = date.getDate();
        const today = thisYear * 10000 + thisMonth * 100 + thisDay;

        for (let i = 0; i < detailCount; i++) {
            const detail = history.usedVacations[i];

            if (detail.isPermitted) {
                const dateCount = detail.dates.length;

                for (let j = 0; j < dateCount; j++) {
                    const _date = detail.dates[j];

                    if (_date.year !== history.year) {
                        continue;
                    }

                    const dateNumber = _date.year * 10000 + _date.month * 100 + _date.day;

                    if (dateNumber < today) {
                        usedDays += VacationManager.getDay(_date);
                    }
                    else if (dateNumber > today) {
                        reservationDays += VacationManager.getDay(_date);
                    }
                    else {
                        if (date.getHours() >= 12) {
                            usedDays += VacationManager.getDay(_date);
                        }
                        else {
                            if (_date.type === am) {
                                usedDays += 0.5;
                            }
                            else if (_date.type === pm) {
                                reservationDays += 0.5;
                            }
                            else {
                                usedDays += 1;
                            }
                        }
                    }
                }
            }
            else {
                waitingDays += detail.totalDays;
            }
        }

        let svDays = 0;
        const svCount = history.annualVacation.specialVacations.length;

        for (let i = 0; i < svCount; i++) {
            const sv = history.annualVacation.specialVacations[i];
            svDays += sv.days;
        }

        return [usedDays, reservationDays, waitingDays, history.totalDays - usedDays - reservationDays - waitingDays, svDays];
    }
}