const createError = require('http-errors')
const Model = require('../Models/Blog.Model')
const mongoose = require('mongoose')
const ModelName = 'blog'

module.exports = {

  create: async (req, res, next) => {
    try {
      const data = req.body
      data.created_by = req.user ? req.user._id : 'unauth'
      data.updated_by = req.user ? req.user._id : 'unauth'
      data.created_at = Date.now()
      const newData = new Model(data)
      const result = await newData.save()
      res.json(newData)
      return
    } catch (error) {
      next(error)
    }
  },
  
  get: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) {
        throw createError.BadRequest('Invalid Parameters')
      }
      const result = await Model.findById(new mongoose.Types.ObjectId(id));
      if (!result) {
        throw createError.NotFound(`No ${ModelName} Found`)
      }
      res.send({
        success: true, data: result,
      })
      return
    } catch (error) {
      next(error)
    }
  },

  publicGet: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) {
        throw createError.BadRequest('Invalid Parameters')
      }
      // const result = await Model.findById({ _id: mongoose.Types.ObjectId(id) })
      const result = await Model.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by'
          }
        },
        {
          $unwind: {
            path: '$created_by',
            preserveNullAndEmptyArrays: true
          }
        }
      ])
      if (!result) {
        throw createError.NotFound(`No ${ModelName} Found`)
      }
      res.send({
        success: true, 
        data: result.pop()
      })
      return
    } catch (error) {
      next(error)
    }
  },

  list: async (req, res, next) => {
    try {
      const { name, is_active, page, limit, sort } = req.query
      const _page = page ? parseInt(page) : 1
      const _limit = limit ? parseInt(limit) : 20
      const _skip = (_page - 1) * _limit
      const _sort = sort ? sort : '+name'
      const query = {};
      if (name) {
        query.name = new RegExp(name, 'i')
      }
      query.created_by = req.user._id
      query.is_active = true;
      const result = await Model.aggregate([
        {
          $match: query
        },
        {
          $lookup: {
            from: 'users',
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by'
          }
        },
        {
          $unwind: {
            path: '$created_by',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $skip: _skip
        },
        {
          $limit: _limit
        }
      ])
      res.json(result)
      return
    } catch (error) {
      next(error)
    }
  },

  publicList: async (req, res, next) => {
    try {
      const { name, is_active, page, limit, sort } = req.query
      const _page = page ? parseInt(page) : 1
      const _limit = limit ? parseInt(limit) : 20
      const _skip = (_page - 1) * _limit
      const _sort = sort ? sort : '+name'
      const query = {};
      if (name) {
        query.name = new RegExp(name, 'i')
      }
      query.is_active = true;
      const result = await Model.aggregate([
        {
          $match: query
        },
        {
          $lookup: {
            from: 'users',
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by'
          }
        },
        {
          $unwind: {
            path: '$created_by',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $skip: _skip
        },
        {
          $limit: _limit
        }
      ])
      res.json(result)
      return
    } catch (error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params
      const data = req.body

      if (!id) {
        throw createError.BadRequest('Invalid Parameters')
      }
      if (!data) {
        throw createError.BadRequest('Invalid Parameters')
      }
      data.updated_at = Date.now()
      const result = await Model.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $set: data })
      res.json(result)
      return
    } catch (error) {
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw createError.BadRequest('Invalid Parameters');
        }

        // Check if the id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw createError.BadRequest('Invalid ObjectId');
        }

        // Check if the blog exists
        const blog = await Model.findById(new mongoose.Types.ObjectId(id)); // Use new here
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Mark the blog as inactive instead of deleting
        const deleted_at = Date.now();
        const result = await Model.updateOne(
            { _id: new mongoose.Types.ObjectId(id) }, // Ensure ObjectId is used properly
            { $set: { is_active: false, deleted_at } }
        );

        res.json({ success: true, message: 'Blog marked as inactive', data: result });

    } catch (error) {
        console.error('Error in delete operation:', error.message);
        next(error);
    }
},

  restore: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw createError.BadRequest('Invalid Parameters');
      }

      const dataToBeDeleted = await Model.findOne({ _id: new mongoose.Types.ObjectId(id) }, { name: 1 }).lean();
      if (!dataToBeDeleted) {
        throw createError.NotFound(`${ModelName} Not Found`);
      }

      const dataExists = await Model.findOne({ name: dataToBeDeleted.name, is_active: false }).lean();
      if (dataExists) {
        throw createError.Conflict(`${ModelName} already exists`);
      }

      const restored_at = Date.now();
      const result = await Model.updateOne(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { is_active: true, restored_at } }
      );
      res.json(result);
      return;
    } catch (error) {
      next(error);
    }
  },

}
