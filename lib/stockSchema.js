var mongoose = require('mongoose');

var stockSchema = new mongoose.Schema({
  id: Number,
  color: String,
  brand: String,
  price: Number,
  sizes: {
    size1: Number,
    size2: Number,
    size3: Number,
    size4: Number,
    size5: Number,
    size6: Number,
    size7: Number,
    size8: Number,
    size9: Number,

  }
});

var StockDB = mongoose.model('Stock', stockSchema);

module.exports = StockDB;
