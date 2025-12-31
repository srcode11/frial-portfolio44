// Teacher Portfolio System - Complete Working Version
console.log('🎯 نظام ملف الإنجاز - جاهز للعمل');

// ===== البيانات والتطبيق =====
const App = {
    data: {
        arabic: [],
        english: [],
        quran: [],
        math: [],
        science: [],
        activities: []
    },
    
    currentTab: 'dashboard',
    isOnline: false,
    
    // تهيئة التطبيق
    init() {
        console.log('🚀 بدء تهيئة التطبيق...');
        this.setupUI();
        this.setupEventListeners();
        this.loadData();
        this.setupTheme();
        console.log('✅ التطبيق جاهز');
    },
    
    // إعداد واجهة المستخدم
    setupUI() {
        this.createAppStructure();
    },
    
    // إنشاء هيكل التطبيق
    createAppStructure() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <!-- Top Navigation -->
            <nav class="top-nav">
                <div class="nav-left">
                    <button class="nav-btn menu-toggle" id="menuToggle">
                        <i class="fas fa-bars"></i>
                    </button>
                    <div class="logo">
                        <i class="fas fa-graduation-cap"></i>
                        <span>ملف الإنجاز</span>
                    </div>
                </div>
                <div class="nav-center">
                    <div class="nav-info">
                        <div class="info-item">
                            <i class="fas fa-user-graduate"></i>
                            <span>المعلمة: فريال الغماري</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-school"></i>
                            <span>ابتدائية النخبة</span>
                        </div>
                    </div>
                </div>
                <div class="nav-right">
                    <button class="nav-btn" id="themeToggle">
                        <i class="fas fa-moon"></i>
                    </button>
                    <button class="nav-btn" id="printBtn">
                        <i class="fas fa-print"></i>
                    </button>
                </div>
            </nav>

            <!-- Sidebar -->
            <aside class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-user">
                        <div class="user-avatar">
                            <i class="fas fa-chalkboard-teacher"></i>
                        </div>
                        <div class="user-info">
                            <h4>فريال الغماري</h4>
                            <p>معلمة الصفوف الأولية</p>
                        </div>
                    </div>
                    <button class="sidebar-close" id="sidebarClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="sidebar-menu">
                    <a href="#" class="menu-item active" data-tab="dashboard">
                        <i class="fas fa-home"></i>
                        <span>الرئيسية</span>
                    </a>
                    <a href="#" class="menu-item" data-tab="fullPortfolio">
                        <i class="fas fa-book-open"></i>
                        <span>الملف الكامل</span>
                        <span class="menu-badge" id="fullPortfolioBadge">0</span>
                    </a>
                    <a href="#" class="menu-item" data-tab="arabic">
                        <i class="fas fa-font"></i>
                        <span>اللغة العربية</span>
                        <span class="menu-badge" id="arabicBadge">0</span>
                    </a>
                    <a href="#" class="menu-item" data-tab="english">
                        <i class="fas fa-language"></i>
                        <span>الإنجليزية</span>
                        <span class="menu-badge" id="englishBadge">0</span>
                    </a>
                    <a href="#" class="menu-item" data-tab="quran">
                        <i class="fas fa-book-quran"></i>
                        <span>القرآن الكريم</span>
                        <span class="menu-badge" id="quranBadge">0</span>
                    </a>
                    <a href="#" class="menu-item" data-tab="math">
                        <i class="fas fa-calculator"></i>
                        <span>الرياضيات</span>
                        <span class="menu-badge" id="mathBadge">0</span>
                    </a>
                    <a href="#" class="menu-item" data-tab="science">
                        <i class="fas fa-flask"></i>
                        <span>العلوم</span>
                        <span class="menu-badge" id="scienceBadge">0</span>
                    </a>
                    <a href="#" class="menu-item" data-tab="activities">
                        <i class="fas fa-chalkboard"></i>
                        <span>النشاطات</span>
                        <span class="menu-badge" id="activitiesBadge">0</span>
                    </a>
                </div>
                
                <div class="sidebar-footer">
                    <button class="btn-primary btn-block" id="quickAddBtn">
                        <i class="fas fa-plus-circle"></i>
                        إضافة سريعة
                    </button>
                    <button class="btn-secondary btn-block mt-10" id="backupBtn">
                        <i class="fas fa-download"></i>
                        نسخة احتياطية
                    </button>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="main-content" id="mainContent">
                <!-- Dashboard -->
                <div id="dashboard" class="tab-content active">
                    <div class="content-header">
                        <h1><i class="fas fa-home"></i> مرحباً بعودتك، المعلمة فريال 👋</h1>
                        <p>هذا هو ملف إنجازك الرقمي المتكامل</p>
                    </div>
                    
                    <!-- Stats -->
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-layer-group"></i>
                            </div>
                            <div class="stat-info">
                                <h3 id="totalItems">0</h3>
                                <p>إجمالي العناصر</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-images"></i>
                            </div>
                            <div class="stat-info">
                                <h3 id="totalImages">0</h3>
                                <p>عدد الصور</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                            <div class="stat-info">
                                <h3 id="thisMonth">0</h3>
                                <p>هذا الشهر</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="stat-info">
                                <h3 id="completionRate">0%</h3>
                                <p>معدل الإنجاز</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Actions -->
                    <div class="quick-actions">
                        <h3>إجراءات سريعة</h3>
                        <div class="actions-grid">
                            <button class="action-btn" data-action="fullPortfolio">
                                <i class="fas fa-book-open"></i>
                                <span>الملف الكامل</span>
                            </button>
                            <button class="action-btn" data-action="addArabic">
                                <i class="fas fa-font"></i>
                                <span>حرف عربي</span>
                            </button>
                            <button class="action-btn" data-action="addEnglish">
                                <i class="fas fa-language"></i>
                                <span>كلمة إنجليزية</span>
                            </button>
                            <button class="action-btn" data-action="print">
                                <i class="fas fa-print"></i>
                                <span>طباعة الملف</span>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Recent Activity -->
                    <div class="recent-activity">
                        <h3>أحدث الإضافات</h3>
                        <div id="recentList"></div>
                    </div>
                </div>
                
                <!-- Other tabs will be loaded dynamically -->
            </main>

            <!-- Add Modal -->
            <div class="modal" id="addModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-plus-circle"></i> إضافة جديد</h3>
                        <button class="close-btn" id="closeModalBtn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="addForm">
                            <div class="form-group">
                                <label for="itemSubject">المادة</label>
                                <select id="itemSubject" class="form-select">
                                    <option value="arabic">اللغة العربية</option>
                                    <option value="english">الإنجليزية</option>
                                    <option value="quran">القرآن الكريم</option>
                                    <option value="math">الرياضيات</option>
                                    <option value="science">العلوم</option>
                                    <option value="activities">النشاطات</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="itemTitle">العنوان</label>
                                <input type="text" id="itemTitle" class="form-input" 
                                       placeholder="مثال: حرف الألف، سورة الفاتحة..." required>
                            </div>
                            
                            <div class="form-group">
                                <label for="itemDescription">الوصف</label>
                                <textarea id="itemDescription" class="form-textarea" 
                                          placeholder="وصف النشاط..." rows="4"></textarea>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn-secondary" id="cancelBtn">
                                    إلغاء
                                </button>
                                <button type="submit" class="btn-primary">
                                    حفظ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Toast Container -->
            <div class="toast-container" id="toastContainer"></div>
        `;
    },
    
    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // Sidebar toggle
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
        
        document.getElementById('sidebarClose')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('active');
        });
        
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        
        // Print button
        document.getElementById('printBtn')?.addEventListener('click', () => this.printDocument());
        
        // Menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
        
        // Quick add button
        document.getElementById('quickAddBtn')?.addEventListener('click', () => this.showAddModal());
        
        // Backup button
        document.getElementById('backupBtn')?.addEventListener('click', () => this.backupData());
        
        // Action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });
        
        // Modal close
        document.getElementById('closeModalBtn')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn')?.addEventListener('click', () => this.closeModal());
        
        // Form submit
        document.getElementById('addForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveItem();
        });
        
        // Close modal when clicking outside
        document.getElementById('addModal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('addModal')) {
                this.closeModal();
            }
        });
    },
    
    // تحميل البيانات
    loadData() {
        console.log('📥 جاري تحميل البيانات...');
        
        // محاولة التحميل من localStorage
        const saved = localStorage.getItem('teacherPortfolio');
        if (saved) {
            try {
                this.data = JSON.parse(saved);
                this.showToast('تم تحميل البيانات', 'success');
                this.updateStats();
                this.updateBadges();
            } catch (error) {
                console.error('خطأ في تحميل البيانات:', error);
                this.showToast('خطأ في تحميل البيانات', 'error');
            }
        } else {
            this.showToast('لا توجد بيانات محفوظة', 'info');
        }
    },
    
    // حفظ البيانات
    saveData() {
        localStorage.setItem('teacherPortfolio', JSON.stringify(this.data));
    },
    
    // تبديل التبويب
    switchTab(tabId) {
        console.log(`🔄 التبديل إلى: ${tabId}`);
        
        // تحديث القائمة
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            }
        });
        
        // إخفاء كل المحتويات
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        this.currentTab = tabId;
        
        // تحميل المحتوى المناسب
        if (tabId === 'fullPortfolio') {
            this.loadFullPortfolio();
        } else if (tabId !== 'dashboard') {
            this.loadSubjectContent(tabId);
        }
    },
    
    // تحديث الإحصائيات
    updateStats() {
        const totalItems = Object.values(this.data).reduce((sum, arr) => sum + arr.length, 0);
        const totalImages = Object.values(this.data).reduce((sum, arr) => 
            sum + arr.reduce((imgSum, item) => imgSum + (item.images ? item.images.length : 0), 0), 0);
        
        document.getElementById('totalItems').textContent = totalItems;
        document.getElementById('totalImages').textContent = totalImages;
        document.getElementById('thisMonth').textContent = totalItems;
        document.getElementById('completionRate').textContent = `${Math.min(100, totalItems)}%`;
    },
    
    // تحديث الشارات
    updateBadges() {
        Object.keys(this.data).forEach(subject => {
            const badge = document.getElementById(`${subject}Badge`);
            if (badge) {
                const count = this.data[subject].length;
                badge.textContent = count;
                badge.style.display = count > 0 ? 'flex' : 'none';
            }
        });
        
        // تحديث شارة الملف الكامل
        const totalBadge = document.getElementById('fullPortfolioBadge');
        if (totalBadge) {
            const total = Object.values(this.data).reduce((sum, arr) => sum + arr.length, 0);
            totalBadge.textContent = total;
            totalBadge.style.display = total > 0 ? 'flex' : 'none';
        }
    },
    
    // عرض الملف الكامل
    loadFullPortfolio() {
        const mainContent = document.getElementById('mainContent');
        let html = `
            <div id="fullPortfolio" class="tab-content active">
                <div class="content-header">
                    <h1><i class="fas fa-book-open"></i> الملف الكامل</h1>
                    <p>عرض جميع المواد والأنشطة</p>
                </div>
                
                <div class="full-portfolio">
        `;
        
        Object.keys(this.data).forEach(subject => {
            const items = this.data[subject];
            if (items.length === 0) return;
            
            const subjectName = this.getSubjectName(subject);
            const subjectIcon = this.getSubjectIcon(subject);
            
            html += `
                <div class="portfolio-section">
                    <h3><i class="${subjectIcon}"></i> ${subjectName}</h3>
                    <div class="subject-items">
            `;
            
            items.forEach(item => {
                const title = item.letter || item.surah || item.concept || item.title || 'عنصر جديد';
                const date = this.formatDate(new Date(item.timestamp || Date.now()));
                
                html += `
                    <div class="item-card">
                        <div class="item-header">
                            <h4>${title}</h4>
                            <span class="item-date">${date}</span>
                        </div>
                        <div class="item-description">
                            ${item.description || 'لا يوجد وصف'}
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        mainContent.innerHTML = html;
    },
    
    // تحميل محتوى المادة
    loadSubjectContent(subject) {
        const mainContent = document.getElementById('mainContent');
        const subjectName = this.getSubjectName(subject);
        const subjectIcon = this.getSubjectIcon(subject);
        const items = this.data[subject] || [];
        
        let html = `
            <div id="${subject}" class="tab-content active">
                <div class="content-header">
                    <h1><i class="${subjectIcon}"></i> ${subjectName}</h1>
                    <p>إدارة ${subjectName}</p>
                </div>
                
                <div class="section-actions">
                    <button class="btn-primary" data-action="addTo" data-subject="${subject}">
                        <i class="fas fa-plus"></i>
                        إضافة جديد
                    </button>
                </div>
                
                <div class="items-grid">
        `;
        
        if (items.length === 0) {
            html += `
                <div class="empty-state">
                    <i class="${subjectIcon}"></i>
                    <h3>لا توجد عناصر</h3>
                    <p>لم يتم إضافة أي عناصر إلى ${subjectName} بعد</p>
                </div>
            `;
        } else {
            items.forEach(item => {
                const title = item.letter || item.surah || item.concept || item.title || 'عنصر جديد';
                const date = this.formatDate(new Date(item.timestamp || Date.now()));
                
                html += `
                    <div class="item-card">
                        <div class="item-header">
                            <h4>${title}</h4>
                            <span class="item-date">${date}</span>
                        </div>
                        <div class="item-description">
                            ${item.description || 'لا يوجد وصف'}
                        </div>
                    </div>
                `;
            });
        }
        
        html += `
                </div>
            </div>
        `;
        
        mainContent.innerHTML = html;
        
        // Add event listener to the add button
        document.querySelector('[data-action="addTo"]')?.addEventListener('click', (e) => {
            const subject = e.target.getAttribute('data-subject');
            this.showAddModal(subject);
        });
    },
    
    // عرض نافذة الإضافة
    showAddModal(subject = 'arabic') {
        const modal = document.getElementById('addModal');
        const subjectSelect = document.getElementById('itemSubject');
        
        if (subjectSelect) {
            subjectSelect.value = subject;
        }
        
        modal.style.display = 'flex';
    },
    
    // إغلاق النافذة
    closeModal() {
        document.getElementById('addModal').style.display = 'none';
        document.getElementById('addForm').reset();
    },
    
    // حفظ العنصر
    saveItem() {
        const subject = document.getElementById('itemSubject').value;
        const title = document.getElementById('itemTitle').value.trim();
        const description = document.getElementById('itemDescription').value.trim();
        
        if (!title) {
            this.showToast('الرجاء إدخال العنوان', 'error');
            return;
        }
        
        const item = {
            id: Date.now(),
            timestamp: Date.now(),
            date: this.formatDate(new Date()),
            title: title,
            description: description
        };
        
        // إضافة حقل خاص حسب المادة
        if (subject === 'arabic' || subject === 'english') {
            item.letter = title;
        } else if (subject === 'quran') {
            item.surah = title;
        } else if (subject === 'math' || subject === 'science') {
            item.concept = title;
        }
        
        // إضافة إلى البيانات
        if (!this.data[subject]) this.data[subject] = [];
        this.data[subject].push(item);
        
        // حفظ البيانات
        this.saveData();
        
        // تحديث الواجهة
        this.updateStats();
        this.updateBadges();
        
        // إغلاق النافذة وإظهار رسالة النجاح
        this.closeModal();
        this.showToast('تم إضافة العنصر بنجاح', 'success');
    },
    
    // معالجة الإجراءات السريعة
    handleQuickAction(action) {
        switch(action) {
            case 'fullPortfolio':
                this.switchTab('fullPortfolio');
                break;
            case 'addArabic':
                this.showAddModal('arabic');
                break;
            case 'addEnglish':
                this.showAddModal('english');
                break;
            case 'print':
                this.printDocument();
                break;
            default:
                this.showToast('إجراء غير معروف', 'warning');
        }
    },
    
    // طباعة المستند
    printDocument() {
        window.print();
        this.showToast('جاري إعداد الطباعة', 'info');
    },
    
    // نسخة احتياطية
    backupData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const fileName = `نسخة-احتياطية-${new Date().toISOString().split('T')[0]}.json`;
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', fileName);
        link.click();
        
        this.showToast('تم إنشاء نسخة احتياطية', 'success');
    },
    
    // إعداد الثيم
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.innerHTML = savedTheme === 'dark' ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
        }
    },
    
    // تبديل الثيم
    toggleTheme() {
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
        
        this.showToast(`الوضع ${newTheme === 'dark' ? 'الداكن' : 'الفاتح'} مفعل`, 'info');
    },
    
    // عرض الإشعارات
    showToast(message, type = 'info') {
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
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // إضافة حدث الإغلاق
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
        
        // إزالة تلقائية بعد 5 ثواني
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    },
    
    // ===== دوال مساعدة =====
    
    // الحصول على اسم المادة
    getSubjectName(subject) {
        const names = {
            arabic: 'اللغة العربية',
            english: 'الإنجليزية',
            quran: 'القرآن الكريم',
            math: 'الرياضيات',
            science: 'العلوم',
            activities: 'النشاطات'
        };
        return names[subject] || subject;
    },
    
    // الحصول على أيقونة المادة
    getSubjectIcon(subject) {
        const icons = {
            arabic: 'fas fa-font',
            english: 'fas fa-language',
            quran: 'fas fa-book-quran',
            math: 'fas fa-calculator',
            science: 'fas fa-flask',
            activities: 'fas fa-chalkboard'
        };
        return icons[subject] || 'fas fa-file';
    },
    
    // تنسيق التاريخ
    formatDate(date) {
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// ===== تهيئة التطبيق عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// ===== جعل الدوال متاحة عالمياً (للعناوين) =====
window.showAddModal = (subject) => App.showAddModal(subject);
window.switchTab = (tab) => App.switchTab(tab);
window.backupData = () => App.backupData();
window.printDocument = () => App.printDocument();

console.log('🎉 جميع الدوال جاهزة للاستخدام!');
