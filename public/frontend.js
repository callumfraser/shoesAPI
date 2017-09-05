var orderButton = document.querySelector('#orderButton');
var stockAddButton = document.querySelector('#addNewStock');
var newStockDiv = document.querySelector('#addStockDiv')
var addStockShow = document.querySelector('#showStockAdd');
var showCatalogue = document.querySelector('#showCatalogue');
var newBrand = document.querySelector('#newBrand');
var newColor = document.querySelector('#newColor');
var newSizes = document.querySelector('#newSizes');
var newPrice = document.querySelector('#newPrice');
var catalogueDiv = document.getElementById("catalogueDiv");
var tableDiv = document.getElementById("tableDiv");
var filterButton = document.getElementById("filter");
var brandSearch = document.getElementById("brandSearch");

var stockTable = document.getElementById('stockTable').innerHTML;
var stockTemplate = Handlebars.compile(stockTable);

var check = true;

function capitalise(string) {
    return string.substr(0, 1).toUpperCase() + string.substr(1, (string.length - 1)).toLowerCase()
}

var brandOptions = document.getElementById('brandsOptions').innerHTML;
var brandTemplate = Handlebars.compile(brandOptions);

Handlebars.registerHelper('sizeCheck', function(size) {
    if (size.amount <= 0 || undefined) {
        return 'disabled'
    } else {
        return null;
    }
});

var cb1 = function(shoes1) {
    var stockTableFound = stockTemplate({
        shoes: shoes1
    })
    tableDiv.innerHTML = stockTableFound
}

var cb2 = function(){
  loadAjax('GET', 'https://shoes--api.herokuapp.com/api/shoes/', null, cb1);
}

var cb3 = function(brands){
  var brandTemplateLoaded = brandTemplate({
    brandOptions: brands
  })
brandSearch.innerHTML = brandTemplateLoaded + "<option selected disabled hidden value=null>Brand</option>";
}

var xhr = new XMLHttpRequest();

var loadAjax = function(method, url, data, cb) {
    xhr.open(method, url, true);
    xhr.send(data);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                cb(data);
                console.log("hi")
            } else {
                console.log("error" + xhr.status)
            }
        }
    }
}

var loadAjaxPost = function(method, url, data, cb) {
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                cb();
            } else {
                console.log("error" + xhr.status)
            }
        }
    }
}

showCatalogue.addEventListener('click', function() {
    if (catalogueDiv.classList.value == "catalogue hidden") {
        catalogueDiv.classList.remove("hidden");
        showCatalogue.value = "Hide catalogue";
    } else {
        catalogueDiv.classList.add("hidden");
        showCatalogue.value = "Show catalogue";
    }

})

addStockShow.addEventListener('click', function() {
    if (newStockDiv.classList.value == "newStockDiv hidden") {
        newStockDiv.classList.remove("hidden");
        addStockShow.value = "Hide new stock input";
    } else {
        newStockDiv.classList.add("hidden");
        addStockShow.value = "Add new stock";
    }

})

brandSearch.addEventListener('mouseenter', function(){
  if (check==true){
  loadAjax('GET', 'https://shoes--api.herokuapp.com/api/shoes/distinctbrands', null, cb3);
  check = false;
}
})

showCatalogue.addEventListener('click', function() {
  loadAjax('GET', 'https://shoes--api.herokuapp.com/api/shoes/', null, cb1);
})

filterButton.addEventListener('click', function() {
    var filterURL;
    var brandSearch = document.getElementById("brandSearch").value;
    var sizeSearch = document.getElementById("sizeSearch").value;
    console.log(sizeSearch);
    if (sizeSearch!=="null"){
    filterURL = 'https://shoes--api.herokuapp.com/api/shoes/brand/' + brandSearch + '/size/' + sizeSearch;
  } else {
    filterURL = 'https://shoes--api.herokuapp.com/api/shoes/brand/' + brandSearch
  }

    loadAjax('GET', filterURL, null, cb1)
})

stockAddButton.addEventListener('click', function(){
  var newSizesArray = newSizes.value.split(',');
  var objArraySizes = [];
  for (var p = 0; p < newSizesArray.length; p++) {
      objArraySizes.push({
          size: p,
          amount: Number(newSizesArray[p])
      })
  }
  var newStock = {
    brand: capitalise(newBrand.value),
    price: Number(newPrice.value),
    color: capitalise(newColor.value),
    sizes: objArraySizes
  }

  newBrand.value = "";
  newPrice.value = "";
  newColor.value = "";
  newSizes.value = "";

  loadAjaxPost('POST', 'https://shoes--api.herokuapp.com/api/shoes', JSON.stringify(newStock), setTimeout(cb2, 2000))
})

orderButton.addEventListener('click', function() {
    var sizes = document.getElementsByName("sizes");
    var shoesSelect = document.getElementsByName("chosenShoe");
    console.log(shoesSelect);
    var chosenSize;
    var chosenShoe;

    for (var j = 0; j < shoesSelect.length; j++) {
        if (shoesSelect[j].checked == true) {
            chosenShoe = shoesSelect[j].value;
        }
    }

    for (var i = 0; i < sizes.length; i++) {
        if (sizes[i].value !== 'none') {
            chosenSize = sizes[i].value;
        }
    }



    var soldURL = 'https://shoes--api.herokuapp.com/api/shoes/sold/' + chosenShoe + '/' + chosenSize;
    loadAjax('POST', soldURL, null, cb2);
})
