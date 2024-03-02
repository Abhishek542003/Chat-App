import mongoose from "mongoose";
const connectDB = async() =>
{
    try
    {
         const conn = await mongoose.connect(process.env.MONGO_DB_URI);
         console.log(
           `MongoDB connected: ${conn.connection.host}`.bgMagenta.white
         );
    }
    catch (error)
    {
        console.log("Error connecting to MONGODB", error.message);
     }
}
 
export default connectDB;