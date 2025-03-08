export const getYearDifference = (date1, date2) => {
  return Math.abs(
    new Date(date1).getFullYear() - new Date(date2).getFullYear()
  );
};
