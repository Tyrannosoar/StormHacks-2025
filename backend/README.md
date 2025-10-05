# MagnaCart Backend API

A local backend API for the MagnaCart food management application, built with Express.js and TypeScript.

## Features

- **Storage Management**: Track food inventory with expiry dates and categories
- **Shopping Lists**: Manage shopping items with priority levels
- **Meal Planning**: Store and manage recipes and meal plans
- **Calendar Events**: Schedule meals and shopping trips
- **Dashboard Data**: Overview of planned meals, urgent items, and expiring food

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The API will be available at `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /health` - API health status

### Storage Management
- `GET /api/storage` - Get all storage items
- `GET /api/storage/:id` - Get specific storage item
- `POST /api/storage` - Add new storage item
- `PUT /api/storage/:id` - Update storage item
- `DELETE /api/storage/:id` - Delete storage item
- `GET /api/storage/category/:category` - Get items by category
- `GET /api/storage/expiring/:days` - Get items expiring within X days

### Shopping Lists
- `GET /api/shopping` - Get all shopping items
- `GET /api/shopping/:id` - Get specific shopping item
- `POST /api/shopping` - Add new shopping item
- `PUT /api/shopping/:id` - Update shopping item
- `DELETE /api/shopping/:id` - Delete shopping item
- `PUT /api/shopping/:id/toggle` - Toggle completion status
- `GET /api/shopping/priority/:priority` - Get items by priority
- `GET /api/shopping/category/:category` - Get items by category
- `GET /api/shopping/completed/items` - Get completed items

### Meal Management
- `GET /api/meals` - Get all meals
- `GET /api/meals/:id` - Get specific meal
- `POST /api/meals` - Add new meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal
- `GET /api/meals/saved/meals` - Get saved meals
- `GET /api/meals/explore/meals` - Get explore meals
- `GET /api/meals/type/:mealType` - Get meals by type
- `GET /api/meals/ingredients/:ingredient` - Search by ingredient
- `PUT /api/meals/:id/archive` - Archive/unarchive meal

### Calendar Events
- `GET /api/calendar` - Get all calendar events
- `GET /api/calendar/:id` - Get specific event
- `POST /api/calendar` - Add new event
- `PUT /api/calendar/:id` - Update event
- `DELETE /api/calendar/:id` - Delete event
- `GET /api/calendar/date/:date` - Get events for specific date
- `GET /api/calendar/type/:type` - Get events by type
- `GET /api/calendar/range/:startDate/:endDate` - Get events in date range

### Dashboard
- `GET /api/dashboard` - Get dashboard overview
- `GET /api/dashboard/planned-meals` - Get planned meals
- `GET /api/dashboard/urgent-shopping` - Get urgent shopping items
- `GET /api/dashboard/expiring-items` - Get expiring items
- `GET /api/dashboard/stats` - Get dashboard statistics

## Data Models

All data is hardcoded and includes:

- **Storage Items**: 19 items across Dairy, Vegetables, Meat, Fruits, Pantry, and Beverages
- **Shopping Items**: 12 items with different priority levels
- **Meals**: 6 recipes including saved and explore categories
- **Calendar Events**: 10 events across different types and dates
- **Dashboard Data**: Planned meals, urgent items, and expiring food

## Development

The backend uses:
- **Express.js** for the web framework
- **TypeScript** for type safety
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Morgan** for request logging

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run type-check` - Run TypeScript type checking

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

This allows the Next.js frontend to communicate with the backend during development.
