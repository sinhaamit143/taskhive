const createError = require('http-errors')
const Model = require('../models/contact.model.js')
const mongoose = require('mongoose')
const ModelName = 'Role'

module.exports = {
  create: async (req, res, next) => {
    try {
      const data = req.body
      data.created_by = req.user ? req.user._id : 'unauth'
      data.updated_by = req.user ? req.user._id : 'unauth'
      data.created_at = Date.now()
      const newData = new Model(data)
      const result = await newData.save()
      res.json(result)  // Send the saved data response
    } catch (error) {
      next(error)
    }
  },

  get: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw createError.BadRequest('Invalid or missing ID')
      }
      const result = await Model.findById(id)
      if (!result) {
        throw createError.NotFound(`No ${ModelName} Found`)
      }
      res.send({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  },

  list: async (req, res, next) => {
    try {
      const { name, page, limit, sort } = req.query
      const _page = page ? parseInt(page) : 1
      const _limit = limit ? parseInt(limit) : 20
      const _skip = (_page - 1) * _limit
      const _sort = sort ? sort : '+name'
      const query = {}

      if (name) {
        query.name = new RegExp(name, 'i')
      }
      query.is_active = true

      const result = await Model.aggregate([
        { $match: query },
        { $skip: _skip },
        { $limit: _limit }
      ])

      res.json(result)
    } catch (error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params
      const data = req.body

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw createError.BadRequest('Invalid or missing ID')
      }
      if (!data) {
        throw createError.BadRequest('No update data provided')
      }
      data.updated_at = Date.now()
      const result = await Model.updateOne({ _id: id }, { $set: data })
      res.json(result)
    } catch (error) {
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw createError.BadRequest('Invalid or missing ID')
      }
      const deleted_at = Date.now()
      const result = await Model.updateOne({ _id: id }, { $set: { is_active: false, deleted_at } })
      res.json(result)
    } catch (error) {
      next(error)
    }
  },

  restore: async (req, res, next) => {
    try {
      const { id } = req.params
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw createError.BadRequest('Invalid or missing ID')
      }
      const dataToBeRestored = await Model.findOne({ _id: id, is_active: false }).lean()
      if (!dataToBeRestored) {
        throw createError.NotFound(`${ModelName} Not Found or Already Active`)
      }
      const restored_at = Date.now()
      const result = await Model.updateOne({ _id: id }, { $set: { is_active: true, restored_at } })
      res.json({ success: true, message: `${ModelName} restored successfully`, result })
    } catch (error) {
      next(error)
    }
  }
}
