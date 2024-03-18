import { Router } from "express";
import * as JV from "./job.validation";
import * as JC from "./job.controller";
import { validationController } from "../../middleware/validation";
import { auth } from "../../middleware/auth";
import { validRoles } from "../../utils/systemRoles";
import { filteration, uploadFile } from "../../middleware/multer";

const router = Router();

router.post("/addJob", auth(validRoles.Company_HR), validationController(JV.addJobVal), JC.addJob);
router.patch("/updateJob/:id", auth(validRoles.Company_HR), JC.updateJob);
router.get("/getSpecific", auth([validRoles.User, validRoles.Company_HR]), JC.getSpecificJob);
router.get("/getAllJobs", auth([validRoles.User, validRoles.Company_HR]), JC.getJobs);
router.get("/filterJobs", auth([validRoles.User, validRoles.Company_HR]), JC.filterJobs);
router.post("/applyToJob/:jobId", uploadFile(filteration.file).single("pdf"), auth(validRoles.User), JC.applyToJob);

export default router;
