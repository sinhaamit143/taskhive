const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: { type: String, required: true, index: true },
    descriptions: { type: [String], required: true },
    images: { type: [String], required: true },       
    is_active: { type: Boolean, default: true, index: true },
    status: { type: String },
    created_at: { type: Date, default: Date.now },
    created_by: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
    updated_at: { type: Date, default: Date.now },
    updated_by: { type: mongoose.Types.ObjectId, ref: 'User', default: null }
});

const Project = mongoose.model('project', ProjectSchema);

module.exports = Project;