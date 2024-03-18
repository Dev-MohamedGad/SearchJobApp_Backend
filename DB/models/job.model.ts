import { Schema, model, Types } from "mongoose";

const jobSchema = new Schema({
    jobTitle:{
        type:String,
        required:true,
        trim:true
    },
    jobLocation:{
        type:String,
        enum:['onsite','remote','hybrid']
    },
    workingTime:{
        type:String,
        enum:['part-time','full-time']
    },
    seniorityLevel:{
        type:String,
        enum:['Junior','Mid-Level','Senior','Team-Lead','CTO']
    },
    jobDescription:{
        type:String,
        required:true
    },
    technicalSkills:[String],
    softSkills:[String],
    addedBy:{
        type:Types.ObjectId,
        ref:'user',
        required:true
    }
})

const jobModel = model("job",jobSchema)
export default jobModel