function shoesSearch(database, res, query) {
    database.find(query, function(err, results) {
        var shoesResult = [];
        if (err) {
            console.log(err)
        } else if (!results){
          console.log("nothing found")
        }else if (results) {
            console.log(results)
            results.forEach(function(stock) {
                shoesResult.push(stock);
            })
        }
        shoesResult.forEach(function(stock) {
            // var sizesAvailable = [];
            for (var i = 0; i++; i < stock.sizes.length) {
                if (stock.sizes[i] !== 0) {
                    sizesAvailable.push(i)
                }
            }
        })
        res.render('shoes', {
            shoesResult: shoesResult,
        })

    })
}

module.exports = shoesSearch
