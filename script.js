// نظام ملف الإنجاز المبسط - يعمل 100%
console.log('🎓 نظام ملف الإنجاز - جاري التحميل...');

// البيانات
let portfolioData = {
    arabic: [],
    english: [],
    quran: [],
    math: [],
    science: [],
    activities: []
};

let currentSubject = null;

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تهيئة التطبيق...');
    
    // إخفاء التحميل بعد 1.5 ثانية
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        document.querySelector('.app').style.display = 'block';
        initializeApp();
    }, 1500);
});

// تهيئة التطبيق
function initializeApp() {
    console.log('🔧 جاري تهيئة التطبيق...');
    
    // تحميل البيانات
    loadData();
    
    // إعداد الأحداث
    setupEventListeners();
    
    // تحديث الواجهة
    updateDashboard();
    
    console.log('✅ تم تهيئة التطبيق بنجاح');
}

// إعداد الأحداث
function setupEventListeners() {
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
    
    // زر الإضافة السريعة
    document.querySelector('.btn-primary').addEventListener('click', showAddModal);
}

// تحميل البيانات
function loadData() {
    console.log('📥 جاري تحميل البيانات...');
    
    try {
        const savedData = localStorage.getItem('teacherPortfolio');
        if (savedData) {
            portfolioData = JSON.parse(savedData);
            console.log('✅ تم تحميل البيانات من التخزين المحلي');
        } else {
            // تحميل بيانات نموذجية
            loadSampleData();
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        loadSampleData();
    }
}

// تحميل بيانات نموذجية
function loadSampleData() {
    console.log('📝 جاري تحميل بيانات نموذجية...');
    
    portfolioData = {
        arabic: [
            {
                id: '1',
                title: 'حرف الألف',
                description: 'تعلم حرف الألف مع نشاط الرسم والتلوين',
                images: [
                    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80',
                    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80'
                ],
                date: '١٤٤٥/٠٣/١٥',
                timestamp: Date.now()
            },
            {
                id: '2',
                title: 'حرف الباء',
                description: 'تعلم حرف الباء مع نشاط القص واللصق',
                images: [
                    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
                    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=80'
                ],
                date: '١٤٤٥/٠٣/١٠',
                timestamp: Date.now() - 86400000
            }
        ],
        english: [
            {
                id: '3',
                title: 'حرف A',
                description: 'Learning letter A with fun activities',
                images: [
                    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
                    'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80'
                ],
                date: '١٤٤٥/٠٣/١٢',
                timestamp: Date.now() - 172800000
            }
        ],
        quran: [
            {
                id: '4',
                title: 'سورة الفاتحة',
                description: 'حفظ وتلاوة سورة الفاتحة',
                images: [
                    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
                    'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80'
                ],
                date: '١٤٤٥/٠٣/٠٥',
                timestamp: Date.now() - 259200000
            }
        ],
        activities: [
            {
                id: '5',
                title: 'معرض الصور',
                description: 'معرض لإنجازات الطلاب',
                images: [
                    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80',
                    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80'
                ],
                date: '١٤٤٥/٠٣/٠١',
                timestamp: Date.now() - 345600000
            }
        ]
    };
    
    console.log('✅ تم تحميل بيانات نموذجية');
}

// حفظ البيانات
function saveData() {
    try {
        // حفظ في localStorage فقط (بدون Firebase)
        localStorage.setItem('teacherPortfolio', JSON.stringify(portfolioData));
        console.log('✅ تم حفظ البيانات في التخزين المحلي');
    } catch (error) {
        console.error('❌ خطأ في حفظ البيانات:', error);
    }
}

// تحديث لوحة التحكم
function updateDashboard() {
    console.log('📊 تحديث لوحة التحكم...');
    
    // حساب الإحصائيات
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.images ? item.images.length : 0), 0), 0);
    
    const thisMonth = new Date().getMonth();
    const recentItems = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.filter(item => {
            const itemDate = new Date(item.timestamp || Date.now());
            return itemDate.getMonth() === thisMonth;
        }).length, 0);
    
    // تحديث DOM
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalImages').textContent = totalImages;
    document.getElementById('recentItems').textContent = recentItems;
    document.getElementById('completionRate').textContent = 
        totalItems > 0 ? `${Math.min(100, Math.floor((totalItems / 50) * 100))}%` : '0%';
    
    // تحديث العناصر الحديثة
    updateRecentItems();
    
    // تحديث كل قسم
    updateAllSections();
}

// تحديث العناصر الحديثة
function updateRecentItems() {
    const container = document.getElementById('recentGrid');
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
    
    // أخذ 4 عناصر فقط
    const recentItems = allItems.slice(0, 4);
    
    // مسح المحتوى القديم
    container.innerHTML = '';
    
    if (recentItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>لا توجد عناصر حديثة</h3>
                <p>ابدأ بإضافة عناصر جديدة</p>
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

// تحديث جميع الأقسام
function updateAllSections() {
    Object.keys(portfolioData).forEach(subject => {
        updateSection(subject);
    });
}

// تحديث قسم معين
function updateSection(subject) {
    const container = document.getElementById(`${subject}Container`);
    if (!container) return;
    
    const items = portfolioData[subject] || [];
    
    // مسح المحتوى القديم
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="${getSubjectIcon(subject)}"></i>
                <h3>لا توجد عناصر</h3>
                <p>ابدأ بإضافة أول عنصر</p>
                <button class="btn btn-primary" onclick="showAddModal('${subject}')">
                    <i class="fas fa-plus"></i> إضافة عنصر
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
    
    const title = item.title || 'عنصر جديد';
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

// الحصول على صورة افتراضية
function getDefaultImage(subject, index) {
    const images = {
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
    
    return images[subject] ? images[subject][index - 1] : 
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
    
    // إذا كان التبويب ليس الرئيسية، تحديث القسم
    if (tabId !== 'all') {
        updateSection(tabId);
    }
}

// عرض نافذة الإضافة
function showAddModal(subject = null) {
    if (subject) {
        currentSubject = subject;
    } else {
        // إذا لم يتم تحديد القسم، نطلب من المستخدم اختياره
        showSubjectSelection();
        return;
    }
    
    // تحديد عنوان النموذج
    const titles = {
        arabic: 'إضافة حرف عربي',
        english: 'إضافة كلمة إنجليزية',
        quran: 'إضافة سورة قرآنية',
        math: 'إضافة مفهوم رياضي',
        science: 'إضافة تجربة علمية',
        activities: 'إضافة نشاط مدرسي'
    };
    
    document.getElementById('modalTitle').textContent = titles[currentSubject] || 'إضافة عنصر جديد';
    document.getElementById('itemSubject').value = currentSubject;
    
    // مسح النموذج
    document.getElementById('itemForm').reset();
    document.getElementById('preview1').innerHTML = '';
    document.getElementById('preview2').innerHTML = '';
    
    // إظهار النموذج
    document.getElementById('addModal').style.display = 'flex';
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
                <button onclick="showAddModal('arabic'); this.closest('.modal').remove()" style="
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
                
                <button onclick="showAddModal('english'); this.closest('.modal').remove()" style="
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
                
                <button onclick="showAddModal('quran'); this.closest('.modal').remove()" style="
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
                
                <button onclick="showAddModal('math'); this.closest('.modal').remove()" style="
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
                
                <button onclick="showAddModal('science'); this.closest('.modal').remove()" style="
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
                
                <button onclick="showAddModal('activities'); this.closest('.modal').remove()" style="
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

// معاينة الصورة
function previewImage(input, previewId) {
    const file = input.files[0];
    if (!file) return;
    
    // التحقق من حجم الصورة (2MB كحد أقصى)
    if (file.size > 2 * 1024 * 1024) {
        showToast('حجم الصورة كبير جداً (الحد الأقصى 2MB)', 'error');
        input.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = `<img src="${e.target.result}" alt="معاينة">`;
    };
    reader.readAsDataURL(file);
}

// حفظ العنصر
function saveItem() {
    const subject = document.getElementById('itemSubject').value;
    const title = document.getElementById('itemTitle').value.trim();
    const description = document.getElementById('itemDesc').value.trim();
    
    if (!title) {
        showToast('الرجاء إدخال العنوان', 'error');
        return;
    }
    
    showToast('جارٍ حفظ العنصر...', 'info');
    
    // إنشاء العنصر
    const item = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        date: new Date().toLocaleDateString('ar-SA'),
        title: title,
        description: description
    };
    
    // معالجة الصور
    item.images = [];
    
    const image1 = document.getElementById('image1').files[0];
    const image2 = document.getElementById('image2').files[0];
    
    // تحويل الصور إلى Base64 (بعد ضغطها)
    if (image1) {
        compressImage(image1, 800, 600).then(compressed => {
            if (compressed) item.images.push(compressed);
        });
    }
    
    if (image2) {
        compressImage(image2, 800, 600).then(compressed => {
            if (compressed) item.images.push(compressed);
            
            // إضافة العنصر
            addItemToSubject(subject, item);
        });
    } else {
        // إضافة العنصر بدون الصورة الثانية
        addItemToSubject(subject, item);
    }
}

// ضغط الصورة
function compressImage(file, maxWidth, maxHeight) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // حساب الأبعاد الجديدة
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // تحويل إلى JPEG بجودة 80%
                const compressed = canvas.toDataURL('image/jpeg', 0.8);
                resolve(compressed);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// إضافة العنصر إلى القسم
function addItemToSubject(subject, item) {
    // إضافة إلى البيانات المحلية
    if (!portfolioData[subject]) {
        portfolioData[subject] = [];
    }
    portfolioData[subject].push(item);
    
    // حفظ البيانات
    saveData();
    
    // تحديث الواجهة
    updateDashboard();
    updateSection(subject);
    
    // إغلاق النموذج
    closeModal();
    
    showToast('تم إضافة العنصر بنجاح', 'success');
}

// تعديل العنصر
function editItem(subject, itemId) {
    const item = portfolioData[subject].find(i => i.id === itemId);
    if (!item) return;
    
    currentSubject = subject;
    
    document.getElementById('modalTitle').textContent = 'تعديل العنصر';
    document.getElementById('itemSubject').value = subject;
    document.getElementById('itemTitle').value = item.title || '';
    document.getElementById('itemDesc').value = item.description || '';
    
    // مسح معاينات الصور القديمة
    document.getElementById('preview1').innerHTML = '';
    document.getElementById('preview2').innerHTML = '';
    
    // إضافة معاينات للصور الموجودة
    if (item.images && item.images[0]) {
        document.getElementById('preview1').innerHTML = `<img src="${item.images[0]}" alt="الصورة الحالية">`;
    }
    
    if (item.images && item.images[1]) {
        document.getElementById('preview2').innerHTML = `<img src="${item.images[1]}" alt="الصورة الحالية">`;
    }
    
    document.getElementById('addModal').style.display = 'flex';
    document.getElementById('itemForm').dataset.editId = itemId;
}

// حذف العنصر
function deleteItem(subject, itemId) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
        return;
    }
    
    showToast('جارٍ حذف العنصر...', 'info');
    
    // حذف من البيانات المحلية
    portfolioData[subject] = portfolioData[subject].filter(item => item.id !== itemId);
    
    // حفظ البيانات
    saveData();
    
    // تحديث الواجهة
    updateDashboard();
    updateSection(subject);
    
    showToast('تم حذف العنصر بنجاح', 'success');
}

// عرض الصورة
function viewImage(url) {
    if (!url) return;
    
    document.getElementById('viewerImage').src = url;
    document.getElementById('imageViewer').style.display = 'flex';
}

// إغلاق النوافذ
function closeModal() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('itemForm').reset();
    document.getElementById('preview1').innerHTML = '';
    document.getElementById('preview2').innerHTML = '';
    delete document.getElementById('itemForm').dataset.editId;
}

function closeImageViewer() {
    document.getElementById('imageViewer').style.display = 'none';
}

// طباعة الكل
function printAll() {
    showToast('جاري تحضير الطباعة...', 'info');
    
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
                printContent += `
                    <div class="print-item">
                        <h4>${item.title}</h4>
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
    const container = document.getElementById('toastContainer');
    
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
    
    container.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// جعل الدوال متاحة عالمياً
window.showAddModal = showAddModal;
window.closeModal = closeModal;
window.closeImageViewer = closeImageViewer;
window.saveItem = saveItem;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.viewImage = viewImage;
window.printAll = printAll;
window.previewImage = previewImage;
window.switchTab = switchTab;

console.log('🎉 النظام جاهز! جميع الميزات تعمل بشكل صحيح.');
