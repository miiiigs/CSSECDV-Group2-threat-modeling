# Test Cases for admin.js Routes

## GET /admin/search

### Test Case 1: Search Users by Username
**Description:** Search for users by username parameter
**Inputs:** 
- username: "john"
- fullname: ""
- studentid: ""
**Expected Output:** HTTP 200 OK, rendered search view with matching users
**Test Result:** PASSED

### Test Case 2: Search Users by Full Name
**Description:** Search for users by full name parameter
**Inputs:** 
- username: ""
- fullname: "John Doe"
- studentid: ""
**Expected Output:** HTTP 200 OK, rendered search view with matching users
**Test Result:** PASSED

### Test Case 3: Search Users by Student ID
**Description:** Search for users by student ID parameter
**Inputs:** 
- username: ""
- fullname: ""
- studentid: "STU123456"
**Expected Output:** HTTP 200 OK, rendered search view with matching users
**Test Result:** PASSED

### Test Case 4: Search with Multiple Parameters
**Description:** Search using multiple search parameters
**Inputs:** 
- username: "john"
- fullname: "Doe"
- studentid: "STU"
**Expected Output:** HTTP 200 OK, rendered search view with users matching any parameter
**Test Result:** PASSED

### Test Case 5: Search with No Results
**Description:** Search that returns no matching users
**Inputs:** 
- username: "nonexistent"
- fullname: ""
- studentid: ""
**Expected Output:** HTTP 200 OK, rendered search view with empty results
**Test Result:** PASSED

### Test Case 6: Search with Empty Parameters
**Description:** Search with all empty parameters
**Inputs:** 
- username: ""
- fullname: ""
- studentid: ""
**Expected Output:** HTTP 200 OK, rendered search view with all users
**Test Result:** PASSED

### Test Case 7: Search with Special Characters
**Description:** Search with special characters in parameters
**Inputs:** 
- username: "user@123"
- fullname: "O'Connor"
- studentid: "STU-123"
**Expected Output:** HTTP 200 OK, rendered search view with matching users
**Test Result:** PASSED

## GET /admin/delete-user

### Test Case 8: Display Users for Deletion - By ID
**Description:** Display users matching search by ID field
**Inputs:** 
- searchInput: "STU123456"
- searchField: "id"
**Expected Output:** HTTP 200 OK, rendered admin_delete_user view with matching non-LabTech users
**Test Result:** PASSED

### Test Case 9: Display Users for Deletion - By Email
**Description:** Display users matching search by email field
**Inputs:** 
- searchInput: "student@example.com"
- searchField: "email"
**Expected Output:** HTTP 200 OK, rendered admin_delete_user view with matching non-LabTech users
**Test Result:** PASSED

### Test Case 10: Display Users for Deletion - By Username
**Description:** Display users matching search by username field
**Inputs:** 
- searchInput: "john"
- searchField: "username"
**Expected Output:** HTTP 200 OK, rendered admin_delete_user view with matching non-LabTech users
**Test Result:** PASSED

### Test Case 11: Display All Users for Deletion
**Description:** Display all non-LabTech users when no search parameters
**Inputs:** 
- searchInput: ""
- searchField: "id"
**Expected Output:** HTTP 200 OK, rendered admin_delete_user view with all non-LabTech users
**Test Result:** PASSED

### Test Case 12: No Results for Deletion
**Description:** Search that returns no non-LabTech users for deletion
**Inputs:** 
- searchInput: "nonexistent"
- searchField: "username"
**Expected Output:** HTTP 200 OK, rendered admin_delete_user view with empty results
**Test Result:** PASSED

### Test Case 13: Invalid Search Field
**Description:** Search with invalid search field parameter
**Inputs:** 
- searchInput: "test"
- searchField: "invalid"
**Expected Output:** HTTP 200 OK, rendered admin_delete_user view with all non-LabTech users
**Test Result:** PASSED

### Test Case 14: Search with Special Characters
**Description:** Search with special characters in search input
**Inputs:** 
- searchInput: "user@123"
- searchField: "email"
**Expected Output:** HTTP 200 OK, rendered admin_delete_user view with matching non-LabTech users
**Test Result:** PASSED

## Authentication and Authorization

### Test Case 15: Access Without Authentication
**Description:** Attempt to access admin routes without being logged in
**Inputs:** No session
**Expected Output:** HTTP 302 Redirect to /login
**Test Result:** PASSED

### Test Case 16: Access Without LabTech Role
**Description:** Attempt to access admin routes as non-LabTech user
**Inputs:** Authenticated student session
**Expected Output:** HTTP 302 Redirect to /logout
**Test Result:** PASSED

### Test Case 17: Access with LabTech Role
**Description:** Access admin routes with proper LabTech authentication
**Inputs:** Authenticated LabTech session
**Expected Output:** HTTP 200 OK, appropriate admin view
**Test Result:** PASSED

## Error Handling

### Test Case 18: Database Connection Error
**Description:** Handle database connection failures gracefully
**Inputs:** Database unavailable
**Expected Output:** HTTP 500 Internal Server Error, appropriate error message
**Test Result:** PASSED

### Test Case 19: Malformed Query Parameters
**Description:** Handle malformed or invalid query parameters
**Inputs:** Invalid query string
**Expected Output:** HTTP 400 Bad Request or graceful handling
**Test Result:** PASSED

### Test Case 20: Very Long Search Input
**Description:** Handle extremely long search input
**Inputs:** searchInput: "verylongsearchterm" (100+ characters)
**Expected Output:** HTTP 200 OK, appropriate handling of long input
**Test Result:** PASSED 