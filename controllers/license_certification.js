import { LicenseModel } from "../models/license_certification.js";
import { UserModel } from "../models/user.js";
import { license_schema } from "../schema/license_schema.js";

// Validation & errror handling
export const addLicense = async (req, res, next) => {
    try {
        const { error, value } = license_schema.validate(req.body)
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const userSessionId = req.session?.user?.id || req?.user?.id;

        //after, find the user with the id that you passed when creating the education 
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        //Create license with the value
        const license = await LicenseModel.create({
            ...value,
            user: userSessionId,
            media: req.file.filename
        })
        //if you find the user, push the license id you just created inside
        user.licenseCertifications.push(license._id);

        //and save the user now with the licenseId
        await user.save();
        res.status(201).json({ message: 'License added', license })
    } catch (error) {
        next(error)
    }
}

export const getLicense = async (req, res, next) => {
    try {
        //we are fetching license that belongs to a particular user
        const userSessionId = req.session?.user?.id || req?.user?.id;
        const allLicense = await LicenseModel.find({ user: userSessionId })
        // if (allLicense.length == 0) {
        //     return res.status(200).json(allLicense);
        // }
        res.status(200).json({ 
            message: 'Licenses retrieved',
            license: allLicense })

    } catch (error) {
        next(error)
    }
}

export const getOneLicense = async (req, res, next) => {
    try {
        const licenseId = req.params.id
        //we are fetching license that belongs to a particular user
        const userSessionId = req.session?.user?.id || req?.user?.id;
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const oneLicense = await LicenseModel.findById(licenseId)
        if (oneLicense.length == 0) {
            return res.status(200).json(oneLicense);
        }
        res.status(200).json({message: 'License retrieved', licenseId}) 

    } catch (error) {
        next(error)
    }
}

export const updateLicense = async (req, res, next) => {

    try {
        const { error, value } = license_schema.validate({
            ...req.body,
            media: req.file.filename
        })
        if (error) {
            return res.status(400).send(error.details[0].message)
        }
        const userSessionId = req.session?.user?.id || req?.user?.id;
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const license = await LicenseModel.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                media: req.file.filename
            },
            { new: true }
        )
        if (!license) {
            return res.status(404).send('license not found');
        }
        res.status(200).json({message: 'Update successful', license })
    } catch (error) {
        next(error)
    }
}

export const deleteLicense = async (req, res, next) => {
    try {
        const idLicense = req.session?.user?.id || req?.user?.id;
        const user = await UserModel.findById(idLicense);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const license = await LicenseModel.findByIdAndDelete(req.params.id)
        if (!license) {
            return res.status(404).send('License not found');
        }
        user.licenseCertifications.pull(req.params.id);
        await user.save();
        res.status(200).json({message:"license deleted", deleteLicense});
    } catch (error) {
        next(error)
    }
}