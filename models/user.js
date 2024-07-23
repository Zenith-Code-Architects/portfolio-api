import { model, Schema, Types } from "mongoose";
import { toJSON } from '@reis/mongoose-to-json';

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, lowercase: true, unique: true, required: true },
    email: { type: String, lowercase: true, unique: true, required: true},
    password: { type: String, required: true },
    userProfile: { type: Types.ObjectId, ref: 'UserProfile' },
    skills: [{ type: Types.ObjectId, ref: 'Skill' }],
    projects: [{ type: Types.ObjectId, ref: 'Project' }],
    experiences: [{ type: Types.ObjectId, ref: 'Experience' }],
    education: [{ type: Types.ObjectId, ref: 'Education' }],
    licenseCertifications: [{ type: Types.ObjectId, ref: 'License' }],
    achievements: [{ type: Types.ObjectId, ref: 'Achievement' }],
    volunteering: [{ type: Types.ObjectId, ref: 'Volunteering' }]
}, {
    timestamps: true
})

userSchema.plugin(toJSON)

export const UserModel = model('User', userSchema)
