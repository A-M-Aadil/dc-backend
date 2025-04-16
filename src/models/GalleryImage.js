const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2'); 

const galleryImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true 
  },
}, { timestamps: true });

galleryImageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('GalleryImage', galleryImageSchema);