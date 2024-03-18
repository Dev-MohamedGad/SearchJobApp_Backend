import { Schema, model } from "mongoose";


const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            minlength: 2,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            minlength: 2,
            trim: true
        },
        userName: {
            type: String,
            minlength: 4,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true
        },
        recoveryEmail: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
        },
        DOB: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            unique: true,
            required: true,
        },
        status: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: ["User", "Company_HR"],
            default: "User"
        },
        code: {
            type: String
        }
    },
    {
        timestamps: true
    }
);
userSchema.pre("save",function(next){
    this.userName = this.firstName + " " + this.lastName
    next()
})

const userModel = model("user", userSchema);
export default userModel;
