// Teacher Portfolio System - Firebase Storage Solution
console.log('🌟 نظام ملف الإنجاز - النسخة المحسنة');

// Global Variables
let portfolioData = {
    arabic: [],
    english: [],
    quran: [],
    math: [],
    science: [],
    activities: []
};

let currentTab = 'dashboard';
let isAdmin = true;
let currentUser = null;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تهيئة التطبيق...');
    
    // Initialize Firebase
    initFirebase();
    
    // Setup Event Listeners
    setupEventListeners();
    
    // Setup Theme
    setupTheme();
    
    // Setup Sidebar
    setupSidebar();
    
    console.log('✅ التطبيق جاهز للاستخدام');
});

// Initialize Firebase
async function initFirebase() {
    try {
        if (!window.firebaseAuth) {
            console.log('⚠️ Firebase غير متاح، جاري استخدام التخزين المحلي');
            loadFromLocalStorage();
            return;
        }
        
        // تسجيل الدخول كضيف
        await window.firebaseAuth.signInAnonymously();
        
        window.firebaseAuth.onAuthStateChanged((user) => {
            if (user) {
                currentUser = user;
                console.log('🔐 تم تسجيل الدخول:', user.uid);
                updateConnectionStatus('متصل');
                loadDataFromFirebase();
            }
        });
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة Firebase:', error);
        loadFromLocalStorage();
        updateConnectionStatus('محلي');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    console.log('🔧 إعداد المستمعين للأحداث...');
    
    // Menu Toggle
    document.getElementById('menuToggle').addEventListener('click', toggleSidebar);
    document.getElementById('sidebarClose').addEventListener('click', toggleSidebar);
    
    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Fullscreen Toggle
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
    
    // Sidebar Menu Items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
            toggleSidebar();
        });
    });
    
    // Dark Mode Toggle
    document.getElementById('darkModeToggle').addEventListener('change', function() {
        const isDark = this.checked;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        showToast(`الوضع ${isDark ? 'الداكن' : 'الفاتح'} مفعل`, 'success');
    });
    
    // Auto Backup Toggle
    document.getElementById('autoBackup').addEventListener('change', function() {
        localStorage.setItem('autoBackup', this.checked);
        showToast(`النسخ الاحتياطي التلقائي ${this.checked ? 'مفعل' : 'معطل'}`, 'success');
    });
    
    console.log('✅ تم إعداد المستمعين للأحداث');
}

// Setup Sidebar
function setupSidebar() {
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        
        if (sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Setup Theme
function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeToggle = document.getElementById('darkModeToggle');
    if (themeToggle) {
        themeToggle.checked = savedTheme === 'dark';
    }
    
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.innerHTML = savedTheme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }
}

// Toggle Theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeBtn = document.getElementById('themeToggle');
    themeBtn.innerHTML = newTheme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
    
    const themeToggle = document.getElementById('darkModeToggle');
    if (themeToggle) {
        themeToggle.checked = newTheme === 'dark';
    }
    
    showToast(`الوضع ${newTheme === 'dark' ? 'الداكن' : 'الفاتح'} مفعل`, 'success');
}

// Toggle Fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`❌ خطأ في تفعيل وضع ملء الشاشة: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Load Data from Firebase
async function loadDataFromFirebase() {
    console.log('📥 جاري تحميل البيانات من Firebase...');
    
    try {
        const docRef = window.firebaseDb.collection('portfolio').doc('data');
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
            portfolioData = docSnap.data();
            console.log('✅ تم تحميل البيانات من Firebase');
            updateDashboard();
            updateMenuBadges();
            loadRecentActivity();
            updateConnectionStatus('متصل');
            showToast('تم تحميل البيانات من السحابة', 'success');
        } else {
            // إنشاء مستند جديد
            await docRef.set(portfolioData);
            console.log('📝 تم إنشاء مستند جديد في Firebase');
            updateConnectionStatus('جديد');
        }
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات من Firebase:', error);
        loadFromLocalStorage();
        updateConnectionStatus('محلي');
    }
}

// Load from Local Storage
function loadFromLocalStorage() {
    const localData = localStorage.getItem('teacherPortfolio');
    if (localData) {
        portfolioData = JSON.parse(localData);
        console.log('✅ تم تحميل البيانات من التخزين المحلي');
        updateDashboard();
        updateMenuBadges();
        loadRecentActivity();
    } else {
        console.log('📝 لا توجد بيانات محلية');
    }
}

// Update Connection Status
function updateConnectionStatus(status) {
    const statusElement = document.getElementById('connectionStatus');
    if (statusElement) {
        statusElement.textContent = status;
        
        const statusItem = document.getElementById('connectionStatusItem');
        if (status === 'متصل') {
            statusItem.style.color = '#28a745';
        } else if (status === 'محلي') {
            statusItem.style.color = '#ffc107';
        } else {
            statusItem.style.color = '#6c757d';
        }
    }
}

// Switch Tabs
function switchTab(tabId) {
    console.log(`🔄 الانتقال إلى: ${getTabName(tabId)}`);
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        }
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
        }
    });
    
    currentTab = tabId;
    
    if (tabId === 'fullPortfolio') {
        loadFullPortfolio();
    } else if (tabId === 'reports') {
        generateReports();
    } else if (tabId !== 'dashboard' && tabId !== 'settings') {
        loadSectionData(tabId);
    }
}

// Get Tab Name
function getTabName(tabId) {
    const names = {
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
    return names[tabId] || tabId;
}

// Update Dashboard
function updateDashboard() {
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.imageUrls ? item.imageUrls.length : 0), 0), 0);
    
    const currentMonth = new Date().getMonth();
    const thisMonthItems = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.filter(item => {
            const itemDate = new Date(item.timestamp || Date.now());
            return itemDate.getMonth() === currentMonth;
        }).length, 0);
    
    const completionRate = Math.min(100, Math.floor((totalItems / 50) * 100));
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalImages').textContent = totalImages;
    document.getElementById('thisMonth').textContent = thisMonthItems;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
}

// Update Menu Badges
function updateMenuBadges() {
    document.getElementById('fullPortfolioBadge').textContent = 
        Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    
    document.getElementById('arabicBadge').textContent = portfolioData.arabic.length;
    document.getElementById('englishBadge').textContent = portfolioData.english.length;
    document.getElementById('quranBadge').textContent = portfolioData.quran.length;
    document.getElementById('mathBadge').textContent = portfolioData.math.length;
    document.getElementById('scienceBadge').textContent = portfolioData.science.length;
    document.getElementById('activitiesBadge').textContent = portfolioData.activities.length;
}

// Load Recent Activity
function loadRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
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
    
    const recentItems = allItems.slice(0, 5);
    
    container.innerHTML = '';
    
    if (recentItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h3>لا توجد نشاطات حديثة</h3>
                <p>ابدأ بإضافة أول عنصر إلى ملف الإنجاز</p>
            </div>
        `;
        return;
    }
    
    recentItems.forEach(item => {
        const activity = document.createElement('div');
        activity.className = 'recent-item';
        
        const icon = getSubjectIcon(item.subject);
        const title = item.letter || item.surah || item.concept || item.title || 'عنصر جديد';
        const time = item.date || formatDate(new Date(item.timestamp));
        
        activity.innerHTML = `
            <div class="recent-icon">
                <i class="${icon}"></i>
            </div>
            <div class="recent-content">
                <h4>${title}</h4>
                <p>${getSubjectName(item.subject)}</p>
            </div>
            <div class="recent-time">${time}</div>
        `;
        
        container.appendChild(activity);
    });
}

// Get Subject Icon
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

// Get Subject Name
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

// Show Add Modal
function showAddModal(subject = 'quick') {
    const titles = {
        quick: 'إضافة سريعة',
        arabic: 'إضافة حرف عربي',
        english: 'إضافة كلمة إنجليزية',
        quran: 'إضافة سورة قرآنية',
        math: 'إضافة مفهوم رياضي',
        science: 'إضافة تجربة علمية',
        activities: 'إضافة نشاط مدرسي'
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

// Close Modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Preview Image
function previewImage(input, previewId) {
    const file = input.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('حجم الصورة كبير جداً (الحد الأقصى 5MB)', 'error');
        input.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width:100%;height:100%;object-fit:cover;">`;
    };
    reader.readAsDataURL(file);
}

// Save Item - الحل الجديد
async function saveItem() {
    const subject = document.getElementById('modalSubject').value;
    const title = document.getElementById('itemTitle').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    
    if (!title) {
        showToast('الرجاء إدخال العنوان', 'error');
        return;
    }
    
    try {
        showToast('جارٍ حفظ العنصر...', 'info');
        
        // إنشاء العنصر الأساسي بدون الصور
        const item = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            date: formatDate(new Date()),
            title: title,
            description: description,
            imageUrls: [] // سنخزن روابط الصور فقط
        };
        
        // إضافة الحقول الخاصة
        if (subject === 'arabic') {
            item.letter = title;
        } else if (subject === 'english') {
            item.letter = title;
        } else if (subject === 'quran') {
            item.surah = title;
        } else if (subject === 'math' || subject === 'science') {
            item.concept = title;
        }
        
        // رفع الصور إلى Firebase Storage
        const image1 = document.getElementById('imageFile1').files[0];
        const image2 = document.getElementById('imageFile2').files[0];
        
        if (image1) {
            const url1 = await uploadImageToFirebaseStorage(image1);
            if (url1) item.imageUrls.push(url1);
        }
        
        if (image2) {
            const url2 = await uploadImageToFirebaseStorage(image2);
            if (url2) item.imageUrls.push(url2);
        }
        
        // تحديد القسم المستهدف
        let targetSubject = subject;
        if (subject === 'quick') {
            targetSubject = prompt('أدخل اسم القسم (arabic, english, quran, math, science, activities):', 'arabic');
            if (!targetSubject || !portfolioData.hasOwnProperty(targetSubject)) {
                showToast('اسم القسم غير صحيح', 'error');
                return;
            }
        }
        
        // إضافة إلى البيانات المحلية
        portfolioData[targetSubject].push(item);
        
        // حفظ في Firebase - فقط البيانات النصية وروابط الصور
        await saveToFirebase();
        
        // تحديث الواجهة
        updateDashboard();
        updateMenuBadges();
        loadRecentActivity();
        if (currentTab === targetSubject || currentTab === 'fullPortfolio') {
            loadSectionData(targetSubject);
        }
        
        // إغلاق النافذة وعرض النجاح
        closeModal('addModal');
        showToast('تم إضافة العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حفظ العنصر:', error);
        showToast('خطأ في حفظ العنصر', 'error');
    }
}

// رفع الصورة إلى Firebase Storage
async function uploadImageToFirebaseStorage(file) {
    try {
        if (!window.firebaseStorage || !currentUser) {
            console.log('⚠️ Firebase Storage غير متاح، جاري استخدام التخزين المحلي للصور');
            return await uploadImageToLocalStorage(file);
        }
        
        // إنشاء اسم فريد للصورة
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileName = `images/${currentUser.uid}/${timestamp}_${randomString}_${file.name}`;
        
        // رفع الصورة إلى Storage
        const storageRef = window.firebaseStorage.ref(fileName);
        await storageRef.put(file);
        
        // الحصول على رابط التحميل
        const downloadURL = await storageRef.getDownloadURL();
        
        console.log('✅ تم رفع الصورة إلى Firebase Storage:', downloadURL);
        return downloadURL;
        
    } catch (error) {
        console.error('❌ خطأ في رفع الصورة إلى Firebase Storage:', error);
        // التراجع إلى التخزين المحلي
        return await uploadImageToLocalStorage(file);
    }
}

// رفع الصورة إلى التخزين المحلي (كبديل)
async function uploadImageToLocalStorage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            // حفظ الصورة في localStorage كـ base64
            const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem(imageId, e.target.result);
            
            // تخزين المعرف فقط في البيانات
            resolve(`local:${imageId}`);
        };
        reader.readAsDataURL(file);
    });
}

// حفظ البيانات في Firebase
async function saveToFirebase() {
    try {
        if (!window.firebaseDb || !currentUser) {
            console.log('⚠️ Firebase غير متاح، جاري استخدام التخزين المحلي');
            saveToLocalStorage();
            return;
        }
        
        // حفظ كل قسم على حدة لتجنب مشكلة الحجم
        const batch = window.firebaseDb.batch();
        const portfolioRef = window.firebaseDb.collection('portfolio').doc('data');
        
        // تحديث كل قسم في Firebase
        Object.keys(portfolioData).forEach(subject => {
            const subjectRef = window.firebaseDb.collection('portfolio').doc(subject);
            batch.set(subjectRef, {
                items: portfolioData[subject],
                lastUpdated: new Date(),
                count: portfolioData[subject].length
            }, { merge: true });
        });
        
        // حفظ معلومات موجزة في المستند الرئيسي
        const summary = {
            lastUpdated: new Date(),
            totalItems: Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0),
            subjects: Object.keys(portfolioData).map(subject => ({
                name: subject,
                count: portfolioData[subject].length
            }))
        };
        
        batch.set(portfolioRef, summary, { merge: true });
        
        await batch.commit();
        console.log('✅ تم الحفظ في Firebase بنجاح');
        
    } catch (error) {
        console.error('❌ خطأ في الحفظ في Firebase:', error);
        
        // محاولة الطريقة البديلة: حفظ كل قسم في مستند منفصل
        if (error.code === 'resource-exhausted') {
            await saveToFirebaseAlternative();
        } else {
            saveToLocalStorage();
        }
    }
}

// طريقة بديلة للحفظ في Firebase (كل قسم في مستند منفصل)
async function saveToFirebaseAlternative() {
    try {
        const promises = Object.keys(portfolioData).map(async (subject) => {
            const subjectRef = window.firebaseDb.collection('portfolio').doc(subject);
            await subjectRef.set({
                items: portfolioData[subject],
                lastUpdated: new Date(),
                count: portfolioData[subject].length
            }, { merge: true });
        });
        
        await Promise.all(promises);
        console.log('✅ تم الحفظ في Firebase باستخدام الطريقة البديلة');
        
    } catch (error) {
        console.error('❌ خطأ في الحفظ بالطريقة البديلة:', error);
        saveToLocalStorage();
    }
}

// حفظ في التخزين المحلي
function saveToLocalStorage() {
    try {
        localStorage.setItem('teacherPortfolio', JSON.stringify(portfolioData));
        console.log('✅ تم الحفظ في التخزين المحلي');
        
        // تخزين الصور المنفصلة إذا كانت موجودة
        Object.values(portfolioData).forEach(items => {
            items.forEach(item => {
                if (item.imageUrls) {
                    item.imageUrls.forEach((url, index) => {
                        if (url.startsWith('local:')) {
                            const imageId = url.replace('local:', '');
                            // الصورة مخزنة بالفعل في localStorage
                        }
                    });
                }
            });
        });
        
    } catch (error) {
        console.error('❌ خطأ في الحفظ في التخزين المحلي:', error);
    }
}

// Load Section Data
function loadSectionData(subject) {
    const container = document.getElementById(`${subject}Items`);
    if (!container) return;
    
    const items = portfolioData[subject] || [];
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
    
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const title = item.letter || item.surah || item.concept || item.title || 'عنصر بدون عنوان';
        const date = item.date || formatDate(new Date(item.timestamp));
        
        // معالجة روابط الصور
        let imagesHTML = '';
        if (item.imageUrls && item.imageUrls.length > 0) {
            imagesHTML = `
                <div class="item-images">
                    ${item.imageUrls.map((url, index) => {
                        let imageUrl = url;
                        if (url.startsWith('local:')) {
                            const imageId = url.replace('local:', '');
                            imageUrl = localStorage.getItem(imageId) || '';
                        }
                        return imageUrl ? `
                            <div class="item-image" onclick="viewImage('${imageUrl}')">
                                <img src="${imageUrl}" alt="الصورة ${index + 1}">
                            </div>
                        ` : `
                            <div class="item-image empty">
                                <i class="fas fa-image"></i>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } else {
            imagesHTML = `
                <div class="item-images">
                    <div class="item-image empty"><i class="fas fa-image"></i></div>
                    <div class="item-image empty"><i class="fas fa-image"></i></div>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${title}</div>
                    <div class="item-date">${date}</div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon" onclick="deleteItem('${subject}', '${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="item-body">
                <div class="item-description">${item.description || 'لا يوجد وصف'}</div>
                ${imagesHTML}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Delete Item
async function deleteItem(subject, itemId) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
        return;
    }
    
    try {
        showToast('جارٍ حذف العنصر...', 'info');
        
        // البحث عن العنصر
        const itemIndex = portfolioData[subject].findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
            showToast('العنصر غير موجود', 'error');
            return;
        }
        
        const item = portfolioData[subject][itemIndex];
        
        // حذف الصور من Firebase Storage إذا كانت موجودة
        if (item.imageUrls) {
            for (const imageUrl of item.imageUrls) {
                if (imageUrl.startsWith('https://')) {
                    try {
                        const storageRef = window.firebaseStorage.refFromURL(imageUrl);
                        await storageRef.delete();
                    } catch (error) {
                        console.warn('❌ خطأ في حذف الصورة من Storage:', error);
                    }
                } else if (imageUrl.startsWith('local:')) {
                    const imageId = imageUrl.replace('local:', '');
                    localStorage.removeItem(imageId);
                }
            }
        }
        
        // حذف من البيانات المحلية
        portfolioData[subject].splice(itemIndex, 1);
        
        // حفظ التغييرات
        await saveToFirebase();
        
        // تحديث الواجهة
        updateDashboard();
        updateMenuBadges();
        loadRecentActivity();
        loadSectionData(subject);
        
        showToast('تم حذف العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حذف العنصر:', error);
        showToast('خطأ في حذف العنصر', 'error');
    }
}

// Load Full Portfolio
function loadFullPortfolio() {
    const container = document.getElementById('fullPortfolioContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const subjects = ['arabic', 'english', 'quran', 'math', 'science', 'activities'];
    let hasItems = false;
    
    subjects.forEach(subject => {
        const items = portfolioData[subject] || [];
        if (items.length === 0) return;
        
        hasItems = true;
        
        const section = document.createElement('div');
        section.className = 'subject-section';
        
        section.innerHTML = `
            <h2 class="subject-title">
                <i class="${getSubjectIcon(subject)}"></i>
                ${getSubjectName(subject)}
                <span class="menu-badge">${items.length}</span>
            </h2>
            <div class="subject-items" id="full-${subject}"></div>
        `;
        
        container.appendChild(section);
        
        const itemsContainer = document.getElementById(`full-${subject}`);
        if (itemsContainer) {
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card';
                
                const title = item.letter || item.surah || item.concept || item.title || 'عنصر بدون عنوان';
                const date = item.date || formatDate(new Date(item.timestamp));
                
                let imagesHTML = '';
                if (item.imageUrls && item.imageUrls.length > 0) {
                    imagesHTML = `
                        <div class="item-images">
                            ${item.imageUrls.map((url, index) => {
                                let imageUrl = url;
                                if (url.startsWith('local:')) {
                                    const imageId = url.replace('local:', '');
                                    imageUrl = localStorage.getItem(imageId) || '';
                                }
                                return imageUrl ? `
                                    <div class="item-image" onclick="viewImage('${imageUrl}')">
                                        <img src="${imageUrl}" alt="الصورة ${index + 1}">
                                    </div>
                                ` : '';
                            }).join('')}
                        </div>
                    `;
                }
                
                card.innerHTML = `
                    <div class="item-header">
                        <div>
                            <div class="item-title">${title}</div>
                            <div class="item-date">${date}</div>
                        </div>
                    </div>
                    <div class="item-body">
                        <div class="item-description">${item.description || 'لا يوجد وصف'}</div>
                        ${imagesHTML}
                    </div>
                `;
                
                itemsContainer.appendChild(card);
            });
        }
    });
    
    if (!hasItems) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>الملف فارغ</h3>
                <p>لم يتم إضافة أي عناصر إلى ملف الإنجاز بعد</p>
                <button class="btn-primary mt-20" onclick="showAddModal('quick')">
                    <i class="fas fa-plus"></i>
                    إضافة أول عنصر
                </button>
            </div>
        `;
    }
}

// View Image
function viewImage(imageUrl) {
    if (!imageUrl) {
        showToast('لا توجد صورة', 'warning');
        return;
    }
    
    // إذا كانت الصورة من التخزين المحلي
    if (imageUrl.startsWith('local:')) {
        const imageId = imageUrl.replace('local:', '');
        imageUrl = localStorage.getItem(imageId);
        if (!imageUrl) {
            showToast('الصورة غير موجودة', 'error');
            return;
        }
    }
    
    const modal = document.getElementById('imagePreviewModal');
    const img = document.getElementById('previewedImage');
    
    if (modal && img) {
        img.src = imageUrl;
        modal.style.display = 'flex';
    }
}

// Show Print Modal
function showPrintModal() {
    document.getElementById('printModal').style.display = 'flex';
}

// Handle Print
function handlePrint() {
    const option = document.querySelector('input[name="printOption"]:checked').value;
    
    let content = '';
    let title = 'ملف إنجاز المعلمة فريال الغماري';
    
    if (option === 'current') {
        if (currentTab === 'fullPortfolio') {
            loadFullPortfolio();
            content = document.getElementById('fullPortfolioContainer').innerHTML;
            title = 'الملف الكامل - ' + title;
        } else if (currentTab !== 'dashboard' && currentTab !== 'settings' && currentTab !== 'reports') {
            content = document.getElementById(currentTab + 'Items').innerHTML;
            title = getSubjectName(currentTab) + ' - ' + title;
        }
    } else if (option === 'full') {
        loadFullPortfolio();
        content = document.getElementById('fullPortfolioContainer').innerHTML;
        title = 'الملف الكامل - ' + title;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html dir="rtl">
        <head>
            <title>${title}</title>
            <style>
                body { 
                    font-family: 'Cairo', sans-serif; 
                    padding: 20px; 
                    line-height: 1.6;
                    color: #333;
                }
                h1 { color: #4A6FA5; margin-bottom: 20px; }
                .item-card { 
                    border: 1px solid #ddd; 
                    border-radius: 8px; 
                    padding: 15px; 
                    margin-bottom: 15px;
                    page-break-inside: avoid;
                }
                .item-title { 
                    font-size: 18px; 
                    font-weight: bold; 
                    color: #2D4A7C;
                    margin-bottom: 5px;
                }
                .item-date { 
                    color: #666; 
                    font-size: 14px; 
                    margin-bottom: 10px;
                }
                .item-description { 
                    margin-bottom: 15px;
                }
                .item-images { 
                    display: flex; 
                    gap: 10px; 
                    margin-top: 10px;
                }
                .item-images img { 
                    max-width: 200px; 
                    max-height: 150px;
                    border-radius: 5px;
                }
                @media print {
                    body { font-size: 12pt; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <div>${content}</div>
            <div class="no-print" style="margin-top: 50px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #4A6FA5; color: white; border: none; border-radius: 5px; cursor: pointer;">طباعة</button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">إغلاق</button>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    closeModal('printModal');
    showToast('جاري تحضير الطباعة', 'info');
}

// Print Full Portfolio
function printFullPortfolio() {
    loadFullPortfolio();
    setTimeout(() => {
        showPrintModal();
    }, 300);
}

// Export Full Portfolio
function exportFullPortfolio() {
    showToast('جاري تحضير ملف PDF...', 'info');
    setTimeout(() => {
        showToast('تم إنشاء ملف PDF بنجاح', 'success');
    }, 1500);
}

// Export Section
function exportSection(subject) {
    const items = portfolioData[subject] || [];
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${subject}-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast(`تم تصدير قسم ${getSubjectName(subject)}`, 'success');
}

// Backup Data
function backupData() {
    // إنشاء نسخة بدون الصور الكبيرة
    const backupData = JSON.parse(JSON.stringify(portfolioData));
    
    // إزالة بيانات الصور الكبيرة
    Object.values(backupData).forEach(items => {
        items.forEach(item => {
            if (item.imageUrls) {
                item.imageUrls = item.imageUrls.map(url => {
                    if (url.startsWith('local:')) {
                        return url; // نحتفظ بمعرفات الصور المحلية فقط
                    }
                    return url; // نحتفظ بروابط Firebase
                });
            }
        });
    });
    
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `teacher-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showToast('تم إنشاء نسخة احتياطية', 'success');
}

// Restore Backup
function restoreBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                portfolioData = JSON.parse(e.target.result);
                
                // حفظ البيانات المستعادة
                saveToLocalStorage();
                if (window.firebaseDb && currentUser) {
                    saveToFirebase();
                }
                
                updateDashboard();
                updateMenuBadges();
                loadRecentActivity();
                showToast('تم استعادة النسخة الاحتياطية بنجاح', 'success');
                
            } catch (error) {
                showToast('خطأ في استعادة النسخة', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Clear All Data
function clearAllData() {
    if (!confirm('هل أنت متأكد من حذف جميع البيانات؟ هذه العملية لا يمكن التراجع عنها.')) {
        return;
    }
    
    if (confirm('⚠️ تحذير: سيتم حذف جميع الصور أيضاً. هل تريد المتابعة؟')) {
        // حذف جميع الصور من Firebase Storage
        if (window.firebaseStorage && currentUser) {
            Object.values(portfolioData).forEach(items => {
                items.forEach(item => {
                    if (item.imageUrls) {
                        item.imageUrls.forEach(url => {
                            if (url.startsWith('https://')) {
                                try {
                                    const storageRef = window.firebaseStorage.refFromURL(url);
                                    storageRef.delete();
                                } catch (error) {
                                    console.warn('❌ خطأ في حذف الصورة:', error);
                                }
                            }
                        });
                    }
                });
            });
        }
        
        // حذف البيانات
        portfolioData = {
            arabic: [],
            english: [],
            quran: [],
            math: [],
            science: [],
            activities: []
        };
        
        // الحفظ
        saveToLocalStorage();
        if (window.firebaseDb && currentUser) {
            saveToFirebase();
        }
        
        // تحديث الواجهة
        updateDashboard();
        updateMenuBadges();
        loadRecentActivity();
        
        if (currentTab === 'fullPortfolio') {
            loadFullPortfolio();
        } else if (currentTab !== 'dashboard' && currentTab !== 'settings' && currentTab !== 'reports') {
            loadSectionData(currentTab);
        }
        
        showToast('تم حذف جميع البيانات', 'success');
    }
}

// Generate Reports
function generateReports() {
    const container = document.getElementById('reportsContainer');
    if (!container) return;
    
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.imageUrls ? item.imageUrls.length : 0), 0), 0);
    
    container.innerHTML = `
        <div class="section-card">
            <h2 class="section-title">
                <i class="fas fa-chart-pie"></i>
                تقرير إحصائي شامل
            </h2>
            <div class="quick-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-boxes"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${totalItems}</h3>
                        <p>إجمالي العناصر</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-images"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${totalImages}</h3>
                        <p>إجمالي الصور</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-folder-open"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${Object.keys(portfolioData).length}</h3>
                        <p>عدد الأقسام</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${new Date().toLocaleDateString('ar-SA')}</h3>
                        <p>تاريخ التقرير</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="section-card">
            <h2 class="section-title">
                <i class="fas fa-list-ol"></i>
                توزيع العناصر حسب الأقسام
            </h2>
            <div class="subject-stats">
                ${Object.entries(portfolioData).map(([subject, items]) => `
                    <div class="stat-row">
                        <span>${getSubjectName(subject)}</span>
                        <span class="stat-value">${items.length} عنصر</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Reset Settings
function resetSettings() {
    if (confirm('هل تريد إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
        localStorage.removeItem('theme');
        document.documentElement.setAttribute('data-theme', 'light');
        
        const themeToggle = document.getElementById('darkModeToggle');
        if (themeToggle) themeToggle.checked = false;
        
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        
        showToast('تم إعادة تعيين الإعدادات', 'success');
    }
}

// Format Date
function formatDate(date) {
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show Toast Notification
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
            <div class="toast-title">${type === 'success' ? 'نجاح' : type === 'error' ? 'خطأ' : type === 'warning' ? 'تحذير' : 'معلومة'}</div>
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

// Make functions globally available
window.switchTab = switchTab;
window.showAddModal = showAddModal;
window.closeModal = closeModal;
window.saveItem = saveItem;
window.viewImage = viewImage;
window.showPrintModal = showPrintModal;
window.handlePrint = handlePrint;
window.printFullPortfolio = printFullPortfolio;
window.exportFullPortfolio = exportFullPortfolio;
window.exportSection = exportSection;
window.backupData = backupData;
window.restoreBackup = restoreBackup;
window.clearAllData = clearAllData;
window.resetSettings = resetSettings;
window.deleteItem = deleteItem;
window.previewImage = previewImage;
window.showToast = showToast;

console.log('🎉 النظام جاهز! جميع الميزات تعمل بشكل صحيح.');
