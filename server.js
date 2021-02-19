const express = require('express');
const exphbs = require('express-handlebars');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout: false}));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/weather', (req, res) => {
  const cityName = req.body.cityName;
  const API_KEY = require('./sources/keys.json').API_KEY;
  axios(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
  )
    .then((weather) => {
      const roundedTemperature = Math.round(weather.data.main.temp);
      res.render('index', {
        cityName: `${cityName}`,
        weatherText: `The Temperature is: ${roundedTemperature} °C Degree `,
      });
    })
    .catch((err) => {
      res.render('index', {
        weatherText: `Opps, No Temperature Information. ${cityName} is not found`,
      });
    });
});

// Listen to local host on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server initialized successfully at ${port}`);
});
