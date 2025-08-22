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
      * Dynamic weather icons and descriptions based on WMO codes.
      * Live local clock for the selected city.
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
  * **Session Persistence**: The last searched city and selected unit are automatically loaded when you revisit the app.
  * **Performance Optimization**: Utilizes `React.memo` and `useCallback` extensively to prevent unnecessary re-renders, ensuring a smooth and responsive UI.

## 🛠️ Tech Stack

  * **Framework**: [Next.js](https://nextjs.org/) (with App Router)
  * **Language**: [TypeScript](https://www.typescriptlang.org/)
  * **Styling**: [Tailwind CSS](https://tailwindcss.com/)
  * **State Management**: [React Context API](https://react.dev/learn/passing-data-deeply-with-context) with the `useReducer` hook for predictable and centralized state management.
  * **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) for elegant dark mode handling.
  * **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
  * **Charting**: [Recharts](https://recharts.org/) for the hourly forecast.
  * **APIs**:
      * [Open-Meteo](https://open-meteo.com/) (Geocoding, Weather Forecast, and Air Quality APIs).

-----

## 📂 Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── globals.css         # Global styles and Tailwind directives
│   │   ├── layout.tsx          # Root layout with all context providers
│   │   └── page.tsx            # Main page component (Layout & Background control)
│   ├── components/
│   │   ├── ContentDisplay.tsx  # Handles conditional rendering (Loading/Error/Data)
│   │   ├── FavoriteButton.tsx  # Button to add/remove favorites
│   │   ├── FavoritesBar.tsx    # Displays saved favorite locations
│   │   ├── HourlyChart.tsx     # Chart for hourly forecast
│   │   ├── SearchForm.tsx      # City search input form
│   │   ├── SearchSection.tsx   # Wrapper for SearchForm and FavoritesBar
│   │   ├── ThemeProvider.tsx   # Provider for next-themes
│   │   ├── ThemeToggle.tsx     # UI button to toggle light/dark mode
│   │   ├── UnitToggle.tsx      # UI button to toggle C°/F°
│   │   └── WeatherDisplay.tsx  # Presentational component for all weather conditions
│   ├── constants/
│   │   └── index.ts            # Stores constant values (API keys, strings)
│   ├── context/
│   │   ├── UnitsContext.tsx    # Context for managing temperature units
│   │   └── WeatherContext.tsx  # Context for managing all weather application state
│   ├── hooks/
│   │   └── useDebounce.ts      # Custom hook for debouncing input
│   ├── services/
│   │   └── weatherService.ts   # Handles all external API calls
│   ├── types/
│   │   └── weather.ts          # TypeScript type definitions for all data structures
│   └── utils/
│       └── weatherUtils.ts     # Helper functions for data processing
└── ... (Configuration files)
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