function shoesSearch2(database, res, query) {
    database.find(query, function(err, results) {
        var shoesResult = [];
        if (err) {
            console.log(err)
        } else if (!results){
          console.log("nothing found")
        }else if (results) {
            results.forEach(function(stock) {
                shoesResult.push(stock);
            })
        }

        res.send(shoesResult);

    })
}

module.exports = shoesSearch2;
