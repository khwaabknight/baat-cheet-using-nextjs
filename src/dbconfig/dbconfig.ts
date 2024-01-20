import mongoose, { connection } from "mongoose";


export async function connect() {
    try {
        await mongoose.connect(process.env.DATABASE_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('Mongo db connected successfully');
        })

        connection.on('error', (error) =>{
            console.log('Mongo Db connection error. Please make sure MongoDb is running. ' + error)
            process.exit(1);
        })
    } catch (error) {
        console.log("Something went wrong!");
        console.log(error);
    }
}