// var firebaseConfig = {
//   apiKey: "AIzaSyCQwhMpGPFS8wqCkRypCXUaVxOe2mZgml0",
//   authDomain: "test-7c38b.firebaseapp.com",
//   databaseURL: "https://test-7c38b.firebaseio.com",
//   projectId: "test-7c38b",
//   storageBucket: "test-7c38b.appspot.com",
//   messagingSenderId: "1084629551515",
//   appId: "1:1084629551515:web:ca74a9aa882f8a3c"
// };

// firebase.initializeApp(firebaseConfig);

// var database = firebase.database();
var beerObj = {};
var city,
  brewery,
  beerName,
  beerStyle,
  beerCateg,
  beerABV,
  beerDescr,
  longitude,
  latitude,
  address,
  website,
  cityInfo,
  beerInfo,
  breweryInfo;
var queryURL =
  "https://data.opendatasoft.com/api/records/1.0/search/?dataset=open-beer-database%40public-us&rows=100&sort=name&facet=style_name&facet=cat_name&facet=name_breweries&facet=country&refine.country=United+States&refine.state=North+Carolina";

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  for (var i = 0; i < response.records.length; i++) {
    city = response.records[i].fields.city;
    brewery = response.records[i].fields.name_breweries;
    beerName = response.records[i].fields.name;
    beerStyle = response.records[i].fields.style_name;
    beerCateg = response.records[i].fields.cat_name;
    if (response.records[i].fields.abv === 0) {
      beerABV = "";
    } else {
      beerABV = response.records[i].fields.abv;
    }
    beerDescr = response.records[i].fields.descript;
    longitude = response.records[i].geometry.coordinates[0];
    latitude = response.records[i].geometry.coordinates[1];
    address = response.records[i].fields.address1;
    website = response.records[i].fields.website;
    if (!beerObj[city]) {
      beerInfo = {
        name: beerName,
        style: beerStyle,
        category: beerCateg,
        ABV: beerABV,
        description: beerDescr
      };
      cityInfo = {
        [brewery]: {
          beers: [beerInfo],
          location: {
            longitude,
            latitude
          },
          address: address,
          website: website,
          breweryName: brewery
        }
      };
      beerObj[city] = cityInfo;
    } else if (!beerObj[city][brewery]) {
      beerInfo = {
        name: beerName,
        style: beerStyle,
        category: beerCateg,
        ABV: beerABV,
        description: beerDescr
      };
      breweryInfo = {
        beers: [beerInfo],
        location: {
          longitude,
          latitude
        },
        address: address,
        website: website,
        breweryName: brewery
      };

      beerObj[city][brewery] = breweryInfo;
    } else if (!beerObj[city][brewery].beers.name) {
      beerInfo = {
        name: beerName,
        style: beerStyle,
        category: beerCateg,
        ABV: beerABV,
        description: beerDescr
      };
      beerObj[city][brewery].beers.push(beerInfo);
    }
  }

  $(".brewery-link").on("click", function() {
    returned = beerObj[$(this).attr("id")][$(this).val()];
    console.log(returned.breweryName);
    var brewNameDiv = $("<div>")
      .attr("id", "breweryName")
      .text(returned.breweryName);
    var brewAddressDiv = $("<div>")
      .attr("id", "breweryAddress")
      .text(returned.address);
    var breweryLink = $("<a>")
      .attr("href", returned.website)
      .attr("target", "_blank")
      .text(returned.website);
    var brewLinkDiv = $("<div>")
      .attr("id", "breweryLink")
      .append(breweryLink);

    $("header").append(brewNameDiv, brewAddressDiv, brewLinkDiv);

    var beerList = returned.beers;
    for (i = 0; i < beerList.length; i++) {
      var newRow = $("<tr>");
      var newName = $("<td>").text(beerList[i].name);
      var newStyle = $("<td>").text(beerList[i].style);
      var newCateg = $("<td>").text(beerList[i].category);
      var newAlcPerc = $("<td>").text(beerList[i].ABV);
      var newDescr = $("<td>").text(beerList[i].description);
      newRow.append(newName, newStyle, newCateg, newAlcPerc, newDescr);
      $("tbody").append(newRow);
    }
  });

  $(".modal-close").on("click", function() {
    $("#beerInfoHeader").empty();
    $("#beerInfoBody").empty();
  });
});

console.log(beerObj);
