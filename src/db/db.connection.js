import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect("mongodb://127.0.0.1:27017/job-search-app")
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((error) => {
      console.error(error.message);
    });
};
