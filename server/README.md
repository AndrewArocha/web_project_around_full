# Gallery Around the World - Backend

## 📝 Project Description
This project is the backend infrastructure for the "Gallery Around the World" web application. It is a RESTful API built with Express.js and Node.js that serves user profiles and location cards. 

The server is designed with a strong focus on modular routing, asynchronous file handling, and robust error management. It dynamically reads data from static JSON files and ensures that all client requests are met with accurate data or precise, informative error messages. 

## 🚀 Features
*   **Modular Routing:** Independent Express routers for `/users` and `/cards` endpoints.
*   **Dynamic Endpoints:** Fetches specific users via dynamic routing (e.g., `/users/:id`).
*  ***`NEW`*** **Database Integration:** Connects to a `MongoDB` database using Mongoose for robust data modeling and validation.
*   **Secure Pathing:** Implements `node:path` and ES Module `import.meta.dirname` for absolute path resolution.
*   **Strict Error Handling:** Comprehensive `try...catch` blocks to prevent unhandled exceptions, alongside a dedicated 404 catch-all route for invalid endpoints.

## 🛠️ Technologies & Techniques Used
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Architecture:** ES Modules (`import`/`export`)
*   **Development Tools:** ESLint, Prettier, tsx (Hot Reloading)

## 💻 Running the Project Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AndrewArocha/web_project_around_express