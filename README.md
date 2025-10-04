# MagnaCarter - Food Management App

A comprehensive food management application built with Next.js and Express.js, designed to help users track their food inventory, plan meals, manage shopping lists, and schedule cooking activities.

## Features

- 🏠 **Dashboard**: Overview of planned meals, urgent shopping items, and expiring food
- 🍽️ **Meal Planning**: Browse recipes, save favorites, and plan meals
- 📦 **Storage Management**: Track food inventory with expiry dates and categories
- 🛒 **Shopping Lists**: Manage shopping items with priority levels
- 📅 **Calendar**: Schedule meals and shopping trips
- 📸 **Camera**: Capture grocery items (UI only)

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Lucide React** - Icons

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin requests
- **Helmet** - Security headers

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "StormHacks 2025"
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   npm run install:backend
   ```

### Development

#### Option 1: Run both frontend and backend together
```bash
npm run dev:full
```

#### Option 2: Run separately
Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run dev:backend
```

### Production

1. Build both frontend and backend:
   ```bash
   npm run build
   npm run build:backend
   ```

2. Start both servers:
   ```bash
   npm start
   npm run start:backend
   ```

## Project Structure

```
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── main-dashboard.tsx # Main dashboard component
│   ├── storage-page.tsx   # Storage management
│   ├── shopping-list-page.tsx # Shopping list
│   ├── meals-page.tsx     # Meal planning
│   ├── calendar-page.tsx  # Calendar events
│   └── camera-page.tsx    # Camera functionality
├── backend/               # Express.js backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── data/          # Hardcoded data
│   │   ├── types/         # TypeScript interfaces
│   │   └── server.ts      # Express server
│   └── package.json
├── lib/                   # Utility functions
└── public/                # Static assets
```

## API Documentation

The backend provides a REST API with the following endpoints:

- **Storage**: `/api/storage/*` - Food inventory management
- **Shopping**: `/api/shopping/*` - Shopping list management  
- **Meals**: `/api/meals/*` - Recipe and meal management
- **Calendar**: `/api/calendar/*` - Event scheduling
- **Dashboard**: `/api/dashboard/*` - Overview data

See `backend/README.md` for detailed API documentation.

## Features Overview

### Dashboard
- Planned meals for the week
- Urgent shopping items by priority
- Food items expiring soon
- Quick statistics and overview

### Storage Management
- Track food items with amounts and expiry dates
- Categorize by type (Dairy, Vegetables, Meat, etc.)
- Filter by category or expiry date
- Add, edit, and remove items

### Shopping Lists
- Create shopping lists with priority levels
- Mark items as completed
- Filter by priority or category
- Track planned vs actual amounts

### Meal Planning
- Browse and save recipes
- Plan meals for specific dates
- Check ingredient availability
- Archive and organize recipes

### Calendar
- Schedule meals and shopping trips
- View weekly calendar
- Different event types (meal, shopping, custom)
- Swipe navigation between weeks

## Development Notes

- The app uses hardcoded data for demonstration
- All data is stored in memory and resets on server restart
- CORS is configured for localhost development
- The camera feature is UI-only (no actual image processing)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for StormHacks 2025.