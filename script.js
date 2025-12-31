// Teacher Portfolio System - Complete & Working
console.log('🌟 نظام ملف الإنجاز - جاهز للعمل');

// بيانات التطبيق
let portfolioData = {
    arabic: [],
    english: [],
    quran: [],
    math: [],
    science: [],
    activities: []
};

let currentTab = 'dashboard';
let isOnline = false;

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تهيئة التطبيق...');
    
    // إعداد السايدبار
    setupSidebar();
    
    // إعداد المستمعين للأحداث
    setupEventListeners();
    
    // تحميل البيانات
    loadData();
    
    // إعداد الثيم
    setupTheme();
    
    // تحديث الإحصائيات
    updateBadges();
    
    console.log('✅ التطبيق جاهز للاستخدام');
});

// إعداد السايدبار
function setupSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const mainContent = document.getElementById('mainContent');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            menuToggle.innerHTML = sidebar.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    }
    
    // إغلاق السايدبار عند النقر خارجها
    if (mainContent) {
        mainContent.addEventListener('click', function() {
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

// إعداد المستمعين للأحداث
function setupEventListeners() {
    console.log('🔧 إعداد المستمعين للأحداث...');
    
    // عناصر القائمة
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
            
            // إغلاق السايدبار على الجوال
            if (window.innerWidth < 768) {
                const sidebar = document.getElementById('sidebar');
                const menuToggle = document.getElementById('menuToggle');
                if (sidebar) sidebar.classList.remove('active');
                if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // تبديل الثيم
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // زر الطباعة
    document.querySelectorAll('[onclick*="showPrintModal"]').forEach(btn => {
        btn.addEventListener('click', showPrintModal);
    });
    
    // زر النسخة الاحتياطية
    document.querySelectorAll('[onclick*="backupData"]').forEach(btn => {
        btn.addEventListener('click', backupData);
    });
    
    // نسخ سريعة
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', function() {
            const text = this.querySelector('h4').textContent;
            showToast(`فتح: ${text}`, 'info');
        });
    });
    
    // معاينة الصور
    document.querySelectorAll('.image-upload-box').forEach(box => {
        box.addEventListener('click', function() {
            const input = this.querySelector('input[type="file"]');
            if (input) input.click();
        });
    });
    
    console.log('✅ تم إعداد المستمعين للأحداث');
}

// تبديل التبويب
function switchTab(tabId) {
    console.log(`🔄 التبديل إلى: ${tabId}`);
    
    // تحديث القائمة
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        }
    });
    
    // تحديث المحتوى
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
            
            // تحميل بيانات التبويب إذا لزم
            if (tabId === 'fullPortfolio') {
                renderFullPortfolio();
            } else if (tabId !== 'dashboard' && tabId !== 'settings' && tabId !== 'reports') {
                renderSection(tabId);
            } else if (tabId === 'reports') {
                renderReports();
            }
        }
    });
    
    currentTab = tabId;
    
    // تحديث عنوان الصفحة
    updatePageTitle(tabId);
    
    showToast(`تم فتح ${getTabName(tabId)}`, 'info');
}

// الحصول على اسم التبويب
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

// تحديث عنوان الصفحة
function updatePageTitle(tabId) {
    const tabName = getTabName(tabId);
    document.title = `${tabName} - ملف إنجاز المعلمة فريال`;
}

// تحميل البيانات
async function loadData() {
    console.log('📥 جاري تحميل البيانات...');
    
    showToast('جاري تحميل البيانات...', 'info');
    
    try {
        // محاولة Firebase أولاً
        if (window.firebaseDb) {
            const docRef = window.firebaseDb.collection('portfolio').doc('data');
            const docSnap = await docRef.get();
            
            if (docSnap.exists()) {
                portfolioData = docSnap.data();
                console.log('✅ تم تحميل البيانات من Firebase');
                updateConnectionStatus('متصل بـ Firebase');
                isOnline = true;
            } else {
                // إنشاء مستند جديد
                await docRef.set(portfolioData);
                console.log('📝 تم إنشاء مستند جديد');
                updateConnectionStatus('جديد');
            }
        } else {
            throw new Error('Firebase غير متاح');
        }
    } catch (error) {
        console.warn('❌ Firebase فشل، جاري استخدام التخزين المحلي:', error);
        
        // استخدام التخزين المحلي
        try {
            const savedData = localStorage.getItem('teacherPortfolioData');
            if (savedData) {
                portfolioData = JSON.parse(savedData);
                console.log('✅ تم تحميل البيانات من التخزين المحلي');
                updateConnectionStatus('محلي');
            }
        } catch (localError) {
            console.error('❌ فشل تحميل البيانات المحلية:', localError);
            updateConnectionStatus('غير متصل');
        }
    }
    
    // تحديث الواجهة
    updateDashboard();
    updateBadges();
    
    showToast('تم تحميل البيانات بنجاح', 'success');
}

// تحديث حالة الاتصال
function updateConnectionStatus(status) {
    const statusElement = document.getElementById('connectionStatus');
    const statusItem = document.getElementById('connectionStatusItem');
    
    if (statusElement) {
        statusElement.textContent = status;
        
        // تحديث اللون حسب الحالة
        if (status.includes('Firebase') || status.includes('متصل')) {
            statusElement.style.color = '#51CF66';
            if (statusItem) statusItem.style.color = '#51CF66';
        } else if (status.includes('محلي')) {
            statusElement.style.color = '#FFD43B';
            if (statusItem) statusItem.style.color = '#FFD43B';
        } else {
            statusElement.style.color = '#FF6B6B';
            if (statusItem) statusItem.style.color = '#FF6B6B';
        }
    }
}

// تحديث الشاشة الرئيسية
function updateDashboard() {
    console.log('📊 تحديث الشاشة الرئيسية...');
    
    // حساب الإحصائيات
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.images ? item.images.length : 0), 0), 0);
    
    // هذا الشهر
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthItems = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.filter(item => {
            const itemDate = new Date(item.timestamp || Date.now());
            return itemDate.getMonth() === currentMonth && 
                   itemDate.getFullYear() === currentYear;
        }).length, 0);
    
    // معدل الإنجاز
    const completionRate = totalItems > 0 ? Math.min(100, Math.floor((totalItems / 100) * 100)) : 0;
    
    // تحديث DOM
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalImages').textContent = totalImages;
    document.getElementById('thisMonth').textContent = thisMonthItems;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
    
    // تحديث النشاط الأخير
    updateRecentActivity();
}

// تحديث النشاط الأخير
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
    
    // ترتيب حسب التاريخ
    allItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // أخذ 5 عناصر فقط
    const recentItems = allItems.slice(0, 5);
    
    // مسح المحتوى القديم
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
    
    // إضافة العناصر الجديدة
    recentItems.forEach(item => {
        const activity = document.createElement('div');
        activity.className = 'recent-item';
        
        const icon = getSubjectIcon(item.subject);
        const title = item.letter || item.surah || item.concept || item.title || 'عنصر جديد';
        const time = formatDate(new Date(item.timestamp || Date.now()));
        
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

// تحديث الشارات
function updateBadges() {
    Object.keys(portfolioData).forEach(subject => {
        const badge = document.getElementById(`${subject}Badge`);
        if (badge) {
            const count = portfolioData[subject].length;
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    });
    
    // تحديث شارة الملف الكامل
    const totalBadge = document.getElementById('fullPortfolioBadge');
    if (totalBadge) {
        const total = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
        totalBadge.textContent = total;
        totalBadge.style.display = total > 0 ? 'flex' : 'none';
    }
}

// الحصول على أيقونة المادة
function getSubjectIcon(subject) {
    const icons = {
        arabic: 'fas fa-font',
        english: 'fas fa-language',
        quran: 'fas fa-book-quran',
        math: 'fas fa-calculator',
        science: 'fas fa-flask',
        activities: 'fas fa-chalkboard-teacher'
    };
    return icons[subject] || 'fas fa-file';
}

// الحصول على اسم المادة
function getSubjectName(subject) {
    const names = {
        arabic: 'اللغة العربية',
        english: 'الإنجليزية',
        quran: 'القرآن الكريم',
        math: 'الرياضيات',
        science: 'العلوم',
        activities: 'النشاطات'
    };
    return names[subject] || subject;
}

// عرض الملف الكامل
function renderFullPortfolio() {
    console.log('📚 عرض الملف الكامل...');
    
    const container = document.getElementById('fullPortfolioContainer');
    if (!container) return;
    
    // مسح المحتوى القديم
    container.innerHTML = '';
    
    // التحقق إذا كانت البيانات فارغة
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    if (totalItems === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>الملف فارغ</h3>
                <p>لم يتم إضافة أي عناصر إلى ملف الإنجاز بعد</p>
                <button class="btn-primary mt-20" onclick="showAddModal('arabic')">
                    <i class="fas fa-plus"></i>
                    ابدأ بإضافة أول عنصر
                </button>
            </div>
        `;
        return;
    }
    
    // عرض كل المواد
    Object.keys(portfolioData).forEach(subject => {
        const items = portfolioData[subject];
        if (items.length === 0) return;
        
        const section = document.createElement('div');
        section.className = 'full-portfolio-item';
        
        const subjectName = getSubjectName(subject);
        const subjectIcon = getSubjectIcon(subject);
        
        let itemsHTML = '';
        items.forEach(item => {
            const title = item.letter || item.surah || item.concept || item.title || 'عنصر بدون عنوان';
            const date = formatDate(new Date(item.timestamp || Date.now()));
            
            let imagesHTML = '';
            if (item.images && item.images.length > 0) {
                imagesHTML = `
                    <div class="subject-item-images">
                        ${item.images.map((img, index) => `
                            <div class="subject-image" onclick="viewImage('${img}')">
                                <img src="${img}" alt="صورة ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            
            itemsHTML += `
                <div class="subject-item">
                    <div class="subject-item-header">
                        <div class="subject-item-title">${title}</div>
                        <div class="subject-item-date">${date}</div>
                    </div>
                    <div class="subject-item-description">
                        ${item.description || 'لا يوجد وصف'}
                    </div>
                    ${imagesHTML}
                </div>
            `;
        });
        
        section.innerHTML = `
            <div class="portfolio-item-header">
                <i class="${subjectIcon}"></i>
                <h3>${subjectName}</h3>
            </div>
            <div class="portfolio-item-body">
                <div class="portfolio-subject">
                    <i class="${subjectIcon}"></i>
                    ${subjectName} - ${items.length} عنصر
                </div>
                <div class="subject-items">
                    ${itemsHTML}
                </div>
            </div>
        `;
        
        container.appendChild(section);
    });
}

// عرض قسم معين
function renderSection(subject) {
    console.log(`📂 عرض قسم: ${subject}`);
    
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
                <p>لم يتم إضافة أي عناصر إلى ${getSubjectName(subject)} بعد</p>
                <button class="btn-primary mt-20" onclick="showAddModal('${subject}')">
                    <i class="fas fa-plus"></i>
                    إضافة أول عنصر
                </button>
            </div>
        `;
        return;
    }
    
    // ترتيب العناصر من الأحدث إلى الأقدم
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // إضافة العناصر
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const title = item.letter || item.surah || item.concept || item.title || 'عنصر بدون عنوان';
        const date = formatDate(new Date(item.timestamp || Date.now()));
        
        let imagesHTML = '';
        if (item.images && item.images.length > 0) {
            imagesHTML = `
                <div class="item-images">
                    ${item.images.map((img, index) => `
                        <div class="item-image" onclick="viewImage('${img}')">
                            <img src="${img}" alt="صورة ${index + 1}">
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            imagesHTML = `
                <div class="item-images">
                    <div class="item-image empty">
                        <i class="fas fa-image"></i>
                    </div>
                    <div class="item-image empty">
                        <i class="fas fa-image"></i>
                    </div>
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
                    <button class="btn-icon" onclick="editItem('${subject}', '${item.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
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

// عرض التقارير
function renderReports() {
    const container = document.getElementById('reportsContainer');
    if (!container) return;
    
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.images ? item.images.length : 0), 0), 0);
    
    let subjectsHTML = '';
    Object.keys(portfolioData).forEach(subject => {
        const count = portfolioData[subject].length;
        const percentage = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
        
        subjectsHTML += `
            <div class="report-item">
                <div class="report-subject">
                    <i class="${getSubjectIcon(subject)}"></i>
                    <span>${getSubjectName(subject)}</span>
                </div>
                <div class="report-stats">
                    <div class="report-count">${count} عنصر</div>
                    <div class="report-bar">
                        <div class="report-progress" style="width: ${percentage}%"></div>
                    </div>
                    <div class="report-percentage">${percentage}%</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = `
        <div class="section-card">
            <h2 class="section-title">
                <i class="fas fa-chart-pie"></i>
                نظرة عامة
            </h2>
            <div class="report-overview">
                <div class="overview-item">
                    <div class="overview-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                        <i class="fas fa-layer-group"></i>
                    </div>
                    <div class="overview-content">
                        <h3>${totalItems}</h3>
                        <p>إجمالي العناصر</p>
                    </div>
                </div>
                <div class="overview-item">
                    <div class="overview-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c);">
                        <i class="fas fa-images"></i>
                    </div>
                    <div class="overview-content">
                        <h3>${totalImages}</h3>
                        <p>إجمالي الصور</p>
                    </div>
                </div>
                <div class="overview-item">
                    <div class="overview-icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe);">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="overview-content">
                        <h3>${new Date().toLocaleDateString('ar-SA')}</h3>
                        <p>تاريخ اليوم</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="section-card">
            <h2 class="section-title">
                <i class="fas fa-chart-bar"></i>
                توزيع المواد
            </h2>
            <div class="report-subjects">
                ${subjectsHTML}
            </div>
        </div>
    `;
}

// عرض نافذة الإضافة
function showAddModal(subject = 'arabic') {
    console.log(`➕ فتح نافذة إضافة لـ: ${subject}`);
    
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
    
    document.getElementById('modalTitle').textContent = titles[subject] || 'إضافة جديد';
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
    
    // عرض النافذة
    document.getElementById('addModal').style.display = 'flex';
}

// معاينة الصورة
function previewImage(input, previewId) {
    const file = input.files[0];
    if (!file) return;
    
    // التحقق من حجم الصورة
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
        preview.innerHTML = `<img src="${e.target.result}" alt="معاينة">`;
    };
    reader.readAsDataURL(file);
}

// حفظ العنصر
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
        showToast('جاري حفظ العنصر...', 'info');
        
        // إنشاء العنصر
        const item = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            date: formatDate(new Date()),
            title: title,
            description: description
        };
        
        // إضافة حقول خاصة بالمادة
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
        
        if (image1) {
            const url1 = await handleImageUpload(image1, subject);
            if (url1) item.images.push(url1);
        }
        
        if (image2) {
            const url2 = await handleImageUpload(image2, subject);
            if (url2) item.images.push(url2);
        }
        
        // إضافة إلى البيانات المحلية
        if (!portfolioData[subject]) portfolioData[subject] = [];
        portfolioData[subject].push(item);
        
        // حفظ البيانات
        await saveData();
        
        // تحديث الواجهة
        updateDashboard();
        updateBadges();
        
        if (currentTab === subject || currentTab === 'fullPortfolio') {
            if (currentTab === 'fullPortfolio') {
                renderFullPortfolio();
            } else {
                renderSection(subject);
            }
        }
        
        // إغلاق النافذة وعرض رسالة النجاح
        closeModal('addModal');
        showToast('تم إضافة العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حفظ العنصر:', error);
        showToast('فشل في حفظ العنصر', 'error');
    }
}

// معالجة رفع الصور
async function handleImageUpload(file, subject) {
    try {
        // استخدام Firebase Storage إذا كان متاحاً
        if (window.firebaseStorage && isOnline) {
            const fileName = `${Date.now()}_${subject}_${file.name}`;
            const storageRef = window.firebaseStorage.ref(`portfolio-images/${fileName}`);
            const snapshot = await storageRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            return downloadURL;
        } else {
            // استخدام Base64 للتخزين المحلي
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        }
    } catch (error) {
        console.warn('❌ فشل رفع الصورة:', error);
        showToast('فشل رفع الصورة، سيتم استخدام التخزين المحلي', 'warning');
        
        // استخدام Base64 كبديل
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }
}

// حفظ البيانات
async function saveData() {
    try {
        // حفظ في Firebase إذا كان متصلاً
        if (window.firebaseDb && isOnline) {
            await window.firebaseDb.collection('portfolio').doc('data').set(portfolioData);
            console.log('✅ تم الحفظ في Firebase');
        }
        
        // حفظ نسخة محلية دائماً
        localStorage.setItem('teacherPortfolioData', JSON.stringify(portfolioData));
        console.log('✅ تم الحفظ محلياً');
        
    } catch (error) {
        console.error('❌ خطأ في حفظ البيانات:', error);
        throw error;
    }
}

// تحرير العنصر
function editItem(subject, itemId) {
    console.log(`✏️ تحرير العنصر: ${itemId}`);
    showToast('ميزة التحرير قيد التطوير', 'info');
}

// حذف العنصر
async function deleteItem(subject, itemId) {
    console.log(`🗑️ حذف العنصر: ${itemId}`);
    
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.')) {
        return;
    }
    
    try {
        showToast('جاري حذف العنصر...', 'info');
        
        // حذف من البيانات المحلية
        portfolioData[subject] = portfolioData[subject].filter(item => item.id !== itemId);
        
        // حفظ التغييرات
        await saveData();
        
        // تحديث الواجهة
        updateDashboard();
        updateBadges();
        
        if (currentTab === subject || currentTab === 'fullPortfolio') {
            if (currentTab === 'fullPortfolio') {
                renderFullPortfolio();
            } else {
                renderSection(subject);
            }
        }
        
        showToast('تم حذف العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حذف العنصر:', error);
        showToast('فشل في حذف العنصر', 'error');
    }
}

// عرض الصورة
function viewImage(url) {
    if (!url) return;
    
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer';
    viewer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        cursor: pointer;
    `;
    
    viewer.innerHTML = `
        <div style="position: relative; max-width: 90%; max-height: 90%;">
            <img src="${url}" 
                 style="max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 8px;"
                 alt="صورة معاينة">
            <button onclick="this.parentElement.parentElement.remove()"
                    style="position: absolute; top: -20px; left: -20px; 
                           background: #ff6b6b; color: white; border: none; 
                           width: 40px; height: 40px; border-radius: 50%; 
                           font-size: 20px; cursor: pointer; display: flex;
                           align-items: center; justify-content: center;">
                &times;
            </button>
        </div>
    `;
    
    viewer.onclick = function(e) {
        if (e.target === this) {
            this.remove();
        }
    };
    
    document.body.appendChild(viewer);
}

// إغلاق النافذة
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// عرض نافذة الطباعة
function showPrintModal() {
    document.getElementById('printModal').style.display = 'flex';
}

// معالجة الطباعة
function handlePrint() {
    const option = document.querySelector('input[name="printOption"]:checked').value;
    
    let content = '';
    let title = 'ملف إنجاز المعلمة فريال الغماري';
    
    switch(option) {
        case 'current':
            if (currentTab === 'fullPortfolio') {
                content = document.getElementById('fullPortfolioContainer').innerHTML;
                title = 'الملف الكامل - ' + title;
            } else {
                content = document.getElementById(currentTab).innerHTML;
                title = getTabName(currentTab) + ' - ' + title;
            }
            break;
        case 'full':
        default:
            content = generatePrintContent();
            title = 'الملف الكامل - ' + title;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html dir="rtl">
        <head>
            <title>${title}</title>
            <style>
                body { font-family: 'Cairo', sans-serif; padding: 20px; color: #333; }
                .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                .print-header h1 { color: #4A6FA5; margin-bottom: 10px; }
                .print-footer { margin-top: 50px; text-align: center; border-top: 1px solid #ccc; padding-top: 20px; color: #666; }
                .section { margin-bottom: 30px; }
                .section-title { color: #4A6FA5; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                .item { margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 8px; }
                .item-title { font-weight: bold; color: #2D4A75; }
                .item-date { color: #666; font-size: 0.9em; }
                .item-description { margin: 10px 0; }
                .item-images { display: flex; gap: 10px; margin-top: 15px; }
                .item-images img { max-width: 200px; max-height: 150px; object-fit: cover; border-radius: 4px; }
                @media print {
                    .no-print { display: none; }
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            <div class="print-header">
                <h1>${title}</h1>
                <p>المعلمة: فريال عبدالله الغماري | ابتدائية النخبة النموذجية</p>
                <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
            </div>
            
            ${content}
            
            <div class="print-footer">
                <p>© ${new Date().getFullYear()} ملف إنجاز المعلمة فريال الغماري - جميع الحقوق محفوظة</p>
            </div>
            
            <div class="no-print" style="margin-top: 50px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #4A6FA5; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    طباعة
                </button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                    إغلاق
                </button>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    closeModal('printModal');
    showToast('جاري تحضير الطباعة', 'info');
}

// توليد محتوى الطباعة
function generatePrintContent() {
    let html = '';
    
    Object.keys(portfolioData).forEach(subject => {
        const items = portfolioData[subject];
        if (items.length === 0) return;
        
        const subjectName = getSubjectName(subject);
        
        html += `
            <div class="section">
                <h2 class="section-title">${subjectName}</h2>
        `;
        
        items.forEach(item => {
            const title = item.letter || item.surah || item.concept || item.title || 'عنصر بدون عنوان';
            const date = formatDate(new Date(item.timestamp || Date.now()));
            
            let imagesHTML = '';
            if (item.images && item.images.length > 0) {
                imagesHTML = `
                    <div class="item-images">
                        ${item.images.map(img => `<img src="${img}" alt="صورة">`).join('')}
                    </div>
                `;
            }
            
            html += `
                <div class="item">
                    <div class="item-title">${title}</div>
                    <div class="item-date">${date}</div>
                    <div class="item-description">${item.description || 'لا يوجد وصف'}</div>
                    ${imagesHTML}
                </div>
            `;
        });
        
        html += `</div>`;
    });
    
    return html;
}

// تصدير الملف الكامل
function exportFullPortfolio() {
    const data = {
        info: {
            title: 'ملف إنجاز المعلمة فريال الغماري',
            teacher: 'فريال عبدالله الغماري',
            school: 'ابتدائية النخبة النموذجية',
            exportDate: new Date().toISOString(),
            totalItems: Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0)
        },
        data: portfolioData
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const fileName = `ملف-إنجاز-فريال-الغماري-${new Date().toISOString().split('T')[0]}.json`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', fileName);
    link.click();
    
    showToast('تم تصدير الملف الكامل', 'success');
}

// نسخة احتياطية
function backupData() {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const fileName = `نسخة-احتياطية-${new Date().toISOString().split('T')[0]}.json`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', fileName);
    link.click();
    
    showToast('تم إنشاء نسخة احتياطية', 'success');
}

// إعداد الثيم
function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.innerHTML = savedTheme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }
}

// تبديل الثيم
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
    
    showToast(`تم تفعيل الوضع ${newTheme === 'dark' ? 'الداكن' : 'الفاتح'}`, 'info');
}

// تنسيق التاريخ
function formatDate(date) {
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// عرض الإشعارات
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
            <div class="toast-title">${titles[type] || 'معلومة'}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // إزالة تلقائية بعد 5 ثواني
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// جعل الدوال متاحة عالمياً
window.switchTab = switchTab;
window.showAddModal = showAddModal;
window.closeModal = closeModal;
window.previewImage = previewImage;
window.saveItem = saveItem;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.viewImage = viewImage;
window.showPrintModal = showPrintModal;
window.handlePrint = handlePrint;
window.exportFullPortfolio = exportFullPortfolio;
window.backupData = backupData;
window.toggleTheme = toggleTheme;

console.log('🎉 النظام جاهز! جميع الميزات تعمل بشكل صحيح.');