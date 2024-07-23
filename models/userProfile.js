import { model, Schema, Types } from "mongoose";
import { toJSON } from '@reis/mongoose-to-json';

const userProfileSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User', required: true },
    profilePicture: { type: String },
    location: { type: String },
    maritalStatus: { type: String, enum: ['single', 'married', 'prefer-not-to-say'] },
    sex: { type: String, enum: ['male', 'female'] },
    bio: { type: String },
    about: { type: String },
    dateOfBirth: { type: Date },
    contact: { type: String },
    resume: { type: String },
    spokenLanguages: [{ type: String }],
    github: { type: String },
    linkedln: { type: String },
    twitter: { type: String }
}, {
    timestamps: true
})

userProfileSchema.plugin(toJSON)

export const UserProfileModel = model('UserProfile', userProfileSchema)
