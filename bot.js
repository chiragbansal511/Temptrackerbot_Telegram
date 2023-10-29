const TelegramBot = require('node-telegram-bot-api');
const axios = require("axios");

const apiKey = '1401f8c37d05a356ca9cca954ebc8dd8';
const token = '6705087135:AAF1Ui4UAV-dNMNVT7knyj4D7Wr7cX2Z9ew';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome! Enter the name of a city to know its weather update.");
});

bot.on("message", (msg) => {
  if (msg.text.startsWith('/')) {
    // Ignore messages starting with '/'
    return;
  }

  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${msg.text}&appid=${apiKey}`)
    .then(response => {
      // Extract the weather information from the API response
      const weatherData = response.data;
      const weatherDescription = weatherData.weather[0].description;
      const temperature = (weatherData.main.temp - 273.15).toFixed(2); // Convert temperature from Kelvin to Celsius

      // Create a message to send
      const message = `Weather in ${msg.text}:\nDescription: ${weatherDescription}\nTemperature: ${temperature}°C`;

      // Send the message to the user
      bot.sendMessage(msg.chat.id, message);
    })
    .catch(error => {
      console.error('Error:', error);
      bot.sendMessage(msg.chat.id, 'Sorry, an error occurred while fetching the weather data.');
    });
});
