var express = require('express');
var bodyParser = require('body-parser');
var express_handlebars = require('express-handlebars');
var mongoose = require('mongoose');
var Handlebars = require('handlebars');
var session = require('express-session');
var app = express();
var port = process.env.PORT || 3005;
var StockDB = require('./lib/stockSchema');
var format = require('util').format;
var searchAll = require('./lib/shoesSearch');
var stockAdd = require('./lib/stockAdd');

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('./public'));

const mongoURL = process.env.MONGO_DB_URL || "mongodb://localhost/ShoeCatalogue"
mongoose.connect(mongoURL);

app.use(session({
    secret: "callum123",
    resave: false,
    saveUnititialized: true
}))
app.use(bodyParser.json());

app.engine('handlebars', express_handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

function capitalise(string){
return string.substr(0,1).toUpperCase() + string.substr(1,(string.length-1)).toLowerCase()
}

Handlebars.registerHelper('sizeCheck', function(size){
if (size.amount== 0 || undefined){
  return 'disabled'
} else {
  return null;
}
})

app.get('/', function(req, res) {
    res.redirect('api/shoes')
})

app.get('/api/shoes', function(req, res) {
searchAll(StockDB, res, "");
})

app.post('/api/shoes/sold/:id', function(req,res){
  var orderStock = req.body.orderStock;
  var chosenShoes = req.body.chosenShoes;
  // var
  if (orderStock){
    console.log(chosenShoes);

  }

})

app.post('/api/shoes', function(req,res){
  var addNewStock = req.body.addNewStock;
  var newBrand = capitalise(req.body.newBrand);
  var newColor = capitalise(req.body.newColor);
  var newPrice = req.body.newPrice;
  var newSizes = req.body.newSizes;
  var newSizesArray = newSizes.split(',');
  var objArraySizes = [];
  console.log(newSizesArray.length);
  for (var p=0;p<newSizesArray.length;p++){
    objArraySizes.push({
      size: p,
      amount: Number(newSizesArray[p])
    })
  }

  var newStock = new StockDB();
  if (addNewStock){
    stockAdd(newStock,newColor,newBrand,newPrice,objArraySizes,res);
  }
})

app.get('/api/shoes/brand/:brandname', function(req, res) {
    var brandSearch = req.params.brandname
    var query = {
      brand: capitalise(brandSearch)
    }
    searchAll(StockDB,res,query)
})

app.listen(port, function() {
    console.log("App listening on port")
});
