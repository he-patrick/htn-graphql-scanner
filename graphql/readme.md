Query all users in GraphiQL:
```
query {
  users {
    userId
    name
    email
    phone
    badge_code
    updated_at
    scans {
			scanId
      activity_name
      activity_category
      scanned_at
      userId
    }
  }
}
```

Query a specific user in GraphiQL:
```
query {
  user(userId: "USER_ID_HERE") {
    userId
    name
    email
    phone
    badge_code
    updated_at
    scans {
      scanId
      activity_name
      scanned_at
      activity_category
    }
  }
}
```

Query all scans in GraphiQL:
```
query {
  scans {
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

Query a specific user's scans in GraphiQL:
```
query {
  userScans(userId: "USER_ID_HERE") {
    scanId
    activity_name
    scanned_at
    activity_category
  }
}
```

Mutation for a new user in GraphiQL:
```
mutation {
  addUser(
    name: "John Doe"
    email: "john.doe@example.com"
    phone: "123-456-7890"
    badge_code: "ABC123"
  ) {
    userId
    name
    email
    phone
    badge_code
  }
}
```

Mutation for a new scan in GraphiQL:
```
mutation {
  addScan(
    userId: "USER_ID_HERE"
    activity_name: "Yoga Class"
    activity_category: "Fitness"
  ) {
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