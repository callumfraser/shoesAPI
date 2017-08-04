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

Handlebars.registerHelper('sizeCheck', function(size){
if (size.amount== 0 || undefined){
  return null
} else {
  return size.size + '   ';
}
})

app.get('/', function(req, res) {
    res.redirect('api/shoes')
})

app.get('/api/shoes', function(req, res) {
    var shoesResult = [];

    StockDB.find({}, function(err, results) {
        if (err) {
            console.log(err)
        } else if (results) {
            // console.log(results)
            results.forEach(function(stock){
          shoesResult.push(stock);
        })
        }
        shoesResult.forEach(function(stock){
          // var sizesAvailable = [];
          for (var i=0;i++;i<stock.sizes.length){
            if (stock.sizes[i] !== 0){
              sizesAvailable.push(i)
            }
          }
        })
        res.render('shoes', {
          shoesResult : shoesResult,
        })

    })
})

app.post('/api/shoes', function(req,res){
  var addNewStock = req.body.addNewStock;
  var newBrand = req.body.newBrand;
  var newColor = req.body.newColor;
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
    newStock.color = newColor.substr(0,1).toUpperCase() + newColor.substr(1,(newColor.length-1)).toLowerCase();
    newStock.brand = newBrand.substr(0,1).toUpperCase() + newBrand.substr(1,(newBrand.length-1)).toLowerCase();
    newStock.price = Number(newPrice);
    newStock.sizes = objArraySizes;
    newStock.save(function(err,savedShoe){
      if (err){
        console.log(err)
      }
      else {
        console.log("shoe saved");
        console.log(savedShoe);
        res.redirect('/api/shoes')
        return
      }
    })
  }
})

app.get('/api/shoes/brand/:brandname', function(req, res) {
    var brandSearch = req.params.brandname
    console.log(brandSearch)
    var shoesResult = [];

    StockDB.find({
        brand: brandSearch
    }, function(err, results) {
        if (err) {
            console.log(err)
        } else if (results) {
            console.log(results)
            results.forEach(function(stock){
          shoesResult.push(stock)
        })
        }
        res.render('shoes', {
          shoesResult : shoesResult
        })

    })
    // res.send('hi')
})

app.listen(port, function() {
    console.log("App listening on port")
});
