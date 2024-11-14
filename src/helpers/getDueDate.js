const getDueDate = (borrowDate) => {
    const borrowingPeriodDays = 14;
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + borrowingPeriodDays);
    dueDate.setHours(23, 59, 59, 999); // Set to end of the day
    return dueDate;
};


export { getDueDate }