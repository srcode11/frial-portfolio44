// نظام ملف الإنجاز الرقمي - كل شيء شغال
console.log('🚀 نظام ملف الإنجاز - جاهز للعمل');

// البيانات الرئيسية
let portfolioData = {
    arabic: [],
    english: [],
    quran: [],
    math: [],
    science: [],
    activities: []
};

// حالة التطبيق
let currentSection = 'dashboard';
let isAdmin = false;
let autoSave = true;

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 بدء تهيئة النظام...');
    
    // إعداد المستمعين للأحداث
    setupEventListeners();
    
    // تحميل البيانات
    loadPortfolioData();
    
    // إعداد الواجهة
    setupUI();
    
    // تحديث الإحصائيات
    updateStats();
    
    console.log('✅ النظام جاهز للاستخدام');
});

// إعداد المستمعين للأحداث
function setupEventListeners() {
    console.log('🎯 إعداد المستمعين...');
    
    // القائمة الجانبية
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // أزرار الرأس
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('refreshBtn').addEventListener('click', refreshData);
    document.getElementById('addBtn').addEventListener('click', function() {
        if (currentSection !== 'dashboard') {
            showAddModal(currentSection);
        } else {
            showToast('الرجاء اختيار قسم أولاً', 'info');
        }
    });
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // نموذج الإضافة
    document.getElementById('addForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveNewItem();
    });
    
    // استعادة النسخة الاحتياطية
    document.getElementById('restoreFile').addEventListener('change', restoreBackup);
    
    console.log('✅ تم إعداد جميع المستمعين');
}

// تحميل بيانات الملف
function loadPortfolioData() {
    console.log('📂 جاري تحميل البيانات...');
    
    try {
        // محاولة التحميل من التخزين المحلي
        const savedData = localStorage.getItem('teacherPortfolioData');
        
        if (savedData) {
            portfolioData = JSON.parse(savedData);
            console.log('✅ تم تحميل البيانات من التخزين المحلي');
            updateConnectionStatus('محلي');
            showToast('تم تحميل بيانات الملف بنجاح', 'success');
        } else {
            // إنشاء بيانات جديدة
            savePortfolioData();
            console.log('📝 تم إنشاء ملف جديد');
            updateConnectionStatus('جديد');
            showToast('تم إنشاء ملف إنجاز جديد', 'info');
        }
        
        // تحديث العرض
        updateRecentItems();
        renderAllSections();
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        showToast('خطأ في تحميل البيانات', 'error');
        updateConnectionStatus('خطأ');
    }
}

// حفظ بيانات الملف
function savePortfolioData() {
    try {
        localStorage.setItem('teacherPortfolioData', JSON.stringify(portfolioData));
        console.log('💾 تم حفظ البيانات في التخزين المحلي');
        return true;
    } catch (error) {
        console.error('❌ خطأ في حفظ البيانات:', error);
        showToast('خطأ في حفظ البيانات', 'error');
        return false;
    }
}

// تحديث حالة الاتصال
function updateConnectionStatus(status) {
    const statusElement = document.getElementById('connectionStatus');
    const statusDot = document.querySelector('.status-dot');
    
    if (statusElement && statusDot) {
        statusElement.textContent = status;
        
        switch(status) {
            case 'محلي':
                statusDot.style.background = '#2ecc71';
                break;
            case 'جديد':
                statusDot.style.background = '#f39c12';
                break;
            case 'خطأ':
                statusDot.style.background = '#e74c3c';
                break;
            default:
                statusDot.style.background = '#3498db';
        }
    }
}

// تبديل الأقسام
function switchSection(sectionId) {
    console.log(`🔄 الانتقال إلى قسم: ${sectionId}`);
    
    // تحديث القائمة الجانبية
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        }
    });
    
    // تحديث المحتوى
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });
    
    currentSection = sectionId;
    
    // تحديث زر الإضافة
    const addBtn = document.getElementById('addBtn');
    if (sectionId === 'dashboard') {
        addBtn.style.display = 'none';
    } else {
        addBtn.style.display = 'flex';
    }
    
    // تحديث عنوان الصفحة
    updatePageTitle(sectionId);
}

// تحديث عنوان الصفحة
function updatePageTitle(sectionId) {
    const titles = {
        dashboard: 'الرئيسية',
        arabic: 'اللغة العربية',
        english: 'الإنجليزية',
        quran: 'القرآن الكريم',
        math: 'الرياضيات',
        science: 'العلوم',
        activities: 'النشاطات',
        print: 'الطباعة',
        backup: 'النسخ الاحتياطي',
        settings: 'الإعدادات'
    };
    
    const sectionName = titles[sectionId] || sectionId;
    document.title = `${sectionName} - ملف إنجاز المعلمة فريال`;
}

// تحديث الإحصائيات
function updateStats() {
    console.log('📊 تحديث الإحصائيات...');
    
    // حساب المجاميع
    let totalItems = 0;
    let totalImages = 0;
    
    Object.values(portfolioData).forEach(items => {
        totalItems += items.length;
        items.forEach(item => {
            if (item.images && Array.isArray(item.images)) {
                totalImages += item.images.length;
            }
        });
    });
    
    // العناصر هذا الشهر
    const currentMonth = new Date().getMonth();
    const thisMonthItems = Object.values(portfolioData).reduce((total, items) => {
        return total + items.filter(item => {
            const itemDate = new Date(item.dateAdded || Date.now());
            return itemDate.getMonth() === currentMonth;
        }).length;
    }, 0);
    
    // معدل الإنجاز (على أساس 100 عنصر كحد أقصى)
    const completionRate = Math.min(100, Math.floor((totalItems / 100) * 100));
    
    // تحديث الواجهة
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalImages').textContent = totalImages;
    document.getElementById('thisMonth').textContent = thisMonthItems;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
    
    console.log(`📈 الإحصائيات: ${totalItems} عنصر، ${totalImages} صورة`);
}

// تحديث العناصر الحديثة
function updateRecentItems() {
    const container = document.getElementById('recentItems');
    if (!container) return;
    
    // جمع جميع العناصر
    let allItems = [];
    Object.keys(portfolioData).forEach(section => {
        portfolioData[section].forEach(item => {
            allItems.push({
                ...item,
                section: section
            });
        });
    });
    
    // ترتيب حسب التاريخ (الأحدث أولاً)
    allItems.sort((a, b) => {
        const dateA = new Date(a.dateAdded || a.timestamp || 0);
        const dateB = new Date(b.dateAdded || b.timestamp || 0);
        return dateB - dateA;
    });
    
    // أخذ آخر 6 عناصر
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
        const itemCard = createItemCard(item, item.section);
        container.appendChild(itemCard);
    });
}

// إنشاء بطاقة عنصر
function createItemCard(item, section) {
    const div = document.createElement('div');
    div.className = 'item-card';
    
    // تحديد العنوان بناءً على القسم
    let title = item.title || item.letter || item.surah || item.concept || 'عنصر جديد';
    let date = item.date || formatDate(new Date(item.dateAdded || item.timestamp || Date.now()));
    let description = item.description || 'لا يوجد وصف';
    
    div.innerHTML = `
        <div class="item-header">
            <div>
                <div class="item-title">${title}</div>
                <div class="item-date">${date}</div>
            </div>
            <div class="item-actions">
                <button class="btn-icon" onclick="editItem('${section}', '${item.id}')" title="تعديل">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="deleteItem('${section}', '${item.id}')" title="حذف">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="item-body">
            <div class="item-description">${description}</div>
            <div class="item-images">
                ${item.images && item.images[0] ? 
                    `<div class="item-image" onclick="viewImage('${item.images[0]}')">
                        <img src="${item.images[0]}" alt="الصورة الأولى">
                    </div>` : 
                    '<div class="item-image empty"><i class="fas fa-image"></i></div>'
                }
                ${item.images && item.images[1] ? 
                    `<div class="item-image" onclick="viewImage('${item.images[1]}')">
                        <img src="${item.images[1]}" alt="الصورة الثانية">
                    </div>` : 
                    '<div class="item-image empty"><i class="fas fa-image"></i></div>'
                }
            </div>
        </div>
    `;
    
    return div;
}

// عرض جميع الأقسام
function renderAllSections() {
    Object.keys(portfolioData).forEach(section => {
        renderSection(section);
    });
}

// عرض قسم معين
function renderSection(section) {
    const container = document.getElementById(`${section}Items`);
    if (!container) return;
    
    const items = portfolioData[section] || [];
    
    // مسح المحتوى القديم
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-${getSectionIcon(section)}"></i>
                <h3>لا توجد عناصر</h3>
                <p>لم يتم إضافة أي عناصر إلى هذا القسم بعد</p>
                <button class="btn primary mt-20" onclick="showAddModal('${section}')">
                    <i class="fas fa-plus"></i>
                    إضافة أول عنصر
                </button>
            </div>
        `;
        return;
    }
    
    // ترتيب العناصر (الأحدث أولاً)
    items.sort((a, b) => {
        const dateA = new Date(a.dateAdded || a.timestamp || 0);
        const dateB = new Date(b.dateAdded || b.timestamp || 0);
        return dateB - dateA;
    });
    
    // إضافة العناصر
    items.forEach(item => {
        const itemCard = createItemCard(item, section);
        container.appendChild(itemCard);
    });
}

// الحصول على أيقونة القسم
function getSectionIcon(section) {
    const icons = {
        arabic: 'book',
        english: 'language',
        quran: 'book-quran',
        math: 'calculator',
        science: 'flask',
        activities: 'chalkboard-teacher'
    };
    return icons[section] || 'file';
}

// إعداد الواجهة
function setupUI() {
    console.log('🎨 إعداد الواجهة...');
    
    // إعداد السمة
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    const themeBtn = document.getElementById('themeToggle');
    if (savedTheme === 'dark') {
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // إعداد الإشعارات
    setupNotifications();
    
    console.log('✅ تم إعداد الواجهة');
}

// تبديل السمة
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeBtn = document.getElementById('themeToggle');
    themeBtn.innerHTML = newTheme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
    
    showToast(`تم تفعيل الوضع ${newTheme === 'dark' ? 'الداكن' : 'الفاتح'}`, 'info');
}

// إعداد الإشعارات
function setupNotifications() {
    // تعطيل الإشعارات المزعجة
    if (window.console) {
        const originalConsoleLog = console.log;
        console.log = function(...args) {
            if (!args[0]?.includes?.('✅') && !args[0]?.includes?.('❌')) {
                return;
            }
            originalConsoleLog.apply(console, args);
        };
    }
}

// تحديث البيانات
function refreshData() {
    showToast('جارٍ تحديث البيانات...', 'info');
    
    // إعادة تحميل البيانات
    loadPortfolioData();
    
    // تحديث الإحصائيات
    updateStats();
    
    setTimeout(() => {
        showToast('تم تحديث البيانات بنجاح', 'success');
    }, 500);
}

// تسجيل الخروج
function logout() {
    if (confirm('هل تريد تسجيل الخروج؟ سيتم حفظ جميع التغييرات تلقائياً.')) {
        // حفظ البيانات قبل الخروج
        savePortfolioData();
        
        showToast('تم تسجيل الخروج بنجاح', 'success');
        
        // إعادة تحميل الصفحة
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// عرض نافذة الإضافة
function showAddModal(section) {
    console.log(`➕ عرض نافذة الإضافة للقسم: ${section}`);
    
    // تعيين عنوان النافذة
    const titles = {
        arabic: 'إضافة حرف عربي جديد',
        english: 'إضافة كلمة إنجليزية جديدة',
        quran: 'إضافة سورة قرآنية جديدة',
        math: 'إضافة مفهوم رياضي جديد',
        science: 'إضافة تجربة علمية جديدة',
        activities: 'إضافة نشاط مدرسي جديد'
    };
    
    document.getElementById('modalTitle').textContent = titles[section] || 'إضافة جديد';
    document.getElementById('modalSection').value = section;
    
    // إعادة تعيين النموذج
    document.getElementById('addForm').reset();
    document.getElementById('preview1').innerHTML = '';
    document.getElementById('preview2').innerHTML = '';
    
    // عرض النافذة
    document.getElementById('addModal').style.display = 'flex';
}

// إغلاق النافذة
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
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
    if (!file.type.startsWith('image/')) {
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

// حفظ العنصر الجديد
function saveNewItem() {
    const section = document.getElementById('modalSection').value;
    const title = document.getElementById('itemTitle').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    
    if (!title) {
        showToast('الرجاء إدخال العنوان', 'error');
        return;
    }
    
    showToast('جارٍ حفظ العنصر...', 'info');
    
    // إنشاء عنصر جديد
    const newItem = {
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
        date: new Date().toLocaleDateString('ar-SA'),
        title: title,
        description: description,
        images: []
    };
    
    // إضافة خصائص إضافية بناءً على القسم
    switch(section) {
        case 'arabic':
            newItem.letter = title;
            break;
        case 'english':
            newItem.letter = title;
            break;
        case 'quran':
            newItem.surah = title;
            break;
        case 'math':
        case 'science':
            newItem.concept = title;
            break;
    }
    
    // معالجة الصور
    const image1 = document.getElementById('image1').files[0];
    const image2 = document.getElementById('image2').files[0];
    
    if (image1) {
        const imageUrl = URL.createObjectURL(image1);
        newItem.images.push(imageUrl);
    }
    
    if (image2) {
        const imageUrl = URL.createObjectURL(image2);
        newItem.images.push(imageUrl);
    }
    
    // إضافة إلى البيانات
    portfolioData[section].push(newItem);
    
    // حفظ البيانات
    savePortfolioData();
    
    // تحديث الواجهة
    updateStats();
    updateRecentItems();
    renderSection(section);
    
    // إغلاق النافذة وإظهار رسالة النجاح
    closeModal('addModal');
    showToast('تم إضافة العنصر بنجاح', 'success');
    
    // إذا كان المستخدم في القسم نفسه، تحويله إليه
    if (currentSection === section) {
        switchSection(section);
    }
}

// تعديل عنصر
function editItem(section, itemId) {
    showToast('ميزة التعديل قيد التطوير', 'info');
}

// حذف عنصر
function deleteItem(section, itemId) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذه العملية.')) {
        return;
    }
    
    showToast('جارٍ حذف العنصر...', 'info');
    
    // البحث عن العنصر وحذفه
    const itemIndex = portfolioData[section].findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        portfolioData[section].splice(itemIndex, 1);
        
        // حفظ البيانات
        savePortfolioData();
        
        // تحديث الواجهة
        updateStats();
        updateRecentItems();
        renderSection(section);
        
        showToast('تم حذف العنصر بنجاح', 'success');
    } else {
        showToast('لم يتم العثور على العنصر', 'error');
    }
}

// عرض الصورة
function viewImage(imageUrl) {
    if (!imageUrl) return;
    
    // إنشاء نافذة عرض الصورة
    const viewer = document.createElement('div');
    viewer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: zoom-out;
    `;
    
    viewer.innerHTML = `
        <img src="${imageUrl}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
        <button style="
            position: absolute;
            top: 20px;
            left: 20px;
            background: #e74c3c;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        " onclick="this.parentElement.remove()">&times;</button>
    `;
    
    viewer.onclick = function(e) {
        if (e.target === this) {
            this.remove();
        }
    };
    
    document.body.appendChild(viewer);
}

// تصدير القسم
function exportSection(section) {
    const sectionData = portfolioData[section] || [];
    
    if (sectionData.length === 0) {
        showToast('لا توجد بيانات للتصدير في هذا القسم', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(sectionData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportName = `${section}-export-${new Date().toISOString().slice(0,10)}.json`;
    
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = exportName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`تم تصدير قسم ${getSectionName(section)}`, 'success');
}

// الحصول على اسم القسم
function getSectionName(section) {
    const names = {
        arabic: 'اللغة العربية',
        english: 'الإنجليزية',
        quran: 'القرآن الكريم',
        math: 'الرياضيات',
        science: 'العلوم',
        activities: 'النشاطات'
    };
    return names[section] || section;
}

// عرض خيارات الطباعة
function showPrintOptions() {
    switchSection('print');
}

// طباعة الملف الكامل
function printFullPortfolio() {
    showToast('جارٍ تحضير الملف للطباعة...', 'info');
    
    // إنشاء محتوى الطباعة
    let print
