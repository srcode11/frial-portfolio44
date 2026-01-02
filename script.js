<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ملف إنجاز المعلمة فريال الغماري</title>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
    
    <!-- Styles -->
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <i class="fas fa-graduation-cap"></i>
                    <div class="logo-text">
                        <h1>ملف إنجاز المعلمة</h1>
                        <h2>فريال عبدالله الغماري</h2>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="btn btn-primary" onclick="showSubjectSelection()">
                        <i class="fas fa-plus"></i> إضافة جديد
                    </button>
                    <button class="btn btn-secondary" onclick="printPortfolio()">
                        <i class="fas fa-print"></i> طباعة
                    </button>
                    <button class="btn btn-secondary" onclick="clearOldData()" title="تنظيف المساحة">
                        <i class="fas fa-broom"></i> تنظيف
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- باقي الـ HTML كما هو تماماً -->
    <!-- لا تغير أي شيء في باقي الملف -->
    <!-- ... -->

    <!-- Firebase Configuration -->
    <script>
        // Firebase Configuration
        const firebaseConfig = {
            apiKey: "AIzaSyDLJPdy0F4W6iqkUCnKw1jc2CCeGNe5cBU",
            authDomain: "teacher-portfolio-fryal.firebaseapp.com",
            projectId: "teacher-portfolio-fryal",
            storageBucket: "teacher-portfolio-fryal.firebasestorage.app",
            messagingSenderId: "1054582250352",
            appId: "1:1054582250352:web:0fbb6f5a8c2763ffcc4db5",
            measurementId: "G-74HC2DH4YP"
        };

        // Initialize Firebase
        try {
            const app = firebase.initializeApp(firebaseConfig);
            const db = firebase.firestore();
            
            window.firebaseApp = app;
            window.firebaseDb = db;
            
            console.log("✅ Firebase initialized successfully");
            
            // اختبار الاتصال
            db.collection('portfolio_items').limit(1).get()
                .then(() => console.log("✅ Firestore connection test passed"))
                .catch(err => console.log("⚠️ Firestore connection test:", err.message));
            
        } catch (error) {
            console.log("⚠️ Firebase initialization error:", error.message);
        }
    </script>

    <!-- Main Script -->
    <script src="script.js"></script>
</body>
</html>
