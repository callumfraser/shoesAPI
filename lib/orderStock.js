function orderStock(database, query, res, size) {
    database.findById(query,
        function(err, shoeFound) {
            if (err) {
                console.log(err)
            } else if (shoeFound) {
              console.log(shoeFound)
                for (var i = 0; i < shoeFound.sizes.length; i++) {
                    if (shoeFound.sizes[i].size == size) {
                        shoeFound.sizes[i].amount -= 1
                    }
                }


                shoeFound.save(function(err, updatedShoe) {
                    if (err) {
                        console.log(err)
                    } else if (updatedShoe) {
                        console.log(updatedShoe);
                        res.send(shoeFound);
                    }
                })
            }
        })
}

module.exports = orderStock;
