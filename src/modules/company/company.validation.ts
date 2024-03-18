import joi from "joi"
import { generalFields } from "../../middleware/validation.js"
import { Types } from "mongoose"

const validateObjectId = (a,b)=>{
    if(Types.ObjectId.isValid(a)){
        return true
    }else{
        return b.message("in-valid id")
    }
}

export const addCompany = {
    body:joi.object({
        companyName:joi.string().min(2).max(30).required(),
        description:joi.string().min(2).max(100).required(),
        companyEmail:generalFields.email.required(),
        address:joi.string().required(),
        industry:joi.string().min(2).max(50).required(),
        from:joi.number().min(1).max(21).required(),
        to:joi.number().min(1).max(21).required(),
    }),
    headers:generalFields.headers.required()
}

export const updateCompany = {
    body:joi.object({
        companyName:joi.string().min(2).max(30),
        description:joi.string().min(2).max(100),
        companyEmail:generalFields.email,
        address:joi.string(),
        industry:joi.string().min(2).max(50),
        from:joi.number().min(1).max(21),
        to:joi.number().min(1).max(21),
    }),
    params:joi.object({
        id:joi.custom(validateObjectId)
    }),
    headers:generalFields.headers.required()
}

export const deleteCompany = {
    params:joi.object({
        id:joi.custom(validateObjectId)
    }),
    headers:generalFields.headers.required()
}