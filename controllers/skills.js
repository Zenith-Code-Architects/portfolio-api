import { SkillsModel } from "../models/skills.js";
import { UserModel } from "../models/user.js";
import { skills_schema } from "../schema/skills_schema.js";

export const addSkill = async (req, res, next) => {
    try {
        // Validate skill data
        const { error, value } = skills_schema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Get user ID from session
        const userSessionId = req.session?.user?.id || req?.user?.id;

        // Find the user by userSessionId
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).json('User not found');
        }
        // checks if skill already exist for a user
        const {name} = req.body;
        const existingSkill = await SkillsModel.findOne({name: name}, {user: userSessionId});
        if(existingSkill) {
            return res.status(409).json('This skill already exists for this user')
        }

        // Create new skill and associate it with the user
        const skill = await SkillsModel.create({ ...value, user: userSessionId });

        // Update user's skills array with new skill ID
        user.skills.push(skill._id);
        await user.save();

        // Return success response with created skill
        res.status(201).json({ 
            message: 'Skill added',
            skill });
    } catch (error) {
        // Handle errors
        next(error)
    }
};

export const getAllUserSkills = async (req, res, next) => {
    try {
        // Get user ID from session
        const userSessionId = req.session?.user?.id || req?.user?.id;

        // Find all skills belonging to the user
        const allUserSkills = await SkillsModel.find({ user: userSessionId });
        // if (allUserSkills.length === 0) {
        //     return res.status(200).json(allUserSkills);
        // }

        // Return skills in the response
        res.status(200).json({ 
            message: 'Skills retrieval successful',
            skills: allUserSkills });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};

export const getSkillById = async (req, res, next) => {
    try {
        const userSessionId = req.session?.user?.id || req?.user?.id;

        // Find skill by ID and user
        const skill = await SkillsModel.findById(req.params.id);

        // Check if skill exists and belongs to the user
        // if (!skill || skill.user.toString() !== userSessionId.toString()) {
        //     return res.status(200).json(skill);
        // }

        // Return the skill in the response
        res.status(200).json({
            message: 'Skill retrieval successful',
            skill,
         });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};

export const updateSkills = async (req, res, next) => {
    try {
        // Validate skill data
        const { error, value } = skills_schema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Get user ID from session
        const userSessionId = req.session?.user?.id || req?.user?.id;
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Find skill by ID and update it
        const updatedSkill = await SkillsModel
            .findByIdAndUpdate(req.params.id, value, { new: true });

        // Check if skill was found and updated
        if (!updatedSkill) {
            return res.status(404).json('Skill not found');
        }

        // Return updated skill in the response
        res.status(200).json({ 
            message: 'Skill updated',
            updatedSkill });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};


export const deleteSkill = async (req, res, next) => {
    try {
        const userSessionId = req.session?.user?.id || req?.user?.id;
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Delete skill by ID
        const deletedSkill = await SkillsModel.findByIdAndDelete(req.params.id);

        // Check if skill was found and deleted
        if (!deletedSkill) {
            return res.status(404).json('Skill not found');
        }

        // Remove skill ID from user's skills array
        user.skills.pull(req.params.id);
        await user.save();
        // Return success message in the response
        res.status(200).json({
            mesage: 'Skill deleted',
            deleteSkill,
         });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};
