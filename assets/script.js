
// $(document).ready(init());
var cityName = $(".inputCity").val();

function searchInputCity(cityName){
    // var cityName = $(".inputCity").val()
    $('.query-city').empty();
    $(".temperature").empty();
    $(".humidity").empty();
    $(".wind-speed").empty();
    $(".uv-index").empty();
    $('.uvBtn').empty();
    $(".weather-icon").empty();
    $(".weather-description").empty();

    
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=166a433c57516f51dfab1f7edaed8413";
    //Query OpenWeather for city name from search bar
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response){
        var date = moment().format('LL');
        $(".query-city").text(response.name + ":  " + date);
       
       $(".weather-icon").attr("src",'http://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png');

       var weatherDescription = response.weather[0].description;
        $('.weather-description').append(weatherDescription);
        
        var printTemp = $("<p>").text("Current Temperature: " + Math.floor((response.main.temp - 273) * (9/5) + 32) + "*F");
        $(".temperature").append(printTemp);
        
        var printHumidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        $(".humidity").append(printHumidity);

        var printWindSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + "mph");
        $(".wind-speed").append(printWindSpeed);

        var uvIndexUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=166a433c57516f51dfab1f7edaed8413&lat=" + response.coord.lat + "&lon=" + response.coord.lon;

        $.ajax({
            url: uvIndexUrl,
            method: "GET"
        }).then(function(response){
            console.log(response);
            var queryUvIndex = Math.floor(response.value);
            var printUvIndex = $("<p>").text("UV Index: " + queryUvIndex);
            $(".uv-index").append(printUvIndex);
        //Uv button color changes: 0-2:low(green), 3-5:moderate(yellow), 6-7:high(orange), 8-10:high(red), 11+:extreme(purple)
            if(queryUvIndex < 3){
            $('.uvBtn').append('<button type="button" class="btn btn-outline-success"  id="green-button">Low</button>') 
            }else if(queryUvIndex = 3, queryUvIndex > 3 && queryUvIndex < 6){
                $('.uvBtn').append('<button type="button" class="btn btn-outline-primary"  id="blue-button">Moderate</button>')
            }else if(queryUvIndex = 6, queryUvIndex > 6 && queryUvIndex < 8){
                $('.uvBtn').append('<button type="button" class="btn btn-outline-warning" id="yellow-button">High</button>')
            }else if(queryUvIndex =8, queryUvIndex > 8 && queryUvIndex < 10, queryUvIndex = 10){
                $('.uvBtn').append('<button type="button" class="btn btn-outline-danger" id="red-outline-button">Very High</button>')
            }else if(queryUvIndex = 11, queryUvIndex < 11) {
                $('.uvBtn').append('<button type="button" class="btn btn-danger"  id="red-button">Extreme</button>')
            }})
        }
        )
        createForecast(cityName);
};

function createForecast(cityName){
    $('.forecast-container').empty();
    var forecastUrl= "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + cityName + "&cnt=5&appid=166a433c57516f51dfab1f7edaed8413"
    $.ajax({
        url: forecastUrl,
        method: "GET"
    }).then(function(response){
        console.log(response);
        for(i=0; i<5; i++){
            var day = response.list[i];
            var forecastDate = day.dt;
            var indexTemp = day.temp.max;
            var forecastTempFar = Math.floor(((indexTemp - 273) * (9/5) + 32));
            var forecastIcon = day.weather[0].icon;
            var forecastHumidity = day.humidity;
            let unix_timestamp = day.dt;
            var forecastDate = new Date(unix_timestamp * 1000);
            var titleDate = forecastDate.toLocaleDateString("en-US");
            
            var forecastContainer= $('.forecast-container');
            var card = $('<div class="card">');
            var cardBody = $('<div class="card-body">');
            var cardTitle = $('<h5 class="card-title">' + titleDate + '</h5>');
            var cardIcon = $("<img src='http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png' alt='weather icon'/>");
            var cardTemp = $('<p> High of ' + forecastTempFar + "*F</p>");
            var cardHumidity = $('<p> Humidity: ' + forecastHumidity + "%</p>")

            forecastContainer.append(card);
            card.append(cardBody);
            cardBody.append(cardTitle);
            cardTitle.append(cardIcon);
            cardTitle.append(cardTemp);
            cardTitle.append(cardHumidity);

}})};
        
//search history saved to localstorage as new array 
function updateSearchHistory(){
    newSearch = $('.inputCity').val();
    searchHistory.unshift(newSearch);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    populateSearchHistory();
};

function getSearchHistory(){
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
};

function populateSearchHistory(){
    $('.recentSearches').empty();
    for(var i = 0; i < 5; i++){
        var recentSearches = JSON.parse(localStorage.getItem("searchHistory"));
        $('.recentSearches').append('<li class="list-group-item"><button class="btn btn-primary listBtn">' + (recentSearches[i]) + '</button></li>');
    }
        $(".listBtn").on("click", function(event){
            event.preventDefault();
            var buttonCity = $(this).text();
            console.log(buttonCity);
            searchInputCity(buttonCity);
        });
};




$(".searchBtn").on("click", function(event){
    var newSearch = $('.inputCity').val();
    // event.preventDefault();
    searchInputCity(newSearch);
    updateSearchHistory(newSearch);
    populateSearchHistory();
});

//show either most recent search if there is one, 
function init(){
    getSearchHistory();
    if(searchHistory){
        populateSearchHistory();
        searchInputCity(searchHistory[0]);
        // createForecast(searchHistory[0]);
    }else {
        searchHistory = [];
        var nashville = "nashville";
        searchInputCity(nashville);
        // createForecast(nashville);
    }
};

init();