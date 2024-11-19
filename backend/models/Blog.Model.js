const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TableSchema = new Schema({
    title: { type: String, index: true },
    description:{ type:String },
    image:{ type:String },
    is_active: { type: Boolean, default: true, index: true },
    status: { type: String },
    created_at: { type: Date, default: Date.now() },
    created_by: { type: mongoose.Types.ObjectId, default: 'self' },
    updated_at: { type: Date, default: Date.now() },
    updated_by: { type: String, default: 'self' },
})

const Table = mongoose.model('Blog', TableSchema)

module.exports = Table