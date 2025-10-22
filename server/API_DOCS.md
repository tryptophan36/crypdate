# Crypdate Backend API Documentation

## Swagger Documentation

The API documentation is available through Swagger UI when the server is running.

### Accessing Swagger Documentation

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3001/api-docs
   ```

### API Endpoints

The API includes the following endpoints:

#### Authentication
- `POST /api/verify-init` - Verify Telegram initData and authenticate user

#### Watchlist Management
- `GET /api/user/watchlist` - Get user's watchlist (requires authentication)
- `POST /api/user/follow` - Follow a token (requires authentication)

#### System
- `GET /_health` - Health check endpoint

### Authentication

Most endpoints require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The JWT token is obtained from the `/api/verify-init` endpoint after successful Telegram authentication.

### Environment Variables

Make sure to set the following environment variables:

- `BOT_TOKEN` - Telegram bot token
- `JWT_SECRET` - Secret key for JWT signing
- `WEBAPP_ORIGIN` - CORS origin for the web app
- `PORT` - Server port (default: 3001)
- `API_BASE_URL` - Base URL for API documentation (optional)
