

function stockAdd(newStock,newInput,res){
newStock.color = newInput.color;
newStock.brand = newInput.brand;
newStock.price = Number(newInput.price);
newStock.sizes = newInput.sizes;
newStock.save(function(err,savedShoe){
  if (err){
    console.log(err)
  }
  else {
    console.log("shoe saved");
    console.log(savedShoe);
    return
  }
})
}

module.exports = stockAdd;
