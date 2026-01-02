// نظام ملف الإنجاز - المعلمة فريال الغماري
console.log('🎓 نظام ملف الإنجاز - جاري التحميل...');

// ⚡ إعدادات Cloudinary المبسطة
const CLOUDINARY_CONFIG = {
    cloudName: 'demo', // للاختبار
    uploadPreset: 'ml_default', // preset عام
    apiUrl: 'https://api.cloudinary.com/v1_1/demo/upload'
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
let isLoading = false;

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تهيئة التطبيق...');
    
    try {
        // 1. إعداد الأحداث
        setupEventListeners();
        
        // 2. تحميل البيانات
        loadData();
        
        console.log('✅ تم تهيئة التطبيق بنجاح');
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة التطبيق:', error);
        showToast('حدث خطأ في تحميل التطبيق', 'error');
    }
});

// إعداد مستمعي الأحداث
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
    document.getElementById('itemForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveItem();
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
// 🔥 نظام Firebase فقط (بدون تخزين محلي)
// ==============================================

// تحميل البيانات
async function loadData() {
    if (isLoading) return;
    
    console.log('📥 جاري تحميل البيانات...');
    isLoading = true;
    
    try {
        // إظهار شاشة تحميل
        showLoading(true);
        
        if (window.firebaseDb) {
            await loadFromFirebase();
        } else {
            console.log('⚠️ Firebase غير متوفر');
            showToast('يرجى الاتصال بالإنترنت', 'error');
            
            // تحميل بيانات تجريبية صغيرة فقط
            loadMiniSampleData();
        }
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        showToast('حدث خطأ في تحميل البيانات', 'error');
        loadMiniSampleData();
    } finally {
        isLoading = false;
        showLoading(false);
    }
}

// تحميل من Firebase
async function loadFromFirebase() {
    try {
        console.log('🔗 جاري تحميل البيانات من Firebase...');
        
        // جلب كل الأقسام مرة واحدة
        const querySnapshot = await window.firebaseDb
            .collection('portfolio_items')
            .orderBy('timestamp', 'desc')
            .limit(100) // 100 عنصر فقط لكل تحميل
            .get();
        
        if (!querySnapshot.empty) {
            // إعادة تعيين البيانات
            portfolioData = {
                arabic: [],
                english: [],
                quran: [],
                math: [],
                science: [],
                activities: []
            };
            
            // تصنيف العناصر حسب القسم
            querySnapshot.forEach(doc => {
                const item = doc.data();
                const subject = item.subject || 'activities';
                
                if (portfolioData[subject]) {
                    portfolioData[subject].push(item);
                }
            });
            
            console.log(`✅ تم تحميل ${querySnapshot.size} عنصر من Firebase`);
            isFirebaseConnected = true;
            showToast('تم تحميل البيانات بنجاح', 'success');
        } else {
            console.log('📭 لا توجد بيانات في Firebase');
            isFirebaseConnected = true;
            loadMiniSampleData();
        }
        
        updateDashboard();
        
    } catch (error) {
        console.warn('⚠️ فشل تحميل Firebase:', error.message);
        isFirebaseConnected = false;
        showToast('فشل الاتصال بالسحابة', 'error');
        loadMiniSampleData();
    }
}

// تحميل بيانات تجريبية صغيرة
function loadMiniSampleData() {
    console.log('📝 جاري تحميل بيانات تجريبية صغيرة...');
    
    portfolioData = {
        arabic: [
            {
                id: '1',
                subject: 'arabic',
                title: 'حرف الألف',
                description: 'نشاط تعليمي',
                imageUrls: [
                    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&q=80'
                ],
                date: '١٤٤٥/٠٣/١٥',
                timestamp: Date.now()
            }
        ],
        english: [],
        quran: [],
        math: [],
        science: [],
        activities: []
    };
    
    updateDashboard();
    showToast('تم تحميل بيانات تجريبية', 'info');
}

// حفظ العنصر (Firebase فقط)
async function saveItem() {
    if (isLoading) return;
    
    console.log('💾 جاري حفظ العنصر...');
    
    const subject = document.getElementById('itemSubject').value;
    const name = document.getElementById('itemName').value.trim();
    const description = document.getElementById('itemDesc').value.trim();
    
    if (!name) {
        showToast('الرجاء إدخال العنوان', 'error');
        return;
    }
    
    if (!window.firebaseDb) {
        showToast('غير متصل بالسحابة، يرجى المحاولة لاحقاً', 'error');
        return;
    }
    
    isLoading = true;
    
    try {
        showToast('جارٍ حفظ العنصر في السحابة...', 'info');
        
        // إنشاء العنصر
        const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const item = {
            id: itemId,
            subject: subject,
            title: name,
            description: description || 'لا يوجد وصف',
            date: new Date().toLocaleDateString('ar-SA'),
            timestamp: Date.now(),
            imageUrls: [],
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // إضافة حقول خاصة
        switch(subject) {
            case 'arabic':
                item.letter = name;
                break;
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
        
        // معالجة الصور (بدون تخزين محلي)
        const image1 = document.getElementById('image1').files[0];
        const image2 = document.getElementById('image2').files[0];
        
        // رفع الصور إذا كانت صغيرة
        if (image1 && image1.size < 2 * 1024 * 1024) { // 2MB كحد أقصى
            try {
                const base64 = await convertToBase64(image1);
                // حفظ Base64 مباشرة في Firebase (للصور الصغيرة)
                item.imageUrls.push(base64.substring(0, 50000)); // خذ 50000 حرف فقط
            } catch (e) {
                console.warn('⚠️ فشل تحويل الصورة 1:', e);
            }
        } else if (image1) {
            showToast('الصورة كبيرة جداً، سيتم حفظها بدون صورة', 'warning');
        }
        
        if (image2 && image2.size < 2 * 1024 * 1024) {
            try {
                const base64 = await convertToBase64(image2);
                item.imageUrls.push(base64.substring(0, 50000));
            } catch (e) {
                console.warn('⚠️ فشل تحويل الصورة 2:', e);
            }
        } else if (image2) {
            showToast('الصورة كبيرة جداً، سيتم حفظها بدون صورة', 'warning');
        }
        
        // حفظ في Firebase فقط
        await window.firebaseDb.collection('portfolio_items').doc(itemId).set(item);
        
        console.log(`✅ تم حفظ العنصر في Firebase: ${itemId}`);
        
        // إضافة إلى البيانات الحالية للتحديث الفوري
        portfolioData[subject].unshift(item);
        
        // ✅ لا تحفظ في localStorage أبداً
        
        // تحديث الواجهة
        updateDashboard();
        updateSection(subject);
        
        // إغلاق النموذج
        closeModal();
        
        showToast('تم إضافة العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حفظ العنصر:', error);
        
        if (error.message.includes('quota') || error.message.includes('QuotaExceeded')) {
            showToast('الحساب تجاوز الحد المسموح، يرجى حذف بعض العناصر', 'error');
        } else {
            showToast('حدث خطأ في حفظ العنصر: ' + error.message, 'error');
        }
        
    } finally {
        isLoading = false;
    }
}

// تحويل إلى Base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// دالة جديدة: حذف عناصر قديمة لتوفير المساحة
async function cleanupOldItems() {
    try {
        showToast('جارٍ تنظيف العناصر القديمة...', 'info');
        
        // جلب كل العناصر
        const querySnapshot = await window.firebaseDb
            .collection('portfolio_items')
            .orderBy('timestamp')
            .get();
        
        if (querySnapshot.size > 50) { // إذا كان هناك أكثر من 50 عنصر
            const items = [];
            querySnapshot.forEach(doc => {
                items.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            // حذف النصف القديم
            const itemsToDelete = items.slice(0, Math.floor(items.length / 2));
            
            for (const item of itemsToDelete) {
                await window.firebaseDb.collection('portfolio_items').doc(item.id).delete();
            }
            
            console.log(`✅ تم حذف ${itemsToDelete.length} عنصر قديم`);
            showToast(`تم تنظيف ${itemsToDelete.length} عنصر قديم`, 'success');
            
            // إعادة تحميل البيانات
            loadData();
        }
        
    } catch (error) {
        console.warn('⚠️ فشل تنظيف العناصر:', error);
    }
}

// دالة جديدة: إظهار/إخفاء شاشة التحميل
function showLoading(show) {
    let loader = document.getElementById('loadingOverlay');
    
    if (!loader && show) {
        loader = document.createElement('div');
        loader.id = 'loadingOverlay';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-size: 20px;
            backdrop-filter: blur(5px);
        `;
        loader.innerHTML = `
            <div style="text-align: center;">
                <div style="
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #4361ee;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <p>جاري التحميل...</p>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(loader);
    } else if (loader && !show) {
        loader.remove();
    }
}

// ==============================================
// 🔄 باقي الدوال (معدلة)
// ==============================================

// تحديث لوحة التحكم
function updateDashboard() {
    console.log('📊 تحديث لوحة التحكم...');
    
    // حساب الإحصائيات
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.imageUrls ? item.imageUrls.length : 0), 0), 0);
    
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
    
    const completionRate = totalItems > 0 ? Math.min(100, Math.floor((totalItems / 50) * 100)) : 0;
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

// تحديث حالة الاتصال
function updateConnectionStatus() {
    const footerStats = document.getElementById('connectionStatus');
    if (footerStats) {
        if (isFirebaseConnected) {
            footerStats.innerHTML = 'Firebase Cloud <span style="color: #4CAF50;">(متصل)</span>';
        } else {
            footerStats.innerHTML = 'Firebase Cloud <span style="color: #f44336;">(غير متصل)</span>';
        }
    }
}

// تحديث العناصر الحديثة
function updateRecentItems() {
    const container = document.getElementById('recentItemsGrid');
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
    
    // أخذ 6 عناصر فقط
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
    
    // إضافة العناصر الحديثة
    recentItems.forEach(item => {
        const card = createItemCard(item, item.subject);
        container.appendChild(card);
    });
}

// إنشاء بطاقة عنصر (معدلة للصور الصغيرة)
function createItemCard(item, subject) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = item.id;
    
    const title = item.letter || item.surah || item.concept || item.title || 'عنصر جديد';
    const date = item.date || formatDate(new Date(item.timestamp || Date.now()));
    
    // استخدام صور افتراضية إذا كانت الصور فارغة
    let image1 = 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=300&q=80';
    let image2 = 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=300&q=80';
    
    if (item.imageUrls && item.imageUrls[0]) {
        image1 = item.imageUrls[0].length > 1000 ? item.imageUrls[0] : getDefaultImage(subject, 1);
    }
    
    if (item.imageUrls && item.imageUrls[1]) {
        image2 = item.imageUrls[1].length > 1000 ? item.imageUrls[1] : getDefaultImage(subject, 2);
    }
    
    card.innerHTML = `
        <div class="item-header">
            <div class="item-title">${title}</div>
            <div class="item-date">${date}</div>
        </div>
        <div class="item-body">
            <div class="item-description">${item.description || 'لا يوجد وصف'}</div>
            <div class="item-images">
                <div class="item-image" onclick="viewImage('${image1}')">
                    <img src="${image1}" alt="الصورة الأولى" loading="lazy" 
                         style="width: 100%; height: 150px; object-fit: cover;"
                         onerror="this.src='https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=300&q=80'">
                </div>
                <div class="item-image" onclick="viewImage('${image2}')">
                    <img src="${image2}" alt="الصورة الثانية" loading="lazy"
                         style="width: 100%; height: 150px; object-fit: cover;"
                         onerror="this.src='https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=300&q=80'">
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

// باقي الدوال تبقى كما هي...
// [أضف هنا بقية الدوال من النسخة السابقة]
// getDefaultImage(), getSubjectIcon(), addItem(), previewImage(),
// editItem(), deleteItem(), closeModal(), viewImage(), closeImageModal(),
// printPortfolio(), formatDate(), showToast(), showSubjectSelection()

// ==============================================
// إضافة زر تنظيف البيانات في HTML
// ==============================================

// في header-actions في HTML، أضف:
// <button class="btn btn-warning" onclick="cleanupOldItems()" title="تنظيف العناصر القديمة">
//     <i class="fas fa-broom"></i> تنظيف
// </button>

// جعل الدوال متاحة عالمياً

// الحصول على صورة افتراضية حسب القسم
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

// الحصول على أيقونة المادة
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

// إضافة عنصر
function addItem(subject) {
    console.log(`➕ إضافة عنصر إلى: ${subject}`);
    
    currentSubject = subject;
    
    // تحديد عنوان النموذج
    const titles = {
        arabic: 'إضافة حرف عربي',
        english: 'إضافة كلمة إنجليزية',
        quran: 'إضافة سورة قرآنية',
        math: 'إضافة مفهوم رياضي',
        science: 'إضافة تجربة علمية',
        activities: 'إضافة نشاط مدرسي'
    };
    
    const modalTitle = document.getElementById('modalTitle');
    const itemSubject = document.getElementById('itemSubject');
    
    if (modalTitle) modalTitle.textContent = titles[subject] || 'إضافة عنصر جديد';
    if (itemSubject) itemSubject.value = subject;
    
    // مسح النموذج
    const itemForm = document.getElementById('itemForm');
    if (itemForm) {
        itemForm.reset();
        delete itemForm.dataset.editId;
        delete itemForm.dataset.editMode;
    }
    
    // مسح معاينات الصور
    document.getElementById('preview1').innerHTML = '';
    document.getElementById('preview2').innerHTML = '';
    
    // إظهار النموذج
    document.getElementById('addModal').style.display = 'flex';
}

// معاينة الصورة
function previewImage(input, previewId) {
    const file = input.files[0];
    if (!file) return;
    
    // التحقق من حجم الصورة (5MB كحد أقصى)
    if (file.size > 5 * 1024 * 1024) {
        showToast('حجم الصورة كبير جداً (الحد الأقصى 5MB)', 'error');
        input.value = '';
        return;
    }
    
    // التحقق من نوع الصورة
    if (!file.type.match('image.*')) {
        showToast('الرجاء اختيار ملف صورة فقط', 'error');
        input.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = `<img src="${e.target.result}" alt="معاينة الصورة" style="max-width: 100%; max-height: 200px;">`;
    };
    reader.readAsDataURL(file);
}

// تعديل العنصر
function editItem(subject, itemId) {
    console.log(`✏️ تعديل العنصر: ${itemId}`);
    
    const item = portfolioData[subject].find(i => i.id === itemId);
    if (!item) {
        showToast('العنصر غير موجود', 'error');
        return;
    }
    
    currentSubject = subject;
    
    // تعبئة النموذج
    document.getElementById('modalTitle').textContent = 'تعديل العنصر';
    document.getElementById('itemSubject').value = subject;
    document.getElementById('itemName').value = item.letter || item.surah || item.concept || item.title || '';
    document.getElementById('itemDesc').value = item.description || '';
    
    // مسح معاينات الصور القديمة
    document.getElementById('preview1').innerHTML = '';
    document.getElementById('preview2').innerHTML = '';
    
    // إضافة معاينات للصور الموجودة
    if (item.imageUrls && item.imageUrls[0]) {
        document.getElementById('preview1').innerHTML = `<img src="${item.imageUrls[0]}" alt="الصورة الحالية" style="max-width: 100%; max-height: 200px;">`;
    }
    
    if (item.imageUrls && item.imageUrls[1]) {
        document.getElementById('preview2').innerHTML = `<img src="${item.imageUrls[1]}" alt="الصورة الحالية" style="max-width: 100%; max-height: 200px;">`;
    }
    
    // إظهار النموذج
    document.getElementById('addModal').style.display = 'flex';
    
    // حفظ معرف العنصر للنموذج
    document.getElementById('itemForm').dataset.editId = itemId;
    document.getElementById('itemForm').dataset.editMode = 'true';
}

// حذف العنصر
async function deleteItem(subject, itemId) {
    console.log(`🗑️ حذف العنصر: ${itemId}`);
    
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذه العملية.')) {
        return;
    }
    
    try {
        showToast('جارٍ حذف العنصر...', 'info');
        
        // حذف من Firebase
        if (window.firebaseDb) {
            await window.firebaseDb.collection('portfolio_items').doc(itemId).delete();
        }
        
        // حذف من البيانات المحلية
        portfolioData[subject] = portfolioData[subject].filter(item => item.id !== itemId);
        
        // تحديث التخزين المحلي
        localStorage.setItem('teacherPortfolio', JSON.stringify(portfolioData));
        
        console.log(`✅ تم حذف العنصر: ${itemId}`);
        
        // تحديث الواجهة
        updateDashboard();
        updateSection(subject);
        
        showToast('تم حذف العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حذف العنصر:', error);
        showToast('حدث خطأ في حذف العنصر', 'error');
    }
}

// إغلاق النموذج
function closeModal() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('itemForm').reset();
    document.getElementById('preview1').innerHTML = '';
    document.getElementById('preview2').innerHTML = '';
    delete document.getElementById('itemForm').dataset.editId;
    delete document.getElementById('itemForm').dataset.editMode;
}

// عرض الصورة
function viewImage(url) {
    if (!url) return;
    
    document.getElementById('modalImageView').src = url;
    document.getElementById('imageModal').style.display = 'flex';
}

// إغلاق نافذة الصورة
function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// طباعة الملف
function printPortfolio() {
    console.log('🖨️ جاري تحضير الطباعة...');
    
    // حفظ HTML الحالي
    const originalHTML = document.body.innerHTML;
    
    // إنشاء محتوى للطباعة
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
            </div>
    `;
    
    // إضافة كل قسم
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
                        ${subjectNames[subject]}
                    </h3>
            `;
            
            items.forEach(item => {
                const title = item.letter || item.surah || item.concept || item.title || 'عنصر';
                printContent += `
                    <div class="print-item">
                        <h4>${title}</h4>
                        <p><strong>التاريخ:</strong> ${item.date || 'غير محدد'}</p>
                        <p><strong>الوصف:</strong> ${item.description || 'لا يوجد وصف'}</p>
                        ${item.imageUrls && item.imageUrls.length > 0 ? `
                            <div class="print-images">
                                ${item.imageUrls.map((img, index) => 
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
    
    // فتح نافذة الطباعة
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    showToast('تم تحضير ملف الطباعة', 'success');
}

// تنسيق التاريخ
function formatDate(date) {
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// عرض الإشعارات
function showToast(message, type = 'info') {
    // إنشاء عنصر الإشعار
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
    
    // إضافة إلى الصفحة
    document.body.appendChild(toast);
    
    // إزالته تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// اختيار القسم للإضافة
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
window.cleanupOldItems = cleanupOldItems;

console.log('🎉 النظام جاهز! يستخدم Firebase فقط بدون تخزين محلي');
