// نظام ملف الإنجاز - المعلمة فريال الغماري - النسخة 3.0
console.log('🎓 نظام ملف الإنجاز - جاري التحميل...');

// ==============================================
// ⚙️ الإعدادات العامة
// ==============================================

// بيانات Cloudinary المجانية (نسخة معدلة)
const CLOUDINARY_CONFIG = {
    cloudName: 'demo', // للاختبار، يمكنك تغييره لحسابك
    uploadPreset: 'ml_default'
};

// البيانات العالمية
let portfolioData = {
    arabic: [],
    english: [],
    quran: [],
    math: [],
    science: [],
    activities: []
};

let currentSubject = null;
let isFirebaseConnected = false;
let appVersion = '3.0';

// ==============================================
// 🚀 تهيئة التطبيق
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تهيئة التطبيق - النسخة ' + appVersion);
    
    try {
        // 1. إعداد الأحداث
        setupEventListeners();
        
        // 2. تحميل البيانات
        loadData();
        
        // 3. عرض الصفحة الرئيسية
        updateDashboard();
        
        console.log('✅ تم تهيئة التطبيق بنجاح');
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة التطبيق:', error);
        showToast('حدث خطأ في تحميل التطبيق', 'error');
    }
});

// ==============================================
// 🔧 إعداد واجهة المستخدم
// ==============================================

function setupEventListeners() {
    console.log('🔧 جاري إعداد واجهة المستخدم...');
    
    // التبويبات
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // نموذج الإضافة
    document.getElementById('itemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveItem();
    });
    
    // معاينة الصور
    document.getElementById('image1').addEventListener('change', function(e) {
        previewImage(e.target, 'preview1');
    });
    
    document.getElementById('image2').addEventListener('change', function(e) {
        previewImage(e.target, 'preview2');
    });
    
    console.log('✅ تم إعداد واجهة المستخدم');
}

// ==============================================
// 📂 نظام التخزين المحلي الكامل (النسخة الجديدة)
// ==============================================

// تحميل البيانات
function loadData() {
    console.log('📥 جاري تحميل البيانات...');
    
    try {
        // محاولة التخزين المحلي أولاً
        loadFromLocalStorage();
        
        // محاولة Firebase في الخلفية (غير متزامن)
        setTimeout(() => {
            if (window.firebaseDb) {
                loadFromFirebase().catch(err => {
                    console.log('⚠️ فشل تحميل Firebase:', err.message);
                });
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        loadSampleData();
    }
}

// تحميل من التخزين المحلي
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('teacherPortfolio_v3');
    if (savedData) {
        try {
            portfolioData = JSON.parse(savedData);
            console.log('✅ تم تحميل البيانات من التخزين المحلي');
            updateDashboard();
        } catch (e) {
            console.error('❌ خطأ في تحليل البيانات المحلية:', e);
            loadSampleData();
        }
    } else {
        loadSampleData();
    }
}

// تحميل من Firebase (إذا كان متوفراً)
async function loadFromFirebase() {
    try {
        if (!window.firebaseDb || typeof window.firebaseDb.collection !== 'function') {
            throw new Error('Firebase غير متوفر');
        }
        
        console.log('🔗 محاولة تحميل البيانات من Firebase...');
        
        // محاولة جلب بيانات النسخة 3
        const docRef = window.firebaseDb.collection('portfolio_v3').doc('data');
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
            const firebaseData = docSnap.data();
            portfolioData = firebaseData.portfolio || portfolioData;
            
            // حفظ نسخة محلية
            localStorage.setItem('teacherPortfolio_v3', JSON.stringify(portfolioData));
            
            console.log('✅ تم تحميل البيانات من Firebase');
            isFirebaseConnected = true;
            showToast('تم مزامنة البيانات مع السحابة', 'success');
            updateDashboard();
        } else {
            console.log('📭 لا توجد بيانات في Firebase');
            isFirebaseConnected = true;
        }
        
    } catch (error) {
        console.warn('⚠️ فشل تحميل Firebase:', error.message);
        isFirebaseConnected = false;
    }
}

// تحميل بيانات نموذجية
function loadSampleData() {
    console.log('📝 جاري تحميل بيانات نموذجية...');
    
    portfolioData = {
        arabic: [
            {
                id: '1',
                subject: 'arabic',
                title: 'حرف الألف',
                description: 'تعلم حرف الألف مع نشاط الرسم والتلوين',
                images: [
                    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80'
                ],
                date: '١٤٤٥/٠٣/١٥',
                timestamp: Date.now(),
                type: 'letter'
            }
        ],
        english: [
            {
                id: '2',
                subject: 'english',
                title: 'حرف A',
                description: 'Learning letter A with fun activities',
                images: [
                    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80'
                ],
                date: '١٤٤٥/٠٣/١٤',
                timestamp: Date.now() - 86400000,
                type: 'letter'
            }
        ],
        quran: [],
        math: [],
        science: [],
        activities: []
    };
    
    localStorage.setItem('teacherPortfolio_v3', JSON.stringify(portfolioData));
    showToast('تم تحميل بيانات نموذجية للبدء', 'info');
}

// ==============================================
// 💾 حفظ البيانات
// ==============================================

async function saveItem() {
    console.log('💾 جاري حفظ العنصر...');
    
    const subject = document.getElementById('itemSubject').value;
    const name = document.getElementById('itemName').value.trim();
    const description = document.getElementById('itemDesc').value.trim();
    
    if (!name) {
        showToast('الرجاء إدخال العنوان', 'error');
        return;
    }
    
    try {
        showToast('جارٍ حفظ العنصر...', 'info');
        
        // إنشاء العنصر
        const itemId = Date.now().toString();
        const item = {
            id: itemId,
            subject: subject,
            title: name,
            description: description,
            date: new Date().toLocaleDateString('ar-SA'),
            timestamp: Date.now(),
            images: [],
            type: getItemType(subject)
        };
        
        // إضافة حقول خاصة
        addSpecialFields(item, subject, name);
        
        // معالجة الصور
        const image1 = document.getElementById('image1').files[0];
        const image2 = document.getElementById('image2').files[0];
        
        if (image1) {
            const url1 = await processImage(image1);
            if (url1) item.images.push(url1);
        }
        
        if (image2) {
            const url2 = await processImage(image2);
            if (url2) item.images.push(url2);
        }
        
        // إضافة إلى البيانات المحلية
        if (!portfolioData[subject]) {
            portfolioData[subject] = [];
        }
        portfolioData[subject].unshift(item);
        
        // حفظ في التخزين المحلي
        saveToLocalStorage();
        console.log('✅ تم الحفظ في التخزين المحلي');
        
        // محاولة الحفظ في Firebase (غير متزامن)
        try {
            if (window.firebaseDb && typeof window.firebaseDb.collection === 'function') {
                await saveToFirebase();
            }
        } catch (firebaseError) {
            console.warn('⚠️ فشل الحفظ في Firebase:', firebaseError.message);
        }
        
        // تحديث الواجهة
        updateDashboard();
        updateSection(subject);
        
        // إغلاق النموذج
        closeModal();
        
        showToast('تم إضافة العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حفظ العنصر:', error);
        showToast('حدث خطأ في حفظ العنصر', 'error');
    }
}

// معالجة الصورة
async function processImage(imageFile) {
    try {
        if (!imageFile) return null;
        
        // 1. محاولة Cloudinary
        try {
            const cloudinaryUrl = await uploadToCloudinary(imageFile);
            if (cloudinaryUrl) return cloudinaryUrl;
        } catch (e) {
            console.log('⚠️ فشل Cloudinary، استخدام Base64:', e.message);
        }
        
        // 2. بديل: Base64 محلي
        const base64Url = await convertToBase64(imageFile);
        return base64Url;
        
    } catch (error) {
        console.warn('⚠️ فشل معالجة الصورة:', error.message);
        return null;
    }
}

// رفع إلى Cloudinary
async function uploadToCloudinary(imageFile) {
    return new Promise((resolve, reject) => {
        // إذا كان Cloudinary غير متوفر، استخدم Base64
        if (!CLOUDINARY_CONFIG.cloudName || CLOUDINARY_CONFIG.cloudName === 'demo') {
            reject('Cloudinary غير مضبوط');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        
        fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/upload`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.secure_url) {
                resolve(data.secure_url);
            } else {
                reject('فشل الرفع');
            }
        })
        .catch(reject);
    });
}

// تحويل إلى Base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        // ضغط الصورة أولاً
        compressImage(file, 0.7, 800).then(blob => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        }).catch(() => {
            // إذا فشل الضغط، استخدم الملف كما هو
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });
}

// ضغط الصورة
function compressImage(file, quality = 0.7, maxWidth = 800) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject('فشل الضغط');
                    }
                }, 'image/jpeg', quality);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// حفظ في التخزين المحلي
function saveToLocalStorage() {
    localStorage.setItem('teacherPortfolio_v3', JSON.stringify(portfolioData));
}

// حفظ في Firebase
async function saveToFirebase() {
    if (!window.firebaseDb) return;
    
    try {
        await window.firebaseDb.collection('portfolio_v3').doc('data').set({
            portfolio: portfolioData,
            lastUpdated: Date.now(),
            version: appVersion,
            totalItems: Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0)
        });
        console.log('✅ تم الحفظ في Firebase');
        isFirebaseConnected = true;
    } catch (error) {
        console.warn('⚠️ فشل الحفظ في Firebase:', error.message);
        isFirebaseConnected = false;
    }
}

// ==============================================
// 🛠️ دوال مساعدة
// ==============================================

function getItemType(subject) {
    const types = {
        arabic: 'letter',
        english: 'letter',
        quran: 'surah',
        math: 'concept',
        science: 'experiment',
        activities: 'activity'
    };
    return types[subject] || 'item';
}

function addSpecialFields(item, subject, name) {
    switch(subject) {
        case 'arabic':
        case 'english':
            item.letter = name;
            break;
        case 'quran':
            item.surah = name;
            break;
        case 'math':
        case 'science':
            item.concept = name;
            break;
    }
}

// ==============================================
// 📊 تحديث الواجهة
// ==============================================

function updateDashboard() {
    console.log('📊 تحديث لوحة التحكم...');
    
    // حساب الإحصائيات
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.images ? item.images.length : 0), 0), 0);
    
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const recentItems = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.filter(item => {
            const itemDate = new Date(item.timestamp || Date.now());
            return itemDate.getMonth() === thisMonth && itemDate.getFullYear() === thisYear;
        }).length, 0);
    
    // تحديث DOM
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalImages').textContent = totalImages;
    document.getElementById('recentItems').textContent = recentItems;
    
    const completionRate = totalItems > 0 ? Math.min(100, Math.floor((totalItems / 100) * 100)) : 0;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
    
    // تحديث حالة الاتصال
    updateConnectionStatus();
    
    // تحديث العناصر الحديثة
    updateRecentItems();
    
    // تحديث كل قسم
    Object.keys(portfolioData).forEach(subject => {
        updateSection(subject);
    });
}

function updateConnectionStatus() {
    const footerStats = document.getElementById('connectionStatus');
    if (footerStats) {
        const statusText = isFirebaseConnected ? 
            `نسخة ${appVersion} - متصل بالسحابة` : 
            `نسخة ${appVersion} - يعمل بدون إنترنت`;
        footerStats.textContent = statusText;
    }
}

// ==============================================
// 🎨 دوال العرض
// ==============================================

function updateRecentItems() {
    const container = document.getElementById('recentItemsGrid');
    if (!container) return;
    
    // جمع جميع العناصر
    const allItems = [];
    Object.keys(portfolioData).forEach(subject => {
        portfolioData[subject].forEach(item => {
            allItems.push({ ...item, subject: subject });
        });
    });
    
    // ترتيب حسب التاريخ
    allItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // أخذ 6 عناصر
    const recentItems = allItems.slice(0, 6);
    
    // مسح المحتوى القديم
    container.innerHTML = '';
    
    if (recentItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>لا توجد عناصر حديثة</h3>
                <p>ابدأ بإضافة عناصر جديدة إلى ملف الإنجاز</p>
            </div>
        `;
        return;
    }
    
    // إضافة العناصر
    recentItems.forEach(item => {
        const card = createItemCard(item, item.subject);
        container.appendChild(card);
    });
}

function switchTab(tabId) {
    console.log(`🔄 تبديل إلى التبويب: ${tabId}`);
    
    // تحديث التبويبات
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        }
    });
    
    // تحديث المحتوى
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
        }
    });
    
    // تحديث العنوان
    const tabNames = {
        all: 'الرئيسية',
        arabic: 'اللغة العربية',
        english: 'الإنجليزية',
        quran: 'القرآن الكريم',
        math: 'الرياضيات',
        science: 'العلوم',
        activities: 'النشاطات'
    };
    
    document.title = `${tabNames[tabId] || tabId} - ملف إنجاز المعلمة فريال`;
}

function updateSection(subject) {
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
                <button class="btn btn-primary" onclick="addItem('${subject}')">
                    <i class="fas fa-plus"></i> إضافة أول عنصر
                </button>
            </div>
        `;
        return;
    }
    
    // ترتيب العناصر
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // إضافة العناصر
    items.forEach(item => {
        const card = createItemCard(item, subject);
        container.appendChild(card);
    });
}

function createItemCard(item, subject) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = item.id;
    
    const title = item.letter || item.surah || item.concept || item.title || 'عنصر جديد';
    const date = item.date || formatDate(new Date(item.timestamp || Date.now()));
    
    // صور افتراضية إذا لزم
    const image1 = item.images && item.images[0] ? item.images[0] : getDefaultImage(subject, 1);
    const image2 = item.images && item.images[1] ? item.images[1] : getDefaultImage(subject, 2);
    
    card.innerHTML = `
        <div class="item-header">
            <div class="item-title">${title}</div>
            <div class="item-date">${date}</div>
        </div>
        <div class="item-body">
            <div class="item-description">${item.description || 'لا يوجد وصف'}</div>
            <div class="item-images">
                <div class="item-image" onclick="viewImage('${image1}')">
                    <img src="${image1}" alt="الصورة الأولى" onerror="this.src='https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80'">
                </div>
                <div class="item-image" onclick="viewImage('${image2}')">
                    <img src="${image2}" alt="الصورة الثانية" onerror="this.src='https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80'">
                </div>
            </div>
            <div class="item-actions">
                <button class="action-btn edit" onclick="editItem('${subject}', '${item.id}')">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="action-btn delete" onclick="deleteItem('${subject}', '${item.id}')">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ==============================================
// 🔧 دوال التحكم
// ==============================================

function addItem(subject) {
    console.log(`➕ إضافة عنصر إلى: ${subject}`);
    
    currentSubject = subject;
    
    const titles = {
        arabic: 'إضافة حرف عربي',
        english: 'إضافة كلمة إنجليزية',
        quran: 'إضافة سورة قرآنية',
        math: 'إضافة مفهوم رياضي',
        science: 'إضافة تجربة علمية',
        activities: 'إضافة نشاط مدرسي'
    };
    
    document.getElementById('modalTitle').textContent = titles[subject] || 'إضافة عنصر جديد';
    document.getElementById('itemSubject').value = subject;
    
    // مسح النموذج
    document.getElementById('itemForm').reset();
    document.getElementById('preview1').innerHTML = '';
    document.getElementById('preview2').innerHTML = '';
    delete document.getElementById('itemForm').dataset.editId;
    
    // إظهار النموذج
    document.getElementById('addModal').style.display = 'flex';
}

function editItem(subject, itemId) {
    console.log(`✏️ تعديل العنصر: ${itemId}`);
    
    const item = portfolioData[subject].find(i => i.id === itemId);
    if (!item) return;
    
    currentSubject = subject;
    
    // تعبئة النموذج
    document.getElementById('modalTitle').textContent = 'تعديل العنصر';
    document.getElementById('itemSubject').value = subject;
    document.getElementById('itemName').value = item.letter || item.surah || item.concept || item.title || '';
    document.getElementById('itemDesc').value = item.description || '';
    
    // مسح المعاينات
    document.getElementById('preview1').innerHTML = '';
    document.getElementById('preview2').innerHTML = '';
    
    // إضافة معاينات للصور الموجودة
    if (item.images && item.images[0]) {
        document.getElementById('preview1').innerHTML = `<img src="${item.images[0]}" alt="الصورة الحالية">`;
    }
    
    if (item.images && item.images[1]) {
        document.getElementById('preview2').innerHTML = `<img src="${item.images[1]}" alt="الصورة الحالية">`;
    }
    
    // إظهار النموذج
    document.getElementById('addModal').style.display = 'flex';
    document.getElementById('itemForm').dataset.editId = itemId;
}

async function deleteItem(subject, itemId) {
    console.log(`🗑️ حذف العنصر: ${itemId}`);
    
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذه العملية.')) {
        return;
    }
    
    try {
        showToast('جارٍ حذف العنصر...', 'info');
        
        // حذف من البيانات المحلية
        portfolioData[subject] = portfolioData[subject].filter(item => item.id !== itemId);
        
        // تحديث التخزين المحلي
        saveToLocalStorage();
        
        // محاولة تحديث Firebase
        try {
            if (window.firebaseDb) {
                await saveToFirebase();
            }
        } catch (firebaseError) {
            console.warn('⚠️ فشل التحديث في Firebase:', firebaseError.message);
        }
        
        // تحديث الواجهة
        updateDashboard();
        updateSection(subject);
        
        showToast('تم حذف العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حذف العنصر:', error);
        showToast('حدث خطأ في حذف العنصر', 'error');
    }
}

function clearSectionData(subject) {
    if (!confirm(`هل أنت متأكد من حذف جميع عناصر قسم "${subject}"؟`)) {
        return;
    }
    
    portfolioData[subject] = [];
    saveToLocalStorage();
    updateDashboard();
    updateSection(subject);
    showToast(`تم تنظيف قسم ${subject}`, 'success');
}

// ==============================================
// 📤 تصدير واستيراد
// ==============================================

function exportData() {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `ملف-الإنجاز-${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
    
    showToast('تم تصدير البيانات بنجاح', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // التحقق من صحة البيانات
            if (importedData.arabic !== undefined) {
                portfolioData = importedData;
                saveToLocalStorage();
                updateDashboard();
                showToast('تم استيراد البيانات بنجاح', 'success');
            } else {
                showToast('ملف غير صالح', 'error');
            }
        } catch (error) {
            console.error('❌ خطأ في استيراد البيانات:', error);
            showToast('ملف غير صالح', 'error');
        }
    };
    reader.readAsText(file);
    
    // إعادة تعيين قيمة الإدخال
    event.target.value = '';
}

async function syncWithFirebase() {
    try {
        if (!window.firebaseDb) {
            showToast('Firebase غير متوفر', 'error');
            return;
        }
        
        showToast('جارٍ المزامنة مع السحابة...', 'info');
        
        await saveToFirebase();
        
        showToast('تمت المزامنة بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في المزامنة:', error);
        showToast('فشلت المزامنة', 'error');
    }
}

// ==============================================
// 🎭 دوال واجهة المستخدم
// ==============================================

function previewImage(input, previewId) {
    const file = input.files[0];
    if (!file) return;
    
    // التحقق من الحجم (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
        showToast('حجم الصورة كبير جداً (الحد الأقصى 5MB)', 'error');
        input.value = '';
        return;
    }
    
    // التحقق من النوع
    if (!file.type.match('image.*')) {
        showToast('الرجاء اختيار ملف صورة فقط', 'error');
        input.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = `<img src="${e.target.result}" alt="معاينة الصورة">`;
    };
    reader.readAsDataURL(file);
}

function showSubjectSelection() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(5px);
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 15px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        ">
            <h3 style="margin-bottom: 30px; color: #333;">اختر القسم</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <button onclick="addItem('arabic'); this.closest('.modal').remove()" style="
                    padding: 20px;
                    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                ">
                    <i class="fas fa-book"></i>
                    <span>العربية</span>
                </button>
                
                <button onclick="addItem('english'); this.closest('.modal').remove()" style="
                    padding: 20px;
                    background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                ">
                    <i class="fas fa-language"></i>
                    <span>الإنجليزية</span>
                </button>
                
                <button onclick="addItem('quran'); this.closest('.modal').remove()" style="
                    padding: 20px;
                    background: linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                ">
                    <i class="fas fa-book-quran"></i>
                    <span>القرآن</span>
                </button>
                
                <button onclick="addItem('math'); this.closest('.modal').remove()" style="
                    padding: 20px;
                    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                ">
                    <i class="fas fa-calculator"></i>
                    <span>الرياضيات</span>
                </button>
                
                <button onclick="addItem('science'); this.closest('.modal').remove()" style="
                    padding: 20px;
                    background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                ">
                    <i class="fas fa-flask"></i>
                    <span>العلوم</span>
                </button>
                
                <button onclick="addItem('activities'); this.closest('.modal').remove()" style="
                    padding: 20px;
                    background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 1.1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                ">
                    <i class="fas fa-chalkboard-teacher"></i>
                    <span>النشاطات</span>
                </button>
            </div>
            <button onclick="this.closest('.modal').remove()" style="
                margin-top: 30px;
                padding: 10px 30px;
                background: #f1f3f5;
                border: none;
                border-radius: 8px;
                color: #666;
                cursor: pointer;
                font-size: 1rem;
            ">
                إلغاء
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ==============================================
// 🖼️ دوال العرض العامة
// ==============================================

function getDefaultImage(subject, index) {
    const defaultImages = {
        arabic: [
            'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80',
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80'
        ],
        english: [
            'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=80',
            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80'
        ],
        quran: [
            'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80',
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'
        ],
        math: [
            'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80',
            'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&q=80'
        ],
        science: [
            'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80',
            'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&q=80'
        ],
        activities: [
            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80',
            'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80'
        ]
    };
    
    return defaultImages[subject] ? defaultImages[subject][index - 1] : 
           'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80';
}

function getSubjectIcon(subject) {
    const icons = {
        arabic: 'fas fa-book',
        english: 'fas fa-language',
        quran: 'fas fa-book-quran',
        math: 'fas fa-calculator',
        science: 'fas fa-flask',
        activities: 'fas fa-chalkboard-teacher',
        all: 'fas fa-home'
    };
    return icons[subject] || 'fas fa-file';
}

function viewImage(url) {
    if (!url) return;
    
    document.getElementById('modalImageView').src = url;
    document.getElementById('imageModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('itemForm').reset();
    document.getElementById('preview1').innerHTML = '';
    document.getElementById('preview2').innerHTML = '';
    delete document.getElementById('itemForm').dataset.editId;
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

function printPortfolio() {
    console.log('🖨️ جاري تحضير الطباعة...');
    
    const originalHTML = document.body.innerHTML;
    
    let printContent = `
        <html dir="rtl">
        <head>
            <title>ملف إنجاز المعلمة فريال الغماري</title>
            <style>
                body { font-family: 'Tajawal', sans-serif; padding: 20px; }
                .print-header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #333; padding-bottom: 20px; }
                .print-section { margin-bottom: 40px; page-break-inside: avoid; }
                .print-item { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 10px; }
                .print-images { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
                .print-images img { max-width: 200px; max-height: 150px; object-fit: cover; border: 1px solid #ddd; }
                @page { margin: 2cm; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="print-header">
                <h1>ملف إنجاز المعلمة</h1>
                <h2>فريال عبدالله الغماري</h2>
                <p>ابتدائية النخبة - العام الدراسي ١٤٤٥-١٤٤٦ هـ</p>
                <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
                <p>إجمالي العناصر: ${Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0)}</p>
            </div>
    `;
    
    Object.keys(portfolioData).forEach(subject => {
        const items = portfolioData[subject];
        if (items.length > 0) {
            const subjectNames = {
                arabic: 'اللغة العربية',
                english: 'اللغة الإنجليزية',
                quran: 'القرآن الكريم',
                math: 'الرياضيات',
                science: 'العلوم',
                activities: 'النشاطات المدرسية'
            };
            
            printContent += `
                <div class="print-section">
                    <h3 style="color: #4361ee; border-bottom: 2px solid #4361ee; padding-bottom: 10px;">
                        ${subjectNames[subject]} (${items.length} عنصر)
                    </h3>
            `;
            
            items.forEach(item => {
                const title = item.letter || item.surah || item.concept || item.title || 'عنصر';
                printContent += `
                    <div class="print-item">
                        <h4>${title}</h4>
                        <p><strong>التاريخ:</strong> ${item.date || 'غير محدد'}</p>
                        <p><strong>الوصف:</strong> ${item.description || 'لا يوجد وصف'}</p>
                        ${item.images && item.images.length > 0 ? `
                            <div class="print-images">
                                ${item.images.map((img, index) => 
                                    `<img src="${img}" alt="الصورة ${index + 1}" onerror="this.style.display='none'">`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
            });
            
            printContent += `</div>`;
        }
    });
    
    printContent += `
            <div class="no-print" style="text-align: center; margin-top: 50px;">
                <button onclick="window.print()" style="padding: 10px 30px; background: #4361ee; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    طباعة
                </button>
                <button onclick="window.close()" style="padding: 10px 30px; background: #666; color: white; border: none; border-radius: 5px; margin-right: 10px; cursor: pointer;">
                    إغلاق
                </button>
            </div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    showToast('تم تحضير ملف الطباعة', 'success');
}

function formatDate(date) {
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showToast(message, type = 'info') {
    // إزالة الإشعارات القديمة
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    // إنشاء الإشعار
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="${icons[type] || 'fas fa-info-circle'}"></i>
        <div class="toast-content">
            <div class="toast-title">${type === 'success' ? 'نجاح' : type === 'error' ? 'خطأ' : 'معلومة'}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    // إزالته تلقائياً
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// ==============================================
// 🌍 جعل الدوال متاحة عالمياً
// ==============================================

window.switchTab = switchTab;
window.addItem = addItem;
window.closeModal = closeModal;
window.closeImageModal = closeImageModal;
window.saveItem = saveItem;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.viewImage = viewImage;
window.printPortfolio = printPortfolio;
window.showSubjectSelection = showSubjectSelection;
window.syncWithFirebase = syncWithFirebase;
window.exportData = exportData;
window.importData = importData;
window.clearSectionData = clearSectionData;

console.log(`🎉 النظام جاهز! النسخة ${appVersion} (مثبتة ومحسنة)`);
