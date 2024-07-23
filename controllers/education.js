import { EducationModel } from "../models/education.js";
import { UserModel } from "../models/user.js";
import { education_schema } from "../schema/education_schema.js";

// Validation & errror handling
export const addEducation = async (req, res, next) => {
    try {
        const { error, value } = education_schema.validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const userSessionId = req.session?.user?.id || req?.user?.id;
       
        //after, find the user with the id that you passed when creating the education 
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        //if you find the user, push the education id you just created inside
         //create education with the value
        const education = await EducationModel.create({...value, user:userSessionId})
        user.education.push(education._id);
        //and save the user now with the educationId
        await user.save();
        //Return the education
        res.status(201).json({ message: 'Education added', education })
    } catch (error) {
        next(error)
    }
}

export const getEducation = async (req, res, next) => {
    try {
        //we are fetching education that belongs to a particular user
        const userSessionId = req.session?.user?.id || req?.user?.id;
        const allEducation = await EducationModel.find({ user: userSessionId })
        // if (allEducation.length == 0) {
        //     return res.status(200).json(allEducation);
        // }
        res.status(200).json({ message: 'Educations retrieved', education: allEducation })

    } catch (error) {
        next(error)
    }
}

export const getOneEducation = async (req, res, next) => {
    try {
        const educationId = req.params.id;
        const userSessionId = req.session?.user?.id || req?.user?.id;
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        //we are fetching education that belongs to a particular user
        const oneEducation = await EducationModel.findById(educationId)
        if (oneEducation.length == 0) {
            return res.status(200).json(oneEducation);
        }
        res.status(200).json({message: 'Education retrieved', oneEducation})

    } catch (error) {
        next(error)
    }
}

export const updateEducation = async (req, res, next) => {

    try {
        const { error, value } = education_schema.validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const userSessionId = req.session?.user?.id || req?.user?.id;
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const education = await EducationModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!education) {
            return res.status(404).send('Education not found');
        }
        res.status(200).json({ message: 'Update successful', education })
    } catch (error) {
        next(error)
    }
}

export const deleteEducation = async (req, res, next) => {
    try {
        const idEducation = req.session?.user?.id || req?.user?.id;
        const user = await UserModel.findById(idEducation);
        if (!user) {
          return res.status(404).send("User not found");
        }
        const education = await EducationModel.findByIdAndDelete(req.params.id)
        if (!education) {
            return res.status(404).send('Education not found');
        }
        user.education.pull(req.params.id);
        await user.save();
      res.status(200).json({message:"Education deleted", deleteEducation});
    } catch (error) {
        next(error)
    }
};