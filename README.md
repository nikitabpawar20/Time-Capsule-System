# ⏳ Time Capsule System

A modern and intuitive web application that allows users to schedule messages and memories for their future selves. This project is built using Node.js and Express.js, featuring a clean dashboard and automated message unlocking logic.

## 🌟 Key Features
* **Message Scheduling:** Easily set a specific date and time for your future messages.
* **Auto-Unlock Logic:** Messages remain "Locked" securely until the scheduled time arrives.
* **Professional Dashboard:** A responsive UI with a sidebar navigation and real-time status updates.
* **Notification System:** Visual badges and alerts for newly unlocked messages.

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3 (Custom UI), JavaScript (ES6+)
* **Backend:** Node.js, Express.js
* **Architecture:** MVC-inspired routing using Express Router.
* **Environment Management:** Configuration handled via `.env`.

## 📂 Folder Structure
* `public/` - Static assets including HTML, CSS, and client-side JavaScript.
* `routes/` - Backend API endpoints and message handling logic.
* `config/` - App configuration and server settings.
* `server.js` - The main entry point of the application.

## 🚀 Installation & Setup
1. Clone the repository to your local machine.
2. Run `npm install` to install all necessary dependencies.
3. Create a `.env` file and set your desired `PORT` (e.g., `PORT=5000`).
4. Start the server using `npm start`.
5. Open `http://localhost:5000` in your browser.
