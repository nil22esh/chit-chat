# Chit-Chat Backend

Welcome to the Chit-Chat backend repository! This backend supports the Chit-Chat application, providing the necessary APIs for user authentication and real-time messaging.

## Folder Structure

client/
server/
node_modules/
src/
controller/
message.controller.js
user.controller.js
db/
db.js
middlewares/
auth.middleware.js
models/
message.model.js
user.model.js
routes/
message.routes.js
user.routes.js
services/
cloudinary.js
.env
.gitignore
app.js
package-lock.json
package.json
README.md

## Routes

### User Routes

- **POST /register**  
  Registers a new user.  
  **Example Response:**

  ```json
  { "message": "User registered successfully!" }
  ```

- **POST /login**  
  Logs in a user.  
  **Example Response:**

  ```json
  { "token": "your_jwt_token" }
  ```

- **POST /logout**  
  Logs out the user.  
  **Example Response:**

  ```json
  { "message": "User logged out successfully!" }
  ```

- **PUT /update**  
  Updates user profile.  
  **Example Response:**

  ```json
  { "message": "Profile updated successfully!" }
  ```

- **GET /checkAuth**  
  Checks if the user is authenticated.  
  **Example Response:**
  ```json
  { "isAuthenticated": true }
  ```

### Message Routes

- **GET /users**  
  Retrieves users for the sidebar.  
  **Example Response:**

  ```json
  [
    { "id": 1, "name": "User1" },
    { "id": 2, "name": "User2" }
  ]
  ```

- **GET /:id**  
  Retrieves messages for a user.  
  **Example Response:**

  ```json
  [{ "sender": "User1", "message": "Hello!" }]
  ```

- **POST /send**  
  Sends a message.  
  **Example Response:**
  ```json
  { "message": "Message sent successfully!" }
  ```

## Dependencies

- bcryptjs: ^3.0.2
- cloudinary: ^2.6.0
- cookie-parser: ^1.4.7
- dotenv: ^16.4.7
- express: ^4.21.2
- jsonwebtoken: ^9.0.2
- mongoose: ^8.13.1
- nodemon: ^3.1.9
- socket.io: ^4.8.1

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set up your `.env` file with the necessary configuration.
4. Start the server using `npm start` or `nodemon` for development.

## License

This project is licensed under the MIT License.
