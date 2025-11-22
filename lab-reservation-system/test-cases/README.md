# Test Cases Documentation

This directory contains comprehensive test case documentation for all routes in the Lab Reservation System.

## 📁 Test Case Files

### 🔐 Authentication Routes (`auth-test-cases.md`)
- **File:** `auth-test-cases.md`
- **Routes Covered:** 
  - `POST /api/login` (21 test cases)
  - `POST /register` (11 test cases) 
  - `GET /logout` (2 test cases)
  - Edge cases and error handling (4 test cases)
- **Total Test Cases:** 38

### 👨‍💼 Admin Routes (`admin-test-cases.md`)
- **File:** `admin-test-cases.md`
- **Routes Covered:**
  - `GET /admin/search` (7 test cases)
  - `GET /admin/delete-user` (7 test cases)
  - Authentication and authorization (3 test cases)
  - Error handling (3 test cases)
- **Total Test Cases:** 20

### 📅 Reservation Routes (`reservations-test-cases.md`)
- **File:** `reservations-test-cases.md`
- **Routes Covered:**
  - `GET /reservation` (3 test cases)
  - `GET /view_reservation` (7 test cases)
  - `POST /api/reservations` (7 test cases)
  - `GET /api/reservations/available` (5 test cases)
  - `DELETE /api/reservations/:id` (6 test cases)
  - Error handling (4 test cases)
- **Total Test Cases:** 32

### 👤 Profile Routes (`profile-test-cases.md`)
- **File:** `profile-test-cases.md`
- **Routes Covered:**
  - `GET /profile` (3 test cases)
  - `POST /profile/update` (9 test cases)
  - `POST /profile/change-password` (8 test cases)
  - `GET /profile/delete-account` (2 test cases)
  - `POST /profile/delete-account` (4 test cases)
  - Error handling (4 test cases)
- **Total Test Cases:** 30

### 📄 Page Routes (`pages-test-cases.md`)
- **File:** `pages-test-cases.md`
- **Routes Covered:**
  - `GET /` (4 test cases)
  - `GET /login` (4 test cases)
  - `GET /register` (4 test cases)
  - `GET /dashboard` (4 test cases)
  - `GET /about` (4 test cases)
  - `GET /contact` (4 test cases)
  - `GET /help` (4 test cases)
  - Error handling (4 test cases)
  - Performance and security (4 test cases)
- **Total Test Cases:** 36

### 📁 Upload Routes (`upload-test-cases.md`)
- **File:** `upload-test-cases.md`
- **Routes Covered:**
  - `POST /upload` (10 test cases)
  - `GET /uploads` (5 test cases)
  - `GET /uploads/:filename` (6 test cases)
  - `DELETE /uploads/:filename` (6 test cases)
  - Error handling (4 test cases)
  - Security (4 test cases)
  - Performance (3 test cases)
- **Total Test Cases:** 38

## 📊 Summary

| Route Category | Test Cases | File |
|---------------|------------|------|
| Authentication | 38 | `auth-test-cases.md` |
| Admin | 20 | `admin-test-cases.md` |
| Reservations | 32 | `reservations-test-cases.md` |
| Profile | 30 | `profile-test-cases.md` |
| Pages | 36 | `pages-test-cases.md` |
| Upload | 38 | `upload-test-cases.md` |
| **TOTAL** | **194** | **6 files** |

## 🎯 Test Case Categories

Each test case file includes the following categories:

### ✅ **Happy Path Tests**
- Successful operations with valid inputs
- Proper authentication and authorization
- Expected responses and redirects

### ❌ **Error Handling Tests**
- Invalid inputs and edge cases
- Missing required fields
- Authentication failures
- Authorization failures

### 🔒 **Security Tests**
- Authentication requirements
- Authorization checks
- Input validation
- XSS and CSRF protection
- Path traversal prevention

### ⚡ **Performance Tests**
- Concurrent requests
- Large file handling
- Rate limiting
- Database connection errors

### 🛡️ **Edge Cases**
- Very long inputs
- Special characters
- Malformed data
- Database errors
- Session handling

## 📝 Test Case Format

Each test case follows this format:

```markdown
### Test Case X: [Test Name]
**Description:** Brief description of what is being tested
**Inputs:** 
- parameter1: "value1"
- parameter2: "value2"
**Expected Output:** HTTP status code and expected response
**Test Result:** PASSED/FAILED
```

## 🚀 Usage

These test case files can be used for:

1. **Manual Testing:** Follow the test cases step by step
2. **Automated Testing:** Convert to automated test scripts
3. **Documentation:** Reference for API behavior
4. **Quality Assurance:** Ensure all scenarios are covered
5. **Development:** Guide for implementing new features

## 🔄 Maintenance

- Update test cases when routes change
- Add new test cases for new features
- Mark test results as PASSED/FAILED after testing
- Review and update edge cases regularly

---

**Last Updated:** January 2024  
**Total Test Cases:** 194  
**Coverage:** All major routes and edge cases 