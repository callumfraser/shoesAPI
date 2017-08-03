var express = require('express');
var bodyParser = require('body-parser');
var express_handlebars = require('express-handlebars');
var mongoose = require('mongoose');
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

app.get('/', function(req,res){
  var shoesStock;
  var newStock = new StockDB();
  newStock.id = 101;
  newStock.color = "blue";
  newStock.brand = "Nike";
  newStock.price = 300;
  newStock.in_stock = 15;
  // newStock.save(function(err,savedUser){
  //   if (err){
  //     console.log(err)
  //   }
  //   else {
  //     console.log("shoe saved");
  //     return
  //   }
  // })
  res.send('hello kaylim')
})

app.listen(port, function() {
    console.log("App listening on port")
});
