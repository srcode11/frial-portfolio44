// نظام ملف الإنجاز - المعلمة فريال الغماري
console.log('🎓 نظام ملف الإنجاز - جاري التحميل...');

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
let currentEditId = null;

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 بدء تهيئة التطبيق...');
    
    try {
        // 1. إعداد الأحداث
        setupEventListeners();
        
        // 2. تحميل البيانات من Firebase
        await loadPortfolioData();
        
        // 3. تحديث الواجهة
        updateDashboard();
        
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
    
    console.log('✅ تم إعداد واجهة المستخدم');
}

// تحميل بيانات ملف الإنجاز من Firebase
async function loadPortfolioData() {
    console.log('📥 جاري تحميل البيانات النصية من Firebase...');
    
    try {
        showToast('جارٍ تحميل البيانات...', 'info');
        
        const docRef = db.collection('portfolio').doc('data');
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
            const data = docSnap.data();
            console.log('📊 البيانات الخام من Firebase:', data);
            
            // تأكد من أن البيانات في التنسيق الصحيح
            portfolioData = {
                arabic: Array.isArray(data.arabic) ? data.arabic : [],
                english: Array.isArray(data.english) ? data.english : [],
                quran: Array.isArray(data.quran) ? data.quran : [],
                math: Array.isArray(data.math) ? data.math : [],
                science: Array.isArray(data.science) ? data.science : [],
                activities: Array.isArray(data.activities) ? data.activities : [],
                createdAt: data.createdAt || new Date().toISOString(),
                updatedAt: data.updatedAt || new Date().toISOString()
            };
            
            console.log('✅ تم تحميل البيانات النصية من Firebase:', portfolioData);
            showToast('تم تحميل البيانات بنجاح', 'success');
        } else {
            // إنشاء وثيقة جديدة
            await initializeNewPortfolio();
        }
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات من Firebase:', error);
        showToast('حدث خطأ في تحميل البيانات النصية', 'error');
    }
}

// تهيئة ملف إنجاز جديد
async function initializeNewPortfolio() {
    console.log('📝 إنشاء ملف إنجاز جديد...');
    
    try {
        const initialData = {
            arabic: [],
            english: [],
            quran: [],
            math: [],
            science: [],
            activities: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        await db.collection('portfolio').doc('data').set(initialData);
        portfolioData = initialData;
        
        console.log('✅ تم إنشاء ملف جديد في Firebase');
        showToast('تم إنشاء ملف إنجاز جديد', 'info');
        
    } catch (error) {
        console.error('❌ خطأ في إنشاء الملف:', error);
        throw error;
    }
}

// حفظ البيانات في Firebase (النصوص فقط)
async function savePortfolioData() {
    try {
        const saveData = {
            arabic: portfolioData.arabic || [],
            english: portfolioData.english || [],
            quran: portfolioData.quran || [],
            math: portfolioData.math || [],
            science: portfolioData.science || [],
            activities: portfolioData.activities || [],
            updatedAt: new Date().toISOString()
        };
        
        // الحفاظ على تاريخ الإنشاء إذا كان موجوداً
        if (portfolioData.createdAt) {
            saveData.createdAt = portfolioData.createdAt;
        }
        
        await db.collection('portfolio').doc('data').set(saveData, { merge: true });
        
        console.log('✅ تم حفظ البيانات النصية في Firebase');
        return true;
        
    } catch (error) {
        console.error('❌ خطأ في حفظ البيانات في Firebase:', error);
        throw error;
    }
}

// تحديث لوحة التحكم
function updateDashboard() {
    console.log('📊 تحديث لوحة التحكم...');
    
    try {
        // حساب الإحصائيات بشكل آمن
        const subjects = ['arabic', 'english', 'quran', 'math', 'science', 'activities'];
        let totalItems = 0;
        let totalImages = 0;
        let recentItems = 0;
        
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        
        subjects.forEach(subject => {
            const items = portfolioData[subject];
            if (Array.isArray(items)) {
                totalItems += items.length;
                
                items.forEach(item => {
                    // حساب عدد الصور
                    if (item.images && Array.isArray(item.images)) {
                        totalImages += item.images.length;
                    }
                    
                    // حساب العناصر الحديثة
                    const itemDate = new Date(item.timestamp || Date.now());
                    if (itemDate.getMonth() === thisMonth && itemDate.getFullYear() === thisYear) {
                        recentItems++;
                    }
                });
            }
        });
        
        // تحديث DOM
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('totalImages').textContent = totalImages;
        document.getElementById('recentItems').textContent = recentItems;
        
        const completionRate = totalItems > 0 ? Math.min(100, Math.floor((totalItems / 100) * 100)) : 0;
        document.getElementById('completionRate').textContent = `${completionRate}%`;
        
        // تحديث العناصر الحديثة
        updateRecentItems();
        
        // تحديث كل قسم
        subjects.forEach(subject => {
            updateSection(subject);
        });
        
    } catch (error) {
        console.error('❌ خطأ في تحديث لوحة التحكم:', error);
    }
}

// تحديث العناصر الحديثة
function updateRecentItems() {
    const container = document.getElementById('recentItemsGrid');
    if (!container) return;
    
    try {
        // جمع جميع العناصر
        const allItems = [];
        const subjects = ['arabic', 'english', 'quran', 'math', 'science', 'activities'];
        
        subjects.forEach(subject => {
            const items = portfolioData[subject];
            if (Array.isArray(items)) {
                items.forEach(item => {
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
        
    } catch (error) {
        console.error('❌ خطأ في تحديث العناصر الحديثة:', error);
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>خطأ في تحميل البيانات</h3>
                <p>حدث خطأ في تحميل العناصر الحديثة</p>
            </div>
        `;
    }
}

// تبديل التبويب
function switchTab(tabId) {
    console.log(`🔄 تبديل إلى التبويب: ${tabId}`);
    
    try {
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
        
    } catch (error) {
        console.error('❌ خطأ في تبديل التبويب:', error);
    }
}

// تحديث قسم معين
function updateSection(subject) {
    const container = document.getElementById(`${subject}Items`);
    if (!container) return;
    
    try {
        const items = portfolioData[subject];
        const validItems = Array.isArray(items) ? items : [];
        
        // مسح المحتوى القديم
        container.innerHTML = '';
        
        if (validItems.length === 0) {
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
        const sortedItems = [...validItems].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        // إضافة العناصر
        sortedItems.forEach(item => {
            try {
                const card = createItemCard(item, subject);
                container.appendChild(card);
            } catch (cardError) {
                console.error('❌ خطأ في إنشاء بطاقة العنصر:', cardError);
            }
        });
        
    } catch (error) {
        console.error(`❌ خطأ في تحديث قسم ${subject}:`, error);
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>خطأ في تحميل القسم</h3>
                <p>حدث خطأ في تحميل بيانات هذا القسم</p>
            </div>
        `;
    }
}

// إنشاء بطاقة عنصر
function createItemCard(item, subject) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = item.id || item._id || Date.now().toString();
    
    const title = item.letter || item.surah || item.concept || item.title || 'عنصر جديد';
    const date = item.date || formatDate(new Date(item.timestamp || Date.now()));
    const description = item.description || 'لا يوجد وصف';
    
    // استخدام صور آمنة
    const image1 = getSafeImageUrl(item.images, 0, subject);
    const image2 = getSafeImageUrl(item.images, 1, subject);
    
    const itemId = item.id || item._id || Date.now().toString();
    
    card.innerHTML = `
        <div class="item-header">
            <div class="item-title">${escapeHtml(title)}</div>
            <div class="item-date">${escapeHtml(date)}</div>
        </div>
        <div class="item-body">
            <div class="item-description">${escapeHtml(description)}</div>
            <div class="item-images">
                <div class="item-image" onclick="viewImage('${escapeHtml(image1)}')">
                    <img src="${escapeHtml(image1)}" alt="الصورة الأولى" onerror="handleImageError(this, '${subject}', 1)">
                </div>
                <div class="item-image" onclick="viewImage('${escapeHtml(image2)}')">
                    <img src="${escapeHtml(image2)}" alt="الصورة الثانية" onerror="handleImageError(this, '${subject}', 2)">
                </div>
            </div>
            <div class="item-actions">
                <button class="action-btn edit" onclick="editItem('${escapeHtml(subject)}', '${escapeHtml(itemId)}')">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="action-btn delete" onclick="deleteItem('${escapeHtml(subject)}', '${escapeHtml(itemId)}')">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// الحصول على رابط صورة آمن
function getSafeImageUrl(images, index, subject) {
    if (!images || !Array.isArray(images) || !images[index]) {
        return getDefaultImage(subject, index + 1);
    }
    
    const url = images[index];
    
    // التحقق من أن الرابط يبدأ بـ https
    if (url.startsWith('http')) {
        return url;
    }
    
    // إذا كان الرابط من Cloudinary، تأكد من أنه https
    if (url.includes('cloudinary.com')) {
        return url.replace('http://', 'https://');
    }
    
    return getDefaultImage(subject, index + 1);
}

// معالجة خطأ الصور
function handleImageError(imgElement, subject, index) {
    imgElement.src = getDefaultImage(subject, index);
    imgElement.style.objectFit = 'contain';
    imgElement.style.background = '#f8f9fa';
}

// الحصول على صورة افتراضية حسب القسم
function getDefaultImage(subject, index) {
    const defaultImages = {
        arabic: [
            'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&q=80',
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&q=80'
        ],
        english: [
            'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop&q=80',
            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop&q=80'
        ],
        quran: [
            'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop&q=80',
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&q=80'
        ],
        math: [
            'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&q=80',
            'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=300&fit=crop&q=80'
        ],
        science: [
            'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop&q=80',
            'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop&q=80'
        ],
        activities: [
            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&q=80',
            'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop&q=80'
        ]
    };
    
    return defaultImages[subject] ? defaultImages[subject][index - 1] : 
           'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=300&fit=crop&q=80';
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

// فتح واجهة رفع Cloudinary للصور
function openUploadWidget(inputId) {
    const myWidget = cloudinary.createUploadWidget({
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
        sources: ['local', 'url'],
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        maxFileSize: 5000000, // 5MB
        folder: 'teacher_portfolio',
        resource_type: 'image',
        cropping: false,
        showAdvancedOptions: false,
        tags: ['teacher_portfolio'],
        context: { alt: 'Teacher Portfolio Image' }
    }, (error, result) => {
        if (!error && result && result.event === "success") {
            const secureUrl = result.info.secure_url;
            
            // حفظ الرابط في الحقل المخفي
            document.getElementById(`${inputId}Url`).value = secureUrl;
            
            // عرض معاينة الصورة
            const previewDiv = document.getElementById(`preview${inputId.slice(-1)}`);
            previewDiv.innerHTML = `<img src="${secureUrl}" alt="الصورة المرفوعة" style="max-width:100%; max-height:200px; object-fit:contain;">`;
            
            showToast('تم رفع الصورة إلى Cloudinary بنجاح', 'success');
            
        } else if (error) {
            console.error('❌ خطأ في رفع الصورة إلى Cloudinary:', error);
            showToast('حدث خطأ في رفع الصورة', 'error');
        }
    });
    
    myWidget.open();
}

// إضافة عنصر جديد
function addItem(subject) {
    console.log(`➕ إضافة عنصر جديد إلى: ${subject}`);
    
    // إعادة تعيين حالة التعديل
    currentEditId = null;
    document.getElementById('itemId').value = '';
    
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
        
        // إضافة روابط الصور من Cloudinary
        if (image1Url) item.images.push(image1Url);
        if (image2Url) item.images.push(image2Url);
        
        // تأكد من وجود المصفوفة
        if (!Array.isArray(portfolioData[subject])) {
            portfolioData[subject] = [];
        }
        
        if (itemId) {
            // تحديث عنصر موجود
            const index = portfolioData[subject].findIndex(i => i.id === itemId);
            if (index !== -1) {
                portfolioData[subject][index] = {
                    ...portfolioData[subject][index],
                    ...item,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            // إضافة عنصر جديد
            portfolioData[subject].push(item);
        }
        
        // حفظ النصوص في Firebase
        await savePortfolioData();
        
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
    if (!Array.isArray(items)) return;
    
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    // حفظ معرف العنصر للتعديل
    currentEditId = itemId;
    document.getElementById('itemId').value = itemId;
    
    // تعبئة النموذج
    document.getElementById('modalTitle').textContent = 'تعديل العنصر';
    document.getElementById('itemSubject').value = subject;
    document.getElementById('itemName').value = item.letter || item.surah || item.concept || item.title || '';
    document.getElementById('itemDesc').value = item.description || '';
    
    // إعادة تعيين معاينات الصور
    const preview1 = document.getElementById('preview1');
    const preview2 = document.getElementById('preview2');
    
    if (item.images && item.images[0]) {
        document.getElementById('image1Url').value = item.images[0];
        preview1.innerHTML = `<img src="${escapeHtml(item.images[0])}" alt="الصورة الحالية" style="max-width:100%; max-height:200px; object-fit:contain;">`;
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
        preview2.innerHTML = `<img src="${escapeHtml(item.images[1])}" alt="الصورة الحالية" style="max-width:100%; max-height:200px; object-fit:contain;">`;
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
        if (Array.isArray(portfolioData[subject])) {
            portfolioData[subject] = portfolioData[subject].filter(item => item.id !== itemId);
            
            // حفظ في Firebase
            await savePortfolioData();
            
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

// عرض الصورة في نافذة منبثقة
function viewImage(url) {
    if (!url) return;
    
    document.getElementById('modalImageView').src = escapeHtml(url);
    document.getElementById('imageModal').style.display = 'flex';
}

// إغلاق نافذة إضافة/تعديل العنصر
function closeModal() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';
    document.getElementById('image1Url').value = '';
    document.getElementById('image2Url').value = '';
    currentEditId = null;
}

// إغلاق نافذة الصورة
function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// طباعة الملف
function printPortfolio() {
    console.log('🖨️ جاري تحضير الطباعة...');
    
    try {
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
        const subjects = ['arabic', 'english', 'quran', 'math', 'science', 'activities'];
        const subjectNames = {
            arabic: 'اللغة العربية',
            english: 'اللغة الإنجليزية',
            quran: 'القرآن الكريم',
            math: 'الرياضيات',
            science: 'العلوم',
            activities: 'النشاطات المدرسية'
        };
        
        subjects.forEach(subject => {
            const items = portfolioData[subject];
            if (Array.isArray(items) && items.length > 0) {
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
                            <h4>${escapeHtml(title)}</h4>
                            <p><strong>التاريخ:</strong> ${item.date || 'غير محدد'}</p>
                            <p><strong>الوصف:</strong> ${escapeHtml(item.description || 'لا يوجد وصف')}</p>
                            ${item.images && item.images.length > 0 ? `
                                <div class="print-images">
                                    ${item.images.map((img, index) => 
                                        `<img src="${escapeHtml(img)}" alt="الصورة ${index + 1}" onerror="this.style.display='none'">`
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
        
    } catch (error) {
        console.error('❌ خطأ في الطباعة:', error);
        showToast('حدث خطأ في تحضير ملف الطباعة', 'error');
    }
}

// تنسيق التاريخ
function formatDate(date) {
    try {
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return new Date().toLocaleDateString('ar-SA');
    }
}

// عرض الإشعارات
function showToast(message, type = 'info') {
    try {
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
                <div class="toast-message">${escapeHtml(message)}</div>
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
    } catch (error) {
        console.error('❌ خطأ في عرض الإشعار:', error);
    }
}

// تهريب HTML لمنع XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// إظهار نافذة إضافة جديد
function showAddModal() {
    try {
        // عرض اختيار القسم
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
                max-width: 600px;
                width: 90%;
                text-align: center;
            ">
                <h3 style="margin-bottom: 30px; color: #333; font-size: 1.5rem;">اختر القسم للإضافة</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px;">
                    <button onclick="addItem('arabic'); this.closest('.modal').remove()" style="
                        padding: 20px;
                        background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
                        border: none;
                        border-radius: 10px;
                        color: white;
                        font-size: 1rem;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                        transition: transform 0.3s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <i class="fas fa-book" style="font-size: 1.5rem;"></i>
                        <span>العربية</span>
                    </button>
                    
                    <button onclick="addItem('english'); this.closest('.modal').remove()" style="
                        padding: 20px;
                        background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
                        border: none;
                        border-radius: 10px;
                        color: white;
                        font-size: 1rem;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                        transition: transform 0.3s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <i class="fas fa-language" style="font-size: 1.5rem;"></i>
                        <span>الإنجليزية</span>
                    </button>
                    
                    <button onclick="addItem('quran'); this.closest('.modal').remove()" style="
                        padding: 20px;
                        background: linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%);
                        border: none;
                        border-radius: 10px;
                        color: white;
                        font-size: 1rem;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                        transition: transform 0.3s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <i class="fas fa-book-quran" style="font-size: 1.5rem;"></i>
                        <span>القرآن</span>
                    </button>
                    
                    <button onclick="addItem('math'); this.closest('.modal').remove()" style="
                        padding: 20px;
                        background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                        border: none;
                        border-radius: 10px;
                        color: white;
                        font-size: 1rem;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                        transition: transform 0.3s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <i class="fas fa-calculator" style="font-size: 1.5rem;"></i>
                        <span>الرياضيات</span>
                    </button>
                    
                    <button onclick="addItem('science'); this.closest('.modal').remove()" style="
                        padding: 20px;
                        background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
                        border: none;
                        border-radius: 10px;
                        color: white;
                        font-size: 1rem;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                        transition: transform 0.3s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <i class="fas fa-flask" style="font-size: 1.5rem;"></i>
                        <span>العلوم</span>
                    </button>
                    
                    <button onclick="addItem('activities'); this.closest('.modal').remove()" style="
                        padding: 20px;
                        background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
                        border: none;
                        border-radius: 10px;
                        color: white;
                        font-size: 1rem;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                        transition: transform 0.3s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <i class="fas fa-chalkboard-teacher" style="font-size: 1.5rem;"></i>
                        <span>النشاطات</span>
                    </button>
                </div>
                <button onclick="this.closest('.modal').remove()" style="
                    padding: 12px 30px;
                    background: #f1f3f5;
                    border: none;
                    border-radius: 8px;
                    color: #666;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background 0.3s;
                " onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='#f1f3f5'">
                    إلغاء
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('❌ خطأ في عرض نافذة الإضافة:', error);
        showToast('حدث خطأ في عرض نافذة الإضافة', 'error');
    }
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
window.showAddModal = showAddModal;
window.handleImageError = handleImageError;

console.log('🎉 النظام جاهز! الصور في Cloudinary والنصوص في Firebase');
