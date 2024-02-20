import { connect } from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI);
    console.log(`MongoDb connected at ${conn.connection.port}`);
  } catch (error) {
    console.log("error : ", error);
    process.exit();
  }
};
