import { ProjectModel } from "../models/projects.js";
import { UserModel } from "../models/user.js";
import { project_schema } from "../schema/projects_schema.js";

export const addProject = async (req, res, next) => {
    try {
        // Validate project data
        const { error, value } = project_schema.validate(req.body);
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

        // Create new project and associate it with the user
        const project = await ProjectModel.create({ ...value, user: userSessionId });

        // Update user's projects array with new project ID
        user.projects.push(project._id);
        await user.save();

        // Return success response with created project
        res.status(201).json({ 
            message: 'Project added',
            project });
    } catch (error) {
        // Handle errors
       next(error)
    }
};

export const getAllUserProjects = async (req, res, next) => {
    try {
        // Get user ID from session
        const userSessionId = req.session?.user?.id || req?.user?.id;

        // Find all projects belonging to the user
        const allUserProjects = await ProjectModel.find({ user: userSessionId });
        // if (allUserProjects.length === 0) {
        //     return res.status(200).json(allUserProjects);
        // }

        // Return projects in the response
        res.status(200).json({ 
            message: 'Projects retrieved',
            projects: allUserProjects });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};

export const getProjectById = async (req, res, next) => {
    try {
        // Get user ID from session
        const userSessionId = req.session?.user?.id || req?.user?.id;

        // Find project by ID and user
        const project = await ProjectModel.findById(req.params.id);

        // Check if project exists and belongs to the user
        if (!project || project.user.toString() !== userSessionId.toString()) {
            return res.status(200).json(project);
        }

        // Return the project in the response
        res.status(200).json({ 
            message: 'Project retrieved',
            project });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};


export const updateProjects = async (req, res, next) => {
    try {
        // validate
        const { error, value } = project_schema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const userSessionId = req.session?.user?.id || req?.user?.id;
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Find project by ID and update it
        const updatedProject = await ProjectModel
            .findByIdAndUpdate(req.params.id, value, { new: true });

        // Check if project was found and updated
        if (!updatedProject) {
            return res.status(404).json('Project not found');
        }

        // Return updated project in the response
        res.status(200).json({ 
            message: 'Project updated',
            updatedProject });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};

export const deleteProject = async (req, res, next) => {
    try {
        const userSessionId = req.session?.user?.id || req?.user?.id;
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).json("User not found")
        }
        // Delete project by ID
        const deletedProject = await ProjectModel.findByIdAndDelete(req.params.id);

        // Check if project was found and deleted
        if (!deletedProject) {
            return res.status(404).json('Project not found');
        }
        // Remove project ID from user's projects array
        user.projects.pull(req.params.id)
        await user.save();
        // Return success message in the response
        res.status(200).json({
            message: 'Project deleted',
        deleteProject});
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};

