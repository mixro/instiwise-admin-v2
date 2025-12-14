# InstiWise Admin Panel - Technical Documentation

![React](https://img.shields.io/badge/React-v18.x-blue)
![Vite](https://img.shields.io/badge/Vite-v5.x-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.x-blue)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-v2.x-red)
![RTK Query](https://img.shields.io/badge/RTK_Query-v2.x-orange)

InstiWise is an intelligent institute management and collaboration platform designed to enhance academic connectivity, communication, and productivity within educational institutions. The admin panel provides administrators with powerful tools to manage news, events, projects, users, and institute-wide announcements, ensuring real-time updates and seamless oversight of the campus ecosystem.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Features](#features)
- [Authentication](#authentication)
- [Theme Management](#theme-management)
- [Testing](#testing)
- [Deployment](#deployment)
- [Error Handling](#error-handling)
- [Security](#security)
- [Future Improvements](#future-improvements)
- [Support](#support)

## Overview

The InstiWise Admin Panel is a modern web application built with React and Vite, offering a responsive and intuitive interface for institute administrators. It supports full CRUD operations on news, events, projects, and users, with real-time data management, analytics, and theme customization. The panel integrates seamlessly with the InstiWise backend API to deliver a centralized system for academic management and campus communication.

## Architecture

### Components

- **React Router**: Handles client-side routing with protected routes.
- **Redux Toolkit & RTK Query**: Manages global state and API interactions with automatic caching and re-authentication.
- **Tailwind CSS**: Provides utility-first styling for rapid and consistent UI development.
- **Custom Theme Context**: Manages light/dark mode with persistence.
- **Reusable Components**: Modular UI elements such as forms, tables, cards, and modals.
- **State Management**: RTK Query for data fetching; Redux slices for authentication.

### Directory Structure

```plaintext
instiwise-admin/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   ├── forms/
│   │   ├── modals/
│   │   └── tables/
│   ├── context/
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── News.jsx
│   │   ├── Events.jsx
│   │   ├── Projects.jsx
│   │   └── Users.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── store/
│   │   ├── api/
│   │   │   ├── authApi.js
│   │   │   ├── newsApi.js
│   │   │   └── eventsApi.js
│   │   ├── slices/
│   │   │   └── authSlice.js
│   │   └── store.js
│   ├── utils/
│   │   └── persistAuth.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── package.json
├── README.md
├── tailwind.config.js
└── vite.config.js
```

## Technologies

- **React**: v18.x for component-based UI
- **Vite**: v5.x for fast development and builds
- **Tailwind CSS**: v3.x for styling
- **Redux Toolkit**: v2.x for state management
- **RTK Query**: v2.x for data fetching and caching
- **React Router DOM**: v6.x for routing
- **MUI Icons**: For consistent iconography
- **localStorage**: For session persistence

## Setup Instructions

### Prerequisites

- **Node.js**: v18.x or higher
- **npm** or **yarn** package manager

1. Clone the repository:
    ```bash
    git clone https://github.com/mixro/instiwise-admin-v2
    cd instiwise-admin-v2
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment:
    - Create `.env` file with `VITE_API_BASE_URL=http://localhost:5000/api`

4. Run the app:
    ```bash
    npm run dev
    ```

    - Open http://localhost:5173 in your browser.

## Project Structure

The project follows a modular, scalable structure with clear separation of concerns: pages for views, components for reusable UI, store for state and API logic, and context/hooks for cross-cutting features.

## Features

- **Authentication**: Secure login with JWT persistence
- **Theme Switching**: Light/dark mode with localStorage persistence
- **Dashboard**: Overview of institute activity and analytics
- **News Management**: Full CRUD with optimistic updates
- **Events Management**: Full CRUD including upcoming events view
- **Projects & Users**: Upcoming full management capabilities
- **Responsive Design**: Mobile-friendly admin interface

## Authentication

- JWT-based authentication with automatic token refresh
- Session persistence via localStorage
- Protected routes and admin-only access

## Theme Management

- Custom ThemeContext with light/dark themes
- Persistence via localStorage
- Seamless integration across all components

## Testing

- Unit tests with Jest and React Testing Library (to be added)
- Component and hook testing recommended

## Deployment

- Build with `npm run build`
- Deploy to Vercel, Netlify, or any static hosting service
- Environment variables configured at deployment

## Error Handling

- Global error boundaries
- User-friendly messages from API errors
- Graceful fallbacks for failed requests

## Security

- JWT token handling with secure storage
- Protected API routes via middleware
- Input validation and sanitization

## Future Improvements

- Real-time updates with WebSockets
- Advanced analytics dashboards
- Role-based access control enhancements
- Integration with institute SSO systems

## Support

For issues, review console logs and network requests. Report bugs with detailed reproduction steps, browser information, and screenshots. Contact the development team for assistance.