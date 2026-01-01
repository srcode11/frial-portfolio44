// نظام ملف الإنجاز - مبسط وشغال
console.log('📚 نظام ملف الإنجاز جاهز');

// البيانات
let portfolioData = {
    arabic: [],
    english: [],
    quran: [],
    math: [],
    science: [],
    activities: []
};

let currentTab = 'dashboard';

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء التطبيق');
    
    // إعداد الأزرار
    setupButtons();
    
    // تحميل البيانات
    loadData();
    
    // عرض الشاشة الرئيسية
    showDashboard();
    
    console.log('✅ التطبيق جاهز');
});

// إعداد الأزرار
function setupButtons() {
    console.log('🔘 إعداد الأزرار...');
    
    // قائمة التحكم
    document.getElementById('menuToggle').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    document.getElementById('sidebarClose').addEventListener('click', function() {
        document.getElementById('sidebar').classList.remove('active');
    });
    
    // التبديل بين الصفحات
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
            document.getElementById('sidebar').classList.remove('active');
        });
    });
    
    // زر الوضع الداكن
    document.getElementById('themeToggle').addEventListener('click', function() {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        showMessage('تم تغيير الوضع', 'success');
    });
    
    // زر الإضافة السريعة
    document.querySelector('[onclick*="showAddModal(\'quick\')"]').addEventListener('click', function() {
        showAddModal('quick');
    });
    
    // زر الطباعة
    document.querySelector('[onclick*="showPrintModal"]').addEventListener('click', function() {
        document.getElementById('printModal').style.display = 'flex';
    });
    
    // زر النسخ الاحتياطي
    document.querySelector('[onclick*="backupData"]').addEventListener('click', function() {
        backupData();
    });
    
    console.log('✅ تم إعداد جميع الأزرار');
}

// تحميل البيانات
function loadData() {
    console.log('📂 تحميل البيانات...');
    
    // جرب التخزين المحلي أولاً
    const saved = localStorage.getItem('teacherPortfolio');
    if (saved) {
        try {
            portfolioData = JSON.parse(saved);
            console.log('✅ تم تحميل البيانات المحلية');
            updateStats();
        } catch (e) {
            console.log('❌ خطأ في تحميل البيانات');
        }
    }
}

// حفظ البيانات
function saveData() {
    localStorage.setItem('teacherPortfolio', JSON.stringify(portfolioData));
    console.log('💾 تم حفظ البيانات');
}

// تبديل الصفحات
function switchTab(tabId) {
    console.log('🔄 التبديل إلى: ' + tabId);
    
    // تحديد الصفحة النشطة في القائمة
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        }
    });
    
    // إخفاء جميع المحتويات
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // إظهار المحتوى المطلوب
    const target = document.getElementById(tabId);
    if (target) {
        target.classList.add('active');
        currentTab = tabId;
        
        // تحميل محتوى الصفحة
        switch(tabId) {
            case 'dashboard':
                showDashboard();
                break;
            case 'fullPortfolio':
                showFullPortfolio();
                break;
            case 'arabic':
            case 'english':
            case 'quran':
            case 'math':
            case 'science':
            case 'activities':
                showSubject(tabId);
                break;
            case 'reports':
                showReports();
                break;
            case 'settings':
                showSettings();
                break;
        }
    }
}

// عرض الشاشة الرئيسية
function showDashboard() {
    console.log('🏠 عرض الشاشة الرئيسية');
    
    // تحديث الإحصائيات
    updateStats();
    
    // عرض النشاط الأخير
    showRecentActivity();
    
    // جعل أزرار الإجراءات تعمل
    setupActionButtons();
}

// تحديث الإحصائيات
function updateStats() {
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.images ? item.images.length : 0), 0), 0);
    
    // هذا الشهر
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthItems = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.filter(item => {
            if (!item.dateAdded) return false;
            const itemDate = new Date(item.dateAdded);
            return itemDate.getMonth() === thisMonth && itemDate.getFullYear() === thisYear;
        }).length, 0);
    
    // تحديث العرض
    if (document.getElementById('totalItems')) {
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('totalImages').textContent = totalImages;
        document.getElementById('thisMonth').textContent = thisMonthItems;
        document.getElementById('completionRate').textContent = 
            totalItems > 0 ? `${Math.min(100, Math.floor((totalItems / 50) * 100))}%` : '0%';
    }
    
    // تحديث الشارات في القائمة
    updateBadges();
}

// تحديث الشارات
function updateBadges() {
    const badges = {
        'fullPortfolio': document.getElementById('fullPortfolioBadge'),
        'arabic': document.getElementById('arabicBadge'),
        'english': document.getElementById('englishBadge'),
        'quran': document.getElementById('quranBadge'),
        'math': document.getElementById('mathBadge'),
        'science': document.getElementById('scienceBadge'),
        'activities': document.getElementById('activitiesBadge')
    };
    
    Object.entries(badges).forEach(([subject, badge]) => {
        if (badge) {
            if (subject === 'fullPortfolio') {
                badge.textContent = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
            } else {
                badge.textContent = portfolioData[subject] ? portfolioData[subject].length : 0;
            }
        }
    });
}

// عرض النشاط الأخير
function showRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    // جمع كل العناصر
    const allItems = [];
    Object.keys(portfolioData).forEach(subject => {
        if (portfolioData[subject]) {
            portfolioData[subject].forEach(item => {
                allItems.push({
                    ...item,
                    subject: subject
                });
            });
        }
    });
    
    // ترتيب من الأحدث
    allItems.sort((a, b) => {
        const timeA = a.timestamp || a.dateAdded || 0;
        const timeB = b.timestamp || b.dateAdded || 0;
        return timeB - timeA;
    });
    
    // أخذ 5 عناصر
    const recentItems = allItems.slice(0, 5);
    
    // عرضها
    container.innerHTML = '';
    
    if (recentItems.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h3>لا توجد نشاطات</h3>
                <p>ابدأ بإضافة أول عنصر</p>
            </div>
        `;
        return;
    }
    
    recentItems.forEach(item => {
        const activity = document.createElement('div');
        activity.className = 'recent-item';
        
        const icon = getSubjectIcon(item.subject);
        const title = item.title || item.letter || item.surah || item.concept || 'عنصر جديد';
        const date = item.date || formatDate(item.timestamp || item.dateAdded || Date.now());
        
        activity.innerHTML = `
            <div class="recent-icon">
                <i class="${icon}"></i>
            </div>
            <div class="recent-content">
                <h4>${title}</h4>
                <p>${getSubjectName(item.subject)}</p>
            </div>
            <div class="recent-time">${date}</div>
        `;
        
        container.appendChild(activity);
    });
}

// إعداد أزرار الإجراءات
function setupActionButtons() {
    // كل أزرار الإجراءات السريعة
    document.querySelectorAll('.action-card').forEach(btn => {
        const originalOnClick = btn.getAttribute('onclick');
        if (originalOnClick) {
            btn.addEventListener('click', function() {
                eval(originalOnClick);
            });
        }
    });
}

// عرض نافذة الإضافة
function showAddModal(subject) {
    console.log('➕ فتح نافذة الإضافة: ' + subject);
    
    // تعيين العنوان
    const titles = {
        'arabic': 'إضافة حرف عربي',
        'english': 'إضافة كلمة إنجليزية',
        'quran': 'إضافة سورة قرآنية',
        'math': 'إضافة مفهوم رياضي',
        'science': 'إضافة تجربة علمية',
        'activities': 'إضافة نشاط مدرسي',
        'quick': 'إضافة سريعة'
    };
    
    document.getElementById('modalTitle').textContent = titles[subject] || 'إضافة جديد';
    
    // تعيين المادة
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

// معاينة الصورة
function previewImage(input, previewId) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
    };
    reader.readAsDataURL(file);
}

// حفظ العنصر
function saveItem(event) {
    if (event) event.preventDefault();
    
    const subject = document.getElementById('modalSubject').value;
    const title = document.getElementById('itemTitle').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    
    if (!title) {
        showMessage('الرجاء إدخال العنوان', 'error');
        return;
    }
    
    // إنشاء العنصر
    const item = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        dateAdded: new Date().toISOString(),
        date: new Date().toLocaleDateString('ar-SA'),
        title: title,
        description: description
    };
    
    // إضافة بيانات خاصة
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
    
    item.images = [];
    
    // تحويل الصور إلى base64
    const processImage = (file) => {
        return new Promise((resolve) => {
            if (!file) {
                resolve(null);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    };
    
    Promise.all([processImage(image1), processImage(image2)]).then(results => {
        results.forEach(img => {
            if (img) item.images.push(img);
        });
        
        // إضافة إلى البيانات
        if (!portfolioData[subject]) portfolioData[subject] = [];
        portfolioData[subject].push(item);
        
        // حفظ البيانات
        saveData();
        
        // تحديث الواجهة
        updateStats();
        
        // إغلاق النافذة
        closeModal('addModal');
        
        // عرض رسالة نجاح
        showMessage('تم إضافة العنصر بنجاح!', 'success');
        
        // إذا كنا في صفحة المادة، تحديث العرض
        if (currentTab === subject) {
            showSubject(subject);
        }
    });
}

// إغلاق النافذة
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// عرض المادة
function showSubject(subject) {
    const container = document.getElementById(subject + 'Items');
    if (!container) return;
    
    const items = portfolioData[subject] || [];
    
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:50px 20px; color:#666;">
                <i class="${getSubjectIcon(subject)}" style="font-size:48px; margin-bottom:20px;"></i>
                <h3>لا توجد عناصر</h3>
                <p>ابدأ بإضافة أول عنصر</p>
                <button class="btn-primary" onclick="showAddModal('${subject}')" 
                        style="margin-top:20px; padding:10px 20px;">
                    <i class="fas fa-plus"></i> إضافة أول عنصر
                </button>
            </div>
        `;
        return;
    }
    
    // ترتيب من الأحدث
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // إنشاء العناصر
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const displayTitle = item.title || item.letter || item.surah || item.concept || 'عنصر';
        
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${displayTitle}</div>
                    <div class="item-date">${item.date || ''}</div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon" onclick="deleteItem('${subject}', '${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="item-body">
                <div class="item-description">${item.description || 'لا يوجد وصف'}</div>
                ${item.images && item.images.length > 0 ? `
                    <div class="item-images">
                        ${item.images.slice(0, 2).map((img, index) => `
                            <div class="item-image" onclick="viewImage('${img}')">
                                <img src="${img}" alt="صورة ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// حذف عنصر
function deleteItem(subject, itemId) {
    if (!confirm('هل تريد حذف هذا العنصر؟')) return;
    
    portfolioData[subject] = portfolioData[subject].filter(item => item.id !== itemId);
    saveData();
    showSubject(subject);
    updateStats();
    showMessage('تم الحذف بنجاح', 'success');
}

// عرض الصورة
function viewImage(url) {
    if (!url) return;
    
    const modal = document.getElementById('imagePreviewModal');
    const img = document.getElementById('previewedImage');
    
    if (modal && img) {
        img.src = url;
        modal.style.display = 'flex';
    }
}

// عرض الملف الكامل
function showFullPortfolio() {
    const container = document.getElementById('fullPortfolioContainer');
    if (!container) return;
    
    let html = '';
    
    const subjects = ['arabic', 'english', 'quran', 'math', 'science', 'activities'];
    
    subjects.forEach(subject => {
        const items = portfolioData[subject] || [];
        if (items.length === 0) return;
        
        html += `
            <div class="subject-section">
                <div class="subject-header">
                    <h3 class="subject-title">
                        <i class="${getSubjectIcon(subject)}"></i>
                        ${getSubjectName(subject)}
                    </h3>
                    <span class="subject-count">${items.length} عنصر</span>
                </div>
                <div class="items-grid">
        `;
        
        items.forEach(item => {
            const title = item.title || item.letter || item.surah || item.concept || 'عنصر';
            
            html += `
                <div class="item-card">
                    <div class="item-header">
                        <div class="item-title">${title}</div>
                        <div class="item-date">${item.date || ''}</div>
                    </div>
                    <div class="item-body">
                        <div class="item-description">${item.description || 'لا يوجد وصف'}</div>
                        ${item.images && item.images.length > 0 ? `
                            <div class="item-images">
                                ${item.images.slice(0, 2).map(img => `
                                    <div class="item-image" onclick="viewImage('${img}')">
                                        <img src="${img}" alt="صورة النشاط">
                                    </div>
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
    });
    
    if (!html) {
        html = `
            <div style="text-align:center; padding:80px 20px; color:#666;">
                <i class="fas fa-book-open" style="font-size:64px; margin-bottom:20px;"></i>
                <h3>الملف فارغ</h3>
                <p>ابدأ بإضافة عناصر إلى ملف الإنجاز</p>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// عرض التقارير
function showReports() {
    const container = document.getElementById('reportsContainer');
    if (!container) return;
    
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.images ? item.images.length : 0), 0), 0);
    
    container.innerHTML = `
        <div class="report-card">
            <h3><i class="fas fa-chart-pie"></i> نظرة عامة</h3>
            <div class="quick-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-layer-group"></i>
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
            </div>
        </div>
        
        <div class="report-card">
            <h3><i class="fas fa-download"></i> تصدير البيانات</h3>
            <div style="display:flex; flex-direction:column; gap:15px;">
                <button class="btn-primary" onclick="exportData()">
                    <i class="fas fa-file-export"></i>
                    تصدير كملف JSON
                </button>
                <button class="btn-secondary" onclick="backupData()">
                    <i class="fas fa-database"></i>
                    نسخة احتياطية
                </button>
                <button class="btn-success" onclick="printReport()">
                    <i class="fas fa-print"></i>
                    طباعة التقرير
                </button>
            </div>
        </div>
    `;
}

// عرض الإعدادات
function showSettings() {
    // جعل كل شيء في الإعدادات يعمل
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = document.body.classList.contains('dark-mode');
        darkModeToggle.addEventListener('change', function() {
            document.getElementById('themeToggle').click();
        });
    }
    
    // زر حذف البيانات
    document.querySelector('[onclick*="clearAllData"]').addEventListener('click', function() {
        if (confirm('هل تريد حذف جميع البيانات؟ لا يمكن التراجع!')) {
            portfolioData = {
                arabic: [], english: [], quran: [], math: [], science: [], activities: []
            };
            localStorage.removeItem('teacherPortfolio');
            showDashboard();
            showMessage('تم حذف جميع البيانات', 'success');
        }
    });
}

// تصدير البيانات
function exportData() {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = 'ملف-الإنجاز-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    
    showMessage('تم تصدير البيانات', 'success');
}

// نسخة احتياطية
function backupData() {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = 'backup-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    
    showMessage('تم إنشاء نسخة احتياطية', 'success');
}

// طباعة التقرير
function printReport() {
    window.print();
}

// إظهار رسالة
function showMessage(message, type) {
    // إنشاء عنصر الرسالة
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // إضافة الأنماط
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // إزالة تلقائية
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// ===== وظائف مساعدة =====

function getSubjectIcon(subject) {
    const icons = {
        arabic: 'fas fa-font',
        english: 'fas fa-language',
        quran: 'fas fa-book-quran',
        math: 'fas fa-calculator',
        science: 'fas fa-flask',
        activities: 'fas fa-chalkboard',
        dashboard: 'fas fa-home',
        fullPortfolio: 'fas fa-book-open',
        reports: 'fas fa-chart-bar',
        settings: 'fas fa-cogs'
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

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ar-SA');
}

// ===== جعل الدوال متاحة عالمياً =====

// كل الدوال التي تحتاجها موجودة أعلاه
// لا حاجة لإضافة المزيد

console.log('🎉 النظام جاهز! كل الأزرار تعمل الآن.');
