var longitud;
var latitud;
let weather = {
    "apiKey": "f95d0d076e350340a893cd5c666d138a",
    fetchWeather: function (city) {
        fetch (
            "https://api.openweathermap.org/data/2.5/weather?q=" 
            + city 
            + "&units=metric&lang=sp&appid="
            + this.apiKey
            )
            .then((response) => {
              if (!response.ok) {
                alert("No weather found.");
                throw new Error("No weather found.");
              }
              return response.json();
            })
            .then((data) => this.displayWeather(data));
        },
        displayWeather: function (data) {
          const { name } = data;
          const { icon, description } = data.weather[0];
          const { temp, humidity, feels_like, temp_min, temp_max, pressure } = data.main;
          const { speed, deg, gust } = data.wind;
          const { lon, lat } = data.coord;
          const dt = data.dt;
          const { sunrise, sunset } = data.sys;
          document.querySelector(".city").innerText = "El tiempo en " + name;
          document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
          document.querySelector(".description").innerText = description;
          document.querySelector(".temp").innerText = temp + "°C";
          document.querySelector(".sensTemp").innerText = feels_like + "°C";
          document.querySelector(".min").innerText = "Mínima: " + temp_min + "°C";
          document.querySelector(".max").innerText = "Máxima: " + temp_max + "°C";

          document.querySelector(".presionAT").innerText = "Presión atmósfera: " + pressure + " hPa";
          document.querySelector(".humidity").innerText = "Humedad: " + humidity + "%";
          document.querySelector(".wind").innerText = "Viento: " + parseFloat(speed * 3,6).toFixed(2) + " km/h";
          document.querySelector(".gust").innerText = "Ráfaga: " + parseFloat(gust * 3,6).toFixed(2) + " km/h";
          document.querySelector(".lon").innerText = "Coord: [" + lon + ", " + lat + "]";

          // Convertir de Unix timestamp a Date y mostrarlo
          var sunrise1 = this.convertUnixToDate(sunrise);
          var sunset1 = this.convertUnixToDate(sunset);
          document.querySelectorAll("div.sunrise").forEach(element => {
            element.innerText = sunrise1 + " AM";
          });
          document.querySelectorAll("div.sunset").forEach(element => {
            element.innerText = sunset1 + " PM";
          });
          longitud = lon;
          latitud = lat;
          /*document.querySelector(".lon").innerText = "Longitud: " + lon;
          document.querySelector(".lat").innerText = "Latitud: " + lat;*/

          /* Current time */
          var day = new Date(dt*1000);

          var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          var today  = new Date();
          document.querySelector(".fechaActual").innerText = today.toLocaleDateString("es-ES", options);

          /*Fetch pollution API with the data from the first fetch*/
          fetch ("https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat="
          + latitud + "&lon=" 
          + longitud + "&appid="
          + this.apiKey)
          .then(response => response.json())
          .then(data => this.displayPollution(data));

          /*Fetch sunrise-sunset API with the data from the first fetch*/
          fetch ("https://api.sunrise-sunset.org/json?lat=" 
          + latitud + "&lng=" 
          + longitud + "&date=today")
          .then(response => response.json())
          .then(data => this.displaySunset(data));

          /*Fetch UVI from the openweather API with the data from the first fetch*/
          fetch ("https://api.openweathermap.org/data/2.5/onecall?lat="
          + latitud + "&lon="
          + longitud + "&units=metric&exclude=hourly,minutely&appid="
          + this.apiKey)
          .then(response => response.json())
          .then(data => this.displayUvi(data));

          weather.displayWindDegrees(deg)
       
          /* Background */
          document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
        },
        search: function () {
          this.fetchWeather(document.querySelector(".search-bar").value);
        },
        displaySunset: function (data) { 
          const { day_length, civil_twilight_begin, civil_twilight_end, nautical_twilight_begin, nautical_twilight_end, astronomical_twilight_begin, astronomical_twilight_end } = data.results;
          let today = new Date();
          let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          /*document.querySelector(".fechaActual").innerText = "Fecha: " + date;*/
          document.querySelector(".tiempoActual").innerText = ", " + time;
          document.querySelector(".day_length").innerText = "Duración del día: " + day_length;

          document.querySelectorAll("div.civil_twilight_begin").forEach(element => {
            element.innerText = civil_twilight_begin;
          });
          document.querySelectorAll("div.civil_twilight_end").forEach(element => {
            element.innerText = civil_twilight_end;
          });
          document.querySelectorAll("div.nautical_twilight_begin").forEach(element => {
            element.innerText = nautical_twilight_begin;
          });
          document.querySelectorAll("div.nautical_twilight_end").forEach(element => {
            element.innerText = nautical_twilight_end;
          });
          document.querySelectorAll("div.astronomical_twilight_begin").forEach(element => {
            element.innerText = astronomical_twilight_begin;
          });
          document.querySelectorAll("div.astronomical_twilight_end").forEach(element => {
            element.innerText = astronomical_twilight_end;
          });
        },
        displayPollution: function (data) {  
          const { aqi } = data.list[0].main;
          const { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
          document.querySelector(".calidadAire").innerText = "Índice de calidad del aire: " + aqi;
          document.querySelector(".co").innerText = " co: " + co + " ug/m3";
          document.querySelector(".no").innerText = " no: " + no + " ug/m3";
          document.querySelector(".no2").innerText = " no2: " + no2 + " ug/m3";
          document.querySelector(".o3").innerText = " o3: " + o3 + " ug/m3";
          document.querySelector(".so2").innerText = " so2: " + so2 + " ug/m3";
          document.querySelector(".pm2_5").innerText = " pm2_5: " + pm2_5 + " ug/m3";
          document.querySelector(".pm10").innerText = " pm10: " + pm10 + " ug/m3";
          document.querySelector(".nh3").innerText = " nh3: " + nh3 + " ug/m3";
        },
        displayWindDegrees: function(windDegrees) {
          var cardinalDirection;
            if (windDegrees >= 348.75 && windDegrees <= 11.25) {
              cardinalDirection = "N"
              document.querySelector(".deg").src = "https://img.icons8.com/ios-filled/50/000000/up--v1.png";
            }
            if (windDegrees >= 258.75 && windDegrees <= 281.25) {
              cardinalDirection = "W"
              document.querySelector(".deg").src = "https://img.icons8.com/ios-filled/50/000000/left.png";
            }
            if (windDegrees >= 168.75 && windDegrees <= 191.25) {
              cardinalDirection = "S"
              document.querySelector(".deg").src = "https://img.icons8.com/ios-filled/50/000000/down--v1.png";
            }
            if (windDegrees >= 78.75 && windDegrees <= 101.25) {
              cardinalDirection = "E"
              document.querySelector(".deg").src = "https://img.icons8.com/ios-filled/50/000000/right--v1.png";
            }
            if (windDegrees >= 11.25 && windDegrees <= 78.75) {
              cardinalDirection = "NE"
              document.querySelector(".deg").src = "https://img.icons8.com/material-outlined/24/000000/up-right-arrow.png";
            }
            if (windDegrees >= 101.25 && windDegrees <= 168.75) {
              cardinalDirection = "SE"
              document.querySelector(".deg").src = "https://img.icons8.com/ios-filled/50/000000/down-right-arrow.png";
            }
            if (windDegrees >= 191.25 && windDegrees <= 258.75) {
              cardinalDirection = "SW"
              document.querySelector(".deg").src = "https://img.icons8.com/ios-filled/50/000000/down-left-arrow.png";
            }
            if (windDegrees >= 281.25 && windDegrees <= 348.75) {
              cardinalDirection = "NW"
              document.querySelector(".deg").src = "https://img.icons8.com/ios-filled/50/000000/up-left-arrow.png";
            }
        },
        convertUnixToDate: function(unix_timestamp) {
          var date = new Date(unix_timestamp * 1000);
          var hours = date.getHours();
          var minutes = "0" + date.getMinutes();
          var seconds = "0" + date.getSeconds();

          var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
          return formattedTime;
        },
        displayUvi: function(data) {
          const { uvi, clouds } = data.current;
          const { moon_phase } = data.daily[0];
          var today = new Date();
          var phase = weather.getMoonPhase(today.getFullYear(), today.getMonth()+1, today.getDate());
          document.querySelector(".luna").innerText = phase + " " + moon_phase;
          document.querySelector(".uvi").innerText = "Índice de radiación ultravioleta: " + uvi;
          document.querySelector(".cloudiness").innerText = "Nubosidad: " + clouds + " %";

        },
        getMoonPhase: function (year, month, day) {
          var c = e = jd = b = 0;

          if (month < 3) {
              year--;
              month += 12;
          }
          ++month;
          c = 365.25 * year;
          e = 30.6 * month;
          jd = c + e + day - 694039.09; //jd is total days elapsed
          jd /= 29.5305882; //divide by the moon cycle
          b = parseInt(jd); //int(jd) -> b, take integer part of jd
          jd -= b; //subtract integer part to leave fractional part of original jd
          b = Math.round(jd * 8); //scale fraction from 0-8 and round
          if (b >= 8 ) {
              b = 0; //0 and 8 are the same so turn 8 into 0
          }
          switch (b) {
            case 0:
              return 'Luna nueva - New moon';
              break;
            case 1:
              return 'Luna creciente - Waxing crescent moon';
              break;
            case 2:
              return 'Cuarto creciente - Quarter moon';
              break;
            case 3:
              return 'Luna creciente gibosa - Waxing gibbous moon';
              break;
            case 4:
              return 'Luna llena - Full moon';
              break;
            case 5:
              return 'Luna gibosa menguante - Waning gibbous moon';
              break;
            case 6:
              return 'Cuarto menguante - Last quarter moon';
              break;
            case 7:
              return 'Luna menguante - Waning crescent moon';
              break;
          }
        }
      };
      
      document.querySelector(".search button").addEventListener("click", function () {
        weather.search();
      });
      
      document
        .querySelector(".search-bar")
        .addEventListener("keyup", function (event) {
          if (event.key == "Enter") {
            weather.search();
          }
        });
      
      weather.fetchWeather("Madrid");


      // Slider
      var slideIndex = 1;
      showSlides(slideIndex);
      
      function plusSlides(n) {
        showSlides(slideIndex += n);
      }
      
      function currentSlide(n) {
        showSlides(slideIndex = n);
      }
      
      function showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        var dots = document.getElementsByClassName("dot");
        if (n > slides.length) {slideIndex = 1}    
        if (n < 1) {slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex-1].style.display = "block";  
        dots[slideIndex-1].className += " active";
      }