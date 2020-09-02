
// $(document).ready(

// var submitBtn = document.getElementById("searchBtn");
// var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

function searchInputCity(cityName){
    $('#query-city').empty();
    $("#temperature").empty();
    $("#humidity").empty();
    $("#wind-speed").empty();
    $("#uv-index").empty();
    $('#uvBtn').empty();
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=1b32de2789b68003db6d51b0bbe36f60";
    //Query OpenWeather for city name from search bar
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response){
        // console.log(response);
        var date = moment().format('LL');
        var queryCityName = response.name;
        var printCityTitle = $("<p>").text(queryCityName + ":  " + date );
        $("#query-city").append(printCityTitle);
        //inclue an icon
        var weatherIcon = response.weather[0].icon
        console.log(weatherIcon);
       var printIcon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/' + weatherIcon + '@2x.png').attr('alt', 'weather icon');
       $("#query-city").append(printIcon);

        //populate temperature for search result
        var tempFahrenheit = Math.floor((response.main.temp - 273) * (9/5) + 32);
        var printTemp = $("<p>").text("Current Temperature: " + tempFahrenheit + "*F");
        $("#temperature").append(printTemp);
        
        //populate card with humidity for search result
        var queryHumidity = response.main.humidity;
        var printHumidity = $("<p>").text("Humidity: " + queryHumidity + "%");
        $("#humidity").append(printHumidity);

        //populate card with wind speed of search result
        var queryWindSpeed = response.wind.speed;
        var printWindSpeed = $("<p>").text("Wind Speed: " + queryWindSpeed);
        $("#wind-speed").append(printWindSpeed);

        //seperate query for uv index using coordinates
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var uvIndexUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=1b32de2789b68003db6d51b0bbe36f60&lat=" + lat + "&lon=" + lon;
        // var queryUvIndex = response.uvindex;
        $.ajax({
            url: uvIndexUrl,
            method: "GET"
        }).then(function(response){
            console.log(response);
            //populate card with uv index
            var queryUvIndex = Math.floor(response.value);
            var printUvIndex = $("<p>").text("UV Index: " + queryUvIndex);
            $("#uv-index").append(printUvIndex);
        //Uv button color changes: 0-2:low(green), 3-5:moderate(yellow), 6-7:high(orange), 8-10:high(red), 11+:extreme(purple)
            if(queryUvIndex < 3){
            $('#uvBtn').append('<button type="button" class="btn btn-outline-success"  id="green-button">Low</button>') 
            }else if(queryUvIndex >= 3 && queryUvIndex < 6){
                $('#uvBtn').append('<button type="button" class="btn btn-outline-primary"  id="blue-button">Moderate</button>')
            }else if(queryUvIndex >= 6 && queryUvIndex < 8){
                $('#uvBtn').append('<button type="button" class="btn btn-outline-warning" id="yellow-button">High</button>')
            }else if(queryUvIndex >=8 && queryUvIndex <= 10){
                $('#uvBtn').append('<button type="button" class="btn btn-outline-danger" id="red-outline-button">Very High</button>')
            }else if(queryUvIndex >= 11) {
                $('#uvBtn').append('<button type="button" class="btn btn-danger"  id="red-button">Extreme</button>')
            }})
        
            searchForecast(queryCityName);
        }
            
    )};

    //populate 5-day forecast cards
    function searchForecast(cityName){
        $('#forecastCard').empty()
        var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=1b32de2789b68003db6d51b0bbe36f60";
       
        $.ajax({
            url: forecastUrl,
            method: "GET"
        }).then(function(response){
            console.log(response);
        
            for(var i = 3;  i < response.list.length; i+=8){
                console.log(i);
                var indexDate = response.list[i].dt_txt.substring(5, 10);
                // var forecastIcon = response.list.weather.icon
                var indexTemp = response.list[i].main.temp;
                var indexTempFar = (indexTemp - 273 * (9/5) + 32);
                var indexHumidity = response.list[i].main.humidity;
                // var indexIcon = response.list[i].weather.icon;
                $("#forecastCard").append('<h5 class="card-title">' + indexDate + '</h5>');
                // $('#forecastCard').append('<img src="http://openweathermap.org/img/wn/' + indexIcon + '@2x.png" width="50px" height="50px" alt="weather icon">');
                $("#forecastCard").append('<p class="card-text"> Temp: ' + indexTempFar + '</p>');
                $("#forecastCard").append('<p class="card-text"> Humidity: ' + indexHumidity + '</p>');
            }})
    };

//search history saved to localstorage as new array 
function updateSearchHistory(){
    newSearch = $('#inputCity').val();
    searchHistory.unshift(newSearch);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
};

function getSearchHistory(){
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
};

//searchHistory populates the side nav buttons
function populateSearchHistory(){
    $('#recentSearches').empty();
    for(var i = 0; i < searchHistory.length && i < 5; i++){
        var recentSearches = JSON.parse(localStorage.getItem("searchHistory"));
        $('#recentSearches').append('<li class="list-group-item"><button class="recentSearchBtn">' + (recentSearches[i]) + '</button></li>');
        //make the search history a button that links info for that city
        $("button").on("click", function(event){
            event.preventDefault();
            searchInputCity($(this).val());
})}};


$("#searchBtn").on("click", function(event){
    event.preventDefault();
    var cityName = $("#inputCity").val();
    searchInputCity(cityName);
    searchForecast(cityName);
    updateSearchHistory();
    populateSearchHistory();
});

//show either most recent search if there is one, or current location
function init(){
    // var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    getSearchHistory();
    if(searchHistory){
        populateSearchHistory();
        searchInputCity(searchHistory[0]);
    }else {
        searchHistory = [];
        var nashville = "nashville";
        searchInputCity(nashville);
    }
};

init();