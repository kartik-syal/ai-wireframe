# Wireframe AI

Wireframe AI is a web application that allows users to generate and edit HTML wireframes using natural language input. It includes user authentication (signup and login) and a dashboard where users can interact with a chatbot to create and refine their wireframes. The generated HTML can be exported as PNG, JPG, or SVG files.

## Features

- User authentication (signup and login)
- Dashboard with a chatbot interface for creating and editing wireframes
- Export generated HTML wireframes as PNG, JPG, or SVG
- Clean and professional UI

## Technologies Used

- Frontend: React, Axios, React Router
- Backend: Node.js, Express, Sequelize, PostgreSQL
- Authentication: JSON Web Tokens (JWT)
- Styling: CSS
- Image Export: `dom-to-image-more`

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- Node.js
- npm (Node Package Manager)
- PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/kartik-syal/ai-wireframe.git
cd ai-wireframe
```

2. Set up the backend:

```bash
cd backend
npm install
```

3. Set up the PostgreSQL database:

Create a database in PostgreSQL and update the `.env` file with your database credentials.

```bash
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
SERPAPI_KEY=your_serpapi_key
```

4. Run the backend server:

```bash
npm run dev
```

5. Set up the frontend:

```bash
cd ../frontend
npm install
```

6. Run the frontend server:

```bash
npm start
```

### Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Sign up for a new account or log in with an existing account.
3. Use the chatbot on the dashboard to enter requirements and generate wireframes.
4. Export the generated wireframes using the export button.

### Project Structure

```
wireframe-ai
├── backend
│   ├── config
│   │   └── database.js
│   ├── models
│   │   └── User.js
│   ├── routes
│   │   └── auth.js
│   ├── .env
│   ├── package.json
│   ├── server.js
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Chatbot.js
│   │   │   ├── Dashboard.js
│   │   │   ├── LoginForm.js
│   │   │   ├── SignupForm.js
│   │   ├── context
│   │   │   └── AuthContext.js
│   │   ├── services
│   │   │   └── auth.js
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── AuthForm.css
│   ├── package.json
```