var mongoose = require('mongoose');

var stockSchema = new mongoose.Schema({
  id: Number,
  color: String,
  brand: String,
  price: Number,
  sizes: [{amount : Number, size : Number}]
});

var StockDB = mongoose.model('Stock', stockSchema);

module.exports = StockDB;
