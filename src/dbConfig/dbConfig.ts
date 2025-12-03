import mongoose from "mongoose";

export async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Mongo DB connected successfully");
    });

    connection.on("error", (err) => {
      console.log("Mongo DB connection error:", err);
    });
  } catch (error) {
    console.log("Error connecting to the database:", error);
  }
}
