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
var distinctBrands = require('./lib/distinctBrands');
var reduceStock = require('./lib/orderStock')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Methods', 'Content-Type');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
})

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

function capitalise(string) {
    return string.substr(0, 1).toUpperCase() + string.substr(1, (string.length - 1)).toLowerCase()
}



app.get('/hello', function(req, res){
  console.log("HI")
  loadAjax('POST', 'http://localhost:3005/api/shoes/sold/598c5853e2a8ee3925948460/9')
})

app.get('/api/shoes', function(req, res) {
    console.log("hi there callum")
    searchAll(StockDB, res, "");
})

app.post('/api/shoes/sold/:id/:size', function(req,res){
  var chosenShoe = req.params.id;
  var chosenSize = req.params.size;
  reduceStock(StockDB, chosenShoe, res, chosenSize);
})

app.post('/api/shoes', function(req, res) {
  var newStock1 = req.body;
  console.log(newStock1);
    var newStock = new StockDB();
    stockAdd(newStock, newStock1, res);
})

app.get('/api/shoes/brand/:brandname', function(req, res) {
    var brandSearch = req.params.brandname;
    var query = {
        brand: capitalise(brandSearch)
    }
    searchAll(StockDB, res, query)
})

app.get('/api/shoes/size/:size', function(req,res){
  var sizeSearch = Number(req.params.size);
  var query = {
    'sizes': {
        $elemMatch: {
            size: sizeSearch,
            amount: {
                $gt: 0
            }
        }
    }

  }
  searchAll(StockDB,res,query)
})

app.get('/api/shoes/distinctbrands', function(req,res){
  distinctBrands(StockDB, res);
})

app.get('/api/shoes/brand/:brandname/size/:size', function(req, res) {
    var brandSearch = req.params.brandname;
    var sizeSearch = Number(req.params.size);
    var query = {
        'brand': capitalise(brandSearch),
        'sizes': {
            $elemMatch: {
                size: sizeSearch,
                amount: {
                    $gt: 0
                }
            }
        }
    }
    searchAll(StockDB, res, query)
})


app.listen(port, function() {
    console.log("App listening on port")
});
