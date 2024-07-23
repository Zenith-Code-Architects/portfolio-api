import { addProject, deleteProject, getAllUserProjects, getProjectById, updateProjects } from "../controllers/projects.js";
import { Router } from "express";
import { checkUserSession } from "../middleware/auth.js";

// Create router
const projectRouter = Router();

// Define routes
projectRouter.post('/user/projects', checkUserSession, addProject); // POST /projects

projectRouter.get('/user/projects', checkUserSession, getAllUserProjects); // GET /projects

projectRouter.get('/user/projects/:id', checkUserSession, getProjectById); // GET /project

projectRouter.patch('/user/projects/:id', checkUserSession, updateProjects); // PATCH /projects/:id

projectRouter.delete('/user/projects/:id', checkUserSession, deleteProject); // DELETE /projects/:id

// Export router
export default projectRouter;
