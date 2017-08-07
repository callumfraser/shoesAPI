

function stockAdd(newStock,newColor,newBrand,newPrice,newSizes,res){
newStock.color = newColor;
newStock.brand = newBrand;
newStock.price = Number(newPrice);
newStock.sizes = newSizes;
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

module.exports = stockAdd;
