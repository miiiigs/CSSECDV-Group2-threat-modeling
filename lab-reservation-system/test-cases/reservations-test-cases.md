# Test Cases for reservations.js Routes

## GET /reservation

### Test Case 1: Access Reservation Page - Student
**Description:** Student accesses reservation page
**Inputs:** Authenticated student session
**Expected Output:** HTTP 200 OK, rendered reservation view
**Test Result:** PASSED

### Test Case 2: Access Reservation Page - LabTech
**Description:** LabTech accesses reservation page
**Inputs:** Authenticated LabTech session
**Expected Output:** HTTP 200 OK, rendered reservation view
**Test Result:** PASSED

### Test Case 3: Access Without Authentication
**Description:** Attempt to access reservation page without login
**Inputs:** No session
**Expected Output:** HTTP 302 Redirect to /login
**Test Result:** PASSED

## GET /view_reservation

### Test Case 4: View All Reservations
**Description:** View all reservations without search parameters
**Inputs:** Authenticated session, no query parameters
**Expected Output:** HTTP 200 OK, rendered view_reservation with all reservations
**Test Result:** PASSED

### Test Case 5: Search Reservations by Username
**Description:** Search reservations by username
**Inputs:** 
- username: "john"
- lab: ""
- pcno: ""
**Expected Output:** HTTP 200 OK, rendered view_reservation with filtered results
**Test Result:** PASSED

### Test Case 6: Search Reservations by Lab
**Description:** Search reservations by lab number
**Inputs:** 
- username: ""
- lab: "1"
- pcno: ""
**Expected Output:** HTTP 200 OK, rendered view_reservation with filtered results
**Test Result:** PASSED

### Test Case 7: Search Reservations by PC Number
**Description:** Search reservations by PC number
**Inputs:** 
- username: ""
- lab: ""
- pcno: "PC01"
**Expected Output:** HTTP 200 OK, rendered view_reservation with filtered results
**Test Result:** PASSED

### Test Case 8: Search with Multiple Parameters
**Description:** Search with multiple search parameters
**Inputs:** 
- username: "john"
- lab: "1"
- pcno: "PC01"
**Expected Output:** HTTP 200 OK, rendered view_reservation with filtered results
**Test Result:** PASSED

### Test Case 9: Search with No Results
**Description:** Search that returns no matching reservations
**Inputs:** 
- username: "nonexistent"
- lab: ""
- pcno: ""
**Expected Output:** HTTP 200 OK, rendered view_reservation with empty results
**Test Result:** PASSED

### Test Case 10: Search with Special Characters
**Description:** Search with special characters in parameters
**Inputs:** 
- username: "user@123"
- lab: "1"
- pcno: "PC-01"
**Expected Output:** HTTP 200 OK, rendered view_reservation with filtered results
**Test Result:** PASSED

## POST /api/reservations

### Test Case 11: Create Valid Reservation
**Description:** Create a new reservation with valid data
**Inputs:** 
- labNumber: "1"
- seatNumbers: ["PC01", "PC02"]
- date: "2024-01-15"
- startTime: "09:00"
- endTime: "11:00"
- userId: "user123"
**Expected Output:** HTTP 201 Created, reservation created successfully
**Test Result:** PASSED

### Test Case 12: Create Reservation with Single Seat
**Description:** Create reservation with single seat
**Inputs:** 
- labNumber: "2"
- seatNumbers: ["PC05"]
- date: "2024-01-15"
- startTime: "14:00"
- endTime: "16:00"
- userId: "user456"
**Expected Output:** HTTP 201 Created, reservation created successfully
**Test Result:** PASSED

### Test Case 13: Failed Reservation - Missing Required Fields
**Description:** Create reservation with missing required fields
**Inputs:** 
- labNumber: "1"
- date: "2024-01-15"
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 14: Failed Reservation - Invalid Date
**Description:** Create reservation with invalid date format
**Inputs:** 
- labNumber: "1"
- seatNumbers: ["PC01"]
- date: "invalid-date"
- startTime: "09:00"
- endTime: "11:00"
- userId: "user123"
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 15: Failed Reservation - Invalid Time
**Description:** Create reservation with invalid time format
**Inputs:** 
- labNumber: "1"
- seatNumbers: ["PC01"]
- date: "2024-01-15"
- startTime: "25:00"
- endTime: "26:00"
- userId: "user123"
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 16: Failed Reservation - End Time Before Start Time
**Description:** Create reservation with end time before start time
**Inputs:** 
- labNumber: "1"
- seatNumbers: ["PC01"]
- date: "2024-01-15"
- startTime: "14:00"
- endTime: "13:00"
- userId: "user123"
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 17: Failed Reservation - Past Date
**Description:** Create reservation for past date
**Inputs:** 
- labNumber: "1"
- seatNumbers: ["PC01"]
- date: "2020-01-15"
- startTime: "09:00"
- endTime: "11:00"
- userId: "user123"
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

## GET /api/reservations/available

### Test Case 18: Get Available Seats - No Conflicts
**Description:** Get available seats when no conflicts exist
**Inputs:** 
- labNumber: "1"
- date: "2024-01-15"
- startTime: "09:00"
- endTime: "11:00"
**Expected Output:** HTTP 200 OK, all seats available
**Test Result:** PASSED

### Test Case 19: Get Available Seats - With Conflicts
**Description:** Get available seats when some seats are reserved
**Inputs:** 
- labNumber: "1"
- date: "2024-01-15"
- startTime: "09:00"
- endTime: "11:00"
**Expected Output:** HTTP 200 OK, filtered available seats and reserved seats map
**Test Result:** PASSED

### Test Case 20: Get Available Seats - All Reserved
**Description:** Get available seats when all seats are reserved
**Inputs:** 
- labNumber: "1"
- date: "2024-01-15"
- startTime: "09:00"
- endTime: "11:00"
**Expected Output:** HTTP 200 OK, empty available seats array
**Test Result:** PASSED

### Test Case 21: Get Available Seats - Missing Parameters
**Description:** Get available seats with missing parameters
**Inputs:** 
- labNumber: "1"
- date: "2024-01-15"
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 22: Get Available Seats - Invalid Lab Number
**Description:** Get available seats with invalid lab number
**Inputs:** 
- labNumber: "999"
- date: "2024-01-15"
- startTime: "09:00"
- endTime: "11:00"
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

## DELETE /api/reservations/:id

### Test Case 23: Delete Own Reservation
**Description:** User deletes their own reservation
**Inputs:** 
- reservationId: "reservation123"
- authenticated user session
**Expected Output:** HTTP 200 OK, reservation deleted successfully
**Test Result:** PASSED

### Test Case 24: Delete Reservation as LabTech
**Description:** LabTech deletes any reservation
**Inputs:** 
- reservationId: "reservation123"
- authenticated LabTech session
**Expected Output:** HTTP 200 OK, reservation deleted successfully
**Test Result:** PASSED

### Test Case 25: Failed Delete - Not Owner
**Description:** User tries to delete another user's reservation
**Inputs:** 
- reservationId: "reservation123"
- authenticated user session (different user)
**Expected Output:** HTTP 403 Forbidden, access denied
**Test Result:** PASSED

### Test Case 26: Failed Delete - Non-existent Reservation
**Description:** Delete non-existent reservation
**Inputs:** 
- reservationId: "nonexistent"
- authenticated session
**Expected Output:** HTTP 404 Not Found, reservation not found
**Test Result:** PASSED

### Test Case 27: Failed Delete - Invalid ID Format
**Description:** Delete with invalid reservation ID format
**Inputs:** 
- reservationId: "invalid-id"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, invalid ID format
**Test Result:** PASSED

### Test Case 28: Failed Delete - Without Authentication
**Description:** Delete reservation without authentication
**Inputs:** 
- reservationId: "reservation123"
- no session
**Expected Output:** HTTP 401 Unauthorized, authentication required
**Test Result:** PASSED

## Error Handling

### Test Case 29: Database Connection Error
**Description:** Handle database connection failures gracefully
**Inputs:** Database unavailable
**Expected Output:** HTTP 500 Internal Server Error, appropriate error message
**Test Result:** PASSED

### Test Case 30: Malformed JSON Request
**Description:** Handle malformed JSON in request body
**Inputs:** Invalid JSON string
**Expected Output:** HTTP 400 Bad Request, JSON parsing error
**Test Result:** PASSED

### Test Case 31: Very Long Input Fields
**Description:** Handle extremely long input fields
**Inputs:** Very long strings in any field
**Expected Output:** HTTP 400 Bad Request, validation error
**Test Result:** PASSED

### Test Case 32: Concurrent Reservation Creation
**Description:** Handle concurrent reservation creation attempts
**Inputs:** Multiple simultaneous requests for same seat/time
**Expected Output:** HTTP 409 Conflict, seat already reserved
**Test Result:** PASSED 