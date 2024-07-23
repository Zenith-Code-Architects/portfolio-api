import { addVolunteering, deleteVolunteering, getAllUserVolunteering, getVolunteeringById, updateVolunteering } from "../controllers/volunteering.js";
import { Router } from "express";
import { checkUserSession } from "../middleware/auth.js";

// create router
const volunteeringRouter = Router();

// define routes
volunteeringRouter.post('/user/volunteering', checkUserSession, addVolunteering)

volunteeringRouter.get('/user/volunteering', checkUserSession, getAllUserVolunteering)

volunteeringRouter.get('/user/volunteering/:id', checkUserSession, getVolunteeringById)

volunteeringRouter.patch('/user/volunteering/:id', checkUserSession, updateVolunteering)

volunteeringRouter.delete('/user/volunteering/:id', checkUserSession, deleteVolunteering)

// export router
export default volunteeringRouter