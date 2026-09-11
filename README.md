# Gallery Around the World - Full Stack Monorepo 🌍

## 📄 Project Description

This project is a fully responsive full-stack web application that allows users to register, securely authenticate, edit profiles, update avatars, and manage a personalized gallery of location image cards. 

In this integrated phase, the application combines a modern **React** front-end built with **Vite** and TypeScript, communicating seamlessly with a robust **Express.js and Node.js RESTful API** backed by a **MongoDB** database via Mongoose.

---

## ✨ Features & Architecture

* **Full-Stack Integration:** Client-server architecture with CORS configuration bridging port 3000 (React) and port 3001 (Express API).
* **Secure Authentication:** JWT-based authorization flow supporting secure user registration (/signup), login (/signin), protected routes (ProtectedRoute), and token persistence.
* **Database Persistence:** Mongoose data modeling and validation connected to a local MongoDB instance (aroundb).
* **Global State Management:** Powered by React Context API (CurrentUserContext) for user data distribution without prop drilling.
* **Component-Based UI:** Modular architecture featuring dynamic popups, controlled forms, card management (CRUD), likes, and an informative feedback tooltip (InfoTooltip).
* **Responsive Design:** Built using CSS Grid, Flexbox, and strict mobile-first adaptations to look and function smoothly across all screen sizes.

---

## 🛠️ Technologies & Techniques Used

* **Frontend:** React, TypeScript, Vite, React Router DOM, CSS3 (BEM Methodology).
* **Backend:** Node.js, Express.js, MongoDB, Mongoose, TypeScript, ES Modules.
* **Development & Quality Tools:** ESLint, Prettier, concurrently (for monorepo script execution).

---

## 🚀 Running the Project Locally

To run both halves of the project simultaneously on your machine, follow these steps:

### 1. Clone the repository:
git clone https://github.com/AndrewArocha/web_project_around_full.git
cd web_project_around_full

### 2. Install dependencies for both client and server:
You can install everything across both workspaces from the root directory:
npm run install:all

### 3. Ensure MongoDB is running:
Make sure your local MongoDB service is active (e.g., via Windows Services or net start MongoDB).

### 4. Run the application:
Start both the API server and the React client concurrently:
* **Run both simultaneously:** npm run dev
* **Or run them individually in separate terminals:**
  * Server: npm run dev:server (Runs on http://localhost:3001)
  * Client: npm run dev:client (Runs on http://localhost:3000)