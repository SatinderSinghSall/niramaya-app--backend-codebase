# Niramaya - Mobile App (Backend)

## Backend Server's API

## Niramaya — Backend Technical Documentation

**Project:** Full-Stack Niramaya Mobile Application  
**Backend:** Node.js + Express.js  
**Database:** MongoDB + Mongoose  
**Authentication:** JWT  
**Validation:** Zod  
**Frontend:** React Native Expo  
**Backend Status:** Feature Development Complete  
**Documentation Status:** In Progress

---

# 1. Project Overview

Niramaya is a full-stack mobile wellness application designed to provide users with personalized wellness-related information and services.

The application collects user information during onboarding, including personal, health, lifestyle, nutrition, sleep, fitness, wellbeing, and other body-related information.

The backend processes this information and provides APIs for:

- Authentication
- User profiles
- Health profiles
- Wellness goals
- Dashboard information
- Ayurvedic content
- Yoga content
- Personalized recommendations
- Progress tracking
- Ayurvedic consultation requests
- Notifications
- Favorites
- Search
- Profile and application settings

The backend follows a modular architecture so that each major application feature has its own:

- Model
- Service
- Controller
- Route
- Validation layer where required

---

# 2. Technology Stack

## Backend

| Technology | Purpose               |
| ---------- | --------------------- |
| Node.js    | JavaScript runtime    |
| Express.js | REST API framework    |
| MongoDB    | NoSQL database        |
| Mongoose   | MongoDB ODM           |
| JWT        | Authentication        |
| bcryptjs   | Password hashing      |
| Zod        | Request validation    |
| dotenv     | Environment variables |
| Helmet     | HTTP security headers |
| CORS       | Cross-origin access   |
| Morgan     | HTTP request logging  |
| Nodemon    | Development server    |

## Frontend

The planned frontend uses:

```text
React Native
Expo
```

The mobile application communicates with the backend through REST APIs.

---

# 3. Backend Architecture

The backend follows a layered architecture:

```text
Mobile Application
       │
       │ HTTP / REST API
       ↓
    Express
       │
       ↓
    Routes
       │
       ↓
 Controllers
       │
       ↓
   Services
       │
       ↓
    Models
       │
       ↓
   MongoDB
```

Supporting layers:

```text
Middleware
├── Authentication
├── Validation
├── Error handling
└── 404 handling

Utils
├── JWT utilities
├── Validation schemas
├── User utilities
└── Seed data
```

---

# 4. Project Structure

Current backend structure:

```text
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── ayurveda.controller.js
│   │   ├── consultation.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── favorite.controller.js
│   │   ├── goal.controller.js
│   │   ├── healthProfile.controller.js
│   │   ├── notification.controller.js
│   │   ├── profile.controller.js
│   │   ├── progress.controller.js
│   │   ├── recommendation.controller.js
│   │   ├── search.controller.js
│   │   ├── user.controller.js
│   │   └── yoga.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── notFound.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── models/
│   │   ├── ayurveda.model.js
│   │   ├── consultation.model.js
│   │   ├── favorite.model.js
│   │   ├── goal.model.js
│   │   ├── healthProfile.model.js
│   │   ├── notification.model.js
│   │   ├── progress.model.js
│   │   ├── settings.model.js
│   │   ├── user.model.js
│   │   └── yoga.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── ayurveda.routes.js
│   │   ├── consultation.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── favorite.routes.js
│   │   ├── goal.routes.js
│   │   ├── healthProfile.routes.js
│   │   ├── index.js
│   │   ├── notification.routes.js
│   │   ├── profile.routes.js
│   │   ├── progress.routes.js
│   │   ├── recommendation.routes.js
│   │   ├── search.routes.js
│   │   └── yoga.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── ayurveda.service.js
│   │   ├── consultation.service.js
│   │   ├── dashboard.service.js
│   │   ├── favorite.service.js
│   │   ├── goal.service.js
│   │   ├── healthProfile.service.js
│   │   ├── notification.service.js
│   │   ├── profile.service.js
│   │   ├── progress.service.js
│   │   ├── recommendation.service.js
│   │   ├── search.service.js
│   │   └── yoga.service.js
│   │
│   ├── utils/
│   │   ├── auth.util.js
│   │   ├── ayurveda.seed.js
│   │   ├── ayurveda.validation.js
│   │   ├── consultation.validation.js
│   │   ├── favorite.validation.js
│   │   ├── goal.validation.js
│   │   ├── healthProfile.validation.js
│   │   ├── notification.validation.js
│   │   ├── profile.validation.js
│   │   ├── progress.validation.js
│   │   ├── recommendation.validation.js
│   │   ├── search.validation.js
│   │   ├── user.util.js
│   │   ├── validation.util.js
│   │   ├── yoga.seed.js
│   │   └── yoga.validation.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── README.md
├── package-lock.json
└── package.json
```

---

# 5. Configuration

## `src/config/env.js`

Responsible for loading and validating environment variables.

Important variables include:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/niramaya

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

CLIENT_URL=http://localhost:8081
```

Sensitive secrets must not be committed to Git.

The `.env` file should remain local.

---

# 6. Database Configuration

## `src/config/db.js`

The backend uses Mongoose to connect to MongoDB.

Database:

```text
niramaya
```

Development connection example:

```text
mongodb://127.0.0.1:27017/niramaya
```

The server starts after the database connection has been established.

---

# 7. Application Configuration

## `src/app.js`

The Express application configures:

- Helmet
- CORS
- Morgan
- JSON parsing
- URL-encoded request parsing
- API routes
- 404 handling
- Global error handling

Base API path:

```text
/api/v1
```

Health endpoint:

```text
GET /api/v1/health
```

Root endpoint:

```text
GET /
```

---

# 8. Server

## `src/server.js`

The server:

1. Loads application configuration.
2. Connects to MongoDB.
3. Starts the Express HTTP server.
4. Listens on the configured port.

Development command:

```bash
npm run dev
```

Production-style command:

```bash
npm start
```

---

# 9. Authentication

Authentication is based on JWT.

The system uses:

```text
Access Token
Refresh Token
```

## Registration

```http
POST /api/v1/auth/register
```

User registration collects:

```text
firstName
lastName
email
phone
password
```

Passwords are hashed using bcrypt before being stored.

---

# 10. Login

```http
POST /api/v1/auth/login
```

Successful login returns authentication tokens.

The access token is used for protected API requests.

Example:

```http
Authorization: Bearer ACCESS_TOKEN
```

---

# 11. Refresh Token

```http
POST /api/v1/auth/refresh
```

The backend uses refresh-token rotation.

Refresh tokens are stored as hashes rather than plain text.

---

# 12. Logout

```http
POST /api/v1/auth/logout
```

The refresh-token information is invalidated.

---

# 13. Current User

```http
GET /api/v1/auth/me
```

Returns the currently authenticated user.

---

# 14. User Model

The `User` model contains account-level information.

Main fields:

```text
firstName
lastName
email
phone
password
isEmailVerified
isActive
lastLoginAt
refreshTokenHash
createdAt
updatedAt
```

There is intentionally **no role field**.

The current application has one user type:

```text
user
```

Admin and consultant roles are not currently implemented.

---

# 15. Health Profile

The Health Profile stores the detailed wellness information collected during onboarding.

Endpoint base:

```text
/api/v1/health-profile
```

Supported operations:

```text
POST   /
GET    /
PATCH  /
DELETE /
```

Health profile sections include:

```text
Personal
Physical Health
Wellbeing
Lifestyle
Nutrition
Sleep
Fitness
Medical History
Preferences
Onboarding
```

Examples of collected information include:

```text
Date of birth
Gender
Height
Weight
Occupation
Energy level
Digestion
Skin concerns
Hair concerns
Stress
Mood
Activity level
Diet
Food allergies
Sleep
Exercise
Yoga experience
Medical history
Wellness interests
```

---

# 16. Goals

Goals allow users to define wellness objectives.

Endpoint:

```text
/api/v1/goals
```

Operations include:

```text
POST   /
GET    /
GET    /:id
PATCH  /:id
DELETE /:id
PATCH  /:id/progress
PATCH  /:id/complete
PATCH  /:id/pause
PATCH  /:id/resume
```

Goal categories include:

```text
sleep
stress_management
fitness
flexibility
strength
weight_management
digestion
energy
mental_wellbeing
mobility
skin_wellness
hair_wellness
general_wellbeing
other
```

Goal statuses:

```text
active
paused
completed
cancelled
```

---

# 17. Dashboard

The Dashboard does not require a separate database model.

It dynamically combines:

```text
User
Health Profile
Goals
```

Endpoint:

```http
GET /api/v1/dashboard
```

The dashboard provides information such as:

- User information
- Profile completion
- Health snapshot
- Goal statistics
- Recent goals

This avoids storing duplicate dashboard information.

---

# 18. Ayurveda Module

The Ayurveda module provides wellness-related Ayurvedic content.

Endpoint:

```text
/api/v1/ayurveda
```

Supported operations include:

```text
GET /
GET /categories
GET /featured
GET /recommendations
GET /:id
```

Ayurveda content types include:

```text
practice
herb
product
routine
nutrition
knowledge
```

Categories include:

```text
digestion
stress
sleep
energy
skin
hair
immunity
fitness
relaxation
nutrition
general_wellness
```

---

# 19. Ayurveda Seed Data

Sample Ayurveda content is provided through:

```text
src/utils/ayurveda.seed.js
```

Example content includes:

```text
Abhyanga
Triphala
Ashwagandha
Ayurvedic Sleep Routine
Ayurvedic Nutrition Basics
Yoga and Ayurveda Lifestyle Connection
```

Seed command:

```bash
npm run seed:ayurveda
```

---

# 20. Yoga Module

The Yoga module provides yoga-related content.

Endpoint:

```text
/api/v1/yoga
```

Supported operations:

```text
GET /
GET /categories
GET /featured
GET /recommendations
GET /:id
```

Yoga types:

```text
pose
practice
routine
breathing
meditation
knowledge
```

Difficulty levels:

```text
beginner
intermediate
advanced
```

Yoga categories include:

```text
stress_relief
sleep
flexibility
strength
mobility
digestion
energy
balance
relaxation
mental_wellbeing
general_wellness
```

---

# 21. Yoga Seed Data

Seed data is located in:

```text
src/utils/yoga.seed.js
```

Example content includes:

```text
Child's Pose
Cat-Cow Stretch
Tree Pose
Alternate Nostril Breathing
Gentle Morning Yoga
Relaxation Yoga Routine
Beginner Flexibility Flow
```

Seed command:

```bash
npm run seed:yoga
```

---

# 22. Recommendation Engine

Recommendations are generated dynamically.

There is intentionally:

```text
No recommendation model
No recommendation seed
```

Instead:

```text
Health Profile
       +
Active Goals
       +
Ayurveda Content
       +
Yoga Content
       ↓
Recommendation Service
       ↓
Personalized Results
```

Endpoint:

```http
GET /api/v1/recommendations
```

Optional type:

```text
type=all
type=ayurveda
type=yoga
```

The service considers signals such as:

```text
Energy level
Digestion
Stress
Sleep quality
Activity level
Yoga experience
Concerns
Goal categories
```

---

# 23. Progress & Tracking

Progress tracking allows users to record wellness activity.

Endpoint:

```text
/api/v1/progress
```

Operations:

```text
POST   /
GET    /
GET    /summary
GET    /:id
PATCH  /:id
DELETE /:id
```

Tracked information includes:

```text
Mood
Energy
Stress
Sleep hours
Sleep quality
Water intake
Steps
Exercise minutes
Yoga minutes
Meditation minutes
Weight
Notes
Completed activities
```

A user has one progress record per date.

---

# 24. Progress Summary

Endpoint:

```http
GET /api/v1/progress/summary
```

The service calculates:

```text
Days tracked
Average mood
Average energy
Average stress
Average sleep
Average water intake
Average steps
Total exercise
Total yoga
Total meditation
Goal summary
```

This data can later power charts in the React Native application.

---

# 25. Consultation

The Consultation module manages user consultation requests.

Endpoint:

```text
/api/v1/consultations
```

Supported operations:

```text
POST   /
GET    /
GET    /:id
PATCH  /:id
PATCH  /:id/cancel
PATCH  /:id/complete
```

Consultation types:

```text
online
offline
```

Statuses:

```text
requested
confirmed
rescheduled
completed
cancelled
```

The system stores:

```text
Preferred date
Preferred time
Concern
Goals
Notes
Consultant information
Scheduled time
Cancellation reason
Completion time
```

The current system does not implement consultant authentication.

---

# 26. Notifications

Notifications are stored in the database.

Endpoint:

```text
/api/v1/notifications
```

Supported operations:

```text
POST   /
GET    /
GET    /unread-count
GET    /:id
PATCH  /:id/read
PATCH  /read-all
DELETE /:id
DELETE /read
```

Notification types:

```text
goal
progress
consultation
yoga
ayurveda
general
system
```

Notifications contain:

```text
Title
Message
Type
Read status
Read timestamp
Action
Metadata
Expiration
```

The system can later be extended to support Expo/Firebase push notifications.

---

# 27. Favorites

Favorites allow users to save Ayurveda and Yoga content.

Endpoint:

```text
/api/v1/favorites
```

Supported operations:

```text
POST   /
GET    /
GET    /check/:itemType/:itemId
GET    /:id
DELETE /:id
DELETE /:itemType/:itemId
DELETE /type/:itemType
```

Supported item types:

```text
ayurveda
yoga
```

Duplicate favorites are prevented using a unique database index.

---

# 28. Search

Search operates directly against the Ayurveda and Yoga collections.

No separate search model is required.

Endpoint:

```http
GET /api/v1/search?q=stress
```

Supported filters:

```text
type
category
difficulty
ayurvedaType
page
limit
```

Search fields include content such as:

```text
Title
Description
Slug
Tags
Benefits
Instructions
Usage
Precautions
Contraindications
Ingredients
```

The response contains:

```text
resultType
```

which identifies whether the result belongs to:

```text
ayurveda
```

or:

```text
yoga
```

---

# 29. Profile & Settings

Profile information is kept separate from the detailed Health Profile.

Profile endpoint:

```text
/api/v1/profile
```

Operations:

```text
GET /
PATCH /
PATCH /password
GET /settings
PATCH /settings
DELETE /account
```

Profile information:

```text
First name
Last name
Phone
Email
Account status
```

Settings include:

```text
Notifications
Goal reminders
Progress reminders
Consultation updates
Wellness reminders
Reminder time
Theme
Analytics preference
Language
Timezone
```

---

# 30. Account Deactivation

Account deletion currently uses a soft-deactivation strategy.

Instead of immediately deleting all associated data:

```text
isActive = false
```

The refresh token is also invalidated.

This approach prevents accidental permanent deletion and provides room for a future account-recovery or data-retention policy.

---

# 31. Middleware

## Authentication Middleware

File:

```text
src/middlewares/auth.middleware.js
```

Responsibilities:

```text
Read Bearer token
Verify JWT
Validate token type
Find user
Check active account
Attach user to req.user
```

---

# 32. Validation Middleware

File:

```text
src/middlewares/validate.middleware.js
```

Zod schemas validate incoming request bodies.

This prevents invalid data from reaching services and database operations.

---

# 33. Error Handling

Global error handling is implemented through:

```text
error.middleware.js
```

Unknown routes are handled through:

```text
notFound.middleware.js
```

The overall flow is:

```text
Request
   ↓
Route
   ↓
Validation
   ↓
Controller
   ↓
Service
   ↓
Error
   ↓
Global Error Middleware
   ↓
JSON Response
```

---

# 34. API Authentication Pattern

Protected APIs use:

```http
Authorization: Bearer ACCESS_TOKEN
```

Example:

```http
GET /api/v1/dashboard
Authorization: Bearer eyJ...
```

Public authentication endpoints include:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

Most application functionality requires authentication.

---

# 35. Complete API Reference

## Authentication

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
```

## Health Profile

```text
POST   /api/v1/health-profile
GET    /api/v1/health-profile
PATCH  /api/v1/health-profile
DELETE /api/v1/health-profile
```

## Goals

```text
POST   /api/v1/goals
GET    /api/v1/goals
GET    /api/v1/goals/:id
PATCH  /api/v1/goals/:id
DELETE /api/v1/goals/:id
PATCH  /api/v1/goals/:id/progress
PATCH  /api/v1/goals/:id/complete
PATCH  /api/v1/goals/:id/pause
PATCH  /api/v1/goals/:id/resume
```

## Dashboard

```text
GET /api/v1/dashboard
```

## Ayurveda

```text
GET /api/v1/ayurveda
GET /api/v1/ayurveda/categories
GET /api/v1/ayurveda/featured
GET /api/v1/ayurveda/recommendations
GET /api/v1/ayurveda/:id
```

## Yoga

```text
GET /api/v1/yoga
GET /api/v1/yoga/categories
GET /api/v1/yoga/featured
GET /api/v1/yoga/recommendations
GET /api/v1/yoga/:id
```

## Recommendations

```text
GET /api/v1/recommendations
```

## Progress

```text
POST   /api/v1/progress
GET    /api/v1/progress
GET    /api/v1/progress/summary
GET    /api/v1/progress/:id
PATCH  /api/v1/progress/:id
DELETE /api/v1/progress/:id
```

## Consultation

```text
POST  /api/v1/consultations
GET   /api/v1/consultations
GET   /api/v1/consultations/:id
PATCH /api/v1/consultations/:id
PATCH /api/v1/consultations/:id/cancel
PATCH /api/v1/consultations/:id/complete
```

## Notifications

```text
POST   /api/v1/notifications
GET    /api/v1/notifications
GET    /api/v1/notifications/unread-count
GET    /api/v1/notifications/:id
PATCH  /api/v1/notifications/:id/read
PATCH  /api/v1/notifications/read-all
DELETE /api/v1/notifications/:id
DELETE /api/v1/notifications/read
```

## Favorites

```text
POST   /api/v1/favorites
GET    /api/v1/favorites
GET    /api/v1/favorites/check/:itemType/:itemId
GET    /api/v1/favorites/:id
DELETE /api/v1/favorites/:id
DELETE /api/v1/favorites/:itemType/:itemId
DELETE /api/v1/favorites/type/:itemType
```

## Search

```text
GET /api/v1/search
```

## Profile

```text
GET    /api/v1/profile
PATCH  /api/v1/profile
PATCH  /api/v1/profile/password
GET    /api/v1/profile/settings
PATCH  /api/v1/profile/settings
DELETE /api/v1/profile/account
```

---

# 36. Database Models

The backend currently contains the following MongoDB collections/models:

```text
User
HealthProfile
Goal
Ayurveda
Yoga
Progress
Consultation
Notification
Favorite
Settings
```

Conceptual relationships:

```text
                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
        ┌──────────────────┼───────────────────┐
        │                  │                   │
        ↓                  ↓                   ↓
 HealthProfile          Goals              Progress
        │
        │
        ├───────────────┐
        ↓               ↓
   Recommendations   Dashboard


User
 │
 ├── Consultations
 ├── Notifications
 ├── Favorites ─────→ Ayurveda
 │                 └→ Yoga
 │
 └── Settings
```

---

# 37. Data Ownership

All user-generated records are associated with the authenticated user.

For example:

```text
Goal.user
Progress.user
Consultation.user
Notification.user
Favorite.user
Settings.user
HealthProfile.user
```

Services verify the authenticated user when retrieving or modifying these records.

This prevents users from accessing another user's private application data.

---

# 38. Seed Data

Currently only content modules require seed data.

Available:

```text
src/utils/ayurveda.seed.js
src/utils/yoga.seed.js
```

Commands:

```bash
npm run seed:ayurveda
npm run seed:yoga
```

User-generated modules do not require seed data:

```text
Health Profile
Goals
Progress
Consultations
Notifications
Favorites
Settings
```

Recommendations are generated dynamically and therefore do not require seed data.

---

# 39. Package Scripts

The expected scripts are:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "seed:ayurveda": "...",
    "seed:yoga": "..."
  }
}
```

Development:

```bash
npm run dev
```

Production-style startup:

```bash
npm start
```

---

# 40. Backend Installation

Clone/open the project and enter the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create environment file:

```text
.env
```

Configure:

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/niramaya

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

CLIENT_URL=http://localhost:8081
```

Start MongoDB.

Then:

```bash
npm run dev
```

---

# 41. Initial Content Setup

After MongoDB is running:

```bash
npm run seed:ayurveda
npm run seed:yoga
```

Then start the backend:

```bash
npm run dev
```

Verify:

```text
GET /api/v1/health
```

---

# 42. Development Workflow

Recommended development flow:

```text
MongoDB
   ↓
Backend
   ↓
REST APIs
   ↓
Postman / API Client
   ↓
React Native Expo
```

Before connecting the frontend, APIs should be tested independently.

---

# 43. Testing Strategy

Each module should be tested independently.

## Authentication

Test:

```text
Registration
Duplicate email
Login
Invalid password
Access token
Refresh token
Logout
Current user
```

## Health Profile

Test:

```text
Create
Read
Update
Delete
Validation
Authentication
```

## Goals

Test:

```text
Create
Read
Update
Delete
Progress
Complete
Pause
Resume
```

## Content

Test:

```text
List
Search
Categories
Featured
Individual content
Personalized recommendations
```

## Progress

Test:

```text
Create daily record
Update
History
Date filters
Summary
```

## Consultation

Test:

```text
Create request
View request
Update
Cancel
Complete
User isolation
```

## Notifications

Test:

```text
Create
List
Unread count
Mark read
Mark all read
Delete
```

## Favorites

Test:

```text
Add
Duplicate prevention
Check
List
Remove
```

## Search

Test:

```text
All
Ayurveda
Yoga
Category
Difficulty
Pagination
```

## Profile

Test:

```text
Read profile
Update profile
Change password
Settings
Account deactivation
```

---

# 44. Security Measures Currently Implemented

The backend already includes several important security foundations:

```text
JWT authentication
Password hashing
Refresh token hashing
Helmet
CORS
Input validation
Authenticated user scoping
Environment variables
Database indexes
Duplicate prevention
Account activation status
Centralized error handling
```

Passwords are never stored as plain text.

---

# 45. Future Security Hardening

Although the main backend functionality is complete, additional production security can be added later.

Potential improvements:

```text
Rate limiting
Brute-force protection
Account lockout
Email verification
Password reset
Refresh-token reuse detection
Request size limits
Audit logging
Security event logging
More restrictive CORS
Production secret management
MongoDB production security
API monitoring
```

These are considered hardening rather than core feature development.

---

# 46. Future Notification Infrastructure

The current notification system is database-backed.

Future architecture:

```text
Application Event
       ↓
Notification Service
       ↓
MongoDB Notification
       ↓
Push Notification Service
       ↓
Expo / Mobile Device
```

This allows push notifications to be added without replacing the current notification system.

---

# 47. Future Consultant System

The current consultation feature is user-focused.

Future expansion could introduce:

```text
Consultant Model
Consultant Authentication
Consultant Availability
Appointment Scheduling
Consultant Dashboard
Consultation Notes
Online Meeting Integration
```

This is intentionally not part of the current user authentication architecture.

---

# 48. Mobile App Frontend Integration

The React Native Expo application will consume these APIs.

Example:

```text
React Native
     │
     │ Axios / Fetch
     ↓
http://localhost:5000/api/v1
     │
     ├── auth
     ├── health-profile
     ├── goals
     ├── dashboard
     ├── ayurveda
     ├── yoga
     ├── recommendations
     ├── progress
     ├── consultations
     ├── notifications
     ├── favorites
     ├── search
     └── profile
```

---

# 49. Mobile Application Mapping

The backend maps directly to the planned Niramaya screens.

| Mobile Screen   | Backend                |
| --------------- | ---------------------- |
| Login           | Authentication         |
| Signup          | Authentication         |
| Onboarding      | Health Profile         |
| Home/Dashboard  | Dashboard              |
| Goals           | Goals                  |
| Ayurveda        | Ayurveda               |
| Yoga            | Yoga                   |
| Recommendations | Recommendation Service |
| Progress        | Progress               |
| Consultation    | Consultation           |
| Notifications   | Notifications          |
| Favorites       | Favorites              |
| Search          | Search                 |
| Profile         | Profile                |
| Settings        | Profile/Settings       |

---

# 50. Backend Development Status

Current feature status:

```text
Foundation                 ✅
Authentication             ✅
Health Profile             ✅
Goals                      ✅
Dashboard                  ✅
Ayurveda                   ✅
Yoga                       ✅
Recommendations            ✅
Progress & Tracking        ✅
Consultation               ✅
Notifications              ✅
Favorites                  ✅
Search                     ✅
Profile & Settings         ✅
Documentation              ✅
```

Therefore:

**Core backend feature development is complete.**

The remaining work is documentation, API verification, testing, security hardening, and production preparation.

---

# 51. Recommended Final Backend Phase

The backend should now move through these stages:

```text
                BACKEND DEVELOPMENT
                       │
                       ↓
              Feature Development
                       │
                       ↓
                    COMPLETE
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
        Documentation         Testing
             │                   │
             └─────────┬─────────┘
                       ↓
              Security Hardening
                       │
                       ↓
              Production Readiness
                       │
                       ↓
                Backend Complete
                       │
                       ↓
             React Native Frontend
```

---

# 52. Final Conclusion

The Niramaya backend has been designed as a modular REST API using Node.js, Express.js, MongoDB, and Mongoose.

The backend provides the foundation required by the mobile application, including authentication, onboarding data, health profiles, goals, dashboards, Ayurveda, Yoga, personalized recommendations, progress tracking, consultations, notifications, favorites, search, and profile/settings functionality.

The architecture separates routes, controllers, services, models, middleware, and utilities, making the application easier to maintain and extend.

The backend is now ready to move from **feature development** into **documentation, testing, security hardening, and frontend integration**.

The next major development phase is therefore the **React Native Expo mobile application**, after the backend APIs have been verified through systematic testing.
