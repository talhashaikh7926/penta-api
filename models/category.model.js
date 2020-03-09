const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

        id: String,
        category: String,
        subcategory: String,
        type: String,
        weight: String,
        price: String,
        createdDate: Date,
        createdBy: String,
        updatedDate: Date,
      

})

module.exports = mongoose.model('Category', categorySchema);