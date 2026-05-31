# 🚀 LOCALI EGYPT LOCAL XAMPP - QUICK REFERENCE

## 3-Step Setup (Takes 5 minutes)

### 1️⃣ XAMPP MySQL - Import Database
```
A. Start XAMPP (Apache + MySQL)
B. Open: http://localhost/phpmyadmin
C. Import: locali_xampp_setup.sql
D. Done! Database is ready
```

### 2️⃣ PHP API - Copy Router File
```
A. Copy: /f/شغل/locali/xampp_api_setup.php
B. Paste to: C:\xampp\htdocs\locali-api\api.php
C. Test: http://localhost/locali-api/api.php
D. Done! API is ready
```

### 3️⃣ React Dev Server
```bash
npm run dev
# Opens: http://localhost:5173
# Logs in with: admin@locali.eg / admin
```

---

## 📍 Important Paths

| Component | Location | Port |
|-----------|----------|------|
| React Vite | `http://localhost:5173` | 5173 |
| PHP API | `http://localhost/locali-api/api.php` | 80 |
| phpMyAdmin | `http://localhost/phpmyadmin` | 80 |
| MySQL | `localhost:3306` | 3306 |
| Database | `locali_egypt` | - |

---

## 🔑 Default Login
- **Email**: `admin@locali.eg`
- **Password**: `admin`
- **Role**: admin

---

## 📦 Files Updated/Created

### New Files
✅ `locali_xampp_setup.sql` - Complete 27-table database schema  
✅ `xampp_api_setup.php` → Copy to `C:\xampp\htdocs\locali-api\api.php`  
✅ `XAMPP_SETUP_GUIDE.md` - Full documentation  
✅ `.env.local` - Environment configuration  

### Updated Files
✅ `src/api/localApi.js` - Points to local PHP API  
✅ `src/lib/AuthContext.jsx` - Fixed authentication context  
✅ `src/components/ProtectedRoute.jsx` - Clean redirect logic  
✅ `src/components/AdminProtectedRoute.jsx` - Admin role check  

---

## 🔍 Verify Everything Works

### Test 1: Database Connected
```
phpMyAdmin → Select locali_egypt → See 27 tables
```

### Test 2: PHP API Responding
```
Browser: http://localhost/locali-api/api.php
Response: {"error":"Endpoint not found"}  ← This is correct!
```

### Test 3: Frontend Loads
```
Browser: http://localhost:5173
See: Login page
```

### Test 4: Login Works
```
Email: admin@locali.eg
Password: admin
Result: Redirects to dashboard (no network errors!)
```

---

## 🐛 Troubleshooting

### Login shows "Network Error"
1. Check XAMPP MySQL is running (green icon)
2. Check XAMPP Apache is running (green icon)
3. Verify file: `C:\xampp\htdocs\locali-api\api.php` exists
4. Browser console (F12) shows actual error URL

### Page shows blank/white instead of redirecting
1. Old auth guard issue (fixed in new files)
2. Clear browser cache: Ctrl+Shift+Delete
3. Hard refresh: Ctrl+F5
4. Clear localStorage: Open DevTools → Application → localStorage → clear

### "Access-Control-Allow-Origin" error
1. Vite must run on http://localhost:5173 (not 127.0.0.1)
2. PHP API has CORS enabled for localhost:5173
3. Restart both servers if changed

### MySQL connection error
1. Username: `root`
2. Password: (leave blank)
3. Host: `localhost`
4. Port: `3306`

---

## 🎯 Architecture Summary

```
React (5173)
    ↓ axios HTTP
PHP API (80)
    ↓ PDO queries
MySQL (3306)
    ↓ SQL
Database Tables (27)
```

**No external servers. All local. No API key needed.**

---

## 🚀 Common Operations

### Add New User (via phpMyAdmin)
```sql
INSERT INTO users (name, email, password_hash, role, phone, city, is_active)
VALUES ('Test User', 'test@locali.eg', '$2a$10$...', 'traveler', '+20 100 1234567', 'luxor', 1);
```

### List Services in City
```
GET http://localhost/locali-api/api.php/services?city=hurghada&limit=10
```

### Report Scam (requires login)
```bash
curl -X POST http://localhost/locali-api/api.php/scam-reports \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Taxi scam","city":"sharm-el-sheikh","severity":"moderate"}'
```

---

## ✅ Everything Fixed

| Issue | Status | Solution |
|-------|--------|----------|
| Network Error on Login | ✅ Fixed | API points to localhost PHP |
| White page on redirect | ✅ Fixed | ProtectedRoute uses Navigate |
| Auth context missing | ✅ Fixed | Created new AuthContext |
| External server needed | ✅ Fixed | All local XAMPP |
| Broken admin guard | ✅ Fixed | Proper role verification |
| CORS issues | ✅ Fixed | Headers enabled in PHP |
| No database | ✅ Fixed | 27-table schema created |
| Missing auth state | ✅ Fixed | localStorage + context |

---

## 📞 Support
All 27 tables working. All auth flow fixed. Ready for development.

**You can now develop locally without any external dependencies.** ✨
