# Test Cases for auth.js Routes

## POST /api/login

### Test Case 1: Successful Login - Student
**Description:** User logs in with correct email and password
**Inputs:** 
- email: "student@example.com"
- password: "password123"
**Expected Output:** HTTP 200 OK, redirect to dashboard
**Test Result:** PASSED

### Test Case 2: Successful Login - LabTech
**Description:** LabTech user logs in with correct credentials
**Inputs:** 
- email: "labtech@example.com"
- password: "labtech123"
**Expected Output:** HTTP 200 OK, redirect to dashboard
**Test Result:** PASSED

### Test Case 3: Failed Login - Wrong Password
**Description:** User provides correct email but wrong password
**Inputs:** 
- email: "student@example.com"
- password: "wrongpassword"
**Expected Output:** HTTP 401 Unauthorized, error message
**Test Result:** PASSED

### Test Case 4: Failed Login - Non-existent User
**Description:** User tries to login with non-existent email
**Inputs:** 
- email: "nonexistent@example.com"
- password: "password123"
**Expected Output:** HTTP 401 Unauthorized, error message
**Test Result:** PASSED

### Test Case 5: Failed Login - Empty Email
**Description:** User submits login with empty email field
**Inputs:** 
- email: ""
- password: "password123"
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 6: Failed Login - Empty Password
**Description:** User submits login with empty password field
**Inputs:** 
- email: "student@example.com"
- password: ""
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 7: Failed Login - Missing Email Field
**Description:** Request body missing email field entirely
**Inputs:** 
- password: "password123"
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 8: Failed Login - Missing Password Field
**Description:** Request body missing password field entirely
**Inputs:** 
- email: "student@example.com"
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 9: Failed Login - Empty Request Body
**Description:** Request with no body data
**Inputs:** {}
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

## POST /register

### Test Case 10: Successful Registration - Student
**Description:** New student user registers successfully
**Inputs:** 
- email: "newstudent@example.com"
- password: "newpassword123"
- fullname: "New Student"
- studentid: "STU123456"
**Expected Output:** HTTP 200 OK, user created, redirect to login
**Test Result:** PASSED

### Test Case 11: Successful Registration - LabTech
**Description:** New LabTech user registers successfully
**Inputs:** 
- email: "newlabtech@example.com"
- password: "newlabtech123"
- fullname: "New LabTech"
- studentid: "LAB123456"
- isLabtech: true
**Expected Output:** HTTP 200 OK, user created, redirect to login
**Test Result:** PASSED

### Test Case 12: Failed Registration - Existing Email
**Description:** User tries to register with existing email
**Inputs:** 
- email: "existing@example.com"
- password: "password123"
- fullname: "Existing User"
- studentid: "STU789012"
**Expected Output:** HTTP 400 Bad Request, "Email already exists"
**Test Result:** PASSED

### Test Case 13: Failed Registration - Missing Required Fields
**Description:** Registration with missing required fields
**Inputs:** 
- email: "incomplete@example.com"
- password: "password123"
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 14: Failed Registration - Empty Email
**Description:** Registration with empty email field
**Inputs:** 
- email: ""
- password: "password123"
- fullname: "Empty Email"
- studentid: "STU345678"
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 15: Failed Registration - Empty Password
**Description:** Registration with empty password field
**Inputs:** 
- email: "emptypass@example.com"
- password: ""
- fullname: "Empty Password"
- studentid: "STU901234"
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

## GET /logout

### Test Case 16: Successful Logout
**Description:** User logs out successfully
**Inputs:** Authenticated session
**Expected Output:** HTTP 302 Redirect to /login, session destroyed
**Test Result:** PASSED

### Test Case 17: Logout Without Session
**Description:** Logout attempt without active session
**Inputs:** No session
**Expected Output:** HTTP 302 Redirect to /login
**Test Result:** PASSED

## Edge Cases and Error Handling

### Test Case 18: Database Connection Error
**Description:** Handle database connection failures gracefully
**Inputs:** Database unavailable
**Expected Output:** HTTP 500 Internal Server Error, appropriate error message
**Test Result:** PASSED

### Test Case 19: Malformed JSON Request
**Description:** Handle malformed JSON in request body
**Inputs:** Invalid JSON string
**Expected Output:** HTTP 400 Bad Request, JSON parsing error
**Test Result:** PASSED

### Test Case 20: Very Long Email Address
**Description:** Handle extremely long email addresses
**Inputs:** email: "verylongemailaddress@verylongdomain.com" (100+ characters)
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 21: Very Long Password
**Description:** Handle extremely long passwords
**Inputs:** password: "verylongpassword" (100+ characters)
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED 