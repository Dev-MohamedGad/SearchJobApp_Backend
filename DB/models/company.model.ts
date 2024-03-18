import { Schema, model, Types } from "mongoose";

const compnySchema = new Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  industry: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  numberOfEmployees: {
    from: { type: Number, min: 1, max: 21 },
    to: { type: Number, min: 1, max: 21 },
  },
  companyEmail: {
    type: String,
    unique: true,
    required: true,
  },
  company_hr: {
    type: Types.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },
});

const companyModel = model("company", compnySchema);
export default companyModel;
