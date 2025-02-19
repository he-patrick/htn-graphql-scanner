# Hack the North 2025 Backend Challenge

## Hosted Interactive Client
Try out the queries and mutations hosted on AWS Lambda and RDS through this website: [link](https://v0-graph-ql-api-client-wfbs1y.vercel.app/)

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

## Managing Hosted Instance

1. **Build Image:**
    ```
    docker build -t htn-backend-challenge .
    ```

2. **Login to AWS**
    ```
    aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin <user-id>.dkr.ecr.us-east-2.amazonaws.com
    ```

3. **Add Tag:**
    ```
    docker tag htn-backend-challenge <user-id>.dkr.ecr.us-east-2.amazonaws.com/htn-backend-challenge
    ```

4. **Push to AWS:**
    ```
    docker push <user-id>.dkr.ecr.us-east-2.amazonaws.com/htn-backend-challenge
    ```

5. **Access AWS RDS Database Through EC2 Instance:**
    ```
    psql -h htn-backend-challenge.c72ys44ic8jb.us-east-2.rds.amazonaws.com -U postgres
    ```

6. **Connect to htn_backend_challenge Database**
    ```
    \c htn_backend_challenge
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
│   │   ├── User.js
│   │   └── Mealtime.js
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
  - **Mealtime.js**: Defines the data model for the "Mealtime" entity.

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
`nextMeal`: Finds the next (or current) meal startTime and endTime. </br>
`addUser`: Create a new user. </br>
`addScan`: Add a scan for a user. (This will update the User.updatedAt field) </br>
`updateUser`: Update a user's name, phone, badgecode. (This will update the User.updatedAt field) </br>
`setMealtime`: Sets a meal and its startTime and endTime. Allows for updating a current meal's times. </br>

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
-------------------+--------------------------+-----------+--------------------------------
 scanId            | uuid                     | not null  | Unique identifier for the scan
 activity_name     | character varying(255)   | not null  | Name of the activity
 activity_category | character varying(255)   | not null  | Category of the activity
 scanned_at        | timestamp with time zone | not null  | Timestamp when the scan occurred
 createdAt         | timestamp with time zone | not null  | Timestamp when the scan was created
 updatedAt         | timestamp with time zone | not null  | Timestamp when the scan was last updated
 userId            | uuid                     | not null  | Identifier of the user who performed the scan
```

**Display Mealtimes Table:** `\d "Mealtimes"`
```
  Column   |           Type           | Nullable | Description                 
-----------+--------------------------+----------+-----------------------------------------
 id        | integer                  | not null | Unique identifier for the meal
 mealType  | character varying(255)   | not null | Name of the meal (e.g. Breakfast, Lunch, Dinner, etc.)
 startTime | timestamp with time zone | not null | Start time of the meal
 endTime   | timestamp with time zone | not null | End time of the meal
 createdAt | timestamp with time zone | not null | Timestamp when the meal was created
 updatedAt | timestamp with time zone | not null | Timestamp when the meal was last updated
```

## Design Choices
- I decided to create a one-to-many relationship so that each "User" can have several "Scans".
- Each scan is linked to a specific user through the userId column (foreign key).
- Even though it was specified that the badge codes are unique, I decided to use a `userId` column to give user a unique uuid — if the requirements were to change in the future, this would ensure that every user has a unique identifier.
- Similarily, I created a `scanId`, even though it's not needed at the moment. Future requirements might find it useful to have a unique identifier for each scan.
- I used a raw SQL query in `services/scanService.js` for the `scans` requirements to show my ability to construct SQL queries (I was working on this stuff at my CRA internship).
- I initially had a query to get scans by userId but removed it because of redundancy -> graphql allows you to retrieve speicifc data that you want so it has the same functionality as using the user query and asking for the user's scan data.

## Assumptions:    
- When the badge_code was empty in the JSON file, I created to create a temporary badge_code labeled `temp-RANDOM`.
- I can see in the example_data.json that users can scan into the same activity_name multiple times, so I don't have anything blocking multiple of the same scans for the same user.

## Bonus:
Sometimes, as a hacker, you're so absolutely locked in that you can't seem to remember when dinner is coming up! Well you're in luck now — I created a mutation that allows the Hack the North team to set meal times, and a query that allows hackers to see when the next meal time is coming up, with its start and end times.

Check out the `nextMeal` and `setMealtime` responses below!

## Queries

### Get All Users
Query:
```graphql
query {
    users {
        userId
        name
        email
        phone
        badge_code
        createdAt
        updatedAt
        scans {
            scanId
            activity_name
            scanned_at
            activity_category
        }
    }
}
```
Example response:
```json
{
    "userId": "ddf9f6a7-1fd1-4227-8bd0-ce37d5110367",
    "name": "Amanda Hicks",
    "email": "milescynthia@example.net",
    "phone": "575-273-5668",
    "badge_code": "move-public-leader-understand",
    "createdAt": "2025-02-09T02:59:23.208Z",
    "updatedAt": "2025-02-09T02:59:23.208Z",
    "scans": [
        {
            "scanId": "a59903e8-bfa3-49e1-8767-b9c22243b273",
            "activity_name": "sunday_breakfast",
            "scanned_at": "2025-01-18T06:30:22.404Z",
            "activity_category": "meal"
        },
    ]
}
```

### Get User by ID
Query:
```graphql
query {
    user(userId: "USER_ID_HERE") {
        userId
        name
        email
        phone
        badge_code
        createdAt
        updatedAt
        scans {
            scanId
            activity_name
            scanned_at
            activity_category
        }
    }
}
```
Example response:
```json
"user": {
    "userId": "a41563d6-9dde-4c6a-9df8-054a065cb115",
    "name": "Angela Dennis",
    "email": "alexanderchristopher@example.com",
    "phone": "001-274-492-0303x52496",
    "badge_code": "assume-issue-hand-others",
    "createdAt": "2025-02-09T02:59:23.224Z",
    "updatedAt": "2025-02-09T02:59:23.224Z",
    "scans": [
        {
            "scanId": "993e7ec4-31a6-42da-89ad-74fc7b5f516d",
            "activity_name": "sunday_breakfast",
            "scanned_at": "2025-01-19T14:44:43.848Z",
            "activity_category": "meal"
        },
    ]
}
```

### Get All Scans with Filters
Query:
```graphql
query {
    scans(min_frequency: 1, max_frequency: 10, activity_category: "CATEGORY_HERE") {
        activity_name
        frequency
    }
}
```
Example Response:
```json
"scans": [
    {
        "activity_name": "closing_ceremony",
        "frequency": 23
    },
    {
        "activity_name": "team_formation",
        "frequency": 22
    }
]

```

### Get Next Mealtime
Query:
```graphql
query {
  nextMeal {
    mealType
    startTime
    endTime
  }
}
```
Example response:
```json
"nextMeal": {
    "mealType": "Dinner",
    "startTime": "2025-02-09T23:00:00.000Z",
    "endTime": "2025-02-10T00:00:00.000Z"
}
```

## Mutations

### Add User
Mutation:
```graphql
mutation {
    addUser(name: "NAME_HERE", email: "EMAIL_HERE", phone: "PHONE_HERE", badge_code: "BADGE_CODE_HERE") {
        userId
        name
        email
        phone
        badge_code
        createdAt
        updatedAt
    }
}
```
Example response:
```json
"addUser": {
    "userId": "7ad062d9-6338-4a39-a2d6-5f190fe4f246",
    "name": "Patrick He",
    "email": "patrick@gmail.com",
    "phone": "613-581-7601",
    "badge_code": "banana_banana_yum",
    "createdAt": "2025-02-09T17:17:07.782Z",
    "updatedAt": "2025-02-09T17:17:07.782Z"
}
```

### Add Scan
Mutation:
```graphql
mutation {
    addScan(userId: "USER_ID_HERE", activity_name: "ACTIVITY_NAME_HERE", activity_category: "CATEGORY_HERE") {
        scanId
        activity_name
        scanned_at
        activity_category
        user {
            userId
            name
        }
    }
}
```
Example response:
```json
"addScan": {
    "scanId": "5f0fcf5c-4e8a-4a35-84d1-99396dbdb1d7",
    "activity_name": "EAAAAAT",
    "scanned_at": "2025-02-09T17:19:07.056Z",
    "activity_category": "food",
    "user": {
        "userId": "7ad062d9-6338-4a39-a2d6-5f190fe4f246",
        "name": "Patrick He"
    }
}
```

### Update User
Mutation:
```graphql
mutation {
    updateUser(userId: "USER_ID_HERE", name: "NEW_NAME_HERE", phone: "NEW_PHONE_HERE", badge_code: "NEW_BADGE_CODE_HERE") {
        userId
        name
        email
        phone
        badge_code
        createdAt
        updatedAt
    }
}
```
Example response:
```json
"updateUser": {
    "userId": "7ad062d9-6338-4a39-a2d6-5f190fe4f246",
    "name": "Bob Joe",
    "email": "patrick@gmail.com",
    "phone": "613-234-5213",
    "badge_code": "banana_banana_yum",
    "createdAt": "2025-02-09T17:17:07.782Z",
    "updatedAt": "2025-02-09T17:20:49.448Z"
}
```

### Set Mealtime
Mutation:
```graphql
mutation {
  setMealtime(mealType: "Breakfast", startTime: "2025-02-10 08:00:00", endTime: "2025-02-10 09:00:00") {
    mealType
    startTime
    endTime
  }
}
```
Example response:
```json
"setMealtime": {
    "mealType": "Breakfast",
    "startTime": "2025-02-10T13:00:00.000Z",
    "endTime": "2025-02-10T14:00:00.000Z"
}
```