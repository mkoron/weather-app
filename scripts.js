$(document).ready(function() {
  var apiID = "vyHjHC7UzpmshBDtxbtjQ1G1sHJAp1vHJIzjsncLWsWSFnfjeD";
  var system = "metric";
  var geoLocationOn = false;
  var units = [" °C", " km/h", " °F", " mph"];
  var icons = {
    clouds: '<i class="cloud move-cloud"></i>',
    rain: '<i class="cloud"><i class="rain"></i></i>',
    snow: '<i class="cloud"><i class="snow"></i></i>',
    clear: '<i class="sun"></i>',
    thunderstom:
      '<i class="cloud"><i class="rain"><i class="storm"></i></i></i>',
    drizzle:
      '<i class="sun" style="left: 10px;"><i class="cloud"><i class="rain"></i></i></i>',
    fog: '<i class="fog"></i>',
    "Partly Cloudy": '<i class="sun"><i class="cloud"</i></i>'
  };

  $(document).ajaxStart(function() {
    $("#loader").show();
  });

  $(document).ajaxStop(function() {
    $("#loader").hide();
  });

  //get coordinates
  function place(callback) {
    var lat, lon;
    //for when location find is successful
    //return coordinates to a callback
    //function 'callback'
    function success(position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      console.log(position.coords.latitude);
      callback(lat, lon);
    }
    function error() {
      console.log("could not find location");
    }

    //call to api to find coordinates
    navigator.geolocation.getCurrentPosition(success, error);
  }

  place(function(lat, lon) {
    $.ajax({
      url:
        "https://simple-weather.p.mashape.com/weatherdata?lat=" +
        lat +
        "&lng=" +
        lon,
      type: "GET",
      dataType: "json",

      success: function(data) {
        var country = data.query.results.channel.location.country;
        var city = data.query.results.channel.location.city;
        var wind = data.query.results.channel.wind.speed;
        var unitTemp = data.query.results.channel.units.temperature;
        var unitSpeed = data.query.results.channel.units.speed;
        var temperature = data.query.results.channel.item.condition.temp;
        var weather = data.query.results.channel.item.condition.text.toLowerCase();
        console.log(weather);
        $("#city").html(city + "<span id='country'>" + country + "</span>");
        $("#icon").html(icons[weather]);
        $("#tempValue").html(temperature + " °" + unitTemp);
        $("#windValue").html(wind + " " + unitSpeed);
        $("#display").fadeIn("slow");
      },
      error: function(err) {
        console.log(err);
        //$('.inner-container').html('data for location does not exist');
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("X-Mashape-Authorization", apiID);
      }
    });
  });

  // $('#loader').show();   window.setTimeout(function(){if (!geoLocationOn) {
  //        $('#loader').hide();
  //        $('#error').show();
  // }}, 3000);

  //   if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //       var lon = position.coords.longitude;
  //       var lat = position.coords.latitude;

  //       geoLocationOn = true;

  //       getWeather(lon, lat);

  //     });
  //   }  else {
  //     console.log("Geolocation is not supported.");
  //   }
  // var getWeather = function(lon, lat) {  $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiID + "&units=metric", function (data) {
  // var temp = JSON.stringify(Math.round(data.main.temp));
  // var city = data.name;
  // var country = data.query.results.channel.location.city;
  // var desc = data.weather[0].main.toLowerCase();
  // var wind = data.wind.speed;

  //  $('#city').html(city + "<span id='country'>" + country + "</span>");
  //  $('#icon').html(icons[desc]);
  //  $("#tempValue").text(temp + units[0]);
  //  $("#windValue").append(wind + units[1]);
  //   console.log(desc);

  //   $("#loader").hide();
  //   $("#display").fadeIn("slow");
  //       },function (err) {
  //   $("#loader").hide();
  //   $("#display").fadeIn("slow");
  //   $('#display').text('ERROR(' + err.code + '): ' + err.message);
  // });
  // }

  $("button").click(function() {
    if (system === "metric") toImperial();
    else toMetric();
  });
  function toMetric() {
    var temp = parseInt($("#tempValue").text(), 10);
    var wind = parseFloat($("#windValue").text(), 10);
    $("#tempValue").text(Math.round((temp - 32) / 1.8).toFixed(1) + units[0]);
    $("#windValue").text((wind * 1.609344).toFixed(2) + units[1]);
    system = "metric";
    $("button").text("To Imperial");
  }

  function toImperial() {
    var temp = parseInt($("#tempValue").text(), 10);
    var wind = parseFloat($("#windValue").text(), 10);

    $("#tempValue").text((temp * 1.8 + 32).toFixed(1) + units[2]);
    $("#windValue").text((wind / 1.609344).toFixed(2) + units[3]);
    system = "imperial";
    $("button").text("To Metric");
  }
});
