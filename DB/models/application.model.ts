import { Schema, model, Types } from "mongoose";

const applicationSchema = new Schema(
    {
        jobId:{
            type:Types.ObjectId,
            ref:"job",
            required:true
        },
        userId:{
            type:Types.ObjectId,
            ref:"user",
            required:true
        },
        userResume:Object,
        userTechSkills:[String],
        userSoftSkills:Array
    }
)

const applicationModel = model("application",applicationSchema)
export default applicationModel