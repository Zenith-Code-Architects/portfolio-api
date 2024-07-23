import { addEducation, deleteEducation, getEducation, getOneEducation, updateEducation } from "../controllers/education.js";
import { Router } from "express";
import { checkUserSession } from "../middleware/auth.js";

export const educationRouter = Router();

educationRouter.post('/user/educations',checkUserSession, addEducation)

educationRouter.get('/user/educations',checkUserSession, getEducation)

educationRouter.get('/user/educations/:id',checkUserSession, getOneEducation)

educationRouter.patch('/user/educations/:id',checkUserSession, updateEducation)

educationRouter.delete('/user/educations/:id',checkUserSession, deleteEducation)