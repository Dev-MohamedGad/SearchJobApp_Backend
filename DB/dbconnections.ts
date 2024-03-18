import mongoose from "mongoose";


export const dbConnection = async () => {
    await mongoose.connect(process.env.dbUrl as string).then(() => {
        console.log(`db connected in ${process.env.dbUrl}`);
    }).catch((err) => {
        console.log({ msg: "fail connect to db", err });
    })
}