import userModel from "../../../DB/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { Request, Response, NextFunction } from "express";


export const signUp = 
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      firstName,
      lastName,
      email,
      recoveryEmail,
      password,
      DOB,
      phone,
      role,
    } = req.body;
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
      return next(new Error("User already exists"));
    }
    const hash = bcrypt.hashSync(password, 8);
    const user = await userModel.create({
      firstName,
      lastName,
      email,
      recoveryEmail,
      password: hash,
      DOB,
      phone,
      role,
    });
    user
      ? res.status(201).json({ msg: "done", user })
      : next(new Error("Failed to save user"));
  }


export const signIn =
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, phone } = req.body;
    const userExist = await userModel.findOne({
      $or: [{ email: email }, { phone }],
    });
    if (!userExist) {
      return next(new Error("Invalid credentials"));
    }
    const match = bcrypt.compareSync(password, userExist.password);
    if (!match) {
      return next(new Error("Invalid credentials"));
    }
    const token = jwt.sign(
      { id: userExist._id, email, role: userExist.role },
      process.env.TOKEN_SIGNATURE as string
    );
    await userModel.updateOne({ _id: userExist._id }, { status: true });
    return res.json({ message: "Signed-In", token });
  }


export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await userModel.findById(req.user._id);
  const { firstName, lastName, email, DOB, phone, recoveryEmail } = req.body;
  if (!user) {
    return next(new Error("User not found"));
  }
  if (firstName) {
    user.firstName = firstName;
  }
  if (lastName) {
    user.lastName = lastName;
  }
  if (DOB) {
    user.DOB = DOB;
  }
  if (phone) {
    const phoneExist = await userModel.findOne({ phone });
    if (phoneExist) {
      return next(new Error("Phone already exists"));
    }
    user.phone = phone;
  }
  if (email) {
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
      return next(new Error("Email already exists"));
    }
    user.email = email;
  }
  if (recoveryEmail) {
    user.recoveryEmail = recoveryEmail;
  }
  await user.save();
  res.status(200).json({ message: "Done!", user });
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = nanoid();
  await userModel.updateOne({ email: req.body.email }, { code });
  return res.json(code);
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userExist = await userModel.findOne({
    email: req.body.email,
    code: req.body.code,
  });
  if (!userExist) {
    return next(new Error("User doesn't exist or invalid code"));
  }
  const password = bcrypt.hashSync(req.body.password, 8);
  await userModel.updateOne({ email: req.body.email }, { password });
  return res.status(200).json({ message: "Password successfully reset" });
};
