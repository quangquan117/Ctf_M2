# PollHub Voting System

![PollHub Banner](https://img.shields.io/badge/PollHub-Voting%20System-blue?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

Welcome to **PollHub**, a full-stack online polling application that allows users to create, share, and participate in polls.

## 🏗️ Project Structure

This repository is divided into two main components:

- `back/` (and `back copie/`): The Spring Boot backend.
- `front/`: The React frontend built with Vite.

---

## 🚀 Backend (Spring Boot)

The backend is a robust REST API built with Java 21, Spring Boot, and Spring Security.

### Features
- **Authentication:** JWT-based authentication.
- **Polls (Sondage):** Create, vote, and manage multi-response polls.
- **Database:** Uses an in-memory H2 database (`/h2-console` accessible during development).
- **Security:** Stateless session management and CORS configured for the frontend.

### Getting Started (Backend)

1. Navigate to the backend directory:
   ```bash
   cd back
   # Or 'cd back copie' depending on the active working directory
   ```
2. Build and run the application using Gradle:
   ```bash
   ./gradlew bootRun
   ```
3. The server will start on `http://localhost:8080`.

---

## 🎨 Frontend (React + Vite)

The frontend is a modern single-page application built with React, TypeScript, and Vite for lightning-fast development.

### Features
- **Fast Build:** Powered by Vite.
- **Type Safety:** Written in TypeScript.
- **Linting:** ESLint configured for code quality.

### Getting Started (Frontend)

1. Navigate to the frontend directory:
   ```bash
   cd front
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The application will be accessible at `http://localhost:5173`.

---

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot 4.0.x
- Spring Security (JWT)
- Spring Data JPA
- H2 Database
- Gradle

### Frontend
- React 19
- TypeScript
- Vite
- ESLint

## 📝 License

This project is open-source and available for educational purposes.
