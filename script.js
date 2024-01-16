var searchInput = $("#search-input");
var searchBtn = $("#search-button");
var forcastToday = $("#today");
var forecastFiveDays = $("#forecast");
var historySection = $("#history");
var latitude = "";
var longitude = "";
var apiKey = '75142a60478f3639a297c2cc0e51c8c9';


// This function is to retrieve longitude and latitude from search input value of a City
var fetchFunction = function (city) {
  var queryUrlCityCoordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

  // Data fetch 
  fetch(queryUrlCityCoordinates)
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      // Error message will show up is city doest exist
      if (!data || data.length === 0 || !data[0].lat || !data[0].lon) {
        var errorMessage = $(`<p class="px-2 text-danger">City not found</p>`);
        $("#error-message").empty().append(errorMessage);
      } else {
        $("#error-message").empty();
        // Grab latitude and longitude with 4 decimals at the end
        latitude = data[0].lat.toFixed(4);
        longitude = data[0].lon.toFixed(4);

        var queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

        fetch(queryURL)
          .then((resp) => {
            return resp.json();
          })
          .then((data) => {
            forcastToday.empty();
            forecastFiveDays.empty();
            var forecastHeading = $(
              `<h2 class="fs-4 px-4 pt-4">${
                city.charAt(0).toUpperCase() + city.slice(1)
              } ${dayjs().format(
                "(DD/MM/YYYY)"
              )} <img src="http://openweathermap.org/img/w/${
                data.list[0].weather[0].icon
              }.png "></h2>`
            );
            // This will show temperature
            var forecastTemp = $(
              `<p class="px-4">Temp: ${(
                data.list[0].main.temp - 273.15
              ).toFixed(2)} &deg;C</p>`
            );
            // Thi will show Wind speed
            var forecastWind = $(
              `<p class="px-4">Wind: ${data.list[0].wind.speed} KPH</p>`
            );
            // This will show humidity
            var forecastHumidity = $(
              `<p class="px-4 pb-4 mb-0">Humidity: ${data.list[0].main.humidity}%</p>`
            );
            forcastToday.append(
              forecastHeading,
              forecastTemp,
              forecastWind,
              forecastHumidity
            );
            // This is for the five day forecast data and elements
            var fiveDaysHeader = $(`<h4 class="px-4 mb-3">5-Day Forecast</h4>`);
            forecastFiveDays.append(fiveDaysHeader);
            for (var i = 1; i < 6; i++) {

              // This is for the card
              var fiveDaysCard =
                $(`<div class="card col-md-5 col-xl-2 border-0">
          <div class="card-body px-2">
            <h6 class="card-title">${dayjs()
              .add(i - 1 + 1, "day")
              .format("DD/MM/YYYY")}</h6>
              <img src="http://openweathermap.org/img/w/${
                data.list[i * 8 - 1].weather[0].icon
              }.png">
            <p class="card-text">Temp: ${(
              data.list[i * 8 - 1].main.temp - 273.15
            ).toFixed(2)} &deg;C</p>
            <p class="card-text">Wind: ${
              data.list[i * 8 - 1].wind.speed
            } KPH</p>
            <p class="card-text">Humidity: ${
              data.list[i * 8 - 1].main.humidity
            }%</p>
          </div>
        </div>`);
              // This will add cards to forecast section
              forecastFiveDays.append(fiveDaysCard);
            }
          });
      }
    })
    .catch((error) => {
      // console.log(`Error: ${error.message}`);
    });
};

// Event on search button click 
searchBtn.on("click", (event) => {
  event.preventDefault();
  forcastToday.empty();
  forecastFiveDays.empty();
  fetchFunction(searchInput.val());
  addItem();
  searchInput.val("");
});

// Event on clear history button click. 
$("#aside-column").on("click", "#btn-clear", () => {
  localStorage.clear();
  forcastToday.empty();
  forecastFiveDays.empty();
  addItem();
  $("#btn-clear").remove();
});

// Event on history div list item click, to display forecast data
$("#history").on("click", ".list-group-item", function () {
  fetchFunction($(this).text());
});
