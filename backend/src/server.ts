import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

// Import routes
import storageRoutes from './routes/storage'
import shoppingRoutes from './routes/shopping'
import mealsRoutes from './routes/meals'
import calendarRoutes from './routes/calendar'
import dashboardRoutes from './routes/dashboard'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet()) // Security headers
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3002'], // Allow frontend origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}))
app.use(morgan('combined')) // Logging
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Quilar Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// API Routes
app.use('/api/storage', storageRoutes)
app.use('/api/shopping', shoppingRoutes)
app.use('/api/meals', mealsRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Quilar Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      storage: '/api/storage',
      shopping: '/api/shopping',
      meals: '/api/meals',
      calendar: '/api/calendar',
      dashboard: '/api/dashboard'
    }
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`
  })
})

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Quilar Backend API running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/`)
  console.log(`🌐 CORS enabled for: http://localhost:3000, http://127.0.0.1:3000`)
})

export default app
