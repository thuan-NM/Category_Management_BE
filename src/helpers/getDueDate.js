const getDueDate = (borrowDate) => {
    const borrowingPeriodDays = 14; // Define the borrowing period in days
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + borrowingPeriodDays);
    return dueDate;
};

export {getDueDate}