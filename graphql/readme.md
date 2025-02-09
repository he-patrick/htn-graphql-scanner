# GraphQL Queries and Mutations

## Queries

### Get All Users
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

### Get User by ID
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

### Get All Scans with Filters
```graphql
query {
    scans(min_frequency: 1, max_frequency: 10, activity_category: "CATEGORY_HERE") {
        activity_name
        frequency
    }
}
```

### Get Scans by User ID
```graphql
query {
    userScans(userId: "USER_ID_HERE") {
        scanId
        activity_name
        scanned_at
        activity_category
    }
}
```

## Mutations

### Add User
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

### Add Scan
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

### Update User
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