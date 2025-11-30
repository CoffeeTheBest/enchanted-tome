# Enchanted Tome - Professional Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Application Flowcharts](#application-flowcharts)
8. [Project Structure](#project-structure)
9. [Setup & Installation](#setup--installation)
10. [Running the Application](#running-the-application)
11. [Frontend Components](#frontend-components)
12. [Backend Services](#backend-services)
13. [Authentication System](#authentication-system)
14. [Styling & Design System](#styling--design-system)
15. [Database Operations](#database-operations)
16. [Development Workflow](#development-workflow)
17. [Deployment](#deployment)

---

## Project Overview

**Enchanted Tome** is a full-stack medieval-themed bookstore web application built entirely in **JavaScript/JSX**. The application evokes a magical bookshop with warm candlelight, wooden shelves, and floating dust motes animations. It provides a seamless experience for browsing books and a secure administrative panel for inventory management.

### Project Goals
- Create an immersive, enchanted medieval bookstore experience.
- Provide book browsing, searching, and filtering capabilities.
- Enable authenticated admin users to manage book inventory via a secure dashboard.
- Support dual theme modes (light parchment and dark walnut) for user comfort.
- Utilize **Firebase** for backend services, including database and authentication.
- Deliver a responsive, accessible, and modern user experience.

### Key Characteristics
- **100% JavaScript/JSX**: Modern JavaScript practices without TypeScript in application code.
- **Firebase-Powered Backend**: Uses Firebase Realtime Database and Firebase Authentication for a robust, scalable backend.
- **Token-Based Authentication**: Secure authentication using Google Sign-In and Email/Password, with JWTs verified on the server.
- **Responsive Design**: Mobile-first design ensures a great experience on all devices.
- **Efficient Server-State Management**: Leverages TanStack Query (React Query) for optimistic updates and data synchronization.

---

## Technology Stack

### Frontend
- **React 18** - A JavaScript library for building user interfaces.
- **Vite** - A modern frontend build tool that significantly improves the development experience.
- **TanStack React Query** - Powerful asynchronous state management for server-state.
- **Wouter** - A minimalist routing library for React.
- **Shadcn/ui** - A collection of re-usable UI components.
- **Tailwind CSS** - A utility-first CSS framework for rapid UI development.
- **Framer Motion** - A production-ready motion library for React.
- **Lucide React** - A comprehensive and beautiful icon library.

### Backend
- **Node.js** - A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js** - A minimal and flexible Node.js web application framework.
- **Firebase Admin SDK** - For server-side authentication and database access.

### Database & Authentication
- **Firebase Realtime Database** - A NoSQL cloud database that lets you store and sync data between your users in realtime.
- **Firebase Authentication** - Provides backend services, easy-to-use SDKs, and ready-made UI libraries to authenticate users. Supports Google Sign-In and Email/Password.

### Development Tools
- **ESLint** - For identifying and reporting on patterns found in ECMAScript/JavaScript code.
- **PostCSS** - A tool for transforming CSS with JavaScript.
- **Autoprefixer** - A PostCSS plugin to parse CSS and add vendor prefixes to CSS rules.

---

## Features

### User-Facing Features
1. **Themed Experience**
   - Light mode (parchment) and Dark mode (walnut) with a toggle in the navigation.
   - Theme preference is saved to the user's local storage.
   - Animated dust motes and scroll-reveal effects to enhance the "enchanted" feel.

2. **Book Discovery**
   - Browse all available books in a responsive grid layout.
   - Dynamic search functionality to filter books by title and author in realtime.
   - View detailed book information in a modal, including description, author, price, and stock status.

3. **Authentication**
   - Seamless user login/signup using **Google Sign-In** or **Email and Password**.
   - Secure, persistent sessions managed via Firebase.
   - User profile information displayed in the navigation bar.

### Admin Features
1. **Admin Dashboard**
   - A secure, protected page accessible only to users with administrative privileges.
   - View, create, edit, and delete books from the inventory.

2. **Book Management**
   - A dedicated form to add new books with details like title, author, price, cover URL, etc.
   - Ability to edit all fields for existing books.
   - Confirmation prompts for deleting books to prevent accidental removal.
   - All changes are reflected in the database in realtime.

### Technical Features
1. **Real-Time Data Sync**
   - TanStack Query provides automatic cache invalidation and background refetching.
   - Optimistic updates are used for a smoother user experience when managing books.

2. **Secure API**
   - Backend API routes for creating, updating, and deleting books are protected.
   - The server verifies Firebase ID tokens (JWT) on every protected request.

3. **Responsive & Accessible Design**
   - The UI is optimized for all screen sizes, from mobile phones to desktop monitors.
   - Attention to accessible color contrast ratios and keyboard navigation.

---

## Architecture

### System Architecture
```
┌─────────────────────────────────────────┐
│        Client (React/Vite/JSX)          │
│  - UI Components (Shadcn)               │
│  - Routing (Wouter)                     │
│  - Auth State (useAuth hook)            │
│  - Server State (TanStack Query)        │
└────────────────┬───┬────────────────────┘
                 │   │ (Firebase SDK)
     (REST API)  │   │
                 │   │
┌────────────────▼───▼────────────────────┐
│      Firebase Services (Google Cloud)   │
│  - Firebase Authentication              │
│  - Firebase Realtime Database           │
└────────────────▲────────────────────────┘
                 │ (Firebase Admin SDK)
                 │
┌────────────────▼────────────────────────┐
│     Server (Node.js/Express.js)         │
│  - API Routes                           │
│  - JWT Verification Middleware          │
│  - Serves static client in production   │
└─────────────────────────────────────────┘
```

### Data Flow
1. **Authentication**:
   - The React client uses the **Firebase JS SDK** to authenticate the user with Google or Email/Password.
   - On success, Firebase returns an ID token (JWT) to the client.
2. **Authenticated API Requests**:
   - The client sends the ID token in the `Authorization` header of its API requests to the Express server.
3. **Server-Side Verification**:
   - The Express server uses a middleware (`server/auth.js`) with the **Firebase Admin SDK** to verify the ID token.
4. **Database Operations**:
   - If the token is valid, the server performs the requested action (e.g., create a book) on the **Firebase Realtime Database**.
5. **Response**:
   - The server returns a JSON response to the client, which then updates its state via TanStack Query.

---

## Database Schema

The application uses **Firebase Realtime Database**, a NoSQL database where data is stored as one large JSON tree.

### Data Structure

```json
{
  "books": {
    "-Nq...": {
      "id": "-Nq...",
      "title": "Pride and Prejudice",
      "author": "Jane Austen",
      "description": "...",
      "price": 12.99,
      "category": "Classic",
      "coverUrl": "https://...",
      "publishedYear": 1813,
      "pages": 432,
      "inStock": true,
      "createdAt": "2025-11-28T14:16:37.393Z",
      "updatedAt": "2025-11-28T14:16:37.393Z"
    }
  },
  "users": {
    "firebase_uid_1": {
      "uid": "firebase_uid_1",
      "email": "user@example.com",
      "displayName": "John Doe",
      "photoURL": "https://...",
      "isAdmin": true
    }
  }
}
```

- **/books**: A collection where each child is a book object, identified by a unique key generated by Firebase (`push` ID).
- **/users**: A collection where each child is a user object, identified by their Firebase `uid`. This collection stores app-specific user data, such as the `isAdmin` flag.

---

## API Endpoints

All API endpoints are prefixed with `/api`.

### Book Endpoints

#### `GET /api/books`
Retrieves all books. This is a public endpoint.
- **Response**: An array of book objects.
- **Status**: `200 OK`

#### `POST /api/books`
Creates a new book.
- **Authentication**: Required (Admin only).
- **Request Body**: A JSON object representing the new book.
- **Response**: The newly created book object, including its Firebase-generated ID.
- **Status**: `201 Created` | `401 Unauthorized` | `403 Forbidden`

#### `PUT /api/books/:id`
Updates an existing book.
- **Authentication**: Required (Admin only).
- **URL Parameter**: `id` - The unique ID of the book to update.
- **Request Body**: A JSON object with the fields to update.
- **Response**: The updated book object.
- **Status**: `200 OK` | `401 Unauthorized` | `403 Forbidden` | `404 Not Found`

#### `DELETE /api/books/:id`
Deletes a book.
- **Authentication**: Required (Admin only).
- **URL Parameter**: `id` - The unique ID of the book to delete.
- **Response**: A success message.
- **Status**: `200 OK` | `401 Unauthorized` | `403 Forbidden` | `404 Not Found`

### Auth & User Endpoints

#### `GET /api/auth/user`
Retrieves the app-specific user profile for the currently authenticated user.
- **Authentication**: Required.
- **Response**: A user object containing `uid`, `email`, `displayName`, `isAdmin`, etc.
- **Status**: `200 OK` | `401 Unauthorized`

#### `POST /api/admin/make-admin`
Promotes the currently authenticated user to an admin.
- **Authentication**: Required. This is a special-purpose endpoint.
- **Response**: The updated user object with `isAdmin: true`.
- **Status**: `200 OK` | `401 Unauthorized`

---

## Application Flowcharts

Below are prompts for generating flowcharts for key application functionalities. These can be used with a text-to-diagram tool or an image generation AI to create visual aids for the documentation.

### 1. User Authentication Flow

**Prompt:**
```
Create a flowchart that illustrates the user authentication process in a web application.

The chart should start with a "User" actor.
1.  The User clicks the "Login / Sign Up" button in the UI.
2.  An "AuthModal" component is displayed.
3.  The User has a decision point: "Choose Sign-in Method".
4.  Path 1: "Google Sign-In".
    - Action: "Firebase `signInWithPopup` is triggered".
    - Action: A Google Auth window appears.
    - Data: The client sends a request to "Firebase Authentication Service".
    - Data: "Firebase Authentication Service" communicates with "Google Identity Service".
    - On success, "Firebase Auth" returns a User object and ID Token (JWT) to the client.
5.  Path 2: "Email & Password".
    - Action: User enters credentials into a form.
    - Action: User clicks "Submit".
    - Data: The client calls "Firebase `signInWithEmailAndPassword`" and sends the credentials to the "Firebase Authentication Service".
    - On success, "Firebase Auth" returns a User object and ID Token (JWT) to the client.
6.  Both paths converge to a single success outcome: "Auth State Updated".
    - Action: The `useAuth` hook in the React client updates its state.
    - Action: The UI re-renders to show the user as logged in (e.g., shows Home page instead of Landing page).
7.  Include a failure path from both sign-in methods leading to an "Error" state, which displays an error message to the user in the UI.
```

### 2. Secure API Request Flow

**Prompt:**
```
Create a sequence diagram that shows how a secure API call is handled between a React client and an Express.js backend using Firebase for authentication.

The diagram should include four participants: "Client (React App)", "Server (Express.js)", "Auth Middleware", and "Firebase Admin SDK".

1.  The "Client" initiates the sequence by sending a `fetch` request to a protected endpoint (e.g., `POST /api/books`). The request must include an `Authorization: Bearer <ID_TOKEN>` header.
2.  The "Server" receives the incoming request.
3.  The "Server" passes the request to the "Auth Middleware" for verification.
4.  The "Auth Middleware" calls `verifyIdToken()` on the "Firebase Admin SDK", passing the token from the header.
5.  The "Firebase Admin SDK" communicates with Google's servers to validate the token's signature and expiration.
6.  A response is returned to the "Auth Middleware". Use an "alt" fragment (alternative) for the two possible outcomes:
    -   **Case 1: Token is Valid**. The "Auth Middleware" attaches the decoded user payload (`req.user`) to the request object and calls `next()` to pass control to the main API route handler. The "Server" then proceeds to execute the database logic (e.g., create a book).
    -   **Case 2: Token is Invalid**. The "Auth Middleware" immediately sends a `401 Unauthorized` or `403 Forbidden` HTTP response back to the "Client". The sequence ends here for this case.
7.  If the token was valid, the "Server" eventually sends a `200 OK` or `201 Created` response back to the "Client" with the requested data.
```

### 3. Admin Book Creation Flow

**Prompt:**
```
Create a flowchart detailing the process of an admin user creating a new book.

The chart should involve three lanes: "Admin User (Client)", "Express Server (Backend)", and "Firebase Realtime DB".

1.  Start in the "Admin User" lane: The user, who is already authenticated as an admin, navigates to the "/admin" page.
2.  Action: The user fills out the "Create New Book" form.
3.  Action: The user clicks the "Submit" button.
4.  Client-side Action: TanStack Query begins an "optimistic update", temporarily adding the new book to the UI in a loading state.
5.  Action: The client sends a `POST /api/books` request, including the new book's data in the body and the user's ID token in the headers.
6.  Transition to the "Express Server" lane: The server receives the request.
7.  Action: An authentication middleware verifies the ID token and checks if the user has the `isAdmin` flag.
8.  Decision: "Is user an admin?".
    -   If No: The server returns a `403 Forbidden` error. The flow stops.
    -   If Yes: The request proceeds.
9.  Action: The server's route handler calls the `storage.createBook()` function.
10. Transition to the "Firebase Realtime DB" lane: The `createBook` function pushes the new book data to the `/books` collection in the Realtime Database.
11. Action: The Realtime Database generates a unique ID and saves the data.
12. Transition back to the "Express Server" lane: The server receives the saved data (including the new ID) from Firebase.
13. Action: The server sends a `201 Created` response back to the client, containing the final book object.
14. Transition back to the "Admin User" lane: The client's TanStack Query process receives the successful response.
15. Action: It finalizes the optimistic update, replacing the temporary loading state with the confirmed data from the server. The UI now shows the book as successfully created.
```

---

## Project Structure

```
enchanted-tome/
├── client/
│   ├── src/
│   │   ├── main.jsx                 # React entry point, renders App.jsx
│   │   ├── App.jsx                  # Root component with routing & providers
│   │   ├── index.css                # Global styles & Tailwind directives
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Public landing page for unauthenticated users
│   │   │   ├── Home.jsx             # Main dashboard for authenticated users
│   │   │   ├── BooksPage.jsx        # Component for browsing/searching books
│   │   │   ├── AdminPage.jsx        # Admin dashboard for book management
│   │   │   └── not-found.jsx        # 404 error page
│   │   ├── components/
│   │   │   ├── Navigation.jsx       # Main navigation bar
│   │   │   ├── BookCard.jsx         # Card for displaying a single book
│   │   │   ├── BookDetailModal.jsx  # Modal for detailed book view
│   │   │   ├── AuthModal.jsx        # Modal for Login/Signup
│   │   │   ├── DustMotes.jsx        # Animated particle effect component
│   │   │   ├── ThemeProvider.jsx    # Manages light/dark theme
│   │   │   └── ui/                  # Shadcn UI components (button, input, etc.)
│   │   ├── hooks/
│   │   │   └── useAuth.js           # Hook for Firebase auth state
│   │   └── lib/
│   │       ├── firebase.js          # Firebase client initialization
│   │       ├── queryClient.js       # TanStack Query client setup
│   │       └── utils.js             # General utility functions
│   ├── index.html                   # HTML entry point for Vite
│   └── vite.config.js               # Vite configuration for the client
│
├── server/
│   ├── index.js                     # Main Express server entry point
│   ├── routes.js                    # API route definitions
│   ├── storage.js                   # Abstraction layer for Firebase DB operations
│   ├── db.js                        # Firebase Admin SDK initialization (Database)
│   ├── auth.js                      # Firebase Admin SDK initialization (Auth) & middleware
│   ├── seed.js                      # Script to seed the database with initial data
│   ├── static.js                    # Serves static frontend assets in production
│   └── vite.js                      # Integrates Express with Vite dev server
│
├── .gitignore
├── firebase-service-account.json    # (Required) Firebase service account credentials
├── package.json                     # Project dependencies and scripts
└── tailwind.config.js               # Tailwind CSS configuration
```

---

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Firebase project with Authentication (Google, Email/Password) and Realtime Database enabled.

### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd enchanted-tome
    ```

2.  **Install Dependencies**
    Install both root and client dependencies.
    ```bash
    npm install
    ```

3.  **Firebase Configuration**
    - Create a **Service Account** in your Firebase project settings.
    - Download the generated JSON key file and save it as `firebase-service-account.json` in the project root.
    - In your Firebase project, go to Project Settings and copy the web app configuration object.
    - Create a new file `client/src/lib/firebaseConfig.js` and paste the configuration:
      ```javascript
      // client/src/lib/firebaseConfig.js
      export const firebaseConfig = {
        apiKey: "...",
        authDomain: "...",
        databaseURL: "...",
        projectId: "...",
        storageBucket: "...",
        messagingSenderId: "...",
        appId: "..."
      };
      ```
4.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

---

## Running the Application

### Development
```bash
npm run dev
```
- This command starts both the Express backend and the Vite frontend dev server concurrently.
- The frontend runs on `http://localhost:3000` with Hot Module Replacement (HMR).
- The backend API is available at the same origin, proxied by Vite.

### Production Build
```bash
npm run build
```
- This script builds the React client app for production into the `dist` folder.

### Running in Production
```bash
npm start
```
- This command starts the Express server, which serves the built static files from the `dist` folder and handles all API requests.

---

## Authentication System

### Flow
1. A user initiates login/signup via the `AuthModal.jsx` component.
2. The client uses the Firebase JS SDK (`signInWithPopup` for Google or `createUserWithEmailAndPassword`/`signInWithEmailAndPassword`) to authenticate the user directly with Firebase.
3. The `useAuth.js` hook listens for auth state changes via `onAuthStateChanged` and updates the application context.
4. When making a request to a protected API route, the client gets the current user's ID token (`user.getIdToken()`) and includes it as a Bearer token in the `Authorization` header.
5. The `server/auth.js` middleware on the Express server intercepts the request, verifies the token using the Firebase Admin SDK, and attaches the decoded user info to the request object (`req.user`). If verification fails, it returns a `401` or `403` error.

### Admin Access
- A user's admin status is determined by the `isAdmin` flag in their profile, stored in the `/users/{uid}` path in the Realtime Database.
- The `isAdmin` middleware in `server/auth.js` checks this flag after verifying the token.

---

This document now accurately reflects the current state of the Enchanted Tome project.