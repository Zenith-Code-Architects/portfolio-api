import { addLicense, deleteLicense, getLicense, getOneLicense, updateLicense, } from "../controllers/license_certification.js";
import { Router } from "express";
import { remoteUpload } from "../middleware/uploads.js";
import { checkUserSession } from "../middleware/auth.js";

export const licenseRouter = Router();

licenseRouter.post('/user/licenses',remoteUpload.single('media'),checkUserSession, addLicense)

licenseRouter.get('/user/licenses',checkUserSession, getLicense)

licenseRouter.get('/user/licenses/:id',checkUserSession, getOneLicense)

licenseRouter.patch('/user/licenses/:id',remoteUpload.single('media'),checkUserSession, updateLicense)

licenseRouter.delete('/user/licenses/:id',checkUserSession, deleteLicense)