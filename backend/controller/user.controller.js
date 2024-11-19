const createError = require('http-errors')
const Model = require('../Models/User.Model')
const mongoose = require('mongoose')
const ModelName =  'User'

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
      const result = await Model.findById({ _id: mongoose.Types.ObjectId(id) })
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
      query.is_active = true;
      const result = await Model.aggregate([
        {
          $match: query
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
      const result = await Model.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: data })
      res.json(result)
      return
    } catch (error) {
      next(error)
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) {
        throw createError.BadRequest('Invalid Parameters')
      }
      const deleted_at = Date.now()
      const result = await Model.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: { is_active: false, deleted_at } })
      res.json(result)
      return
    } catch (error) {
      next(error)
    }
  },
  restore: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id) {
        throw createError.BadRequest('Invalid Parameters')
      }
      const dataToBeDeleted = await Model.findOne({ _id: mongoose.Types.ObjectId(id) }, { name: 1 }).lean()
      if (!dataToBeDeleted) {
        throw createError.NotFound(`${ModelName} Not Found`)
      }
      const dataExists = await Model.findOne({ name: dataToBeDeleted.name, is_active: false }).lean()
      if (dataExists) {
        throw createError.Conflict(`${ModelName} already exists`)
      }
      const restored_at = Date.now()
      const result = await Model.updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: { is_active: false, restored_at } })
      res.json(result)
      return
    } catch (error) {
      next(error)
    }
  },

}
