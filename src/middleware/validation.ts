import joi, { Schema } from "joi";
import { Request, Response, NextFunction } from 'express';

interface JoiObjectSchema {
    [key: string]: Schema;
}

interface GeneralFields {
    file: Schema;
    phone: Schema;
    email: Schema;
    password: Schema;
    headers: Schema;
}

export  const generalFields: GeneralFields = {
    file: joi.object({
        size: joi.number().positive(),
        path: joi.string(),
        filename: joi.string(),
        destination: joi.string(),
        mimetype: joi.string(),
        encoding: joi.string(),
        originalname: joi.string(),
        fieldname: joi.string(),
        finalDest: joi.string()
    }),
    phone: joi.string().regex(/^01[0125][0-9]{8}$/),
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','eg'] } }),
    password: joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/)),
    headers: joi.object({
        'cache-control': joi.string(),
        'postman-token': joi.string(),
        'content-type': joi.string(),
        'user-agent': joi.string(),
        accept: joi.string(),
        'accept-encoding': joi.string(),
        connection: joi.string(),
        'content-length': joi.string(),
        authorization: joi.string(),
        host: joi.string()
    })
};

const dataMethods = ["body", "params", "query", "headers", "file","files"];

export const validationController = (schema: JoiObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationErrors: any[] = [];
        
        for (let index = 0; index < dataMethods.length; index++) {
            if (schema[dataMethods[index]]) {
                const validationRes = schema[dataMethods[index]].validate(req[dataMethods[index]], { abortEarly: false });
                if (validationRes.error) {
                    validationErrors.push(validationRes);
                }
            }
        }

        if (validationErrors.length) {
            return res.json({ message: "Error", validationErrors });
        }
        
        return next();
    };
};
