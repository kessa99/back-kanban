<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Kanban Board Backend API</h1>

<p align="center">
  A powerful RESTful API backend for Kanban board management built with NestJS and Firebase.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#technologies-used">Technologies</a> •
  <a href="#setup-instructions">Setup</a> •
  <a href="#api-documentation">API</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## Project Overview

This is a comprehensive **Kanban Board Management System Backend API** that provides:

- **Team-based Kanban boards** with multi-user collaboration
- **Task management** with priorities, due dates, and status tracking
- **User authentication** with email verification (OTP)
- **Team management** with role-based access control
- **Task comments and file attachments**
- **Checklist functionality** with individual user assignments
- **Task view tracking** for analytics
- **Real-time collaboration** features

The API is built using modern backend technologies and follows RESTful principles with comprehensive error handling and security measures.

## Technologies Used

### Backend Framework
- **NestJS** - Progressive Node.js framework for scalable applications
- **TypeScript** - Type-safe JavaScript for better development experience
- **Node.js** - JavaScript runtime environment

### Database & Storage
- **Firebase Firestore** - NoSQL document database for real-time data
- **Firebase Admin SDK** - Server-side Firebase integration
- **Firebase Authentication** - User authentication system

### Authentication & Security
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Passport.js** - Authentication middleware
- **bcryptjs** - Password hashing and verification

### Email & Notifications
- **Nodemailer** - Email sending service
- **Gmail SMTP** - Email delivery service

### Validation & Transformation
- **Class-validator** - DTO validation
- **Class-transformer** - Data transformation

### Development & Deployment
- **Docker & Docker Compose** - Containerization
- **Railway** - Cloud deployment platform
- **ESLint & Prettier** - Code quality and formatting
- **Jest** - Testing framework

## Setup Instructions

### Prerequisites
- Node.js (v20+ recommended)
- npm or yarn
- Firebase project
- Gmail account for email services

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd back-kanban

# Install dependencies with legacy peer deps
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Create a service account:
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Download the JSON file

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Application Configuration
NODE_ENV=development
PORT=3000
```

### 4. Gmail SMTP Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security > App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_HOST_PASSWORD`

### 5. Run the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

### 6. Verify Installation

Check the health endpoint:
```bash
curl http://localhost:3000/health
```
```bash
live link(front-end): https://kanban-test-project.vercel.app/
live link(back-end): https://back-kanban-production.up.railway.app/
```

## Features

### Core Kanban Features
-  **Board Management**: Create, read, update, delete Kanban boards
-  **Column Management**: Organize tasks in customizable columns
-  **Task Management**: Full CRUD operations for tasks
-  **Task Status Tracking**: Pending, In Progress, Completed, Cancelled
-  **Task Priorities**: Low, Medium, High, Urgent priority levels
-  **Drag & Drop Support**: Move tasks between columns via API

### Team Collaboration
-  **Team Creation**: Create and manage teams
-  **Member Management**: Add/remove team members
-  **Role-Based Access**: Admin, Member, Viewer roles
-  **Email Invitations**: Send team invitations via email
-  **Permission Control**: Role-based feature access

### User Management
-  **User Registration**: Account creation with validation
-  **Email Verification**: OTP-based email verification
-  **JWT Authentication**: Secure token-based authentication
-  **Password Security**: bcrypt hashing
-  **User Profiles**: Manage user information

### Task Collaboration
-  **Comments**: Add comments to tasks
-  **File Attachments**: Upload and manage task files
-  **Checklists**: Individual checklist items with user assignments
-  **Task Views**: Track task view analytics
-  **Due Dates**: Set and manage task deadlines

### Advanced Features
-  **Email Notifications**: OTP and invitation emails
-  **CORS Support**: Frontend integration ready
-  **Health Checks**: Application monitoring endpoints
-  **Error Handling**: Comprehensive error responses
-  **API Documentation**: Detailed endpoint documentation

## API Documentation

### Base URL
```
http://localhost:3000 (development)
https://your-domain.com (production)
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Core API Endpoints

#### Authentication (`/auth`)
```bash
POST /auth/register          # Register new user
POST /auth/login             # User login
POST /auth/verify-otp        # Verify email OTP
POST /auth/resend-otp        # Resend OTP code
POST /auth/logout            # User logout
```

#### User Management (`/users`)
```bash
GET    /users                # Get all users
GET    /users/:id            # Get user by ID
PUT    /users/:id            # Update user
DELETE /users/:id            # Delete user
POST   /users/invite         # Send team invitation
POST   /users/verify-invite  # Verify team invitation
```

#### Team Management (`/teams`)
```bash
POST   /teams/create                    # Create team
GET    /teams                          # Get user teams
GET    /teams/:id                      # Get team details
PUT    /teams/:id                      # Update team
DELETE /teams/:id                      # Delete team
POST   /teams/:id/members              # Add team member
DELETE /teams/:id/members/:memberId    # Remove member
GET    /teams/:id/members              # Get team members
PUT    /teams/:id/members/:memberId/role # Change member role
```

#### Board Management (`/boards`)
```bash
GET    /boards                 # Get all boards
POST   /boards                 # Create board
GET    /boards/:id             # Get board details
PATCH  /boards/:id             # Update board
DELETE /boards/:id             # Delete board
GET    /boards/:id/columns     # Get board columns
```

#### Task Management (`/boards/:boardId/tasks`)
```bash
POST   /boards/:boardId/tasks                    # Create task
GET    /boards/:boardId/tasks                    # Get board tasks
PATCH  /boards/:boardId/tasks/:taskId/move       # Move task
POST   /boards/:boardId/tasks/:taskId/comments   # Add comment
POST   /boards/:boardId/tasks/:taskId/files      # Upload file
POST   /boards/:boardId/tasks/:taskId/views      # Record view
```

#### Kanban Board Management (`/boards`)
```bash
GET    /boards                                   # Get all boards
GET    /boards/:boardId                          # Get board details
POST   /boards                                   # Create board
PATCH  /boards/:boardId                          # Update board
DELETE /boards/:boardId                          # Delete board
```

#### Team Management (`/teams`)
```bash
POST   /teams/create                             # Create team
GET    /teams                                    # Get user teams
GET    /teams/:teamId                            # Get team details
PUT    /teams/:teamId                            # Update team
DELETE /teams/:teamId                            # Delete team
POST   /teams/:teamId/members                    # Add team member
DELETE /teams/:teamId/members/:memberId          # Remove member
GET    /teams/:teamId/members                    # Get team members
PUT    /teams/:teamId/members/:memberId/role     # Change member role
```

#### Task Management (`/boards/:boardId/tasks`)
```bash
POST   /boards/:boardId/tasks                    # Create task
GET    /boards/:boardId/tasks                    # Get board tasks
PATCH  /boards/:boardId/tasks/:taskId/move       # Move task
POST   /boards/:boardId/tasks/:taskId/comments   # Add comment
POST   /boards/:boardId/tasks/:taskId/files      # Upload file
POST   /boards/:boardId/tasks/:taskId/views      # Record view


GET /teams/tasks/assigned - Récupère toutes les tâches assignées à l'utilisateur connecté
GET /teams/boards/assigned - Récupère tous les boards où l'utilisateur a des tâches assignées
GET /teams/:teamId/tasks - Récupère toutes les tâches d'une équipe spécifique
GET /teams/:teamId/boards/:boardId/tasks/assigned - Récupère les tâches assignées d'un board spécifique   
```


### Response Format
All endpoints return responses in this format:
```json
{
  "status": "success" | "failed",
  "message": "Description of the operation result",
  "data": object | array | null
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

For detailed API documentation, see [API_ENDPOINTS_DOCUMENTATION.txt](./API_ENDPOINTS_DOCUMENTATION.txt)

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## Deployment

### Docker Deployment

1. **Build and run with Docker Compose:**
```bash
docker-compose up --build
```

2. **Build Docker image manually:**
```bash
docker build -t kanban-backend .
docker run -p 3000:3000 --env-file .env kanban-backend
```

### Railway Deployment

1. **Connect your repository to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on push to main branch**

For detailed deployment instructions, see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

### Environment Variables for Production

Ensure these variables are set in your production environment:
```bash
NODE_ENV=production
PORT=3000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
JWT_SECRET=your-production-jwt-secret
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

## Known Issues

### Security Concerns
-  **Hardcoded Credentials**: Email credentials are hardcoded in `otpMailer.ts`
-  **Firebase Key Exposure**: Service account key committed to repository
-  **No Rate Limiting**: API endpoints lack rate limiting protection
-  **Input Sanitization**: Missing comprehensive input validation

### Code Quality Issues
-  **Mixed Languages**: French/English comments and error messages
-  **Error Handling**: Inconsistent error handling patterns
-  **Dead Code**: Some unused imports and code segments

### Architecture Issues
-  **Direct Repository Calls**: Controllers directly calling Firebase repositories
-  **Missing Validation**: Some endpoints lack proper input validation
-  **Logging System**: No structured logging implementation

### Deployment Issues
-  **Environment Variables**: Missing `.env.example` file
-  **Error Handling**: Poor handling of missing environment variables
-  **Health Checks**: Basic health check implementation

## Future Improvements

### Security Enhancements
-  Implement rate limiting (express-rate-limit)
-  Add comprehensive input validation and sanitization
-  Implement proper secrets management
-  Add API versioning strategy
-  Implement request/response logging

### Feature Enhancements
-  Advanced task filtering and search capabilities
-  Task templates and bulk operations
-  Advanced analytics and reporting
-  Mobile app API support
-  File upload with cloud storage
-  Task dependencies and relationships

### Technical Improvements
- Implement caching layer (Redis)
- Add comprehensive testing suite
-  Implement proper error handling middleware
- Add Swagger/OpenAPI documentation
- Implement database migrations
- Add structured logging (Winston)
- Implement application metrics

### DevOps Improvements
- Add CI/CD pipeline
- Implement proper monitoring and alerting
- Add backup and recovery procedures
- Implement proper secrets management
- Add performance monitoring

## Clean Architecture Overview

```
src/
├── config/          # Configuration modules (JWT, Firebase, etc.)
├── domain/          # Domain entities and business logic
│   ├── entities/    # Domain entities
│   └── repositories/ # Repository interfaces
├── infrastructure/ # External service implementations
│   └── repositories/ # Firebase repository implementations
├── interface/      # API layer
│   ├── controller/ # REST API controllers
│   └── service/   # Application services
└── utils/          # Utilities, DTOs, constants
    ├── dto/       # Data Transfer Objects
    ├── constance/ # Application constants
    └── mailer/    # Email services
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Known Issues](#known-issues) section
2. Review the [API Documentation](#api-documentation)
3. Check existing issues in the repository
4. Create a new issue with detailed information

---

<p align="center">
  <a href="https://nestjs.com/" target="_blank"><img src="https://nestjs.com/img/logo_text.svg" width="200" alt="Nest Logo" /></a>
  <br>
  Built with using NestJS and Firebase
  <br>
  KIPRE KESSA DAVID
  <br>
  kessadavidkipre@gmail.com
  <br>
  github: kessa99
  <br>
  phone number: 92152971

</p>
