# Hack the North 2025 Backend Challenge

## Setup Instructions

### Requirements

- Node.js
- Docker
- Docker Compose

1. **Install dependencies:**
    ```
    npm install
    ```

2. **Build and run the Docker containers:**
    ```
    docker-compose up --build
    ```

3. **Load initial data:**
    ```
    cd scripts
    node loadData.js
    ```

4. **Access PostgreSQL Container:**
    ```
    docker exec -it postgres_db psql -U postgres -d htn_backend_challenge
    ```

## Project Structure

```
htn-backend-challenge/
├── scripts/
│   └── loadData.js
│── controllers/
│   └── userController.js
│── models/
│   └── userModel.js
│── routes/
│   └── userRoutes.js
└── index.js
```

Assumptions:
- If the badge_code is empty, I'm going to create an temporary badge_code labeled `temp-RANDOM`
- I can see in the example_data.json that users can scan into the same activity_name multiple times, so I don't have anything blocking multiple of the same scans for the same user