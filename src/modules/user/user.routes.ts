import { Router } from "express";
import * as UV from "./user.validation";
import * as UC from "./user.controller";
import { validationController } from "../../middleware/validation";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/signUp", validationController(UV.signUp), UC.signUp);
router.post("/signIn", validationController(UV.signIn), UC.signIn);
router.patch("/updateUser", auth("Company_HR"), UC.updateUser);

export default router;
