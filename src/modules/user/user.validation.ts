import coreJoi, { ObjectSchema } from "joi";
import joiDate from "@joi/date";
import {generalFields} from "../../middleware/validation";

const joi = coreJoi.extend(joiDate);

interface SignUpSchema {
    body: ObjectSchema;
}

interface SignInSchema {
    body: ObjectSchema;
    file?: ObjectSchema;
}

interface UpdateUserSchema {
    body: ObjectSchema;
    headers?: ObjectSchema;
}

export const signUp: SignUpSchema = {
    body: joi.object({
        firstName: joi.string().min(2).max(15).alphanum().required(),
        lastName: joi.string().min(2).max(15).alphanum().required(),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'eg'] } }).required(),
        recoveryEmail: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'eg'] } }).required(),
        password: joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/)).required(),
        DOB: joi.date().format("YYYY-MM-DD"),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/).required(),
        role: joi.string().valid("User", "Company_HR")
    }).required()
};

export const signIn: SignInSchema = {
    body: joi.object({
        email: generalFields.email,
        phone: generalFields.phone,
        password: generalFields.password.required()
    }),
    file: generalFields.file
};

export const updateUser: UpdateUserSchema = {
    body: joi.object({
        firstName: joi.string().min(2).max(15).alphanum(),
        lastName: joi.string().min(2).max(15).alphanum(),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'eg'] } }),
        recoveryEmail: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'eg'] } }),
        DOB: joi.date().format("YYYY-MM-DD"),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/),
    }),
    headers: generalFields.headers.required()
};
