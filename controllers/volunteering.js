import { VolunteeringModel } from "../models/volunteering.js";
import { UserModel } from "../models/user.js";
import { volunteering_schema } from "../schema/volunteering_schema.js";

export const addVolunteering = async (req, res, next) => {
    try {
        // Validate volunteering data
        const { error, value } = volunteering_schema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Get user ID from session or request(token)
        
        const userSessionId = req.session?.user?.id || req?.user?.id;

        // Find the user by userSessionId
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).json('User not found');
        }

        // Create new volunteering record and associate it with the user
        const volunteering = await VolunteeringModel.create({ ...value, user: userSessionId });

        // Update user's volunteering array with new volunteering ID
        user.volunteering.push(volunteering._id);
        await user.save();

        // Return success response with created volunteering record
        res.status(201).json({ 
            message: 'Volunteering added',
            volunteering });
    } catch (error) {
        next(error)
    }
};

export const getAllUserVolunteering = async (req, res, next) => {
    try {
        // Get user ID from session or request
        const userSessionId = req.session?.user?.id || req?.user?.id;

        // Find all volunteering records belonging to the user
        const allUserVolunteering = await VolunteeringModel.find({ user: userSessionId });
        // if (allUserVolunteering.length === 0) {
        //     return res.status(200).json(allUserVolunteering);
        // }

        // Return volunteering records in the response
        res.status(200).json({ 
            message: 'Volunteering retrieved',
            volunteering: allUserVolunteering });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};

export const getVolunteeringById = async (req, res, next) => {
    try {
        const userSessionId = req.session?.user?.id || req?.user?.id;

        // Find volunteering record by ID and user
        const volunteering = await VolunteeringModel.findById(req.params.id);

        // Check if volunteering record exists and belongs to the user
        if (!volunteering || volunteering.user.toString() !== userSessionId.toString()) {
            return res.status(200).json(volunteering);
        }

        // Return the volunteering record in the response
        res.status(200).json({
            message: 'Volunteering retrieved',
             volunteering });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};

export const updateVolunteering = async (req, res, next) => {
    try {
        // Validate volunteering data
        const { error, value } = volunteering_schema.validate(req.body);
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
        // Find volunteering record by ID and update it
        const updatedVolunteering = await VolunteeringModel
            .findByIdAndUpdate(req.params.id, value, { new: true });

        // Check if volunteering record was found and updated
        if (!updatedVolunteering) {
            return res.status(404).json('Volunteering record not found');
        }

        // Return updated volunteering record in the response
        res.status(200).json({ 
            message: 'Volunteering updated',
            updatedVolunteering });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};

export const deleteVolunteering = async (req, res, next) => {
    try {
        const userSessionId = req.session?.user?.id || req?.user?.id;
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Delete volunteering record by ID
        const deletedVolunteering = await VolunteeringModel.findByIdAndDelete(req.params.id);

        // Check if volunteering record was found and deleted
        if (!deletedVolunteering) {
            return res.status(404).json('Volunteering record not found');
        }
        // Remove volunteering record ID from user's volunteering array
        user.volunteering.pull(req.params.id);
        await user.save();
        // Return success message in the response
        res.status(200).json({
         message: 'Volunteering record deleted',
        deleteVolunteering});
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};

