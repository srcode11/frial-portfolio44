// ==============================================
// نظام ملف الإنجاز الرقمي للمعلمة فريال الغماري
// ==============================================

console.log('🎓 نظام ملف الإنجاز - جاري التحميل...');

// ===== المتغيرات العالمية =====
let portfolioData = {
    arabic: [],
    english: [],
    quran: [],
    math: [],
    science: [],
    activities: []
};

let isAdmin = true; // اجعله true دائماً للإضافة
let currentTab = 'dashboard';
let currentUser = null;
let firebaseInitialized = false;

// صور لكل قسم (يتم تحميلها تلقائياً)
const sectionImages = {
    arabic: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h-200&fit=crop&auto=format',
    english: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=200&fit=crop&auto=format',
    quran: 'https://images.unsplash.com/photo-1519730722595-a5d4d8e99e48?w=400&h=200&fit=crop&auto=format',
    math: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop&auto=format',
    science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=200&fit=crop&auto=format',
    activities: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=200&fit=crop&auto=format'
};

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 بدء تهيئة التطبيق...');
    
    try {
        // 1. إعداد واجهة المستخدم
        setupUI();
        
        // 2. تهيئة Firebase (بشكل غير متزامن)
        setTimeout(initFirebase, 1000);
        
        // 3. تحميل البيانات من التخزين المحلي أولاً
        loadLocalData();
        
        // 4. تحديث الواجهة
        updateUI();
        
        // 5. إظهار شعارات الأقسام
        updateSectionImages();
        
        console.log('✅ التطبيق جاهز للاستخدام!');
        showToast('مرحباً بك في ملف إنجاز المعلمة فريال الغماري', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة التطبيق:', error);
        showToast('حدث خطأ في تحميل التطبيق', 'error');
    }
});

// ===== إعداد واجهة المستخدم =====
function setupUI() {
    console.log('🔧 جاري إعداد واجهة المستخدم...');
    
    // إعداد القائمة الجانبية
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
            
            // إغلاق القائمة الجانبية على الأجهزة الصغيرة
            if (window.innerWidth < 1200) {
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    });
    
    // زر فتح/إغلاق القائمة الجانبية
    const menuToggle = document.getElementById('menuToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    }
    
    // زر تبديل الوضع
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // زر ملء الشاشة
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // إعداد Form الإضافة
    const addForm = document.getElementById('addForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveItem();
        });
    }
    
    // زر الطباعة
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('طباعة')) {
            btn.addEventListener('click', showPrintModal);
        }
    });
    
    console.log('✅ تم إعداد واجهة المستخدم');
}

// ===== تهيئة Firebase =====
async function initFirebase() {
    console.log('🔥 جاري تهيئة Firebase...');
    
    try {
        // التحقق من وجود Firebase
        if (!window.firebase || !window.firebase.auth) {
            throw new Error('Firebase SDK غير متاح');
        }
        
        // تهيئة التطبيق
        if (!window.firebase.apps.length) {
            window.firebase.initializeApp({
                apiKey: "AIzaSyDLJPdy0F4W6iqkUCnKw1jc2CCeGNe5cBU",
                authDomain: "teacher-portfolio-fryal.firebaseapp.com",
                projectId: "teacher-portfolio-fryal",
                storageBucket: "teacher-portfolio-fryal.firebasestorage.app",
                messagingSenderId: "1054582250352",
                appId: "1:1054582250352:web:0fbb6f5a8c2763ffcc4db5",
                measurementId: "G-74HC2DH4YP"
            });
        }
        
        // محاولة تسجيل الدخول كضيف
        try {
            await window.firebase.auth().signInAnonymously();
        } catch (authError) {
            console.log('⚠️ تسجيل الدخول المجهول معطل، جاري استخدام بدون مصادقة');
        }
        
        // مستمع لحالة المستخدم
        window.firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                currentUser = user;
                firebaseInitialized = true;
                updateConnectionStatus('متصل بـ Firebase');
                console.log('👤 المستخدم:', user.uid);
                
                // تحميل البيانات من Firebase بعد الاتصال
                loadFirebaseData();
            } else {
                firebaseInitialized = true; // حتى بدون مصادقة
                updateConnectionStatus('متصل');
            }
        });
        
        console.log('✅ Firebase جاهز للاستخدام');
        
    } catch (error) {
        console.warn('⚠️ Firebase فشل، جاري استخدام التخزين المحلي:', error);
        firebaseInitialized = false;
        updateConnectionStatus('محلي فقط');
    }
}

// ===== تحميل البيانات من Firebase =====
async function loadFirebaseData() {
    try {
        const db = window.firebase.firestore();
        const docRef = db.collection('portfolio').doc('data');
        const docSnap = await docRef.get();
        
        if (docSnap.exists()) {
            const firebaseData = docSnap.data();
            
            // دمج البيانات (Firebase له الأولوية)
            Object.keys(firebaseData).forEach(subject => {
                if (portfolioData[subject]) {
                    // دمج العناصر، تجنب التكرار
                    const existingIds = new Set(portfolioData[subject].map(item => item.id));
                    firebaseData[subject].forEach(item => {
                        if (!existingIds.has(item.id)) {
                            portfolioData[subject].push(item);
                        }
                    });
                } else {
                    portfolioData[subject] = firebaseData[subject];
                }
            });
            
            console.log('✅ تم دمج البيانات من Firebase');
            updateUI();
            saveLocalData(); // حفظ نسخة محلية
            showToast('تم تحديث البيانات من السحابة', 'success');
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات من Firebase:', error);
    }
}

// ===== تحديث حالة الاتصال =====
function updateConnectionStatus(status) {
    const statusElement = document.getElementById('connectionStatus');
    if (statusElement) {
        statusElement.textContent = status;
        
        // تغيير اللون حسب الحالة
        if (status.includes('Firebase')) {
            statusElement.style.color = '#4cc9f0';
        } else {
            statusElement.style.color = '#f72585';
        }
    }
}

// ===== تحميل البيانات المحلية =====
function loadLocalData() {
    const saved = localStorage.getItem('teacherPortfolio');
    if (saved) {
        try {
            portfolioData = JSON.parse(saved);
            console.log('✅ تم تحميل البيانات من التخزين المحلي');
        } catch (e) {
            console.error('❌ خطأ في تحليل البيانات المحلية:', e);
            portfolioData = {
                arabic: [],
                english: [],
                quran: [],
                math: [],
                science: [],
                activities: []
            };
        }
    }
}

// ===== حفظ البيانات المحلية =====
function saveLocalData() {
    try {
        localStorage.setItem('teacherPortfolio', JSON.stringify(portfolioData));
        console.log('✅ تم حفظ البيانات محلياً');
    } catch (e) {
        console.error('❌ خطأ في حفظ البيانات المحلية:', e);
    }
}

// ===== حفظ البيانات إلى Firebase =====
async function saveToFirebase() {
    if (!firebaseInitialized || !window.firebase.firestore) return;
    
    try {
        const db = window.firebase.firestore();
        const docRef = db.collection('portfolio').doc('data');
        await docRef.set(portfolioData);
        console.log('✅ تم حفظ البيانات في Firebase');
    } catch (error) {
        console.error('❌ خطأ في حفظ البيانات في Firebase:', error);
    }
}

// ===== تبديل التبويبات =====
function switchTab(tabId) {
    console.log(`🔄 تبديل إلى: ${tabId}`);
    
    // إزالة النشط من جميع العناصر
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // إضافة النشط للعنصر المحدد
    const activeMenuItem = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    const activeContent = document.getElementById(tabId);
    if (activeContent) {
        activeContent.classList.add('active');
    }
    
    currentTab = tabId;
    
    // تحديث محتوى التبويب
    if (tabId === 'dashboard') {
        updateDashboard();
    } else if (tabId === 'fullPortfolio') {
        renderFullPortfolio();
    } else if (tabId === 'reports') {
        generateReports();
    } else if (tabId !== 'settings') {
        renderSection(tabId);
    }
    
    // تحديث العنوان
    updatePageTitle(tabId);
    
    // إضافة تأثير
    activeContent.style.animation = 'none';
    setTimeout(() => {
        activeContent.style.animation = 'slideUp 0.3s ease';
    }, 10);
}

// ===== تحديث عنوان الصفحة =====
function updatePageTitle(tab) {
    const titles = {
        dashboard: 'الرئيسية',
        fullPortfolio: 'الملف الكامل',
        arabic: 'اللغة العربية',
        english: 'اللغة الإنجليزية',
        quran: 'القرآن الكريم',
        math: 'الرياضيات',
        science: 'العلوم',
        activities: 'النشاطات',
        reports: 'التقارير',
        settings: 'الإعدادات'
    };
    
    const title = titles[tab] || 'ملف الإنجاز';
    document.title = `${title} - المعلمة فريال الغماري`;
}

// ===== تحديث الشاشة الرئيسية =====
function updateDashboard() {
    updateStats();
    updateRecentActivity();
    updateBadges();
}

// ===== تحديث الإحصائيات =====
function updateStats() {
    // حساب الإحصائيات
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.images ? item.images.length : 0), 0), 0);
    
    // العناصر هذا الشهر
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthItems = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.filter(item => {
            const itemDate = new Date(item.timestamp || Date.now());
            return itemDate.getMonth() === thisMonth && itemDate.getFullYear() === thisYear;
        }).length, 0);
    
    // معدل الإنجاز
    const completionRate = totalItems > 0 ? Math.min(100, Math.floor((totalItems / 100) * 100)) : 0;
    
    // تحديث DOM
    const totalItemsEl = document.getElementById('totalItems');
    const totalImagesEl = document.getElementById('totalImages');
    const thisMonthEl = document.getElementById('thisMonth');
    const completionRateEl = document.getElementById('completionRate');
    
    if (totalItemsEl) totalItemsEl.textContent = totalItems;
    if (totalImagesEl) totalImagesEl.textContent = totalImages;
    if (thisMonthEl) thisMonthEl.textContent = thisMonthItems;
    if (completionRateEl) completionRateEl.textContent = `${completionRate}%`;
}

// ===== تحديث الأنشطة الحديثة =====
function updateRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    // جمع جميع العناصر
    const allItems = [];
    Object.keys(portfolioData).forEach(subject => {
        portfolioData[subject].forEach(item => {
            allItems.push({
                ...item,
                subject: subject
            });
        });
    });
    
    // ترتيب حسب التاريخ (الأحدث أولاً)
    allItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // أخذ آخر 5 عناصر
    const recentItems = allItems.slice(0, 5);
    
    // مسح المحتوى القديم
    container.innerHTML = '';
    
    if (recentItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h3>لا توجد نشاطات حديثة</h3>
                <p>ابدأ بإضافة أول عنصر إلى ملف الإنجاز</p>
                <button class="btn-primary mt-20" onclick="showAddModal('arabic')">
                    <i class="fas fa-plus"></i>
                    إضافة أول عنصر
                </button>
            </div>
        `;
        return;
    }
    
    // إضافة العناصر مع الصور
    recentItems.forEach(item => {
        const activityItem = document.createElement('div');
        activityItem.className = 'recent-item';
        
        const icon = getSubjectIcon(item.subject);
        const title = item.letter || item.surah || item.concept || item.title || 'عنصر جديد';
        const subjectName = getSubjectName(item.subject);
        const time = item.date || formatDate(new Date(item.timestamp || Date.now()));
        const image = item.images && item.images[0] ? item.images[0] : sectionImages[item.subject];
        
        activityItem.innerHTML = `
            <div class="recent-icon" style="background: url('${image}') center/cover;">
                <i class="${icon}"></i>
            </div>
            <div class="recent-content">
                <h4>${title}</h4>
                <p>${subjectName}</p>
            </div>
            <div class="recent-time">${time}</div>
        `;
        
        container.appendChild(activityItem);
    });
}

// ===== تحديث الشارات =====
function updateBadges() {
    const badges = {
        arabic: 'arabicBadge',
        english: 'englishBadge',
        quran: 'quranBadge',
        math: 'mathBadge',
        science: 'scienceBadge',
        activities: 'activitiesBadge'
    };
    
    Object.keys(badges).forEach(subject => {
        const badgeElement = document.getElementById(badges[subject]);
        if (badgeElement) {
            const count = portfolioData[subject].length;
            badgeElement.textContent = count;
            badgeElement.style.display = count > 0 ? 'flex' : 'none';
        }
    });
    
    // تحديث شارة الملف الكامل
    const fullBadge = document.getElementById('fullPortfolioBadge');
    if (fullBadge) {
        const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
        fullBadge.textContent = totalItems;
        fullBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// ===== تحديث صور الأقسام =====
function updateSectionImages() {
    // تحديث صورة كل قسم في القائمة الجانبية
    document.querySelectorAll('.menu-item').forEach(item => {
        const subject = item.getAttribute('data-tab');
        if (sectionImages[subject]) {
            const icon = item.querySelector('i');
            if (icon) {
                // إضافة خلفية للعنصر
                item.style.background = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${sectionImages[subject]}') center/cover`;
                item.style.backgroundBlendMode = 'multiply';
                item.style.color = 'white';
                item.style.borderRadius = '8px';
                item.style.marginBottom = '8px';
            }
        }
    });
    
    // تحديث صور بطاقات الإجراءات السريعة
    document.querySelectorAll('.action-card').forEach(card => {
        const icon = card.querySelector('.action-icon');
        if (icon) {
            const subject = icon.querySelector('i').className.includes('font') ? 'arabic' :
                          icon.querySelector('i').className.includes('language') ? 'english' :
                          icon.querySelector('i').className.includes('book-quran') ? 'quran' :
                          icon.querySelector('i').className.includes('calculator') ? 'math' :
                          icon.querySelector('i').className.includes('flask') ? 'science' : 'activities';
            
            if (sectionImages[subject]) {
                icon.style.background = `linear-gradient(rgba(67,97,238,0.8), rgba(67,97,238,0.8)), url('${sectionImages[subject]}') center/cover`;
                icon.style.backgroundBlendMode = 'multiply';
            }
        }
    });
}

// ===== عرض نافذة الإضافة =====
function showAddModal(subject) {
    console.log(`➕ عرض نافذة إضافة لـ: ${subject}`);
    
    // تحديد العنوان المناسب
    const titles = {
        arabic: 'إضافة حرف عربي',
        english: 'إضافة كلمة إنجليزية',
        quran: 'إضافة سورة قرآنية',
        math: 'إضافة مفهوم رياضي',
        science: 'إضافة تجربة علمية',
        activities: 'إضافة نشاط مدرسي',
        quick: 'إضافة سريعة'
    };
    
    document.getElementById('modalTitle').textContent = titles[subject] || 'إضافة عنصر جديد';
    document.getElementById('modalSubject').value = subject;
    
    // إعادة تعيين النموذج
    document.getElementById('addForm').reset();
    document.getElementById('imagePreview1').innerHTML = `
        <i class="fas fa-camera"></i>
        <span>الصورة الأولى</span>
        <small>انقر لاختيار صورة</small>
    `;
    document.getElementById('imagePreview2').innerHTML = `
        <i class="fas fa-camera"></i>
        <span>الصورة الثانية</span>
        <small>انقر لاختيار صورة</small>
    `;
    
    // إظهار النافذة
    document.getElementById('addModal').style.display = 'flex';
}

// ===== إغلاق النافذة المنبثقة =====
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// ===== معاينة الصور قبل الرفع =====
function previewImage(input, previewId) {
    const file = input.files[0];
    if (!file) return;
    
    // التحقق من حجم الصورة (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
        showToast('حجم الصورة كبير جداً (الحد الأقصى 5MB)', 'error');
        input.value = '';
        return;
    }
    
    // التحقق من نوع الملف
    if (!file.type.match('image.*')) {
        showToast('الرجاء اختيار ملف صورة فقط', 'error');
        input.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`;
        preview.style.padding = '0';
    };
    reader.readAsDataURL(file);
}

// ===== حفظ العنصر =====
async function saveItem(event) {
    if (event) event.preventDefault();
    
    console.log('💾 جاري حفظ العنصر...');
    
    const subject = document.getElementById('modalSubject').value;
    const title = document.getElementById('itemTitle').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    
    // التحقق من البيانات
    if (!title) {
        showToast('الرجاء إدخال العنوان', 'error');
        return;
    }
    
    try {
        showToast('جارٍ حفظ العنصر...', 'info');
        
        // إنشاء كائن العنصر
        const item = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            date: new Date().toLocaleDateString('ar-SA'),
            title: title,
            description: description,
            images: []
        };
        
        // إضافة حقول إضافية حسب المادة
        if (subject === 'arabic' || subject === 'english') {
            item.letter = title;
        } else if (subject === 'quran') {
            item.surah = title;
        } else if (subject === 'math' || subject === 'science') {
            item.concept = title;
        }
        
        // التعامل مع رفع الصور
        const image1 = document.getElementById('imageFile1').files[0];
        const image2 = document.getElementById('imageFile2').files[0];
        
        if (image1) {
            const imageUrl = await uploadImage(image1, subject);
            if (imageUrl) item.images.push(imageUrl);
        }
        
        if (image2) {
            const imageUrl = await uploadImage(image2, subject);
            if (imageUrl) item.images.push(imageUrl);
        }
        
        // إذا لم توجد صور، أضف صورة القسم الافتراضية
        if (item.images.length === 0 && sectionImages[subject]) {
            item.images.push(sectionImages[subject]);
        }
        
        // إضافة إلى البيانات
        if (!portfolioData[subject]) portfolioData[subject] = [];
        portfolioData[subject].push(item);
        
        // حفظ البيانات
        saveLocalData();
        await saveToFirebase();
        
        // تحديث الواجهة
        updateUI();
        renderSection(subject);
        
        // إغلاق النافذة
        closeModal('addModal');
        
        showToast('تم إضافة العنصر بنجاح', 'success');
        
        // الانتقال للقسم المناسب
        if (subject !== 'quick') {
            switchTab(subject);
        }
        
    } catch (error) {
        console.error('❌ خطأ في حفظ العنصر:', error);
        showToast('خطأ في حفظ العنصر', 'error');
    }
}

// ===== رفع الصور =====
async function uploadImage(file, subject) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        
        try {
            // استخدم base64 إذا كان Firebase غير متاح
            if (!firebaseInitialized || !window.firebase.storage) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
                return;
            }
            
            // رفع إلى Firebase Storage
            const storage = window.firebase.storage();
            const fileName = `${Date.now()}_${subject}_${file.name}`;
            const storageRef = storage.ref(`portfolio-images/${fileName}`);
            
            const uploadTask = storageRef.put(file);
            
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`📤 رفع الصورة: ${progress.toFixed(1)}%`);
                },
                (error) => {
                    console.error('❌ خطأ في رفع الصورة:', error);
                    // إذا فشل الرفع، استخدم base64
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        resolve(e.target.result);
                    };
                    reader.readAsDataURL(file);
                },
                async () => {
                    try {
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                        resolve(downloadURL);
                    } catch (error) {
                        console.error('❌ خطأ في الحصول على رابط الصورة:', error);
                        reject(error);
                    }
                }
            );
            
        } catch (error) {
            console.error('❌ خطأ في عملية الرفع:', error);
            reject(error);
        }
    });
}

// ===== عرض القسم مع الصور =====
function renderSection(subject) {
    const container = document.getElementById(`${subject}Items`);
    if (!container) return;
    
    const items = portfolioData[subject] || [];
    
    // مسح المحتوى القديم
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="${getSubjectIcon(subject)}"></i>
                ${sectionImages[subject] ? `<img src="${sectionImages[subject]}" style="width:200px;height:150px;object-fit:cover;border-radius:12px;margin-bottom:20px;">` : ''}
                <h3>${getSubjectName(subject)}</h3>
                <p>لم يتم إضافة أي عناصر إلى هذا القسم بعد</p>
                <button class="btn-primary mt-20" onclick="showAddModal('${subject}')">
                    <i class="fas fa-plus"></i>
                    إضافة أول عنصر
                </button>
            </div>
        `;
        return;
    }
    
    // إضافة صورة القسم في الأعلى
    if (sectionImages[subject]) {
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header-image';
        sectionHeader.style.cssText = `
            width: 100%;
            height: 200px;
            background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${sectionImages[subject]}');
            background-size: cover;
            background-position: center;
            border-radius: 12px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
            position: relative;
        `;
        sectionHeader.innerHTML = `
            <div style="text-align: center;">
                <i class="${getSubjectIcon(subject)}" style="font-size: 40px; margin-bottom: 10px;"></i>
                <h2 style="margin: 0;">${getSubjectName(subject)}</h2>
                <p style="opacity: 0.9;">(${items.length} عنصر)</p>
            </div>
        `;
        container.appendChild(sectionHeader);
    }
    
    // ترتيب العناصر (الأحدث أولاً)
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // عرض العناصر
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const title = item.letter || item.surah || item.concept || item.title || 'عنصر بدون عنوان';
        const date = item.date || formatDate(new Date(item.timestamp || Date.now()));
        const hasImages = item.images && item.images.length > 0;
        
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${title}</div>
                    <div class="item-date">${date}</div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon" onclick="editItem('${subject}', '${item.id}')" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteItem('${subject}', '${item.id}')" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="item-body">
                <div class="item-description">${item.description || 'لا يوجد وصف'}</div>
                <div class="item-images">
                    ${hasImages ? item.images.map((img, index) => `
                        <div class="item-image" onclick="viewImage('${img}')">
                            <img src="${img}" alt="الصورة ${index + 1}" loading="lazy">
                            <div class="image-overlay">
                                <i class="fas fa-search-plus"></i>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="item-image empty">
                            <i class="fas fa-image"></i>
                            <span>لا توجد صور</span>
                        </div>
                        <div class="item-image empty">
                            <i class="fas fa-image"></i>
                            <span>لا توجد صور</span>
                        </div>
                    `}
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// ===== تحديث جميع الأقسام =====
function updateAllSections() {
    ['arabic', 'english', 'quran', 'math', 'science', 'activities'].forEach(subject => {
        renderSection(subject);
    });
}

// ===== تحديث الواجهة =====
function updateUI() {
    updateStats();
    updateRecentActivity();
    updateBadges();
    updateAllSections();
}

// ===== عرض الملف الكامل مع الصور =====
function renderFullPortfolio() {
    const container = document.getElementById('fullPortfolioContainer');
    if (!container) return;
    
    let html = '<div class="full-portfolio-grid">';
    
    // إضافة كل قسم
    const subjects = [
        { id: 'arabic', name: 'اللغة العربية', icon: 'fas fa-font' },
        { id: 'english', name: 'اللغة الإنجليزية', icon: 'fas fa-language' },
        { id: 'quran', name: 'القرآن الكريم', icon: 'fas fa-book-quran' },
        { id: 'math', name: 'الرياضيات', icon: 'fas fa-calculator' },
        { id: 'science', name: 'العلوم', icon: 'fas fa-flask' },
        { id: 'activities', name: 'النشاطات', icon: 'fas fa-chalkboard' }
    ];
    
    subjects.forEach(({ id, name, icon }) => {
        const items = portfolioData[id] || [];
        const sectionImage = sectionImages[id];
        
        if (items.length > 0) {
            html += `
                <div class="portfolio-section" style="margin-bottom: 40px;">
                    <div class="section-header" style="
                        background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${sectionImage}');
                        background-size: cover;
                        background-position: center;
                        padding: 30px;
                        border-radius: 12px;
                        color: white;
                        margin-bottom: 25px;
                    ">
                        <h2 style="display: flex; align-items: center; gap: 15px;">
                            <i class="${icon}" style="font-size: 28px;"></i>
                            ${name} (${items.length} عنصر)
                        </h2>
                    </div>
                    <div class="items-grid">
            `;
            
            items.forEach(item => {
                const title = item.letter || item.surah || item.concept || item.title || 'عنصر بدون عنوان';
                const date = item.date || formatDate(new Date(item.timestamp || Date.now()));
                const primaryImage = item.images && item.images[0] ? item.images[0] : sectionImage;
                
                html += `
                    <div class="item-card" style="border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden;">
                        <div style="
                            height: 150px;
                            background: url('${primaryImage}') center/cover;
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background: linear-gradient(transparent, rgba(0,0,0,0.7));
                            "></div>
                            <div style="
                                position: absolute;
                                bottom: 15px;
                                right: 15px;
                                left: 15px;
                                color: white;
                            ">
                                <h3 style="margin: 0; font-size: 18px;">${title}</h3>
                                <small style="opacity: 0.9;">${date}</small>
                            </div>
                        </div>
                        <div style="padding: 20px;">
                            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 15px;">
                                ${item.description || 'لا يوجد وصف'}
                            </p>
                            ${item.images && item.images.length > 1 ? `
                                <div style="display: flex; gap: 10px; margin-top: 15px;">
                                    ${item.images.slice(1).map((img, index) => `
                                        <img src="${img}" 
                                             onclick="viewImage('${img}')"
                                             style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; cursor: pointer;"
                                             alt="صورة ${index + 2}">
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
    });
    
    html += '</div>';
    
    if (!html.includes('portfolio-section')) {
        html = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>الملف فارغ</h3>
                <p>لم يتم إضافة أي عناصر إلى ملف الإنجاز بعد</p>
                <button class="btn-primary mt-20" onclick="switchTab('dashboard')">
                    <i class="fas fa-plus"></i>
                    ابدأ بإضافة عناصر
                </button>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// ===== تعديل العنصر =====
function editItem(subject, itemId) {
    console.log(`✏️ تعديل العنصر: ${itemId}`);
    
    const items = portfolioData[subject] || [];
    const item = items.find(i => i.id === itemId);
    
    if (!item) {
        showToast('العنصر غير موجود', 'error');
        return;
    }
    
    // تعبئة النموذج
    document.getElementById('modalSubject').value = subject;
    document.getElementById('itemTitle').value = item.title || item.letter || item.surah || item.concept || '';
    document.getElementById('itemDescription').value = item.description || '';
    
    // معاينة الصور
    const preview1 = document.getElementById('imagePreview1');
    const preview2 = document.getElementById('imagePreview2');
    
    if (item.images && item.images[0]) {
        preview1.innerHTML = `<img src="${item.images[0]}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`;
        preview1.style.padding = '0';
    }
    
    if (item.images && item.images[1]) {
        preview2.innerHTML = `<img src="${item.images[1]}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`;
        preview2.style.padding = '0';
    }
    
    // تغيير عنوان النافذة
    document.getElementById('modalTitle').textContent = 'تعديل العنصر';
    
    // تخزين معرف العنصر للتحرير
    document.getElementById('addForm').dataset.editingId = itemId;
    
    // إظهار النافذة
    document.getElementById('addModal').style.display = 'flex';
}

// ===== حذف العنصر =====
async function deleteItem(subject, itemId) {
    console.log(`🗑️ حذف العنصر: ${itemId}`);
    
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذه العملية.')) {
        return;
    }
    
    try {
        showToast('جارٍ حذف العنصر...', 'info');
        
        // حذف من المصفوفة
        portfolioData[subject] = portfolioData[subject].filter(item => item.id !== itemId);
        
        // حفظ البيانات
        saveLocalData();
        await saveToFirebase();
        
        // تحديث الواجهة
        updateUI();
        
        showToast('تم حذف العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حذف العنصر:', error);
        showToast('خطأ في حذف العنصر', 'error');
    }
}

// ===== عرض الصورة =====
function viewImage(url) {
    if (!url) return;
    
    document.getElementById('previewedImage').src = url;
    document.getElementById('imagePreviewModal').style.display = 'flex';
}

// ===== عرض نافذة الطباعة =====
function showPrintModal() {
    document.getElementById('printModal').style.display = 'flex';
}

// ===== معالجة الطباعة =====
function handlePrint() {
    const option = document.querySelector('input[name="printOption"]:checked').value;
    
    let content = '';
    let title = 'ملف إنجاز المعلمة فريال الغماري';
    
    switch(option) {
        case 'full':
            renderFullPortfolio();
            setTimeout(() => {
                content = document.getElementById('fullPortfolioContainer').innerHTML;
                printContent(content, title + ' - الملف الكامل');
            }, 500);
            break;
        case 'current':
            content = document.getElementById(currentTab).innerHTML;
            printContent(content, title + ` - ${getSubjectName(currentTab)}`);
            break;
        default:
            content = document.getElementById('fullPortfolioContainer').innerHTML;
            printContent(content, title);
    }
    
    closeModal('printModal');
}

function printContent(content, title) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Cairo', sans-serif;
                    padding: 40px;
                    background: white;
                    color: black;
                    line-height: 1.6;
                }
                .print-header {
                    text-align: center;
                    margin-bottom: 40px;
                    border-bottom: 3px solid #333;
                    padding-bottom: 20px;
                }
                .print-header h1 {
                    color: #4361ee;
                    margin-bottom: 10px;
                    font-size: 28px;
                }
                .section-header {
                    background: #4361ee !important;
                    color: white !important;
                    padding: 20px !important;
                    border-radius: 8px !important;
                    margin: 30px 0 20px 0 !important;
                }
                .item-card {
                    border: 1px solid #ddd !important;
                    border-radius: 8px !important;
                    padding: 20px !important;
                    margin-bottom: 20px !important;
                    page-break-inside: avoid !important;
                }
                .item-images {
                    display: flex !important;
                    gap: 10px !important;
                    margin-top: 15px !important;
                    flex-wrap: wrap !important;
                }
                .item-images img {
                    max-width: 200px !important;
                    max-height: 150px !important;
                    object-fit: contain !important;
                    border: 1px solid #ddd !important;
                    border-radius: 4px !important;
                }
                @media print {
                    .no-print { display: none !important; }
                    body { padding: 20px !important; }
                    .print-header { margin-bottom: 30px !important; }
                }
                button {
                    padding: 12px 24px;
                    background: #4361ee;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-family: 'Cairo', sans-serif;
                    margin: 10px;
                }
                button:hover {
                    background: #3a56d4;
                }
            </style>
        </head>
        <body>
            <div class="print-header">
                <h1>${title}</h1>
                <p>المعلمة: فريال عبدالله الغماري</p>
                <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
            <div id="printContent">
                ${content}
            </div>
            <div class="no-print" style="margin-top: 50px; text-align: center;">
                <button onclick="window.print()">
                    <i class="fas fa-print"></i> طباعة
                </button>
                <button onclick="window.close()" style="background: #6c757d;">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    showToast('جاري تحضير الطباعة', 'info');
}

// ===== تصدير الملف الكامل =====
function exportFullPortfolio() {
    const data = JSON.stringify(portfolioData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ملف-الإنجاز-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    showToast('تم تصدير الملف بنجاح', 'success');
}

// ===== تصدير القسم =====
function exportSection(subject) {
    const data = JSON.stringify(portfolioData[subject] || [], null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subject}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    showToast(`تم تصدير قسم ${getSubjectName(subject)}`, 'success');
}

// ===== نسخة احتياطية =====
function backupData() {
    const data = JSON.stringify(portfolioData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    showToast('تم إنشاء نسخة احتياطية', 'success');
}

// ===== تبديل الوضع =====
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.innerHTML = newTheme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }
    
    showToast(`الوضع ${newTheme === 'dark' ? 'الداكن' : 'الفاتح'} مفعل`, 'info');
}

// ===== ملء الشاشة =====
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            showToast('تعذر تفعيل ملء الشاشة', 'error');
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// ===== إظهار الإشعارات =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <i class="${icons[type] || 'fas fa-info-circle'}"></i>
        <div class="toast-content">
            <div class="toast-title">${getToastTitle(type)}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // إزالة تلقائية بعد 5 ثوان
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// ===== دوال مساعدة =====
function getSubjectIcon(subject) {
    const icons = {
        arabic: 'fas fa-font',
        english: 'fas fa-language',
        quran: 'fas fa-book-quran',
        math: 'fas fa-calculator',
        science: 'fas fa-flask',
        activities: 'fas fa-chalkboard'
    };
    return icons[subject] || 'fas fa-file';
}

function getSubjectName(subject) {
    const names = {
        arabic: 'اللغة العربية',
        english: 'اللغة الإنجليزية',
        quran: 'القرآن الكريم',
        math: 'الرياضيات',
        science: 'العلوم',
        activities: 'النشاطات'
    };
    return names[subject] || subject;
}

function getToastTitle(type) {
    const titles = {
        success: 'نجاح',
        error: 'خطأ',
        info: 'معلومة',
        warning: 'تحذير'
    };
    return titles[type] || 'إشعار';
}

function formatDate(date) {
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ===== دوال التقارير =====
function generateReports() {
    const container = document.getElementById('reportsContainer');
    if (!container) return;
    
    let html = '<div class="reports-grid">';
    
    // تقرير إحصائي
    html += `
        <div class="report-card">
            <h3><i class="fas fa-chart-pie"></i> الإحصائيات العامة</h3>
            <div class="report-content">
    `;
    
    Object.keys(portfolioData).forEach(subject => {
        const count = portfolioData[subject].length;
        const images = portfolioData[subject].reduce((sum, item) => 
            sum + (item.images ? item.images.length : 0), 0);
        
        html += `
            <div class="report-item">
                <span>${getSubjectName(subject)}</span>
                <span><strong>${count}</strong> عنصر، <strong>${images}</strong> صورة</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // أحدث الإضافات
    html += `
        <div class="report-card">
            <h3><i class="fas fa-history"></i> آخر 10 إضافات</h3>
            <div class="report-content">
    `;
    
    const allItems = [];
    Object.keys(portfolioData).forEach(subject => {
        portfolioData[subject].forEach(item => {
            allItems.push({
                ...item,
                subject: subject
            });
        });
    });
    
    allItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    const recentItems = allItems.slice(0, 10);
    
    if (recentItems.length === 0) {
        html += '<p style="text-align: center; color: var(--text-muted);">لا توجد إضافات حديثة</p>';
    } else {
        recentItems.forEach(item => {
            const title = item.letter || item.surah || item.concept || item.title || 'عنصر جديد';
            const time = formatDate(new Date(item.timestamp || Date.now()));
            
            html += `
                <div class="report-item">
                    <div>
                        <strong>${title}</strong>
                        <small>${getSubjectName(item.subject)}</small>
                    </div>
                    <small>${time}</small>
                </div>
            `;
        });
    }
    
    html += `
            </div>
        </div>
    `;
    
    html += '</div>';
    container.innerHTML = html;
}

// ===== جعل الدوال متاحة عالمياً =====
window.switchTab = switchTab;
window.showAddModal = showAddModal;
window.closeModal = closeModal;
window.saveItem = saveItem;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.viewImage = viewImage;
window.showPrintModal = showPrintModal;
window.handlePrint = handlePrint;
window.printFullPortfolio = printFullPortfolio;
window.exportFullPortfolio = exportFullPortfolio;
window.exportSection = exportSection;
window.backupData = backupData;
window.toggleTheme = toggleTheme;
window.toggleFullscreen = toggleFullscreen;
window.previewImage = previewImage;
window.showToast = showToast;

console.log('🎉 النظام جاهز! جميع الميزات تعمل بشكل صحيح.');
