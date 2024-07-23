import { addAchievements, deleteAchievements, getAchievements, getOneAchievements, updateAchievements } from "../controllers/achievements.js";
import { remoteUpload } from "../middleware/uploads.js";
import { Router } from "express";
import { checkUserSession } from "../middleware/auth.js";

export const achievementRouter = Router();

achievementRouter.post('/user/achievements',remoteUpload.single('image'),checkUserSession, addAchievements)

achievementRouter.get('/user/achievements',checkUserSession, getAchievements)

achievementRouter.get('/user/achievements/:id',checkUserSession, getOneAchievements)

achievementRouter.patch('/user/achievements/:id',remoteUpload.single('image'),checkUserSession, updateAchievements)

achievementRouter.delete('/user/achievements/:id',checkUserSession, deleteAchievements)

