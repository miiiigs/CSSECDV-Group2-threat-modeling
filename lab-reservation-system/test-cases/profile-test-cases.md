# Test Cases for profile.js Routes

## GET /profile

### Test Case 1: View Profile - Student
**Description:** Student views their profile page
**Inputs:** Authenticated student session
**Expected Output:** HTTP 200 OK, rendered profile view with user data
**Test Result:** PASSED

### Test Case 2: View Profile - LabTech
**Description:** LabTech views their profile page
**Inputs:** Authenticated LabTech session
**Expected Output:** HTTP 200 OK, rendered profile view with user data
**Test Result:** PASSED

### Test Case 3: Access Without Authentication
**Description:** Attempt to access profile page without login
**Inputs:** No session
**Expected Output:** HTTP 302 Redirect to /login
**Test Result:** PASSED

## POST /profile/update

### Test Case 4: Update Profile Successfully
**Description:** User updates their profile information successfully
**Inputs:** 
- fullname: "Updated Name"
- email: "updated@example.com"
- studentid: "STU789012"
- authenticated session
**Expected Output:** HTTP 200 OK, profile updated successfully
**Test Result:** PASSED

### Test Case 5: Update Profile - Partial Update
**Description:** User updates only some profile fields
**Inputs:** 
- fullname: "New Name"
- email: "user@example.com" (unchanged)
- studentid: "STU123456" (unchanged)
- authenticated session
**Expected Output:** HTTP 200 OK, profile updated successfully
**Test Result:** PASSED

### Test Case 6: Failed Update - Missing Required Fields
**Description:** Update profile with missing required fields
**Inputs:** 
- fullname: ""
- email: "user@example.com"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 7: Failed Update - Invalid Email Format
**Description:** Update profile with invalid email format
**Inputs:** 
- fullname: "Test User"
- email: "invalid-email"
- studentid: "STU123456"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 8: Failed Update - Email Already Exists
**Description:** Update profile with email that already exists for another user
**Inputs:** 
- fullname: "Test User"
- email: "existing@example.com"
- studentid: "STU123456"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, "Email already exists"
**Test Result:** PASSED

### Test Case 9: Failed Update - Empty Full Name
**Description:** Update profile with empty full name
**Inputs:** 
- fullname: ""
- email: "user@example.com"
- studentid: "STU123456"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 10: Failed Update - Empty Student ID
**Description:** Update profile with empty student ID
**Inputs:** 
- fullname: "Test User"
- email: "user@example.com"
- studentid: ""
- authenticated session
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 11: Failed Update - Without Authentication
**Description:** Update profile without authentication
**Inputs:** 
- fullname: "Test User"
- email: "user@example.com"
- studentid: "STU123456"
- no session
**Expected Output:** HTTP 401 Unauthorized, authentication required
**Test Result:** PASSED

### Test Case 12: Failed Update - Very Long Input
**Description:** Update profile with extremely long input fields
**Inputs:** 
- fullname: "Very long name" (100+ characters)
- email: "user@example.com"
- studentid: "STU123456"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

## POST /profile/change-password

### Test Case 13: Change Password Successfully
**Description:** User changes their password successfully
**Inputs:** 
- currentPassword: "oldpassword123"
- newPassword: "newpassword123"
- confirmPassword: "newpassword123"
- authenticated session
**Expected Output:** HTTP 200 OK, password changed successfully
**Test Result:** PASSED

### Test Case 14: Failed Password Change - Wrong Current Password
**Description:** User provides wrong current password
**Inputs:** 
- currentPassword: "wrongpassword"
- newPassword: "newpassword123"
- confirmPassword: "newpassword123"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, "Current password is incorrect"
**Test Result:** PASSED

### Test Case 15: Failed Password Change - Passwords Don't Match
**Description:** New password and confirm password don't match
**Inputs:** 
- currentPassword: "oldpassword123"
- newPassword: "newpassword123"
- confirmPassword: "differentpassword"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, "Passwords do not match"
**Test Result:** PASSED

### Test Case 16: Failed Password Change - Empty Current Password
**Description:** User provides empty current password
**Inputs:** 
- currentPassword: ""
- newPassword: "newpassword123"
- confirmPassword: "newpassword123"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 17: Failed Password Change - Empty New Password
**Description:** User provides empty new password
**Inputs:** 
- currentPassword: "oldpassword123"
- newPassword: ""
- confirmPassword: ""
- authenticated session
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 18: Failed Password Change - Weak New Password
**Description:** User provides weak new password
**Inputs:** 
- currentPassword: "oldpassword123"
- newPassword: "123"
- confirmPassword: "123"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, "Password too weak"
**Test Result:** PASSED

### Test Case 19: Failed Password Change - Same as Current Password
**Description:** User tries to set new password same as current
**Inputs:** 
- currentPassword: "oldpassword123"
- newPassword: "oldpassword123"
- confirmPassword: "oldpassword123"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, "New password must be different"
**Test Result:** PASSED

### Test Case 20: Failed Password Change - Without Authentication
**Description:** Change password without authentication
**Inputs:** 
- currentPassword: "oldpassword123"
- newPassword: "newpassword123"
- confirmPassword: "newpassword123"
- no session
**Expected Output:** HTTP 401 Unauthorized, authentication required
**Test Result:** PASSED

## GET /profile/delete-account

### Test Case 21: Access Delete Account Page
**Description:** User accesses delete account confirmation page
**Inputs:** Authenticated session
**Expected Output:** HTTP 200 OK, rendered delete account confirmation view
**Test Result:** PASSED

### Test Case 22: Access Delete Account Without Authentication
**Description:** Attempt to access delete account page without login
**Inputs:** No session
**Expected Output:** HTTP 302 Redirect to /login
**Test Result:** PASSED

## POST /profile/delete-account

### Test Case 23: Delete Account Successfully
**Description:** User deletes their account successfully
**Inputs:** 
- confirmPassword: "userpassword123"
- authenticated session
**Expected Output:** HTTP 200 OK, account deleted, session destroyed, redirect to login
**Test Result:** PASSED

### Test Case 24: Failed Account Deletion - Wrong Password
**Description:** User provides wrong password for account deletion
**Inputs:** 
- confirmPassword: "wrongpassword"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, "Password is incorrect"
**Test Result:** PASSED

### Test Case 25: Failed Account Deletion - Empty Password
**Description:** User provides empty password for account deletion
**Inputs:** 
- confirmPassword: ""
- authenticated session
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 26: Failed Account Deletion - Without Authentication
**Description:** Delete account without authentication
**Inputs:** 
- confirmPassword: "userpassword123"
- no session
**Expected Output:** HTTP 401 Unauthorized, authentication required
**Test Result:** PASSED

## Error Handling

### Test Case 27: Database Connection Error
**Description:** Handle database connection failures gracefully
**Inputs:** Database unavailable
**Expected Output:** HTTP 500 Internal Server Error, appropriate error message
**Test Result:** PASSED

### Test Case 28: Malformed JSON Request
**Description:** Handle malformed JSON in request body
**Inputs:** Invalid JSON string
**Expected Output:** HTTP 400 Bad Request, JSON parsing error
**Test Result:** PASSED

### Test Case 29: Session Expired
**Description:** Handle expired session gracefully
**Inputs:** Expired session
**Expected Output:** HTTP 401 Unauthorized, redirect to login
**Test Result:** PASSED

### Test Case 30: User Not Found
**Description:** Handle case where user no longer exists in database
**Inputs:** Valid session but user deleted from database
**Expected Output:** HTTP 404 Not Found or redirect to login
**Test Result:** PASSED 