// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
var submitBtn = document.getElementById("searchBtn");
var searchHistory = [];

function searchInputCity(cityName){

//Set up search variables
var queryUrl = "api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=1b32de2789b68003db6d51b0bbe36f60";
var searchBtn = document.getElementById('searchBtn');
//Query OpenWeather for city name from search bar

$.ajax({
    url: queryUrl,
    method: "GET"
}).then(function(response){
    //Grab the temperature, humidity, wind speed, uv index and populate the card with those values
    console.log(response);
    //populate card with temperature of search result
    var queryTemp = response.temperature.temperature_unit.Fahrenheit;
    var printTemp = $("<p>").text("Temperature: " + queryTemp);
    $("#temperature").append(printTemp);
    //populate card with humidity for search result
    var queryHumidity = response.main.humidity;
    var printHumidity = $("<p>").text("Humidity: " + queryHumidity + "%");
    $("#humidity").append(printHumidity);
    //populate card with wind speed of search result
    var queryWindSpeed = response.wind.speed;
    var printWindSpeed = $("<p>").text("Wind Speed: " + queryWindSpeed);
    $("#wind-speed").append(printWindSpeed);
    //populate card with uv index
    // var queryUvIndex = response.uvindex;
    var printUvIndex = $("<p>").text("UV Index: " + queryUvIndex);
    $("#uv-index").append(printUvIndex);
    //Uv button color changes: 0-2:low(green), 3-5:moderate(yellow), 6-7:high(orange), 8-10:high(red), 11+:extreme(purple)
        if(queryUvIndex < 3){
           $('#uvBtn').removeAttribute("class").append('<button type="button" class="btn btn-outline-success" class="hide" id="green-button">Low</button>') 
        }else if(queryUvIndex >= 3 && queryUvIndex < 6){
            $('#uvBtn').removeAttribute("class").append('<button type="button" class="btn btn-outline-primary" class="hide" id="blue-button">Moderate</button>')
        }else if(queryUvIndex >= 6 && queryUvIndex < 8){
            $('#uvBtn').removeAttribute("class").append('<button type="button" class="btn btn-outline-warning" class="hide" id="yellow-button">High</button>')
        }else if(queryUvIndex >=8 && queryUvIndex <= 10){
            $('#uvBtn').removeAttribute("class").append('<button type="button" class="btn btn-outline-danger" class="hide" id="red-outline-button">Very High</button>')
        }else if(queryUvIndex >= 11) {
            $('#uvBtn').removeAttribute("class").append('<button type="button" class="btn btn-danger" class="hide" id="red-button">Extreme</button>')
        };                             
})
};

//populate 5-day forecast cards

//search history saved to localstorage as new array 
function saveSearchHistory(){
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

};

//searchHistory populates the side nav
function populateSearchHistory(){

    for(var i = 0; i < 5; i++){
        var recentSearches = JSON.parse(localStorage.getItem("searchHistory"));

        $('.list-group').append('<p class="list-group-item"><a href="#" class="card-link">' + recentSearches[i] + '</a></p>');
        //make the search history a button that links info for that city
}};

//Set most recent search as the landing page



$("#searchBtn").on("click", function(event){
    event.preventDefault();
    var cityName = $("#inputCity").val();
    searchInputCity(cityName);
});