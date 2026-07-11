# Chavpk Stream

Chavpk Stream is a polished entertainment-style web app experience built with React, Vite, and Firebase. It includes:

- A cinematic, modern UI with a streaming-inspired layout
- Firebase authentication for sign-in and account creation
- Cloud-based watchlist storage using Firestore
- A clean, responsive experience for desktop and mobile

## Features

- Modern entertainment landing experience
- Authenticated profile flow with email/password
- Watchlist saved to the cloud for each user
- Responsive cards and panels for a premium app feel
- Firebase-ready configuration through environment variables

## Getting started

1. Install dependencies
   ```bash
   npm install
   ```
2. Create a Firebase project in the Firebase console.
3. Enable Authentication with the Email/Password provider.
4. Create a Firestore database.
5. Copy the example env file and add your Firebase config values.
   ```bash
   cp .env.example .env.local
   ```
6. Start the development server.
   ```bash
   npm run dev
   ```

## Firebase setup

Add these values to your .env.local file:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

If the Firebase values are missing, the app will continue in demo mode so you can preview the UI.

## Build

```bash
npm run build
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
