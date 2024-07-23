import { addUserProfile, getUserProfile, updateUserProfile } from "../controllers/userProfile.js";
import { Router } from "express";
import { checkUserSession } from "../middleware/auth.js";
import { remoteUpload } from "../middleware/uploads.js";

// Create router
const userProfileRouter = Router();

// Define routes
userProfileRouter.post('/user/profile', remoteUpload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), checkUserSession, addUserProfile);

userProfileRouter.get('/user/profile', checkUserSession, getUserProfile);

userProfileRouter.patch('/user/profile/:id', remoteUpload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), checkUserSession, updateUserProfile);

// userProfileRouter.delete('/profile/:id', deleteUserProfile);

// Export router
export default userProfileRouter;
