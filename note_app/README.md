# Note App - 
## Project Overview
Assignment 3 Authentication

It connects:
- React frontend
- GraphQL backend (Apollo Server with Express)
- MongoDB Atlas database

## Project Structure

note_app
- backend
    -.env
    -databas.js
    -resolvers.js
    -server.js
    -typeDefs.js
    -user.js

- frontend
    - src
        - components
            - ProtectedRoute.jsx
        - graphql
            - mutation.js
            - queries.js
        - pages
            - home.jsx
            - login.jsx
            - notes.jsx
            - register.jsx

# Setup Steps

# 1. Setup Backend

cd backend  
npm install  
npm run dev  

Backend runs on:  
http://localhost:5001/graphql  


# 2. Setup Frontend

cd frontend  
npm install  
npm run dev  

Frontend runs on:  
http://localhost:5173  


# What is Complete So Far

- Users register with username, email, and password  
- Passwords are encrypted using bcrypt 
- On login, credentials are verified  
- A JWT token is generated and returned   



# Environment Variables

Create a `.env` file inside the backend folder:
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
PORT=5001  




