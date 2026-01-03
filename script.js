// نظام ملف الإنجاز - المعلمة فريال الغماري
console.log('🎓 نظام ملف الإنجاز - جاري التحميل...');

// البيانات العالمية
let portfolioData = {
    arabic: [],
    english: [],
    quran: [],
    math: [],
    science: [],
    activities: [],
    lastUpdated: new Date().toISOString()
};

let currentSubject = null;

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 بدء تهيئة التطبيق...');
    
    try {
        // 1. إعداد الأحداث
        setupEventListeners();
        
        // 2. تحميل البيانات من Cloudinary
        await loadDataFromCloudinary();
        
        // 3. عرض الصفحة الرئيسية
        updateDashboard();
        
        console.log('✅ تم تهيئة التطبيق بنجاح');
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة التطبيق:', error);
        showToast('حدث خطأ في تحميل التطبيق', 'error');
        loadSampleDataForDisplay();
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
    
    console.log('✅ تم إعداد واجهة المستخدم');
}

// تحميل البيانات من Cloudinary
async function loadDataFromCloudinary() {
    console.log('📥 جاري تحميل البيانات من Cloudinary...');
    
    try {
        // محاولة تحميل ملف JSON من Cloudinary
        const portfolioUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/raw/upload/v1/${PORTFOLIO_FILE_NAME}`;
        
        const response = await fetch(portfolioUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            portfolioData = data;
            console.log('✅ تم تحميل البيانات من Cloudinary:', portfolioData);
            showToast('تم تحميل البيانات من السحابة', 'success');
        } else {
            // الملف غير موجود، سنخلق ملفاً جديداً
            console.log('📝 إنشاء ملف جديد في Cloudinary...');
            await initializePortfolioInCloudinary();
        }
        
    } catch (error) {
        console.warn('⚠️ فشل تحميل البيانات من Cloudinary:', error.message);
        
        // محاولة بديلة: استخدام قاعدة بيانات نصية في Cloudinary
        try {
            await loadDataFromCloudinaryDatabase();
        } catch (dbError) {
            console.error('❌ فشل تحميل البيانات:', dbError);
            throw new Error('لا يمكن تحميل البيانات');
        }
    }
}

// طريقة بديلة: تخزين البيانات كقاعدة بيانات نصية في Cloudinary
async function loadDataFromCloudinaryDatabase() {
    console.log('🔍 محاولة طريقة بديلة لتحميل البيانات...');
    
    // هنا يمكننا استخدام خواص Cloudinary الإضافية
    // لكن للتبسيط، سنستخدم ملف JSON مباشرة
    const publicId = `portfolio/${PORTFOLIO_FILE_NAME}`;
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/resources/raw/upload/${publicId}`;
    
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            portfolioData = JSON.parse(data.content || '{}');
            console.log('✅ تم تحميل البيانات من قاعدة Cloudinary');
        } else {
            await initializePortfolioInCloudinary();
        }
    } catch (error) {
        console.error('❌ خطأ في الطريقة البديلة:', error);
        throw error;
    }
}

// تهيئة ملف الإنجاز في Cloudinary
async function initializePortfolioInCloudinary() {
    console.log('📝 إنشاء ملف إنجاز جديد...');
    
    portfolioData = {
        arabic: [],
        english: [],
        quran: [],
        math: [],
        science: [],
        activities: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
    
    try {
        // رفع ملف JSON فارغ إلى Cloudinary
        await saveDataToCloudinary();
        console.log('✅ تم إنشاء ملف جديد في Cloudinary');
        showToast('تم إنشاء ملف إنجاز جديد', 'info');
    } catch (error) {
        console.error('❌ خطأ في إنشاء الملف:', error);
        showToast('جارٍ استخدام البيانات المحلية', 'info');
    }
}

// حفظ البيانات في Cloudinary
async function saveDataToCloudinary() {
    try {
        // تحويل البيانات إلى JSON
        const jsonData = JSON.stringify(portfolioData, null, 2);
        
        // إنشاء Blob من JSON
        const blob = new Blob([jsonData], { type: 'application/json' });
        
        // إنشاء FormData
        const formData = new FormData();
        formData.append('file', blob, PORTFOLIO_FILE_NAME);
        formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        formData.append('public_id', `portfolio/${PORTFOLIO_FILE_NAME}`);
        formData.append('resource_type', 'raw');
        
        // رفع الملف إلى Cloudinary
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/raw/upload`,
            {
                method: 'POST',
                body: formData
            }
        );
        
        if (!response.ok) {
            throw new Error('فشل في رفع الملف');
        }
        
        console.log('✅ تم حفظ البيانات في Cloudinary');
        return true;
        
    } catch (error) {
        console.error('❌ خطأ في حفظ البيانات:', error);
        throw error;
    }
}

// تحميل بيانات نموذجية للعرض فقط
function loadSampleDataForDisplay() {
    console.log('📝 جاري تحميل بيانات نموذجية للعرض...');
    
    portfolioData = {
        arabic: [
            {
                id: '1',
                title: 'حرف الألف',
                description: 'تعلم حرف الألف مع نشاط الرسم والتلوين',
                images: [
                    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80'
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
}

// تحديث لوحة التحكم
function updateDashboard() {
    console.log('📊 تحديث لوحة التحكم...');
    
    // حساب الإحصائيات
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => 
        Array.isArray(arr) ? sum + arr.length : sum, 0);
    
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => {
        if (!Array.isArray(arr)) return sum;
        return sum + arr.reduce((imgSum, item) => 
            imgSum + (item.images ? item.images.length : 0), 0);
    }, 0);
    
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const recentItems = Object.values(portfolioData).reduce((sum, arr) => {
        if (!Array.isArray(arr)) return sum;
        return sum + arr.filter(item => {
            const itemDate = new Date(item.timestamp || Date.now());
            return itemDate.getMonth() === thisMonth && itemDate.getFullYear() === thisYear;
        }).length;
    }, 0);
    
    // تحديث DOM
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalImages').textContent = totalImages;
    document.getElementById('recentItems').textContent = recentItems;
    
    const completionRate = totalItems > 0 ? Math.min(100, Math.floor((totalItems / 100) * 100)) : 0;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
    
    // تحديث العناصر الحديثة
    updateRecentItems();
    
    // تحديث كل قسم
    Object.keys(portfolioData).forEach(subject => {
        if (Array.isArray(portfolioData[subject])) {
            updateSection(subject);
        }
    });
}

// تحديث العناصر الحديثة
function updateRecentItems() {
    const container = document.getElementById('recentItemsGrid');
    if (!container) return;
    
    // جمع جميع العناصر
    const allItems = [];
    Object.keys(portfolioData).forEach(subject => {
        if (Array.isArray(portfolioData[subject])) {
            portfolioData[subject].forEach(item => {
                allItems.push({
                    ...item,
                    subject: subject
                });
            });
        }
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

// تبديل التبويب
function switchTab(tabId) {
    console.log(`🔄 تبديل إلى التبويب: ${tabId}`);
    
    // تحديث التبويبات النشطة
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
}

// تحديث قسم معين
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
    
    // ترتيب العناصر (الأحدث أولاً)
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // إضافة العناصر
    items.forEach(item => {
        const card = createItemCard(item, subject);
        container.appendChild(card);
    });
}

// إنشاء بطاقة عنصر
function createItemCard(item, subject) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = item.id;
    
    const title = item.letter || item.surah || item.concept || item.title || 'عنصر جديد';
    const date = item.date || formatDate(new Date(item.timestamp || Date.now()));
    
    // استخدام صور افتراضية إذا كانت الصور فارغة
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
        activities: 'fas fa-chalkboard-teacher'
    };
    return icons[subject] || 'fas fa-file';
}

// فتح واجهة رفع Cloudinary
function openUploadWidget(inputId) {
    const myWidget = cloudinary.createUploadWidget({
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        maxFileSize: 5000000, // 5MB
        folder: 'teacher_portfolio',
        resource_type: 'auto',
        cropping: false
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            const secureUrl = result.info.secure_url;
            
            // حفظ الرابط في الحقل المخفي
            document.getElementById(`${inputId}Url`).value = secureUrl;
            
            // عرض معاينة الصورة
            const previewDiv = document.getElementById(`preview${inputId.slice(-1)}`);
            previewDiv.innerHTML = `<img src="${secureUrl}" alt="الصورة المرفوعة" style="max-width:100%; max-height:200px; object-fit:contain;">`;
            
            showToast('تم رفع الصورة بنجاح', 'success');
        } else if (error) {
            console.error('❌ خطأ في رفع الصورة:', error);
            showToast('حدث خطأ في رفع الصورة', 'error');
        }
    });
    
    myWidget.open();
}

// إضافة عنصر
function addItem(subject) {
    console.log(`➕ إضافة عنصر إلى: ${subject}`);
    
    // تحديد عنوان النموذج
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
    document.getElementById('itemId').value = '';
    
    // مسح النموذج
    document.getElementById('itemForm').reset();
    document.getElementById('image1Url').value = '';
    document.getElementById('image2Url').value = '';
    
    // إعادة تعيين معاينات الصور
    document.getElementById('preview1').innerHTML = `
        <div class="upload-placeholder" onclick="openUploadWidget('image1')">
            <i class="fas fa-cloud-upload-alt"></i>
            <span>انقر لرفع صورة</span>
        </div>
    `;
    
    document.getElementById('preview2').innerHTML = `
        <div class="upload-placeholder" onclick="openUploadWidget('image2')">
            <i class="fas fa-cloud-upload-alt"></i>
            <span>انقر لرفع صورة</span>
        </div>
    `;
    
    // إظهار النموذج
    document.getElementById('addModal').style.display = 'flex';
}

// حفظ العنصر
async function saveItem() {
    console.log('💾 جاري حفظ العنصر...');
    
    const subject = document.getElementById('itemSubject').value;
    const name = document.getElementById('itemName').value.trim();
    const description = document.getElementById('itemDesc').value.trim();
    const itemId = document.getElementById('itemId').value;
    const image1Url = document.getElementById('image1Url').value;
    const image2Url = document.getElementById('image2Url').value;
    
    if (!name) {
        showToast('الرجاء إدخال العنوان', 'error');
        return;
    }
    
    try {
        showToast('جارٍ حفظ العنصر...', 'info');
        
        // إنشاء العنصر
        const item = {
            id: itemId || `item_${Date.now()}`,
            timestamp: Date.now(),
            date: new Date().toLocaleDateString('ar-SA'),
            title: name,
            description: description,
            images: []
        };
        
        // إضافة حقل خاص حسب القسم
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
        
        // إضافة روابط الصور
        if (image1Url) item.images.push(image1Url);
        if (image2Url) item.images.push(image2Url);
        
        // تأكد من وجود المصفوفة
        if (!portfolioData[subject] || !Array.isArray(portfolioData[subject])) {
            portfolioData[subject] = [];
        }
        
        if (itemId) {
            // تحديث عنصر موجود
            const index = portfolioData[subject].findIndex(i => i.id === itemId);
            if (index !== -1) {
                portfolioData[subject][index] = item;
            }
        } else {
            // إضافة عنصر جديد
            portfolioData[subject].push(item);
        }
        
        // تحديث تاريخ التعديل
        portfolioData.lastUpdated = new Date().toISOString();
        
        // حفظ في Cloudinary
        await saveDataToCloudinary();
        
        // تحديث الواجهة
        updateDashboard();
        updateSection(subject);
        
        // إغلاق النموذج
        closeModal();
        
        showToast(`تم ${itemId ? 'تحديث' : 'إضافة'} العنصر بنجاح`, 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حفظ العنصر:', error);
        showToast('حدث خطأ في حفظ العنصر', 'error');
    }
}

// تعديل العنصر
function editItem(subject, itemId) {
    console.log(`✏️ تعديل العنصر: ${itemId}`);
    
    const items = portfolioData[subject];
    if (!items || !Array.isArray(items)) return;
    
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    // تعبئة النموذج
    document.getElementById('modalTitle').textContent = 'تعديل العنصر';
    document.getElementById('itemSubject').value = subject;
    document.getElementById('itemId').value = itemId;
    document.getElementById('itemName').value = item.letter || item.surah || item.concept || item.title || '';
    document.getElementById('itemDesc').value = item.description || '';
    
    // إعادة تعيين معاينات الصور
    const preview1 = document.getElementById('preview1');
    const preview2 = document.getElementById('preview2');
    
    if (item.images && item.images[0]) {
        document.getElementById('image1Url').value = item.images[0];
        preview1.innerHTML = `<img src="${item.images[0]}" alt="الصورة الحالية" style="max-width:100%; max-height:200px; object-fit:contain;">`;
    } else {
        preview1.innerHTML = `
            <div class="upload-placeholder" onclick="openUploadWidget('image1')">
                <i class="fas fa-cloud-upload-alt"></i>
                <span>انقر لرفع صورة</span>
            </div>
        `;
    }
    
    if (item.images && item.images[1]) {
        document.getElementById('image2Url').value = item.images[1];
        preview2.innerHTML = `<img src="${item.images[1]}" alt="الصورة الحالية" style="max-width:100%; max-height:200px; object-fit:contain;">`;
    } else {
        preview2.innerHTML = `
            <div class="upload-placeholder" onclick="openUploadWidget('image2')">
                <i class="fas fa-cloud-upload-alt"></i>
                <span>انقر لرفع صورة</span>
            </div>
        `;
    }
    
    // إظهار النموذج
    document.getElementById('addModal').style.display = 'flex';
}

// حذف العنصر
async function deleteItem(subject, itemId) {
    console.log(`🗑️ حذف العنصر: ${itemId}`);
    
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذه العملية.')) {
        return;
    }
    
    try {
        showToast('جارٍ حذف العنصر...', 'info');
        
        // حذف من البيانات المحلية
        if (portfolioData[subject] && Array.isArray(portfolioData[subject])) {
            portfolioData[subject] = portfolioData[subject].filter(item => item.id !== itemId);
            
            // تحديث تاريخ التعديل
            portfolioData.lastUpdated = new Date().toISOString();
            
            // حفظ في Cloudinary
            await saveDataToCloudinary();
            
            // تحديث الواجهة
            updateDashboard();
            updateSection(subject);
            
            showToast('تم حذف العنصر بنجاح', 'success');
        }
        
    } catch (error) {
        console.error('❌ خطأ في حذف العنصر:', error);
        showToast('حدث خطأ في حذف العنصر', 'error');
    }
}

// عرض الصورة
function viewImage(url) {
    if (!url) return;
    
    document.getElementById('modalImageView').src = url;
    document.getElementById('imageModal').style.display = 'flex';
}

// إغلاق النموذج
function closeModal() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';
    document.getElementById('image1Url').value = '';
    document.getElementById('image2Url').value = '';
}

// إغلاق نافذة الصورة
function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// طباعة الملف
function printPortfolio() {
    console.log('🖨️ جاري تحضير الطباعة...');
    
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
                <p>آخر تحديث: ${new Date(portfolioData.lastUpdated).toLocaleDateString('ar-SA')}</p>
            </div>
    `;
    
    // إضافة كل قسم
    Object.keys(portfolioData).forEach(subject => {
        if (subject === 'lastUpdated' || subject === 'createdAt') return;
        
        const items = portfolioData[subject];
        if (items && items.length > 0) {
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

// جعل الدوال متاحة عالمياً
window.switchTab = switchTab;
window.addItem = addItem;
window.closeModal = closeModal;
window.closeImageModal = closeImageModal;
window.saveItem = saveItem;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.viewImage = viewImage;
window.printPortfolio = printPortfolio;
window.openUploadWidget = openUploadWidget;

console.log('🎉 النظام جاهز! يعتمد على Cloudinary فقط.');
