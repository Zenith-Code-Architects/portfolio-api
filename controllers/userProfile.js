import { UserProfileModel } from "../models/userProfile.js";
import { UserModel } from "../models/user.js";
import { userProfile_schema } from "../schema/userProfile_schema.js";

// create one user profile per user
export const addUserProfile = async (req, res, next) => {
    try {
        const { error, value } = userProfile_schema.validate({
            ...req.body,
            profilePicture: req.files.profilePicture[0].filename,
            resume: req.files.resume[0].filename,
        });
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const userSessionId = req.session?.user?.id || req?.user?.id;
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).json('User not found');
        }

        // Create user profile with the value and uploaded file
        const userProfile = await UserProfileModel.create({
            ...value,
            user: userSessionId,
            profilePicture: req.files.profilePicture[0].filename,
            resume: req.files.resume[0].filename
        });
        // Update user's userProfile reference
        user.userProfile = userProfile.id;
        await user.save();

        // Return response
        res.status(201).json({ 
            message: 'User profile created',
            userProfile });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.user === 1) {
            return res.status(400).json('User profile already exists');
        }
        res.status(500).send(error);
        next(error)
    }
};

// function to create only one user profile per user without setting user as unique in userprofile model
// export const addUserProfile = async (req, res) => {
//     try {
//         const { error, value } = userProfile_schema.validate({
//             ...req.body,
//             profilePicture: req.files.profilePicture[0].filename,
//             resume: req.files.resume[0].filename,
//         });
//         if (error) {
//             return res.status(400).send(error.details[0].message);
//         }

//         const userSessionId = req.session?.user?.id || req?.user?.id;
//         const user = await UserModel.findById(userSessionId);
//         if (!user) {
//             return res.status(404).json('User not found');
//         }

//         // Check if user already has a userProfile
//         const existingProfile = await UserProfileModel.findOne({ user: userSessionId });
//         if (existingProfile) {
//             return res.status(400).json('User profile already exists');
//         }

//         // Ensure req.file exists and is populated correctly
//         if (!req.files) {
//             return res.status(400).json('No file uploaded');
//         }

//         // Create user profile with the value and uploaded file
//         const userProfile = await UserProfileModel.create({
//             ...value,
//             user: userSessionId,
//             profilePicture: req.files.profilePicture[0].filename,
//             resume: req.files.resume[0].filename 
//         });

//         // Update user's userProfile reference
//         user.userProfile = userProfile.id;
//         await user.save();

//         // Return response
//         res.status(201).json({ userProfile });
//     } catch (error) {
//         res.status(500).send(error);
//     }
// };


// GET user profile
export const getUserProfile = async (req, res, next) => {
    try {
        //Get user id from session or request
        const userSessionId = req.session?.user?.id || req?.user?.id;
        const userProfile = await UserProfileModel.findOne({ user: userSessionId })
        .populate({ 
            path: 'user', 
            select: '-password' 
        });
        if (!userProfile) {
            return res.status(200).json({userProfile});
        }
        // Return response
        res.status(200).json({ 
            message: 'User profile retrieved',
            userProfile });
    } catch (error) {
        next(error);
    }
};

// UPDATE user profile
export const updateUserProfile = async (req, res, next) => {
    try {
        // validation
        const { error, value } = userProfile_schema.validate({
            ...req.body,
            profilePicture: req.files.profilePicture[0].filename,
            resume: req.files.resume[0].filename,
        });
        if (error) {
            return res.status(400).send(error.details[0].message);
          }
        // Find user profile by ID and user session ID
        const userId = req.session?.user?.id || req?.user.id;
        const user = await UserModel.findById(userId);
        if (!user) {
          return res.status(404).send("User not found");
        }

        // const userProfile = await UserProfileModel.findOne({
        //     _id: req.params.id,
        //     user: req.session.user.id
        // });
       

        // Update user profile with new data
        const userProfile = await UserProfileModel.findByIdAndUpdate(
            req.params.id, value,
            // {
            //     ...req.body,
            //     profilePicture: req.files.profilePicture ? req.files.profilePicture[0].filename : userProfile.profilePicture,
            //     resume: req.files.resume ? req.files.resume[0].filename : userProfile.resume
            // },
            { new: true }
        );
         if (!userProfile) {
            return res.status(404).json('User profile not found');
        }
        // Return response
        res.status(200).json({
            message: 'User profile updated',
            userProfile });
    } catch (error) {
        next(error);
    }
};

// DELETE user profile
// export const deleteUserProfile = async (req, res, next) => {
//     try {
//         // Delete user profile by ID and user session ID
//         await UserProfileModel.findOneAndDelete({
//             _id: req.params.id,
//             user: req.session.user.id
//         });

//         // Return response
//         res.status(200).json('User profile deleted');
//     } catch (error) {
//         next(error);
//     }
// };
