# EcoTrack MERN Stack Application

EcoTrack is a full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to help users track their eco-friendly activities, calculate their carbon footprint savings, earn rewards, and compete on a leaderboard.

## Features

*   **Authentication:** User signup, login, and JWT-based authentication for protected routes.
*   **Dashboard:** Displays carbon footprint score, monthly CO2 savings graph, recent activities, and local weather/AQI.
*   **Activity Tracking:** Users can log various eco activities (Walking, Public Transport, Cycling, Recycling, Energy Saving), which calculate CO2 saved and update their carbon score and points.
*   **Analytics:** Monthly CO2 savings chart, total carbon saved, and activity history.
*   **Rewards System:** Users earn points for eco activities and can redeem them for rewards.
*   **Leaderboard:** Displays top users with the highest carbon savings.
*   **Weather API Integration:** Shows local weather conditions and Air Quality Index (AQI).
*   **Notification System:** Backend endpoint for sending eco reminders (placeholder).

## Tech Stack

### Frontend
*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool for modern web projects.
*   **TailwindCSS:** A utility-first CSS framework for rapidly building custom designs.
*   **Chart.js:** Flexible JavaScript charting for designers & developers.
*   **React Router:** Declarative routing for React.
*   **Axios:** Promise-based HTTP client for the browser and Node.js.

### Backend
*   **Node.js:** JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** A NoSQL document database.
*   **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
*   **JWT (JSON Web Tokens):** For secure authentication.
*   **dotenv:** Loads environment variables from a `.env` file.
*   **CORS:** Middleware to enable Cross-Origin Resource Sharing.
*   **bcryptjs:** For password hashing.

## Project Structure

```
ecotrack-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/     # Reusable UI components (Layout, Sidebar, ProtectedRoute)
│   │   ├── context/        # React Context for global state (AuthContext)
│   │   ├── pages/          # Individual application pages
│   │   ├── App.jsx         # Main application component, defines routes
│   │   ├── main.jsx        # Entry point for React app
│   │   └── index.css       # TailwindCSS imports
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
└── server/                 # Node.js backend
    ├── config/             # Database connection
    ├── controllers/        # Business logic for routes
    ├── middleware/         # Authentication and error handling middleware
    ├── models/             # Mongoose schemas (User, Activity, Reward)
    ├── routes/             # API routes
    ├── .env.example        # Example environment variables
    ├── .env                # Environment variables (create this file)
    ├── package.json
    └── server.js           # Main server file
```

## Getting Started

Follow these instructions to set up and run the EcoTrack project on your local machine.

### Prerequisites

*   Node.js (v14 or higher)
*   npm (Node Package Manager)
*   MongoDB instance (local or cloud-based like MongoDB Atlas)

### Installation

1.  **Clone the repository (if applicable):**
    ```bash
    # If you have a git repository, clone it first
    # git clone <your-repo-url>
    # cd ecotrack-app
    ```
    *(Note: For this session, the project structure has been created directly.)*

2.  **Install Backend Dependencies:**
    Navigate to the `server` directory and install the required Node.js packages:
    ```bash
    cd ecotrack-app/server
    npm install
    ```

3.  **Install Frontend Dependencies:**
    Navigate to the `client` directory and install the required React packages:
    ```bash
    cd ../client
    npm install
    ```

### Configuration

1.  **Backend Environment Variables:**
    In the `ecotrack-app/server` directory, create a file named `.env`. Copy the contents from `.env.example` into your new `.env` file and replace the placeholder values:

    ```
    NODE_ENV=development
    PORT=5000
    MONGO_URI=your_mongodb_connection_string_here
    JWT_SECRET=your_jwt_secret_key_here
    WEATHER_API_KEY=your_openweathermap_api_key_here
    ```
    *   `MONGO_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/ecotrack` or your MongoDB Atlas connection string).
    *   `JWT_SECRET`: A strong, random string for signing JWT tokens. You can generate one online or use a random string of characters.
    *   `WEATHER_API_KEY`: Obtain a free API key from [OpenWeatherMap](https://openweathermap.org/api) for weather data.

### Running the Application

1.  **Start the Backend Server:**
    From the `ecotrack-app/server` directory, run:
    ```bash
    npm run server
    ```
    The server will start on `http://localhost:5000` (or the port specified in your `.env` file) and will automatically restart on file changes using `nodemon`.

2.  **Start the Frontend Development Server:**
    From the `ecotrack-app/client` directory, run:
    ```bash
    npm run dev
    ```
    The React development server will start, typically on `http://localhost:5173`.

3.  **Access the Application:**
    Open your web browser and navigate to `http://localhost:5173` to use the EcoTrack application.

## Usage

*   **Register/Login:** Create a new account or log in with existing credentials.
*   **Dashboard:** View your carbon footprint, points, monthly CO2 savings, and local weather.
*   **Activities:** Log your eco-friendly activities and see your impact.
*   **Leaderboard:** See how you rank against other users.
*   **Rewards:** Check available rewards and redeem your points.
*   **Profile:** View your user details.

#