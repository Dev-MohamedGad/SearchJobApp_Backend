import joi, { ObjectSchema } from "joi";
import { generalFields } from "../../middleware/validation";

interface AddJobValidation {
    body: ObjectSchema;
    headers: ObjectSchema;
}

export const addJobVal: AddJobValidation = {
    body: joi.object({
        jobTitle: joi.string().required(),
        jobLocation: joi.string().required(),
        workingTime: joi.string().valid('part-time', 'full-time').required(),
        seniorityLevel: joi.string().required(),
        jobDescription: joi.string().required(),
        technicalSkills: joi.array().required(),
        softSkills: joi.array().required(),
    }),
    headers: generalFields.headers.required()
};
