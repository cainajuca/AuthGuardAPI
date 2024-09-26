# **Auth Guard API**

## **Description**

The **Auth Guard API** is an API for a user authentication system, designed to provide full user management functionalities, including secure authentication. This project is part of a professional portfolio, demonstrating proficiency in NodeJS, NoSQL databases, and DevOps technologies such as Docker and Cloud.

## **Technologies Used**

- **Language**: Typescript
- **Technologies**: NodeJS, Docker, AWS, MongoDB
- **Libraries**: 
  - **Express**: Web framework for building APIs.
  - **Bcrypt**: For hashing passwords securely.
  - **JWT (jsonwebtoken)**: For implementing authentication via access and refresh tokens.
  - **CookieParser**: For handling cookies, particularly for storing refresh tokens in HTTP-only cookies.
  - **SendGrid Mail**: For sending emails for password reset and account activation.
  - **Redis**: Used for caching the list of active users.
  - **Jest**: For implementing automatic tests
  - **Swagger**: Tool for generating interactive API documentation
  - **Winston**: Logging library supporting multiple transports and log levels

## **Features**

- **Complete User CRUD**
  - Create, read, update, and delete users.
- **Authentication**
  - Authentication using Access and Refresh Tokens with JSON Web Tokens (JWT).
- **Password Reset via Email**: 
  - A password reset link is sent to the user’s registered email, allowing them to securely update their password.
- **Account Activation via Email**: 
  - Upon registration, users receive an email to activate their account, ensuring the authenticity of their email address.

## **How to Run the Project**

Make sure to configure the necessary environment variables in a .env file based on the .env.example provided in the project.
You can run the project with Docker or directly using Yarn. Below are the steps for each method:

### Using Docker:

- **Start the containers:**
```bash
docker compose -f docker-compose.prod.yml up --build
```

- **Stop the containers:**
```bash
docker compose -f docker-compose.prod.yml down
```

### Using Yarn:
Alternatively, you can start this API without Docker by cloning this repository and running the following command in the project root.

```bash
git clone https://github.com/cainajuca/AuthGuardAPI.git
npm install
npm run build
npm run start:prod
```

## **Project Structure**

The project follows solid software engineering patterns and principles to ensure maintainability and scalability:

- **Adopted Patterns**:
  - **Repository Pattern**
  - **Service Layer Pattern**
  - **Dependency Injection**
  - **Middleware Pattern**

- **Principles**:
  - **SOLID**
  - **Clean Architecture**

## **Environment Variables**

The following environment variables must be configured in a `.env` file for the API to work properly:

### Server Configuration
- **`API_PORT`**: The port where the API will run (default: 8080).
- **`API_URL`**: The base URL where the API will be accessible (default: `http://localhost:8080`).

### JWT Configuration
- **`JWT_SECRET`**: Secret key used to sign and verify JSON Web Tokens (JWT). This should be a strong, secure key to ensure token security.

### MongoDB Configuration
- **`MONGO_DB_CONNECTION_STRING`**: The MongoDB connection string. Replace `<USERNAME>`, `<PASSWORD>`, and `<DB_NAME>` with your MongoDB credentials and database name.

### Admin User Configuration
- **`ADMIN_PASSWORD`**: Password for the admin account, used for creating or managing administrative functionalities.

### Token Expiration Times
- **`ACCESS_TOKEN_EXPIRY`**: The duration for which an access token is valid (e.g., `1d` for 1 day).
- **`REFRESH_TOKEN_EXPIRY`**: The duration for which a refresh token is valid (e.g., `7d` for 7 days).

### Email Configuration
- **`API_EMAIL_USER`**: Email address used by the API to send system emails (e.g., for password reset and account activation). Current example: `authguardapi@outlook.com`.
- **`SENDGRID_API_KEY`**: API key for the SendGrid email service used to send system emails. Make sure to replace it with your actual SendGrid API key.

### URL Configurations
- **`RESET_URL`**: The URL where users will be redirected to reset their password. Typically, this will be a frontend endpoint.
- **`ACTIVATION_URL`**: The URL where users will activate their account after registration.
- **`ACTIVATION_TOKEN_EXPIRY`**: The duration for which the account activation token is valid (e.g., `1d` for 1 day).

## **API Documentation with Swagger**
The project includes API documentation with **Swagger**. You can access the Swagger UI by running the project and navigating to the `/api-docs` endpoint.
- **URL**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
- **Authorization**: You can use the **Authorize** button to pass a JWT for secured routes.

## **Planned Improvements**

In future commits, I plan to enhance the project with the following features:

- Log Implementation with **Winston**
- Automated Testing with **Jest**

## **Authors:**
- **Cainã Jucá** - [@cainajuca](https://www.linkedin.com/in/cainajuca)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.