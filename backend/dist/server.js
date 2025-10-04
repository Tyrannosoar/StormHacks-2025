"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Import routes
const storage_1 = __importDefault(require("./routes/storage"));
const shopping_1 = __importDefault(require("./routes/shopping"));
const meals_1 = __importDefault(require("./routes/meals"));
const calendar_1 = __importDefault(require("./routes/calendar"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, helmet_1.default)()); // Security headers
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3002'], // Allow frontend origins
    credentials: true
}));
app.use((0, morgan_1.default)('combined')); // Logging
app.use(express_1.default.json()); // Parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded bodies
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Quilar Backend API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// API Routes
app.use('/api/storage', storage_1.default);
app.use('/api/shopping', shopping_1.default);
app.use('/api/meals', meals_1.default);
app.use('/api/calendar', calendar_1.default);
app.use('/api/dashboard', dashboard_1.default);
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
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        message: `The requested endpoint ${req.originalUrl} does not exist`
    });
});
// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Quilar Backend API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/`);
    console.log(`🌐 CORS enabled for: http://localhost:3000, http://127.0.0.1:3000`);
});
exports.default = app;
//# sourceMappingURL=server.js.map