# Contract Real-Time Update

This project provides a real-time contract update system using Django with Daphne for WebSocket support, React as the frontend, and PostgreSQL as the database.

## Technologies Used
- **Backend:** Django (ASGI with Daphne)
- **Frontend:** React
- **Database:** PostgreSQL
- **Message Queue:** Redis
- **Containerization:** Docker & Docker Compose
- **Infrastructure:** Terraform (for deployment, but not deployed yet)

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Docker & Docker Compose
- Node.js (for frontend development)
- Python 3 & pip (if running Django outside Docker)

### Setup & Running the Project

1. **Clone the Repository**
   ```sh
   git clone https://github.com/jahnavi0102/contract-real-time-update
   cd contract-real-time-update
   ```

2. **Start Docker Containers**
   ```sh
   docker-compose up --build
   ```

   **Note:** PostgreSQL may fail due to an **unmatching password** error. If this happens:
   - Enter the PostgreSQL container:
     ```sh
     docker exec -it <postgres-container-id> psql -U postgres
     ```
   - Alter the user password to match the `DATABASE_URL` in `docker-compose.yml`:
     ```sql
     ALTER USER postgres WITH PASSWORD 'password';
     ```
   - Restart the backend:
     ```sh
     docker-compose restart backend
     ```

3. **Access the Application**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:8000](http://localhost:8000)
   - **WebSockets:** `ws://localhost:8000/ws/contracts/`


## WebSocket Connection
Daphne is used to handle WebSocket connections in Django. The WebSocket server runs on `ws://localhost:8000/ws/contracts/` and updates contract statuses in real-time.

## Terraform Deployment (Not Yet Deployed)
Terraform configuration files have been created and tested with a dummy deployment. However, due to deployment requiring a credit card, actual deployment hasn't been completed yet.

## Troubleshooting
- **Postgres Authentication Error**: Ensure the PostgreSQL password matches the one in `docker-compose.yml`.
- **Backend Not Accessible**: Make sure Daphne is running on `0.0.0.0:8000`, not `127.0.0.1:8000`.
- **WebSockets Not Working**: Check if Daphne is running correctly (`docker logs backend`).

## Future Improvements
- Deploying the project using Terraform
- Adding authentication for WebSockets
- Enhancing error handling

---

For any issues, feel free to raise an issue or contribute to the project!

