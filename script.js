// في القسم الأخير من HTML
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
        
        // اختبار الاتصال بدون كتابة (تجنب مشكلة الأذونات)
        db.collection('portfolio').doc('test').get()
            .then(() => console.log("✅ Firestore connection test passed"))
            .catch(err => console.log("⚠️ Firestore connection test (read only):", err.message));
        
    } catch (error) {
        console.log("⚠️ Firebase initialization error:", error.message);
    }
</script>
