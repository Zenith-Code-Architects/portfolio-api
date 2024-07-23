import { addSkill, deleteSkill, getAllUserSkills, getSkillById, updateSkills } from "../controllers/skills.js";
import { Router } from "express";
import { checkUserSession } from "../middleware/auth.js";

// create skill router
const skillRouter = Router();

skillRouter.post('/user/skills', checkUserSession, addSkill)

skillRouter.get('/user/skills', checkUserSession, getAllUserSkills)

skillRouter.get('/user/skills/:id', checkUserSession, getSkillById)

skillRouter.patch('/user/skills/:id', checkUserSession, updateSkills)

skillRouter.delete('/user/skills/:id', checkUserSession, deleteSkill)

// export router
export default skillRouter