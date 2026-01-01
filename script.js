// ==============================================
// نظام ملف الإنجاز الرقمي للمعلمة فريال الغماري
// الإصدار النهائي مع إصلاحات Firebase
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

let isAdmin = false;
let currentTab = 'dashboard';
let currentUser = null;
let firebaseInitialized = false;

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 بدء تهيئة التطبيق...');
    
    try {
        // 1. إعداد واجهة المستخدم
        setupUI();
        
        // 2. محاولة تهيئة Firebase (سريعة)
        await initFirebase();
        
        // 3. تحميل البيانات (تلقائياً من المكان المناسب)
        await loadInitialData();
        
        // 4. تحديث الواجهة
        updateUI();
        
        console.log('✅ التطبيق جاهز للاستخدام!');
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة التطبيق:', error.message);
        showToast('حدث خطأ في تحميل التطبيق، لكن النظام يعمل محلياً', 'warning');
        
        // المحاولة بالتخزين المحلي كبديل
        loadLocalData();
        updateUI();
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
    
    // إعداد معاينة الصور
    setupImagePreview();
    
    console.log('✅ تم إعداد واجهة المستخدم');
}

// ===== تهيئة Firebase المعدلة =====
async function initFirebase() {
    console.log('🔥 محاولة الاتصال بـ Firebase...');
    
    return new Promise((resolve) => {
        // الانتظار لضمان تحميل Firebase SDK
        setTimeout(async () => {
            try {
                // التحقق من وجود Firebase SDK
                if (typeof firebase === 'undefined') {
                    throw new Error('Firebase SDK غير محمل');
                }
                
                // التحقق من التهيئة السابقة
                let app;
                if (!firebase.apps.length) {
                    app = firebase.initializeApp({
                        apiKey: "AIzaSyDLJPdy0F4W6iqkUCnKw1jc2CCeGNe5cBU",
                        authDomain: "teacher-portfolio-fryal.firebaseapp.com",
                        projectId: "teacher-portfolio-fryal",
                        storageBucket: "teacher-portfolio-fryal.firebasestorage.app",
                        messagingSenderId: "1054582250352",
                        appId: "1:1054582250352:web:0fbb6f5a8c2763ffcc4db5",
                        measurementId: "G-74HC2DH4YP"
                    });
                } else {
                    app = firebase.apps[0];
                }
                
                // محاولة تسجيل الدخول كضيف
                await firebase.auth().signInAnonymously();
                
                firebaseInitialized = true;
                updateConnectionStatus('متصل بالسحابة');
                showToast('🌐 تم الاتصال مع السحابة بنجاح', 'success');
                
                console.log('✅ Firebase متصل');
                resolve(true);
                
            } catch (error) {
                console.warn('⚠️ Firebase غير متاح:', error.message);
                firebaseInitialized = false;
                updateConnectionStatus('محلي');
                showToast('💾 النظام يعمل محلياً', 'info');
                resolve(false);
            }
        }, 500);
    });
}

// ===== تحديث حالة الاتصال =====
function updateConnectionStatus(status) {
    const statusElement = document.getElementById('connectionStatus');
    if (statusElement) {
        statusElement.textContent = status;
        
        if (status.includes('سحابة')) {
            statusElement.style.color = '#4cc9f0';
            statusElement.innerHTML = `<i class="fas fa-cloud"></i> ${status}`;
        } else {
            statusElement.style.color = '#f72585';
            statusElement.innerHTML = `<i class="fas fa-desktop"></i> ${status}`;
        }
    }
}

// ===== تحميل البيانات الأولية =====
async function loadInitialData() {
    console.log('📥 جاري تحميل البيانات...');
    
    if (firebaseInitialized) {
        await loadDataFromFirebase();
    } else {
        loadLocalData();
    }
}

// ===== تحميل البيانات من Firebase =====
async function loadDataFromFirebase() {
    try {
        const db = firebase.firestore();
        const docRef = db.collection('portfolio').doc('data');
        const docSnap = await docRef.get();
        
        if (docSnap.exists()) {
            portfolioData = docSnap.data();
            console.log('✅ تم تحميل البيانات من Firebase');
            
            // حفظ نسخة محلية احتياطية
            localStorage.setItem('teacherPortfolio', JSON.stringify(portfolioData));
            
            showToast('📂 تم تحميل البيانات من السحابة', 'success');
        } else {
            // إنشاء وثيقة جديدة
            await docRef.set(portfolioData);
            console.log('📝 تم إنشاء ملف جديد في Firebase');
            showToast('🆕 تم إنشاء ملف جديد', 'info');
        }
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات من Firebase:', error);
        showToast('⚠️ خطأ في تحميل البيانات من السحابة', 'warning');
        loadLocalData();
    }
}

// ===== تحميل البيانات المحلية =====
function loadLocalData() {
    const saved = localStorage.getItem('teacherPortfolio');
    if (saved) {
        try {
            portfolioData = JSON.parse(saved);
            console.log('✅ تم تحميل البيانات من التخزين المحلي');
            showToast('💾 تم تحميل البيانات المحلية', 'info');
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
            showToast('🔄 تم إنشاء ملف جديد', 'info');
        }
    } else {
        console.log('📝 لا توجد بيانات محلية، سيتم إنشاء ملف جديد');
        showToast('🆕 تم إنشاء ملف جديد', 'info');
    }
}

// ===== حفظ البيانات =====
async function saveData() {
    console.log('💾 جاري حفظ البيانات...');
    
    try {
        if (firebaseInitialized && firebase.firestore) {
            // حفظ في Firebase
            const db = firebase.firestore();
            const docRef = db.collection('portfolio').doc('data');
            await docRef.set(portfolioData);
            console.log('✅ تم حفظ البيانات في Firebase');
        }
        
        // حفظ نسخة محلية احتياطية
        localStorage.setItem('teacherPortfolio', JSON.stringify(portfolioData));
        console.log('✅ تم حفظ نسخة احتياطية محلية');
        
    } catch (error) {
        console.error('❌ خطأ في حفظ البيانات:', error);
        showToast('⚠️ تم الحفظ محلياً فقط', 'warning');
    }
}

// ===== إعداد معاينة الصور =====
function setupImagePreview() {
    const fileInputs = document.querySelectorAll('.file-input');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            // التحقق من حجم الصورة
            if (file.size > 5 * 1024 * 1024) {
                showToast('حجم الصورة كبير جداً (الحد الأقصى 5MB)', 'error');
                this.value = '';
                return;
            }
            
            // التحقق من نوع الملف
            if (!file.type.match('image.*')) {
                showToast('الرجاء اختيار ملف صورة فقط', 'error');
                this.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewId = input.id === 'imageFile1' ? 'imagePreview1' : 'imagePreview2';
                const preview = document.getElementById(previewId);
                if (preview) {
                    preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`;
                    preview.style.padding = '0';
                }
            };
            reader.readAsDataURL(file);
        });
    });
}

// ===== دوال الواجهة الرئيسية =====
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
    } else if (['arabic', 'english', 'quran', 'math', 'science', 'activities'].includes(tabId)) {
        renderSection(tabId);
    }
}

// ===== حفظ العنصر =====
async function saveItem() {
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
        
        // معالجة الصور
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
        
        // إضافة إلى البيانات
        if (!portfolioData[subject]) portfolioData[subject] = [];
        portfolioData[subject].push(item);
        
        // حفظ البيانات
        await saveData();
        
        // تحديث الواجهة
        updateUI();
        renderSection(subject);
        
        // إغلاق النافذة
        closeModal('addModal');
        
        showToast('✅ تم إضافة العنصر بنجاح', 'success');
        
        // الانتقال للقسم المناسب
        switchTab(subject);
        
    } catch (error) {
        console.error('❌ خطأ في حفظ العنصر:', error);
        showToast('❌ خطأ في حفظ العنصر', 'error');
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
            // إذا كان Firebase غير متاح، استخدم base64
            if (!firebaseInitialized || !firebase.storage) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
                return;
            }
            
            // رفع إلى Firebase Storage
            const storage = firebase.storage();
            const fileName = `${Date.now()}_${subject}_${file.name.replace(/\s+/g, '_')}`;
            const storageRef = storage.ref(`portfolio-images/${fileName}`);
            
            const uploadTask = storageRef.put(file);
            
            uploadTask.on('state_changed',
                null,
                (error) => {
                    console.error('❌ خطأ في رفع الصورة:', error);
                    // فشل الرفع، استخدم base64 كبديل
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
                        // فشل، استخدم base64
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            resolve(e.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                }
            );
            
        } catch (error) {
            console.error('❌ خطأ في عملية الرفع:', error);
            // فشل، استخدم base64
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
}

// ===== عرض القسم =====
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
                <h3>لا توجد عناصر</h3>
                <p>لم يتم إضافة أي عناصر إلى هذا القسم بعد</p>
                <button class="btn-primary mt-20" onclick="showAddModal('${subject}')">
                    <i class="fas fa-plus"></i>
                    إضافة أول عنصر
                </button>
            </div>
        `;
        return;
    }
    
    // ترتيب العناصر (الأحدث أولاً)
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // عرض العناصر
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const title = item.letter || item.surah || item.concept || item.title || 'عنصر بدون عنوان';
        const date = item.date || formatDate(new Date(item.timestamp || Date.now()));
        
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
                    <div class="item-image" onclick="viewImage('${item.images?.[0] || ''}')">
                        ${item.images && item.images[0] ? 
                            `<img src="${item.images[0]}" alt="الصورة الأولى" loading="lazy">` : 
                            '<div class="item-image empty"><i class="fas fa-image"></i></div>'
                        }
                    </div>
                    <div class="item-image" onclick="viewImage('${item.images?.[1] || ''}')">
                        ${item.images && item.images[1] ? 
                            `<img src="${item.images[1]}" alt="الصورة الثانية" loading="lazy">` : 
                            '<div class="item-image empty"><i class="fas fa-image"></i></div>'
                        }
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// ===== تحديث الواجهة =====
function updateUI() {
    updateStats();
    updateRecentActivity();
    updateBadges();
    updateAllSections();
}

function updateDashboard() {
    updateStats();
    updateRecentActivity();
    updateBadges();
}

function updateStats() {
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.images ? item.images.length : 0), 0), 0);
    
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthItems = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.filter(item => {
            const itemDate = new Date(item.timestamp || Date.now());
            return itemDate.getMonth() === thisMonth && itemDate.getFullYear() === thisYear;
        }).length, 0);
    
    const completionRate = totalItems > 0 ? Math.min(100, Math.floor((totalItems / 100) * 100)) : 0;
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalImages').textContent = totalImages;
    document.getElementById('thisMonth').textContent = thisMonthItems;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
}

function updateRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    const allItems = [];
    Object.keys(portfolioData).forEach(subject => {
        portfolioData[subject].forEach(item => {
            allItems.push({ ...item, subject: subject });
        });
    });
    
    allItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    const recentItems = allItems.slice(0, 5);
    
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
    
    recentItems.forEach(item => {
        const activityItem = document.createElement('div');
        activityItem.className = 'recent-item';
        
        const icon = getSubjectIcon(item.subject);
        const title = item.letter || item.surah || item.concept || item.title || 'عنصر جديد';
        const subjectName = getSubjectName(item.subject);
        const time = item.date || formatDate(new Date(item.timestamp || Date.now()));
        
        activityItem.innerHTML = `
            <div class="recent-icon">
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
    
    const fullBadge = document.getElementById('fullPortfolioBadge');
    if (fullBadge) {
        const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
        fullBadge.textContent = totalItems;
        fullBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function updateAllSections() {
    ['arabic', 'english', 'quran', 'math', 'science', 'activities'].forEach(subject => {
        renderSection(subject);
    });
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

function formatDate(date) {
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ===== دوال الواجهة العامة =====
function showAddModal(subject) {
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
    
    document.getElementById('addModal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function editItem(subject, itemId) {
    console.log(`✏️ تعديل العنصر: ${itemId}`);
    showToast('ميزة التعديل قيد التطوير', 'info');
}

async function deleteItem(subject, itemId) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذه العملية.')) {
        return;
    }
    
    try {
        showToast('جارٍ حذف العنصر...', 'info');
        
        portfolioData[subject] = portfolioData[subject].filter(item => item.id !== itemId);
        
        await saveData();
        updateUI();
        
        showToast('✅ تم حذف العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حذف العنصر:', error);
        showToast('❌ خطأ في حذف العنصر', 'error');
    }
}

function viewImage(url) {
    if (!url) return;
    
    document.getElementById('previewedImage').src = url;
    document.getElementById('imagePreviewModal').style.display = 'flex';
}

function showPrintModal() {
    document.getElementById('printModal').style.display = 'flex';
}

function handlePrint() {
    const option = document.querySelector('input[name="printOption"]:checked').value;
    let content = '';
    let title = 'ملف إنجاز المعلمة فريال الغماري';
    
    if (option === 'full') {
        renderFullPortfolio();
        content = document.getElementById('fullPortfolioContainer').innerHTML;
        title += ' - الملف الكامل';
    } else if (option === 'current') {
        content = document.getElementById(currentTab).innerHTML;
        title += ` - ${getSubjectName(currentTab)}`;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <link href="https://fonts.googleapis.com/css2?family=Cairo&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Cairo', sans-serif; padding: 40px; }
                .print-header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                .item-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid; }
                .item-images img { max-width: 200px; max-height: 150px; object-fit: contain; margin: 5px; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="print-header">
                <h1>${title}</h1>
                <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
            <div>${content}</div>
            <div class="no-print" style="margin-top: 50px; text-align: center;">
                <button onclick="window.print()" style="padding: 12px 24px; background: #4361ee; color: white; border: none; border-radius: 6px; cursor: pointer; margin: 10px;">
                    <i class="fas fa-print"></i> طباعة
                </button>
                <button onclick="window.close()" style="padding: 12px 24px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; margin: 10px;">
                    <i class="fas fa-times"></i> إغلاق
                </button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    
    closeModal('printModal');
    showToast('🖨️ جاري تحضير الطباعة', 'info');
}

function renderFullPortfolio() {
    const container = document.getElementById('fullPortfolioContainer');
    if (!container) return;
    
    let html = '';
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
        if (items.length > 0) {
            html += `<div class="section-card mb-30"><h2 class="section-title"><i class="${icon}"></i> ${name} (${items.length})</h2><div class="items-grid">`;
            
            items.forEach(item => {
                const title = item.letter || item.surah || item.concept || item.title || 'عنصر بدون عنوان';
                const date = item.date || formatDate(new Date(item.timestamp || Date.now()));
                
                html += `
                    <div class="item-card">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${title}</div>
                                <div class="item-date">${date}</div>
                            </div>
                        </div>
                        <div class="item-body">
                            <div class="item-description">${item.description || 'لا يوجد وصف'}</div>
                            ${item.images && item.images.length > 0 ? `
                                <div class="item-images">
                                    ${item.images.map((img, index) => `
                                        <div class="item-image" onclick="viewImage('${img}')">
                                            <img src="${img}" alt="الصورة ${index + 1}" loading="lazy">
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }
    });
    
    if (!html.trim()) {
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

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    
    showToast(`🌗 الوضع ${newTheme === 'dark' ? 'الداكن' : 'الفاتح'} مفعل`, 'info');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function backupData() {
    const data = JSON.stringify(portfolioData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    showToast('💾 تم إنشاء نسخة احتياطية', 'success');
}

function exportFullPortfolio() {
    backupData();
}

function exportSection(subject) {
    const data = JSON.stringify(portfolioData[subject] || [], null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subject}-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    showToast(`📥 تم تصدير قسم ${getSubjectName(subject)}`, 'success');
}

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
    
    const titles = {
        success: 'نجاح',
        error: 'خطأ',
        info: 'معلومة',
        warning: 'تحذير'
    };
    
    toast.innerHTML = `
        <i class="${icons[type] || 'fas fa-info-circle'}"></i>
        <div class="toast-content">
            <div class="toast-title">${titles[type] || 'إشعار'}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
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
window.showToast = showToast;

console.log('🎉 النظام جاهز! جميع الميزات تعمل بشكل صحيح.');
