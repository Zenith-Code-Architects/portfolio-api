import { addExperience, deleteExperience, getExperience, getOneExperience, updateExperience } from "../controllers/experience.js";
import { Router } from "express";
import { checkUserSession } from "../middleware/auth.js";

export const experienceRouter = Router();

experienceRouter.post('/user/experiences',checkUserSession, addExperience)

experienceRouter.get('/user/experiences',checkUserSession, getExperience)

experienceRouter.get('/user/experiences/:id',checkUserSession, getOneExperience)

experienceRouter.patch('/user/experiences/:id',checkUserSession, updateExperience)

experienceRouter.delete('/user/experiences/:id',checkUserSession, deleteExperience)