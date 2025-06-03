import mongoose from "mongoose";
// import "dotenv/config" 

//Function to connect to the mongodb database

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("MongoDB connected")
    );

    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    // console.log(process.env.MONGODB_URI);
    
  } catch (error) {
    console.log(error);
  }
};
