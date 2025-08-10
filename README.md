# web-project

This project is an MVP for an online store. It includes:

- Product listing page built with React
- User registration and login using JWT. Logging in with a new username automatically creates the account
- Express.js backend with MongoDB via Mongoose

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Ensure a MongoDB instance is running and accessible. Default URI is `mongodb://0.0.0.0:27017/webstore`.
3. Start the server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the application.

The server seeds the database with six sample products on first run.
