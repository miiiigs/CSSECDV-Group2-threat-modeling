# Test Cases for upload.js Routes

## POST /upload

### Test Case 1: Upload Valid File
**Description:** Upload a valid file successfully
**Inputs:** 
- file: Valid file (e.g., .txt, .pdf, .doc)
- authenticated session
**Expected Output:** HTTP 200 OK, file uploaded successfully
**Test Result:** PASSED

### Test Case 2: Upload Multiple Files
**Description:** Upload multiple files in single request
**Inputs:** 
- files: Multiple valid files
- authenticated session
**Expected Output:** HTTP 200 OK, all files uploaded successfully
**Test Result:** PASSED

### Test Case 3: Upload Without Authentication
**Description:** Attempt to upload file without authentication
**Inputs:** 
- file: Valid file
- no session
**Expected Output:** HTTP 401 Unauthorized, authentication required
**Test Result:** PASSED

### Test Case 4: Upload Empty Request
**Description:** Upload request with no file
**Inputs:** 
- no file in request
- authenticated session
**Expected Output:** HTTP 400 Bad Request, "No file uploaded"
**Test Result:** PASSED

### Test Case 5: Upload Invalid File Type
**Description:** Upload file with invalid/unsupported file type
**Inputs:** 
- file: Invalid file type (e.g., .exe, .bat)
- authenticated session
**Expected Output:** HTTP 400 Bad Request, "Invalid file type"
**Test Result:** PASSED

### Test Case 6: Upload File Too Large
**Description:** Upload file that exceeds size limit
**Inputs:** 
- file: Large file (>10MB)
- authenticated session
**Expected Output:** HTTP 400 Bad Request, "File too large"
**Test Result:** PASSED

### Test Case 7: Upload Corrupted File
**Description:** Upload corrupted or invalid file
**Inputs:** 
- file: Corrupted file
- authenticated session
**Expected Output:** HTTP 400 Bad Request, "Invalid file"
**Test Result:** PASSED

### Test Case 8: Upload with Special Characters in Filename
**Description:** Upload file with special characters in filename
**Inputs:** 
- file: "file@#$%^&*().txt"
- authenticated session
**Expected Output:** HTTP 200 OK, file uploaded with sanitized filename
**Test Result:** PASSED

### Test Case 9: Upload with Spaces in Filename
**Description:** Upload file with spaces in filename
**Inputs:** 
- file: "my file name.txt"
- authenticated session
**Expected Output:** HTTP 200 OK, file uploaded with sanitized filename
**Test Result:** PASSED

### Test Case 10: Upload with Very Long Filename
**Description:** Upload file with extremely long filename
**Inputs:** 
- file: "verylongfilename" (100+ characters)
- authenticated session
**Expected Output:** HTTP 200 OK, file uploaded with truncated filename
**Test Result:** PASSED

## GET /uploads

### Test Case 11: List Uploaded Files - Authenticated User
**Description:** List user's uploaded files
**Inputs:** Authenticated session
**Expected Output:** HTTP 200 OK, list of user's uploaded files
**Test Result:** PASSED

### Test Case 12: List Uploaded Files - Student User
**Description:** Student user lists their uploaded files
**Inputs:** Authenticated student session
**Expected Output:** HTTP 200 OK, list of student's uploaded files
**Test Result:** PASSED

### Test Case 13: List Uploaded Files - LabTech User
**Description:** LabTech user lists their uploaded files
**Inputs:** Authenticated LabTech session
**Expected Output:** HTTP 200 OK, list of LabTech's uploaded files
**Test Result:** PASSED

### Test Case 14: List Uploaded Files - No Files
**Description:** List uploaded files when user has no files
**Inputs:** Authenticated session, no uploaded files
**Expected Output:** HTTP 200 OK, empty list
**Test Result:** PASSED

### Test Case 15: List Uploaded Files - Without Authentication
**Description:** Attempt to list files without authentication
**Inputs:** No session
**Expected Output:** HTTP 401 Unauthorized, authentication required
**Test Result:** PASSED

## GET /uploads/:filename

### Test Case 16: Download Own File
**Description:** User downloads their own uploaded file
**Inputs:** 
- filename: "userfile.txt"
- authenticated session (file owner)
**Expected Output:** HTTP 200 OK, file download
**Test Result:** PASSED

### Test Case 17: Download File as LabTech
**Description:** LabTech downloads any user's file
**Inputs:** 
- filename: "userfile.txt"
- authenticated LabTech session
**Expected Output:** HTTP 200 OK, file download
**Test Result:** PASSED

### Test Case 18: Failed Download - Not Owner
**Description:** User tries to download another user's file
**Inputs:** 
- filename: "otheruserfile.txt"
- authenticated session (different user)
**Expected Output:** HTTP 403 Forbidden, access denied
**Test Result:** PASSED

### Test Case 19: Failed Download - File Not Found
**Description:** Download non-existent file
**Inputs:** 
- filename: "nonexistent.txt"
- authenticated session
**Expected Output:** HTTP 404 Not Found, file not found
**Test Result:** PASSED

### Test Case 20: Failed Download - Without Authentication
**Description:** Download file without authentication
**Inputs:** 
- filename: "userfile.txt"
- no session
**Expected Output:** HTTP 401 Unauthorized, authentication required
**Test Result:** PASSED

### Test Case 21: Failed Download - Invalid Filename
**Description:** Download with invalid filename
**Inputs:** 
- filename: "../../../etc/passwd"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, invalid filename
**Test Result:** PASSED

## DELETE /uploads/:filename

### Test Case 22: Delete Own File
**Description:** User deletes their own uploaded file
**Inputs:** 
- filename: "userfile.txt"
- authenticated session (file owner)
**Expected Output:** HTTP 200 OK, file deleted successfully
**Test Result:** PASSED

### Test Case 23: Delete File as LabTech
**Description:** LabTech deletes any user's file
**Inputs:** 
- filename: "userfile.txt"
- authenticated LabTech session
**Expected Output:** HTTP 200 OK, file deleted successfully
**Test Result:** PASSED

### Test Case 24: Failed Delete - Not Owner
**Description:** User tries to delete another user's file
**Inputs:** 
- filename: "otheruserfile.txt"
- authenticated session (different user)
**Expected Output:** HTTP 403 Forbidden, access denied
**Test Result:** PASSED

### Test Case 25: Failed Delete - File Not Found
**Description:** Delete non-existent file
**Inputs:** 
- filename: "nonexistent.txt"
- authenticated session
**Expected Output:** HTTP 404 Not Found, file not found
**Test Result:** PASSED

### Test Case 26: Failed Delete - Without Authentication
**Description:** Delete file without authentication
**Inputs:** 
- filename: "userfile.txt"
- no session
**Expected Output:** HTTP 401 Unauthorized, authentication required
**Test Result:** PASSED

### Test Case 27: Failed Delete - Invalid Filename
**Description:** Delete with invalid filename
**Inputs:** 
- filename: "../../../etc/passwd"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, invalid filename
**Test Result:** PASSED

## Error Handling

### Test Case 28: Storage Directory Full
**Description:** Handle storage directory full error
**Inputs:** No disk space available
**Expected Output:** HTTP 500 Internal Server Error, "Storage full"
**Test Result:** PASSED

### Test Case 29: File System Error
**Description:** Handle file system errors
**Inputs:** File system unavailable or corrupted
**Expected Output:** HTTP 500 Internal Server Error, appropriate error message
**Test Result:** PASSED

### Test Case 30: Malformed Request
**Description:** Handle malformed upload request
**Inputs:** Invalid multipart form data
**Expected Output:** HTTP 400 Bad Request, "Invalid request"
**Test Result:** PASSED

### Test Case 31: Concurrent Upload
**Description:** Handle concurrent uploads of same filename
**Inputs:** Multiple simultaneous uploads with same filename
**Expected Output:** HTTP 409 Conflict or unique filename generation
**Test Result:** PASSED

## Security

### Test Case 32: Path Traversal Attack
**Description:** Prevent path traversal attacks
**Inputs:** 
- filename: "../../../etc/passwd"
- authenticated session
**Expected Output:** HTTP 400 Bad Request, "Invalid filename"
**Test Result:** PASSED

### Test Case 33: XSS in Filename
**Description:** Prevent XSS attacks in filename
**Inputs:** 
- filename: "<script>alert('xss')</script>.txt"
- authenticated session
**Expected Output:** HTTP 200 OK, sanitized filename
**Test Result:** PASSED

### Test Case 34: File Type Validation
**Description:** Validate file types properly
**Inputs:** 
- file: File with wrong extension
- authenticated session
**Expected Output:** HTTP 400 Bad Request, "Invalid file type"
**Test Result:** PASSED

### Test Case 35: File Content Validation
**Description:** Validate file content matches extension
**Inputs:** 
- file: .txt file with executable content
- authenticated session
**Expected Output:** HTTP 400 Bad Request, "Invalid file content"
**Test Result:** PASSED

## Performance

### Test Case 36: Large File Upload
**Description:** Handle large file uploads efficiently
**Inputs:** 
- file: Large file (5-10MB)
- authenticated session
**Expected Output:** HTTP 200 OK, file uploaded successfully
**Test Result:** PASSED

### Test Case 37: Multiple Concurrent Uploads
**Description:** Handle multiple concurrent uploads
**Inputs:** Multiple simultaneous upload requests
**Expected Output:** All uploads processed correctly
**Test Result:** PASSED

### Test Case 38: Upload Rate Limiting
**Description:** Implement upload rate limiting
**Inputs:** Rapid successive upload requests
**Expected Output:** Rate limiting applied appropriately
**Test Result:** PASSED 