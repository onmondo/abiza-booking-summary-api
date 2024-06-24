export function daysInMonth(year: string | number, month: string | number): number {
    const enteredMonth: number = 
        (typeof month === "string")
        ? getMonth(year, month)
        : month;

    const enteredYear: number = 
        (typeof year === "string") 
        ? parseInt(year) 
        : year;

    return new Date(enteredYear, enteredMonth, 0).getDate();
}

export function getMonth(year: string | number, month: string): number {
    return new Date(Date.parse(month + ' 1, ' + year)).getMonth() + 1
}