// Teacher Portfolio System - Local Storage Only
console.log('🌟 نظام ملف الإنجاز - جاهز للعمل');

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

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تهيئة التطبيق...');
    
    // Setup Event Listeners
    setupEventListeners();
    
    // Load Data
    loadData();
    
    // Setup Theme
    setupTheme();
    
    // Setup Sidebar
    setupSidebar();
    
    console.log('✅ التطبيق جاهز للاستخدام');
});

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
    
    // Image Quality Select
    document.getElementById('imageQuality').addEventListener('change', function() {
        localStorage.setItem('imageQuality', this.value);
        showToast(`جودة الصور: ${this.value === 'high' ? 'عالية' : this.value === 'medium' ? 'متوسطة' : 'منخفضة'}`, 'success');
    });
    
    console.log('✅ تم إعداد المستمعين للأحداث');
});

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
    
    // Load other settings
    const autoBackup = localStorage.getItem('autoBackup');
    if (autoBackup !== null) {
        document.getElementById('autoBackup').checked = autoBackup === 'true';
    }
    
    const imageQuality = localStorage.getItem('imageQuality') || 'medium';
    document.getElementById('imageQuality').value = imageQuality;
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
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Switch Tabs
function switchTab(tabId) {
    console.log(`🔄 الانتقال إلى: ${getTabName(tabId)}`);
    
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
        }
    });
    
    currentTab = tabId;
    
    // Load section data if needed
    if (tabId === 'fullPortfolio') {
        loadFullPortfolio();
    } else if (tabId === 'reports') {
        generateReports();
    } else if (tabId !== 'dashboard' && tabId !== 'settings') {
        loadSectionData(tabId);
    }
    
    showToast(`تم الانتقال إلى ${getTabName(tabId)}`, 'info');
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

// Load Data
function loadData() {
    console.log('📥 جاري تحميل البيانات...');
    
    try {
        const localData = localStorage.getItem('teacherPortfolio');
        if (localData) {
            portfolioData = JSON.parse(localData);
            console.log('✅ تم تحميل البيانات من التخزين المحلي');
            updateConnectionStatus('محلي');
        } else {
            console.log('📝 لا توجد بيانات محلية، سيتم إنشاء ملف جديد');
            updateConnectionStatus('جديد');
        }
        
        // Update UI
        updateDashboard();
        updateMenuBadges();
        loadRecentActivity();
        
        showToast('تم تحميل البيانات بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        showToast('خطأ في تحميل البيانات', 'error');
        updateConnectionStatus('خطأ');
    }
}

// Update Connection Status
function updateConnectionStatus(status) {
    const statusElement = document.getElementById('connectionStatus');
    if (statusElement) {
        statusElement.textContent = status;
        
        const statusItem = document.getElementById('connectionStatusItem');
        if (status === 'محلي') {
            statusItem.style.color = '#28a745';
        } else if (status === 'جديد') {
            statusItem.style.color = '#ffc107';
        } else {
            statusItem.style.color = '#dc3545';
        }
    }
}

// Update Dashboard
function updateDashboard() {
    console.log('📊 تحديث الشاشة الرئيسية...');
    
    // Calculate totals
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.images ? item.images.length : 0), 0), 0);
    
    // This month items
    const currentMonth = new Date().getMonth();
    const thisMonthItems = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.filter(item => {
            const itemDate = new Date(item.timestamp || Date.now());
            return itemDate.getMonth() === currentMonth;
        }).length, 0);
    
    // Completion rate
    const completionRate = Math.min(100, Math.floor((totalItems / 50) * 100));
    
    // Update DOM
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
    
    // Get all items sorted by timestamp
    const allItems = [];
    Object.keys(portfolioData).forEach(subject => {
        portfolioData[subject].forEach(item => {
            allItems.push({
                ...item,
                subject: subject
            });
        });
    });
    
    // Sort by timestamp (newest first)
    allItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // Take latest 5
    const recentItems = allItems.slice(0, 5);
    
    // Clear container
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
    
    // Add items
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
    console.log(`➕ عرض نافذة الإضافة لـ: ${subject}`);
    
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
    
    // Reset form
    document.getElementById('itemTitle').value = '';
    document.getElementById('itemDescription').value = '';
    document.getElementById('imageFile1').value = '';
    document.getElementById('imageFile2').value = '';
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
    
    // Show modal
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
    
    // Check file size (max 2MB for local storage)
    if (file.size > 2 * 1024 * 1024) {
        showToast('حجم الصورة كبير جداً (الحد الأقصى 2MB)', 'error');
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

// Save Item
function saveItem() {
    console.log('💾 حفظ العنصر...');
    
    const subject = document.getElementById('modalSubject').value;
    const title = document.getElementById('itemTitle').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    
    if (!title) {
        showToast('الرجاء إدخال العنوان', 'error');
        return;
    }
    
    try {
        showToast('جارٍ حفظ العنصر...', 'info');
        
        // Create item object
        const item = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            date: formatDate(new Date()),
            title: title,
            description: description
        };
        
        // Add specific fields based on subject
        if (subject === 'arabic') {
            item.letter = title;
        } else if (subject === 'english') {
            item.letter = title;
        } else if (subject === 'quran') {
            item.surah = title;
        } else if (subject === 'math' || subject === 'science') {
            item.concept = title;
        }
        
        // Handle image uploads
        item.images = [];
        
        const image1 = document.getElementById('imageFile1').files[0];
        const image2 = document.getElementById('imageFile2').files[0];
        
        if (image1) {
            const url1 = await uploadImage(image1);
            if (url1) item.images.push(url1);
        }
        
        if (image2) {
            const url2 = await uploadImage(image2);
            if (url2) item.images.push(url2);
        }
        
        // Determine which subject to add to
        let targetSubject = subject;
        if (subject === 'quick') {
            // Ask user which subject
            targetSubject = prompt('أدخل اسم القسم (arabic, english, quran, math, science, activities):', 'arabic');
            if (!targetSubject || !portfolioData.hasOwnProperty(targetSubject)) {
                showToast('اسم القسم غير صحيح', 'error');
                return;
            }
        }
        
        // Add to portfolio data
        portfolioData[targetSubject].push(item);
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Update UI
        updateDashboard();
        updateMenuBadges();
        loadRecentActivity();
        if (currentTab === targetSubject || currentTab === 'fullPortfolio') {
            loadSectionData(targetSubject);
        }
        
        // Close modal and show success
        closeModal('addModal');
        showToast('تم إضافة العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حفظ العنصر:', error);
        showToast('خطأ في حفظ العنصر', 'error');
    }
}

// Upload Image - async function
async function uploadImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Compress image if needed
            const imageQuality = localStorage.getItem('imageQuality') || 'medium';
            const compressedData = compressImage(e.target.result, imageQuality);
            resolve(compressedData);
        };
        reader.readAsDataURL(file);
    });
}

// Compress Image
function compressImage(dataUrl, quality = 'medium') {
    // For now, just return the original
    // In a real app, you would compress the image here
    return dataUrl;
}

// Save to Local Storage
function saveToLocalStorage() {
    try {
        localStorage.setItem('teacherPortfolio', JSON.stringify(portfolioData));
        console.log('✅ تم الحفظ في التخزين المحلي');
        
        // Auto backup if enabled
        const autoBackup = localStorage.getItem('autoBackup');
        if (autoBackup === 'true') {
            createAutoBackup();
        }
        
    } catch (error) {
        console.warn('❌ فشل الحفظ في التخزين المحلي:', error);
        // If storage is full, try to clear old backups
        if (error.name === 'QuotaExceededError') {
            clearOldBackups();
            showToast('تم مسح النسخ القديمة لحفظ البيانات الجديدة', 'warning');
            saveToLocalStorage(); // Try again
        }
    }
}

// Create Auto Backup
function createAutoBackup() {
    const today = new Date().toISOString().split('T')[0];
    const lastBackup = localStorage.getItem('lastBackupDate');
    
    // Create backup only once per day
    if (lastBackup !== today) {
        const backupData = JSON.stringify(portfolioData);
        const backupKey = `backup_${today}`;
        
        try {
            localStorage.setItem(backupKey, backupData);
            localStorage.setItem('lastBackupDate', today);
            console.log('✅ تم إنشاء نسخة احتياطية تلقائية');
        } catch (error) {
            console.warn('❌ فشل إنشاء النسخة الاحتياطية:', error);
        }
    }
}

// Clear Old Backups
function clearOldBackups() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('backup_')) {
            const dateStr = key.replace('backup_', '');
            const backupDate = new Date(dateStr);
            
            if (backupDate < oneWeekAgo) {
                localStorage.removeItem(key);
                console.log(`🗑️ تم مسح النسخة القديمة: ${key}`);
            }
        }
    }
}

// Load Section Data
function loadSectionData(subject) {
    const container = document.getElementById(`${subject}Items`);
    if (!container) return;
    
    const items = portfolioData[subject] || [];
    
    // Clear container
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
    
    // Sort items by timestamp (newest first)
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // Add items
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const title = item.letter || item.surah || item.concept || item.title || 'عنصر بدون عنوان';
        const date = item.date || formatDate(new Date(item.timestamp));
        
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${title}</div>
                    <div class="item-date">${date}</div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon delete-btn" onclick="deleteItem('${subject}', '${item.id}')" 
                            title="حذف العنصر">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="item-body">
                <div class="item-description">${item.description || 'لا يوجد وصف'}</div>
                <div class="item-images">
                    <div class="item-image" onclick="viewImage('${item.images?.[0] || ''}')">
                        ${item.images && item.images[0] ? 
                            `<img src="${item.images[0]}" alt="الصورة الأولى">` : 
                            '<div class="item-image empty"><i class="fas fa-image"></i></div>'
                        }
                    </div>
                    <div class="item-image" onclick="viewImage('${item.images?.[1] || ''}')">
                        ${item.images && item.images[1] ? 
                            `<img src="${item.images[1]}" alt="الصورة الثانية">` : 
                            '<div class="item-image empty"><i class="fas fa-image"></i></div>'
                        }
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Delete Item
function deleteItem(subject, itemId) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذه العملية.')) {
        return;
    }
    
    try {
        showToast('جارٍ حذف العنصر...', 'info');
        
        // Find and remove item
        const itemIndex = portfolioData[subject].findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
            showToast('العنصر غير موجود', 'error');
            return;
        }
        
        // Remove item
        portfolioData[subject].splice(itemIndex, 1);
        
        // Save changes
        saveToLocalStorage();
        
        // Update UI
        updateDashboard();
        updateMenuBadges();
        loadRecentActivity();
        
        // Reload current content
        if (currentTab === subject || currentTab === 'fullPortfolio') {
            if (currentTab === 'fullPortfolio') {
                loadFullPortfolio();
            } else {
                loadSectionData(subject);
            }
        }
        
        showToast('تم حذف العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حذف العنصر:', error);
        showToast('خطأ في حذف العنصر', 'error');
    }
}

// Delete All Items from Subject
function deleteAllItems(subject) {
    if (!confirm(`هل أنت متأكد من حذف جميع عناصر قسم ${getSubjectName(subject)}؟ هذه العملية لا يمكن التراجع عنها.`)) {
        return;
    }
    
    try {
        showToast(`جارٍ حذف جميع عناصر ${getSubjectName(subject)}...`, 'info');
        
        // Delete all items
        portfolioData[subject] = [];
        
        // Save changes
        saveToLocalStorage();
        
        // Update UI
        updateDashboard();
        updateMenuBadges();
        loadRecentActivity();
        
        if (currentTab === subject || currentTab === 'fullPortfolio') {
            if (currentTab === 'fullPortfolio') {
                loadFullPortfolio();
            } else {
                loadSectionData(subject);
            }
        }
        
        showToast(`تم حذف جميع عناصر ${getSubjectName(subject)}`, 'success');
        
    } catch (error) {
        console.error('خطأ في حذف العناصر:', error);
        showToast('خطأ في حذف العناصر', 'error');
    }
}

// Load Full Portfolio
function loadFullPortfolio() {
    const container = document.getElementById('fullPortfolioContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create sections for each subject
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
        
        // Load items for this section
        const itemsContainer = document.getElementById(`full-${subject}`);
        if (itemsContainer) {
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card';
                
                const title = item.letter || item.surah || item.concept || item.title || 'عنصر بدون عنوان';
                const date = item.date || formatDate(new Date(item.timestamp));
                
                card.innerHTML = `
                    <div class="item-header">
                        <div>
                            <div class="item-title">${title}</div>
                            <div class="item-date">${date}</div>
                        </div>
                        <div class="item-actions">
                            <button class="btn-icon delete-btn" onclick="deleteItem('${subject}', '${item.id}')" 
                                    title="حذف العنصر">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="item-body">
                        <div class="item-description">${item.description || 'لا يوجد وصف'}</div>
                        ${item.images && item.images.length > 0 ? `
                            <div class="item-images">
                                ${item.images.map((img, index) => `
                                    <div class="item-image" onclick="viewImage('${img}')">
                                        <img src="${img}" alt="الصورة ${index + 1}">
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
                
                itemsContainer.appendChild(card);
            });
        }
    });
    
    // If no items at all
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
            setTimeout(() => {
                content = document.getElementById('fullPortfolioContainer').innerHTML;
                printContent(content, 'الملف الكامل - ' + title);
            }, 100);
            return;
        } else if (currentTab !== 'dashboard' && currentTab !== 'settings' && currentTab !== 'reports') {
            content = document.getElementById(currentTab + 'Items').innerHTML;
            title = getSubjectName(currentTab) + ' - ' + title;
        }
    } else if (option === 'full') {
        loadFullPortfolio();
        setTimeout(() => {
            content = document.getElementById('fullPortfolioContainer').innerHTML;
            printContent(content, 'الملف الكامل - ' + title);
        }, 100);
        return;
    }
    
    printContent(content, title);
}

// Print Content
function printContent(content, title) {
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
                h1 { 
                    color: #4A6FA5; 
                    margin-bottom: 20px;
                    text-align: center;
                    border-bottom: 2px solid #4A6FA5;
                    padding-bottom: 10px;
                }
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
                    @page { margin: 1cm; }
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <div>${content}</div>
            <div class="no-print" style="margin-top: 50px; text-align: center;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #4A6FA5; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">📄 طباعة</button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">✖ إغلاق</button>
            </div>
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
                <p>تم الإنشاء بواسطة: ملف الإنجاز الرقمي - المعلمة فريال الغماري</p>
                <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</p>
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

// Export Full Portfolio as PDF
function exportFullPortfolio() {
    showToast('جاري تحضير ملف PDF...', 'info');
    
    // Create HTML content for PDF
    let htmlContent = `
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Cairo', sans-serif; padding: 20px; }
                h1 { color: #4A6FA5; text-align: center; }
                .section { margin-bottom: 30px; }
                .item { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <h1>ملف إنجاز المعلمة فريال الغماري</h1>
            <h3>تاريخ التصدير: ${new Date().toLocaleDateString('ar-SA')}</h3>
    `;
    
    // Add all sections
    Object.keys(portfolioData).forEach(subject => {
        const items = portfolioData[subject];
        if (items.length > 0) {
            htmlContent += `<h2>${getSubjectName(subject)} (${items.length} عنصر)</h2>`;
            items.forEach(item => {
                htmlContent += `
                    <div class="item">
                        <h4>${item.letter || item.surah || item.concept || item.title || 'عنصر'}</h4>
                        <p>${item.description || 'لا يوجد وصف'}</p>
                        <p><small>${item.date || ''}</small></p>
                    </div>
                `;
            });
        }
    });
    
    htmlContent += '</body></html>';
    
    // Convert to blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ملف-الإنجاز-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    
    showToast('تم إنشاء الملف بنجاح', 'success');
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
    const dataStr = JSON.stringify(portfolioData, null, 2);
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
                const newData = JSON.parse(e.target.result);
                
                // Validate data structure
                const requiredSubjects = ['arabic', 'english', 'quran', 'math', 'science', 'activities'];
                let isValid = true;
                
                requiredSubjects.forEach(subject => {
                    if (!newData[subject] || !Array.isArray(newData[subject])) {
                        isValid = false;
                    }
                });
                
                if (isValid) {
                    portfolioData = newData;
                    saveToLocalStorage();
                    updateDashboard();
                    updateMenuBadges();
                    loadRecentActivity();
                    showToast('تم استعادة النسخة الاحتياطية بنجاح', 'success');
                    
                    // Reload current view
                    if (currentTab === 'fullPortfolio') {
                        loadFullPortfolio();
                    } else if (currentTab !== 'dashboard' && currentTab !== 'settings' && currentTab !== 'reports') {
                        loadSectionData(currentTab);
                    }
                } else {
                    showToast('ملف النسخة الاحتياطية غير صالح', 'error');
                }
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
    
    portfolioData = {
        arabic: [],
        english: [],
        quran: [],
        math: [],
        science: [],
        activities: []
    };
    
    saveToLocalStorage();
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

// Generate Reports
function generateReports() {
    const container = document.getElementById('reportsContainer');
    if (!container) return;
    
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.images ? item.images.length : 0), 0), 0);
    
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
                    <div class="stat-row" style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid var(--border-color);">
                        <span>${getSubjectName(subject)}</span>
                        <span class="stat-value" style="font-weight: bold; color: var(--primary);">${items.length} عنصر</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section-card">
            <h2 class="section-title">
                <i class="fas fa-history"></i>
                آخر التحديثات
            </h2>
            <div class="recent-list" id="reportRecentActivity"></div>
        </div>
    `;
    
    // Load recent activity for report
    loadReportRecentActivity();
}

// Load Report Recent Activity
function loadReportRecentActivity() {
    const container = document.getElementById('reportRecentActivity');
    if (!container) return;
    
    // Get all items sorted by timestamp
    const allItems = [];
    Object.keys(portfolioData).forEach(subject => {
        portfolioData[subject].forEach(item => {
            allItems.push({
                ...item,
                subject: subject
            });
        });
    });
    
    // Sort by timestamp (newest first)
    allItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // Take latest 10
    const recentItems = allItems.slice(0, 10);
    
    // Clear container
    container.innerHTML = '';
    
    if (recentItems.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted);">لا توجد نشاطات</p>';
        return;
    }
    
    // Add items
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

// Reset Settings
function resetSettings() {
    if (confirm('هل تريد إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
        localStorage.removeItem('theme');
        localStorage.removeItem('autoBackup');
        localStorage.removeItem('imageQuality');
        
        document.documentElement.setAttribute('data-theme', 'light');
        
        const themeToggle = document.getElementById('darkModeToggle');
        if (themeToggle) themeToggle.checked = false;
        
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        
        document.getElementById('autoBackup').checked = false;
        document.getElementById('imageQuality').value = 'medium';
        
        showToast('تم إعادة تعيين الإعدادات', 'success');
    }
}

// Format Date
function formatDate(date) {
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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
    
    // Auto remove after 5 seconds
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
window.showToast = showToast;
window.deleteItem = deleteItem;
window.deleteAllItems = deleteAllItems;
window.previewImage = previewImage;

console.log('🎉 النظام جاهز! جميع الميزات تعمل على التخزين المحلي.');
