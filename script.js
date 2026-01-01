// نظام ملف إنجاز المعلمة - كامل الوظائف
console.log('🌟 نظام ملف الإنجاز - جاهز للعمل');

// البيانات الرئيسية
let portfolioData = {
    arabic: [],
    english: [],
    quran: [],
    math: [],
    science: [],
    activities: []
};

// متغيرات النظام
let currentTab = 'dashboard';
let activeToasts = [];
let sidebarVisible = true;

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تهيئة التطبيق...');
    
    // إعداد المستمعين للأحداث
    setupEventListeners();
    
    // تحميل البيانات المحفوظة
    loadData();
    
    // إعداد الوضع المظلم/فاتح
    setupTheme();
    
    // إعداد القائمة الجانبية
    setupSidebar();
    
    // إخفاء شاشة التحميل
    setTimeout(() => {
        document.querySelector('.loader').style.display = 'none';
        document.querySelector('.app-container').style.display = 'flex';
        showToast('مرحباً بك في ملف الإنجاز الرقمي', 'success');
    }, 1500);
    
    console.log('✅ التطبيق جاهز للاستخدام');
});

// إعداد المستمعين للأحداث
function setupEventListeners() {
    console.log('🔧 إعداد المستمعين للأحداث...');
    
    // زر إخفاء/إظهار القائمة
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    document.getElementById('closeSidebar').addEventListener('click', toggleSidebar);
    
    // القائمة الجانبية
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
            
            // إغلاق القائمة على الهواتف
            if (window.innerWidth <= 1200) {
                toggleSidebar();
            }
        });
    });
    
    // تبديل الوضع المظلم
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // زر الإشعارات
    document.getElementById('notificationsBtn').addEventListener('click', showNotifications);
    
    // نموذج الإضافة
    document.getElementById('addForm').addEventListener('submit', function(e) {
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
    
    // إغلاق القائمة عند النقر خارجها (للهواتف)
    document.getElementById('sidebarOverlay').addEventListener('click', toggleSidebar);
    
    console.log('✅ تم إعداد المستمعين للأحداث');
}

// إعداد القائمة الجانبية
function setupSidebar() {
    // تحميل حالة القائمة من localStorage
    const savedState = localStorage.getItem('sidebarState');
    if (savedState === 'hidden') {
        sidebarVisible = false;
        hideSidebar();
    } else {
        sidebarVisible = true;
        showSidebar();
    }
    
    // إخفاء زر الإغلاق على الشاشات الكبيرة
    if (window.innerWidth > 1200) {
        document.getElementById('closeSidebar').style.display = 'none';
    }
}

// إظهار/إخفاء القائمة الجانبية
function toggleSidebar() {
    if (sidebarVisible) {
        hideSidebar();
    } else {
        showSidebar();
    }
}

// إظهار القائمة
function showSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.remove('sidebar-hidden');
    overlay.classList.remove('active');
    
    if (window.innerWidth > 1200) {
        mainContent.style.marginLeft = '280px';
    }
    
    sidebarVisible = true;
    localStorage.setItem('sidebarState', 'visible');
}

// إخفاء القائمة
function hideSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const mainContent = document.getElementById('mainContent');
    
    sidebar.classList.add('sidebar-hidden');
    overlay.classList.remove('active');
    
    if (window.innerWidth > 1200) {
        mainContent.style.marginLeft = '0';
    }
    
    sidebarVisible = false;
    localStorage.setItem('sidebarState', 'hidden');
}

// تحديث واجهة القائمة للشاشات المختلفة
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const closeBtn = document.getElementById('closeSidebar');
    
    if (window.innerWidth <= 1200) {
        // على الهواتف - إظهار زر الإغلاق
        closeBtn.style.display = 'flex';
        
        if (sidebarVisible) {
            sidebar.classList.remove('sidebar-hidden');
            document.getElementById('sidebarOverlay').classList.add('active');
        }
    } else {
        // على الشاشات الكبيرة - إخفاء زر الإغلاق
        closeBtn.style.display = 'none';
        document.getElementById('sidebarOverlay').classList.remove('active');
        
        if (sidebarVisible) {
            sidebar.classList.remove('sidebar-hidden');
            mainContent.style.marginLeft = '280px';
        } else {
            sidebar.classList.add('sidebar-hidden');
            mainContent.style.marginLeft = '0';
        }
    }
});

// باقي الدوال كما هي بدون تغيير (loadData, saveData, etc.)
// ... [كل الدوال الأخرى تبقى كما هي بدون تغيير] ...

// تحميل البيانات
function loadData() {
    console.log('📥 جاري تحميل البيانات...');
    
    try {
        const savedData = localStorage.getItem('teacherPortfolioData');
        
        if (savedData) {
            portfolioData = JSON.parse(savedData);
            console.log('✅ تم تحميل البيانات من التخزين المحلي');
            
            updateConnectionStatus('محلي', '#2ECC71');
            updateDashboardStats();
            updateRecentActivity();
            renderSectionData('arabic');
            
            showToast('تم تحميل بياناتك المحفوظة', 'success');
        } else {
            console.log('📝 لا توجد بيانات سابقة، سيتم إنشاء ملف جديد');
            updateConnectionStatus('جديد', '#F39C12');
            showToast('تم إنشاء ملف جديد لك', 'info');
            saveData();
        }
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        updateConnectionStatus('خطأ', '#E74C3C');
        showToast('خطأ في تحميل البيانات، سيتم إنشاء ملف جديد', 'error');
    }
}

// حفظ البيانات
function saveData() {
    console.log('💾 جاري حفظ البيانات...');
    
    try {
        const dataToSave = JSON.parse(JSON.stringify(portfolioData));
        localStorage.setItem('teacherPortfolioData', JSON.stringify(dataToSave));
        
        console.log('✅ تم حفظ البيانات بنجاح');
        updateConnectionStatus('محفوظ', '#2ECC71');
        return true;
        
    } catch (error) {
        console.error('❌ خطأ في حفظ البيانات:', error);
        updateConnectionStatus('خطأ', '#E74C3C');
        showToast('خطأ في حفظ البيانات', 'error');
        return false;
    }
}

// تحديث حالة الاتصال
function updateConnectionStatus(status, color = '#2ECC71') {
    const statusElement = document.getElementById('connectionStatus');
    const statusIcon = document.getElementById('statusIcon');
    
    if (statusElement) {
        statusElement.textContent = status;
        statusElement.style.color = color;
    }
    
    if (statusIcon) {
        statusIcon.style.background = color;
        statusIcon.style.boxShadow = `0 0 0 3px ${color}20`;
    }
}

// تبديل بين الأقسام
function switchTab(tabId) {
    console.log(`🔄 التبديل إلى: ${tabId}`);
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        }
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
        currentTab = tabId;
        
        if (tabId !== 'dashboard') {
            renderSectionData(tabId);
        }
        
        closeAllModals();
    }
}

// ... [بقية الدوال تبقى كما هي بدون تغيير] ...

// جعل الدوال متاحة عالمياً
window.switchTab = switchTab;
window.showAddModal = showAddModal;
window.closeModal = closeModal;
window.saveItem = saveItem;
window.viewItem = viewItem;
window.deleteItem = deleteItem;
window.viewImage = viewImage;
window.showPrintModal = showPrintModal;
window.printDocument = printDocument;
window.exportToPDF = exportToPDF;
window.backupData = backupData;
window.toggleTheme = toggleTheme;
window.showNotifications = showNotifications;
window.logout = logout;
window.exportSection = exportSection;
window.toggleSidebar = toggleSidebar;

console.log('🎉 النظام جاهز! جميع الميزات تعمل بشكل صحيح.');
