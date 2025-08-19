# Weather Forecast App

A sleek and modern weather application built with Next.js and Tailwind CSS. Search for any city worldwide, get real-time weather data, personalize your experience with theme and unit options, and save your favorite locations for quick access.

## 📸 Screenshot

![App Screenshot](screenshots/app-screenshot.png)

## 🚀 Live Demo

[https://weather-app-next-gold.vercel.app/](https://weather-app-next-gold.vercel.app/)

-----

## ✨ Features

  * **City Search**: Dynamically search for cities worldwide.
      * **Debounced Input**: API calls are optimized to fire only after the user stops typing.
      * **Dynamic Language**: Automatically detects Korean input to provide search results in Korean.
      * **Keyboard Navigation**: Use `ArrowUp` and `ArrowDown` keys to navigate suggestions and `Enter` to select.
  * **Real-time Weather Data**:
      * Current conditions (temperature, "feels like," humidity, wind speed, and air quality).
      * Dynamic weather icons and descriptions.
      * Hourly temperature forecast chart.
      * 7-day weekly forecast.
  * **Dynamic & Personalized UI**:
      * **Sophisticated Dark Mode**: Automatically syncs with your system's theme. A manual toggle allows you to override the OS setting, and your choice is saved for future visits.
      * **Temperature Unit Selection**: Easily switch between Celsius (°C) and Fahrenheit (°F). Your preference is saved in your browser.
      * **Dynamic Background**: The background gradient smoothly cross-fades to match the current weather conditions, time of day, and selected theme.
  * **Geolocation**: Instantly get the weather for your current location with a single click.
  * **Favorites System**:
      * Add or remove cities from a persistent favorites list.
      * Favorites are saved locally in the browser using `localStorage`.
  * **Session Persistence**: The last searched city is automatically loaded when you revisit the app.
  * **Accessibility**: Press `Enter` from anywhere on the page to immediately focus the search bar.

## 🛠️ Tech Stack

  * **Framework**: [Next.js](https://nextjs.org/) (with App Router)
  * **Language**: [TypeScript](https://www.typescriptlang.org/)
  * **Styling**: [Tailwind CSS](https://tailwindcss.com/)
  * **State Management**: [React Context API](https://react.dev/learn/passing-data-deeply-with-context) for global state (Theme, Units).
  * **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) for elegant dark mode handling.
  * **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
  * **Charting**: [Recharts](https://recharts.org/) for the hourly forecast.
  * **APIs**:
      * [Open-Meteo](https://open-meteo.com/) (Geocoding, Weather Forecast, and Air Quality APIs).

-----

## 📂 Project Structure

```
src/
├── app/
│   ├── globals.css                 # Global CSS and Tailwind directives
│   └── layout.tsx                  # Root layout with context providers
│   └── page.tsx                    # Main page component and application logic
├── components/
│   ├── FavoriteButton.tsx          # Button to add/remove favorites
│   ├── FavoritesBar.tsx            # Displays saved favorite locations
│   ├── HourlyChart.tsx             # Chart for hourly temperature forecast
│   ├── SearchForm.tsx              # City search input form
│   ├── ThemeProvider.tsx           # Provider for next-themes
│   ├── ThemeToggle.tsx             # UI button to toggle light/dark mode
│   ├── UnitToggle.tsx              # UI button to toggle C°/F°
│   └── WeatherDisplay.tsx          # Displays all weather conditions
├── context/
│   └── UnitsContext.tsx            # Context for managing temperature units
├── hooks/
│   └── useDebounce.ts              # Custom hook for debouncing input
├── services/
│   └── weatherService.ts           # Handles all external API calls
├── types/
│   └── weather.ts                  # TypeScript type definitions
└── utils/
    └── weatherUtils.ts             # Helper functions for data processing
```

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

  * Node.js (v18.x or later)
  * npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd your-repo-name
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Environment Variables**
    This project uses the Open-Meteo API, which does **not** require an API key. Therefore, no `.env.local` file is necessary.

### Running the Development Server

Start the development server with the following command:

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the result.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## 🙏 Acknowledgements

A big thank you to [Open-Meteo](https://open-meteo.com/) for providing the free, high-quality weather, geocoding, and air quality APIs that power this application.