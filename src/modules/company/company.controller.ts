import { Request, Response, NextFunction } from "express";
import companyModel from "../../../DB/models/company.model";
import jobModel from "../../../DB/models/job.model";

export const addCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    companyName,
    description,
    industry,
    address,
    from,
    to,
    companyEmail,
  } = req.body;
  const isExist = await companyModel.findOne({ companyName });
  if (isExist) {
    return next({ message: "company name already exists", cause: 409 });
  }
  const isCompanyEmail = await companyModel.findOne({ companyEmail });
  if (isCompanyEmail) {
    return next({ message: "company email already exists", cause: 409 });
  }
  const isCompanyOwnerExist = await companyModel.findOne({
    company_hr: req.user._id,
  });
  if (isCompanyOwnerExist) {
    return next({
      message: "company hr can only have one company",
      cause: 409,
    });
  }
  const company = await companyModel.create({
    companyName,
    description,
    address,
    industry,
    numberOfEmployees: { from, to },
    companyEmail,
    company_hr: req.user._id,
  });
  res.status(200).json({ message: "Done", company });
};

export const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    companyName,
    description,
    industry,
    address,
    from,
    to,
    companyEmail,
  } = req.body;
  const companyId = req.params.id;
  const company = await companyModel.findOne({
    _id: companyId,
    company_hr: req.user._id,
  });
  if (!company) {
    return next({
      message: "this company does not exist or does not belong to this user!",
      cause: 404,
    });
  }
  if (companyName) {
    const isNameExist = await companyModel.findOne({
      companyName,
      _id: { $ne: companyId },
    });
    if (isNameExist) {
      return next({ message: "this company name already exists!", cause: 409 });
    }
    company.companyName = companyName;
  }
  if (description) {
    company.description = description;
  }
  if (industry) {
    company.industry = industry;
  }
  if (address) {
    company.address = address;
  }
  if (from) {
    company.numberOfEmployees.from = from;
  }
  if (to) {
    company.numberOfEmployees.to = to;
  }
  if (companyEmail) {
    const isEmailExist = await companyModel.findOne({
      companyEmail,
      _id: { $ne: companyId },
    });
    if (isEmailExist) {
      return next(new Error("this company email already exists!", 409));
    }
    company.companyEmail = companyEmail;
  }
  await companyModel.updateOne(
    { _id: companyId },
    { companyName, description, industry, address, from, to, companyEmail }
  );
  res.status(200).json({ message: "Done!", company });
};

export const deleteCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const company = await companyModel.findOneAndDelete({
    _id: req.params.id,
    company_hr: req.user._id,
  });
  if (!company) {
    return next({
      message: "this company doesn't exist or you don't own this company",
      cause: 404,
    });
  }
  return res.status(200).json(company);
};

export const getCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const company = await companyModel.findOne({
    _id: req.params.id,
    company_hr: req.user._id,
  });
  if (!company) {
    return next({ message: "company not found", cause: 404 });
  }

  const jobs = await jobModel.find({ addedBy: company.company_hr });

  const result = company.toObject();
  result.jobs = jobs;

  res.status(200).json({ message: "Done", result });
};
