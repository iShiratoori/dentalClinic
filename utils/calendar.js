const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0);
};

const getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28;
};

const calendar = {
    month_names,
    isLeapYear,
    getFebDays,
    generateCalendar: ({ month, year }) => {
        const days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const currDate = new Date();

        if (!month) month = currDate.getMonth();
        if (!year) year = currDate.getFullYear();

        const first_day = new Date(year, month, 1);
        const result = {
            currentDayIndex: '',
            currentMonth: month_names[month],
            months: month_names,
            year: year,
            days: [],
            getFulldate: () => {
                return `${result.days[result.currentDayIndex]} ${result.currentMonth} ${result.year}`;
            },
            getTime: () => {
                const currTime = new Date();
                const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
                return currTime.toLocaleTimeString('en-US', timeOptions);
            },
            getDay: () => {
                const currentDate = new Date();
                const day = currentDate.getDate();
                return day;
            }
        };

        for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
            const day = i - first_day.getDay() + 1;
            result.days.push(day);

            const currentDate = new Date(year, month, day);
            if (
                currentDate.getDate() === currDate.getDate() &&
                currentDate.getFullYear() === currDate.getFullYear() &&
                currentDate.getMonth() === currDate.getMonth()
            ) {
                result.currentDayIndex = i;
            }
        }

        return result;
    }
};

module.exports = calendar;