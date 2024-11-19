const createError = require('http-errors');
const Model = require('../models/Project.Model');
const mongoose = require('mongoose');
const ModelName = 'project';

module.exports = {
    create: async (req, res, next) => {
        try {
            const { name, descriptions, images } = req.body;

            if (!name || !Array.isArray(descriptions) || !Array.isArray(images)) {
                return res.status(400).json({ 
                    message: "Missing required fields: 'name', 'descriptions' (array), or 'images' (array)!" 
                });
            }

            const newProject = {
                name,
                descriptions,
                images,
                created_by: req.user ? req.user._id : null,
                updated_by: req.user ? req.user._id : null,
                created_at: Date.now(),
                updated_at: Date.now(),
            };

            const result = await Model.create(newProject);
            return res.status(201).json({ success: true, data: result });
        } catch (error) {
            console.error("Error in project creation:", error);
            next(error);
        }
    },

    get: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id) throw createError.BadRequest('Invalid Parameters');

            const result = await Model.findById(new mongoose.Types.ObjectId(id));
            if (!result) throw createError.NotFound(`No ${ModelName} Found`);

            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    },

    publicGet: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id) throw createError.BadRequest('Invalid Parameters');

            const result = await Model.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(id) } },
                { 
                    $lookup: {
                        from: 'users',
                        localField: 'created_by',
                        foreignField: '_id',
                        as: 'created_by'
                    } 
                },
                { $unwind: { path: '$created_by', preserveNullAndEmptyArrays: true } }
            ]);

            if (!result) throw createError.NotFound(`No ${ModelName} Found`);

            res.json({ success: true, data: result.pop() });
        } catch (error) {
            next(error);
        }
    },

    list: async (req, res, next) => {
        try {
            const { name, page, limit } = req.query;

            const _page = page ? parseInt(page) : 1;
            const _limit = limit ? parseInt(limit) : 20;
            const _skip = (_page - 1) * _limit;

            const query = { created_by: req.user._id, is_active: true };

            if (name) {
                query.name = new RegExp(name, 'i');
            }

            const result = await Model.aggregate([
                { $match: query },
                { $skip: _skip },
                { $limit: _limit },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'created_by',
                        foreignField: '_id',
                        as: 'created_by',
                    },
                },
                { $unwind: { path: '$created_by', preserveNullAndEmptyArrays: true } },
            ]);

            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    },

    publicList: async (req, res, next) => {
        try {
            const { name, page, limit } = req.query;

            const _page = page ? parseInt(page) : 1;
            const _limit = limit ? parseInt(limit) : 20;
            const _skip = (_page - 1) * _limit;

            const query = { is_active: true };

            if (name) {
                query.name = new RegExp(name, 'i');
            }

            const result = await Model.aggregate([
                { $match: query },
                { $skip: _skip },
                { $limit: _limit },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'created_by',
                        foreignField: '_id',
                        as: 'created_by',
                    },
                },
                { $unwind: { path: '$created_by', preserveNullAndEmptyArrays: true } },
            ]);

            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            if (!id || !updates) throw createError.BadRequest('Invalid Parameters');

            const result = await Model.findByIdAndUpdate(
                new mongoose.Types.ObjectId(id),
                { $set: updates, updated_at: Date.now(), updated_by: req.user._id },
                { new: true }
            );

            if (!result) throw createError.NotFound(`No ${ModelName} Found`);

            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id) throw createError.BadRequest('Invalid Parameters');

            const result = await Model.findByIdAndUpdate(
                new mongoose.Types.ObjectId(id),
                { $set: { is_active: false, updated_at: Date.now() } },
                { new: true }
            );

            if (!result) throw createError.NotFound(`No ${ModelName} Found`);

            res.json({ success: true, message: "Project deactivated", data: result });
        } catch (error) {
            next(error);
        }
    },

    restore: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id) throw createError.BadRequest('Invalid Parameters');

            const result = await Model.findByIdAndUpdate(
                new mongoose.Types.ObjectId(id),
                { $set: { is_active: true, updated_at: Date.now() } },
                { new: true }
            );

            if (!result) throw createError.NotFound(`No ${ModelName} Found`);

            res.json({ success: true, message: "Project reactivated", data: result });
        } catch (error) {
            next(error);
        }
    }
};