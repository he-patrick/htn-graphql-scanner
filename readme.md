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
htn_backend_challenge/
├── node_modules/
├── src/
│   ├── graphql/
│   │   ├── resolvers.js
│   │   ├── schema.js
│   │   └── types.js
│   ├── models/
│   │   ├── Scan.js
│   │   └── User.js
│   ├── scripts/
│   │   ├── example_data.json
│   │   └── loadData.js
│   └── services/
│       └── scanService.js
├── db.js
└── index.js
```
- **src/graphql/**:
  - **resolvers.js**: Contains the queries and mutations.
  - **schema.js**: Defines the GraphQL schema.
  - **types.js**: Contains custom GraphQL types to reduce repetitiveness and increase readability.

- **src/models/**:
  - **Scan.js**: Defines the data model for the "Scan" entity.
  - **User.js**: Defines the data model for the "User" entity.

- **src/scripts/**:
  - **loadData.js**: The script used to load the JSON file data.

- **src/services/**:
  - **scanService.js**: Counts the occurrences of each activity_name from the Scans table with filters.

- **db.js**: Handles the database connection setup.

- **index.js**: The entry point of the application.



## GraphQL Queries And Mutations
`users`: Retrieve all users along with their associated scans. </br>
`user`: Search for a specific user along with their associated scans. </br>
`scans`: Retrieve the number of scans for each activity with optional filters for specific criteria such as min_frequency, max_frequency, or activity_category. </br>
`addUser`: Create a new user. </br>
`addScan`: Add a scan for a user. (This will update the User.updatedAt field) </br>
`updateUser`: Update a user's name, phone, badgecode. (This will update the User.updatedAt field) </br>

**See demo queries in:** `/src/graphql/readme.md`

## Database Structure
**Access PostgreSQL Container:** `docker exec -it postgres_db psql -U postgres -d htn_backend_challenge`

**List Relations:** `\dt`
```
         List of relations
 Schema | Name  | Type  |  Owner   
--------+-------+-------+----------
 public | Scans | table | postgres
 public | Users | table | postgres
```

**Display Users Table:** `\d "Users"`
```
                Table "public.Users"
   Column   |           Type           | Nullable  | Description
------------+--------------------------+-----------+-------------
 userId     | uuid                     | not null  | Unique identifier for the user
 name       | character varying(255)   | not null  | Name of the user
 email      | character varying(255)   | not null  | Email address of the user
 phone      | character varying(255)   | not null  | Phone number of the user
 badge_code | character varying(255)   | not null  | Unique badge code for the user
 createdAt  | timestamp with time zone | not null  | Timestamp when the user was created
 updatedAt  | timestamp with time zone | not null  | Timestamp when the user was last updated
 ```

**Display Scans Table:** `\d "Scans"`
```
                Table "public.Scans"
      Column       |           Type           | Nullable  | Description
-------------------+--------------------------+-----------+-------------
 scanId            | uuid                     | not null  | Unique identifier for the scan
 activity_name     | character varying(255)   | not null  | Name of the activity
 activity_category | character varying(255)   | not null  | Category of the activity
 scanned_at        | timestamp with time zone | not null  | Timestamp when the scan occurred
 createdAt         | timestamp with time zone | not null  | Timestamp when the scan was created
 updatedAt         | timestamp with time zone | not null  | Timestamp when the scan was last updated
 userId            | uuid                     | not null  | Identifier of the user who performed the scan
```

## Design Choices
- I decided to create a one-to-many relationship so that each "User" can have several "Scans".
- Each scan is linked to a specific user through the userId column (foreign key).
- Even though it was specified that the badge codes are unique, I decided to use a `userId` column to give user a unique uuid — if the requirements were to change in the future, this would ensure that every user has a unique identifier.
- Similarily, I created a `scanId`, even though it's not needed at the moment. Future requirements might find it useful to have a unique identifier for each scan.
- I used a raw SQL query in `services/scanService.js` for the `scans` requirements to show my ability to construct SQL queries (I was working on this stuff at my CRA internship).


## Assumptions:    
- When the badge_code was empty in the JSON file, I created to create a temporary badge_code labeled `temp-RANDOM`.
- I can see in the example_data.json that users can scan into the same activity_name multiple times, so I don't have anything blocking multiple of the same scans for the same user.

***Now, check out [/src/graphql/readme.md](https://github.com/he-patrick/htn-backend-challenge/tree/b0d8e749fd9c6e22def0eed62f35a49aab1cfb64/src/graphql) for a list of demo queries and mutations and their responses***
