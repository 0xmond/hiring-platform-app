export const notFoundError = (req, res, next) => {
  return next(new Error("Not found", { cause: 404 }));
};
