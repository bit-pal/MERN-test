# Community Learning Hub Backend

A community hub where users can discover educational content, interact with a curated feed, and earn credit points for engagement.

## Features

- **User Authentication**: Register and login using JWT for secure access
- **Credit Points System**: Earn points for viewing content, sharing, and daily logins
- **Feed Aggregator**: LinkedIn feed integration with save, share, and report functionalities
- **Admin/Moderator Panel**: Content moderation, user management, and statistical insights

## Tech Stack

- **Backend**: Express.js with MongoDB
- **Authentication**: JWT-based authentication system
- **Database**: MongoDB for storing users, content, reports, and credit transactions
- **API**: RESTful API architecture with comprehensive validation

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- API keys for LinkedIn integration (optional for initial setup)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd community-learning-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   LINKEDIN_API_KEY=your_linkedin_api_key (optional for initial setup)
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### API Endpoints

#### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update user password
- `GET /api/auth/logout` - Logout user

#### Feed Management

- `GET /api/feed` - Get all feed items (with filtering & pagination)
- `GET /api/feed/:id` - Get a specific feed item
- `POST /api/feed/:id/save` - Save a feed item
- `DELETE /api/feed/:id/save` - Remove saved feed item
- `POST /api/feed/:id/share` - Share a feed item
- `POST /api/feed/:id/report` - Report a feed item

#### Credits System

- `GET /api/credits/balance` - Get user credit balance
- `GET /api/credits/transactions` - Get user's credit transactions
- `POST /api/credits/daily-login` - Claim daily login credits
- `POST /api/credits/spend` - Spend credits on premium content

#### Admin Panel

- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/reports` - Get content reports
- `PUT /api/admin/reports/:id/review` - Review a report
- `GET /api/admin/credit-stats` - Get credit system statistics
- `GET /api/admin/content-stats` - Get content performance statistics

### Deployment Steps

#### GCP Deployment

1. Set up a GCP account and create a new project

2. Enable Cloud Build, App Engine, and MongoDB Atlas (or use Cloud SQL)

3. Configure app.yaml:
   ```yaml
   runtime: nodejs16
   env: standard
   
   env_variables:
     NODE_ENV: "production"
     PORT: "8080"
     MONGO_URI: "your_production_mongodb_uri"
     JWT_SECRET: "your_production_jwt_secret"
     JWT_EXPIRE: "30d"
     LINKEDIN_API_KEY: "your_linkedin_api_key"
   ```

4. Deploy to App Engine:
   ```bash
   gcloud app deploy
   ```

## Testing

Run tests using:
```bash
npm test
```

## License

This project is licensed under the ISC License.