import { Router } from "express";
import * as CV from "./company.validation";
import * as CC from "./company.controller";
import { validationController } from "../../middleware/validation";
import { auth } from "../../middleware/auth";
import { validRoles } from "../../utils/systemRoles";

const router = Router();

router.post("/addCompany", auth(validRoles.Company_HR), validationController(CV.addCompany), CC.addCompany);
router.patch("/updateCompany/:id", validationController(CV.updateCompany), auth(validRoles.Company_HR), CC.updateCompany);
router.delete("/deleteCompany/:id", validationController(CV.deleteCompany), auth(validRoles.Company_HR), CC.deleteCompany);

router.get("/getCompany/:id", auth(validRoles.Company_HR), CC.getCompany);

export default router;
