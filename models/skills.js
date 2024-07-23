import { model, Schema, Types } from "mongoose";
import { toJSON } from '@reis/mongoose-to-json';

const skillsSchema = new Schema({
    user: { type: Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    levelOfProficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
}, {
    timestamps: true
})

skillsSchema.plugin(toJSON)

export const SkillsModel = model('Skill', skillsSchema)
