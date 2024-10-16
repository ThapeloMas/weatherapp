# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Weather App

A real-time weather application that provides current weather conditions, hourly and daily forecasts, weather alerts, and support for multiple locations. The app also offers offline access, customization options, and is optimized for performance while prioritizing user privacy and security.

## Features

### 1. Real-time Weather Information
- Displays **current weather conditions** such as temperature, humidity, wind speed, and more.
- **Hourly and daily forecasts** are available to help users plan ahead.

### 2. Location-Based Forecasting
- Users can **manually set their location** or let the app **automatically detect** it via device location services.
- Provides weather updates based on the user’s current location.

### 3. Multiple Locations
- Users can **save multiple locations** for quick access to weather information.
- Easily switch between locations to get weather updates from different places.

### 4. Offline Access
- The app **caches weather data** to ensure that users can still access the most recent forecast, even when offline.

### 5. Performance
- The app is optimized for **fast loading** and smooth performance, ensuring minimal latency when fetching data.
- Uses efficient API requests and caching mechanisms to improve response times and reduce data usage.

### 6. Privacy & Security
- The app complies with **privacy regulations** by protecting user location data and any personal information.
- **Secure data transmission** is used to ensure that user data remains private.

## Screenshots

### Home Screen (Current Weather)
![Home Screen](src/components/Images/Screenshot%202024-10-16%20104210.png)
*Displays current weather conditions for the user’s selected or detected location.*

### Daily Forecast
![Daily Forecast](src/media/Weather_App5.png)
*Displays the weather forecast for the upcoming week, including high/low temperatures and conditions.*

### Multiple Locations
![Multiple Locations](src/media/Weather_App2.png)
*Users can add, view, and switch between different saved locations for weather updates.*

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Cornel-MIT/Weather-App.git
    cd weather-app
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api) or any other weather API provider.

4. Add your API key in the environment variables or configuration file.

5. Start the application:
    ```bash
    npm start
    ```

## Technologies Used

- **React.js** for the user interface.
- **OpenWeatherMap API** for fetching weather data.
- **HTML/CSS** for layout and styling.
- **Service Workers** for offline access and caching.
- **LocalStorage** for saving user preferences and locations.

## Future Improvements

- Add support for **additional languages**.
- Integrate more **detailed weather maps** (e.g., radar).
- Provide **custom weather alerts** based on user-defined thresholds