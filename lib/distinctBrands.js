function distinctBrands(database, res) {
    database.distinct("brand", function(err, results) {
      var distinctBrandsArr = [];
        if (err) {
            console.log(err)
        } else if (results) {
            results.forEach(function(brand) {
                distinctBrandsArr.push(brand);
            })
        }
        // res.send(shoesResult)
        res.send(distinctBrandsArr)

    })
}

module.exports = distinctBrands
