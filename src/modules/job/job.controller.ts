import applicationModel from "../../../DB/models/application.model";
import companyModel from "../../../DB/models/company.model";
import jobModel from "../../../DB/models/job.model";
import cloudinary from "../../utils/cloudinary";
import { Request, Response, NextFunction } from 'express';

export const addJob = async (req: Request, res: Response, next: NextFunction) => {
	const {
		jobTitle,
		jobLocation,
		workingTime,
		seniorityLevel,
		jobDescription,
		technicalSkills,
		softSkills,
	} = req.body;

	const job = await jobModel.create({
		jobTitle,
		jobLocation,
		workingTime,
		seniorityLevel,
		jobDescription,
		technicalSkills,
		softSkills,
		addedBy: req.user._id
	});
	return res.json({ message: "Done", job });
}

export const updateJob = async(req: Request, res: Response, next: NextFunction) => {
	const {
		jobTitle,
		jobLocation,
		workingTime,
		seniorityLevel,
		jobDescription,
		technicalSkills,
		softSkills,
	} = req.body;
	const job = await jobModel.findOne({_id: req.params.id, addedBy: req.user._id});
	if (!job) {
		return next({message:"This job is not found or you do not own this job",cause: 404});
	}
	if (jobTitle) {
		job.jobTitle = jobTitle;
	}
	if (jobLocation) {
		job.jobLocation = jobLocation;
	}
	if (workingTime) {
		job.workingTime = workingTime;
	}
	if (seniorityLevel) {
		job.seniorityLevel = seniorityLevel;
	}
	if (jobDescription) {
		job.jobDescription = jobDescription;
	}
	if (technicalSkills) {
		job.technicalSkills = technicalSkills;
	}
	if (softSkills) {
		job.softSkills = softSkills;
	}
	const jobUpdate = await jobModel.findOneAndUpdate({_id: req.params.id}, {
		jobTitle,
		jobLocation,
		workingTime,
		seniorityLevel,
		jobDescription,
		technicalSkills,
		softSkills,
	}, { new: true });
	return res.json({ message: "Done!", jobUpdate });
}
export const getJobs = async(req: Request, res: Response, next: NextFunction) => {
	const jobs = await jobModel.find({});
	let results = [];
	for (const job of jobs) {
		const companies = await companyModel.find({ company_hr: job.addedBy });
		const objJob = job.toObject();
		objJob.companies = companies;
		results.push(objJob);
	}
	return res.status(200).json({ message: "Done!", results });
}

export const getSpecificJob = async(req: Request, res: Response, next: NextFunction) => {
	const company = await companyModel.findOne({ companyName: req.query.companyName });
	if (!company) {
		return next({message:"Company not found!", cause :404});
	}
	const jobs = await jobModel.find({ addedBy: company.company_hr });
	return res.status(200).json({ message: "Done!", jobs });
}

export const filterJobs = async(req: Request, res: Response, next: NextFunction) => {
	let filterQuery: any = {};
	if (req.query?.jobTitle) {
		filterQuery.jobTitle = req.query.jobTitle;
	}
	if (req.query?.jobLocation) {
		filterQuery.jobLocation = req.query.jobLocation;
	}
	if (req.query?.workingTime) {
		filterQuery.workingTime = req.query.workingTime;
	}
	if (req.query?.seniorityLevel) {
		filterQuery.seniorityLevel = req.query.seniorityLevel;
	}
	if (req.query?.technicalSkills) {
		filterQuery.technicalSkills = req.query.technicalSkills;
	}
	console.log({ filterQuery });
	const jobs = await jobModel.find(filterQuery);
	res.status(200).json({ message: "Done!", jobs });
}

export const applyToJob = async(req: Request, res: Response, next: NextFunction) => {
	const { userSoftSkills, userTechSkills } = req.body;
	const jobId = req.params.jobId;
	const userId = req.user._id;
	const job = await jobModel.find({ _id: jobId });
	if (!job) {
		return next({message:"Job not found", cause:404});
	}

	const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
		folder: "exam/userResumes"
	});

	const application = await applicationModel.create({ userSoftSkills, userTechSkills, userResume: { secure_url, public_id }, userId, jobId });
	return res.status(200).json({ message: "Done!", application });
}
