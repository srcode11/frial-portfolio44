// نظام ملف الإنجاز - Firebase Only
console.log('🔥 نظام ملف الإنجاز - Firebase فقط');

// Global Variables
let currentUser = null;
let portfolioData = {};
let currentSection = 'dashboard';
let imageCache = new Map();

// Initialize App
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 بدء تهيئة النظام...');
    
    try {
        // Initialize Firebase Connection
        await initFirebase();
        
        // Setup UI
        setupUI();
        
        // Load Data
        await loadAllData();
        
        // Update UI
        updateUI();
        
        console.log('✅ النظام جاهز للاستخدام');
        
    } catch (error) {
        console.error('❌ فشل في تهيئة النظام:', error);
        showError('فشل في تحميل النظام');
    }
});

// Initialize Firebase
async function initFirebase() {
    try {
        // تسجيل الدخول كضيف
        await auth.signInAnonymously();
        
        // استماع لتغييرات حالة المصادقة
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                currentUser = user;
                console.log('👤 User authenticated:', user.uid);
                
                // تحديث حالة الاتصال
                updateConnectionStatus('متصل');
                updateLastSync();
                
                // Load initial data
                await loadAllData();
                
                // Hide loading screen
                document.getElementById('loadingScreen').style.display = 'none';
                document.getElementById('appContainer').style.display = 'block';
                
                showNotification('تم الاتصال بنجاح', 'success');
                
            } else {
                // Re-authenticate if user logs out
                await auth.signInAnonymously();
            }
        });
        
    } catch (error) {
        console.error('❌ Authentication error:', error);
        throw new Error('فشل في المصادقة');
    }
}

// Setup UI
function setupUI() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', async () => {
        await loadAllData();
        showNotification('تم تحديث البيانات', 'success');
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await auth.signOut();
        location.reload();
    });
    
    // Add form submission
    document.getElementById('addItemForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveItem();
    });
    
    // Menu toggle
    document.getElementById('menuToggle').addEventListener('click', function() {
        document.getElementById('mainNav').classList.toggle('active');
    });
}

// Switch Section
function switchSection(section) {
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === section) {
            link.classList.add('active');
        }
    });
    
    // Update content sections
    document.querySelectorAll('.content-section').forEach(content => {
        content.classList.remove('active');
        if (content.id === section + 'Section') {
            content.classList.add('active');
        }
    });
    
    currentSection = section;
    
    // Load section data if needed
    if (section !== 'dashboard' && section !== 'add' && section !== 'print' && section !== 'settings') {
        loadSectionData(section);
    }
}

// Update Connection Status
function updateConnectionStatus(status) {
    const element = document.getElementById('connectionStatus');
    if (element) {
        element.textContent = status;
        element.className = status === 'متصل' ? 'connected' : 'disconnected';
    }
}

// Update Last Sync Time
function updateLastSync() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-SA');
    document.getElementById('lastSync').textContent = timeString;
}

// Load All Data
async function loadAllData() {
    try {
        showLoading('جاري تحميل البيانات...');
        
        // Load all sections
        const sections = ['arabic', 'english', 'quran', 'math', 'science', 'activities'];
        
        for (const section of sections) {
            await loadSectionFromFirebase(section);
        }
        
        // Update counts
        updateCounts();
        
        // Load recent activity
        loadRecentActivity();
        
        // Update dashboard stats
        updateDashboardStats();
        
        hideLoading();
        updateLastSync();
        
    } catch (error) {
        console.error('❌ Error loading data:', error);
        showError('فشل في تحميل البيانات');
    }
}

// Load Section from Firebase
async function loadSectionFromFirebase(section) {
    try {
        const docRef = db.collection('portfolio').doc(section);
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
            const data = docSnap.data();
            portfolioData[section] = data.items || [];
            console.log(`✅ Loaded ${section}:`, portfolioData[section].length, 'items');
        } else {
            portfolioData[section] = [];
            console.log(`📝 No data for ${section}, creating empty`);
        }
        
    } catch (error) {
        console.error(`❌ Error loading ${section}:`, error);
        portfolioData[section] = [];
    }
}

// Update Counts
function updateCounts() {
    document.getElementById('arabicCount').textContent = (portfolioData.arabic || []).length;
    document.getElementById('englishCount').textContent = (portfolioData.english || []).length;
    document.getElementById('quranCount').textContent = (portfolioData.quran || []).length;
    document.getElementById('mathCount').textContent = (portfolioData.math || []).length;
    document.getElementById('scienceCount').textContent = (portfolioData.science || []).length;
    document.getElementById('activitiesCount').textContent = (portfolioData.activities || []).length;
}

// Update Dashboard Stats
function updateDashboardStats() {
    const totalItems = Object.values(portfolioData).reduce((sum, items) => sum + (items ? items.length : 0), 0);
    const totalImages = Object.values(portfolioData).reduce((sum, items) => {
        if (!items) return sum;
        return sum + items.reduce((imgSum, item) => imgSum + (item.imageUrls ? item.imageUrls.length : 0), 0);
    }, 0);
    
    const today = new Date().toDateString();
    const todayItems = Object.values(portfolioData).reduce((sum, items) => {
        if (!items) return sum;
        return sum + items.filter(item => {
            const itemDate = new Date(item.timestamp || Date.now()).toDateString();
            return itemDate === today;
        }).length;
    }, 0);
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalImages').textContent = totalImages;
    document.getElementById('todayItems').textContent = todayItems;
    
    // Calculate storage usage (approximate)
    const storagePercent = Math.min(100, Math.floor((totalItems / 1000) * 100));
    document.getElementById('storageUsed').textContent = `${storagePercent}%`;
}

// Load Recent Activity
function loadRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    // Get all items from all sections
    const allItems = [];
    Object.entries(portfolioData).forEach(([section, items]) => {
        if (items) {
            items.forEach(item => {
                allItems.push({
                    ...item,
                    section: section
                });
            });
        }
    });
    
    // Sort by timestamp
    allItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // Take latest 10
    const recentItems = allItems.slice(0, 10);
    
    container.innerHTML = '';
    
    if (recentItems.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-history"></i>
                <p>لا توجد نشاطات حديثة</p>
            </div>
        `;
        return;
    }
    
    recentItems.forEach(item => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const sectionName = getSectionName(item.section);
        const title = item.letter || item.surah || item.concept || item.title || 'عنصر جديد';
        const time = formatTime(item.timestamp || Date.now());
        
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="${getSectionIcon(item.section)}"></i>
            </div>
            <div class="activity-content">
                <h4>${title}</h4>
                <p>${sectionName}</p>
            </div>
            <div class="activity-time">${time}</div>
        `;
        
        container.appendChild(activityItem);
    });
}

// Load Section Data for Display
function loadSectionData(section) {
    const container = document.getElementById(section + 'Container');
    if (!container) return;
    
    const items = portfolioData[section] || [];
    
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-section">
                <i class="${getSectionIcon(section)}"></i>
                <h3>لا توجد عناصر</h3>
                <p>لم يتم إضافة أي عناصر إلى هذا القسم بعد</p>
                <button class="btn-primary" onclick="showAddForm('${section}')">
                    <i class="fas fa-plus"></i>
                    إضافة أول عنصر
                </button>
            </div>
        `;
        return;
    }
    
    // Sort by timestamp
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    items.forEach(item => {
        const itemElement = createItemElement(section, item);
        container.appendChild(itemElement);
    });
}

// Create Item Element
function createItemElement(section, item) {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.dataset.id = item.id;
    
    const title = item.letter || item.surah || item.concept || item.title || 'عنصر بدون عنوان';
    const date = formatDate(item.timestamp || Date.now());
    
    let imagesHTML = '';
    if (item.imageUrls && item.imageUrls.length > 0) {
        imagesHTML = `
            <div class="item-images">
                ${item.imageUrls.map((url, index) => `
                    <div class="item-image" onclick="viewImage('${url}')">
                        <img src="${url}" alt="الصورة ${index + 1}" loading="lazy">
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
    
    div.innerHTML = `
        <div class="item-header">
            <div class="item-info">
                <h3>${title}</h3>
                <p class="item-date">${date}</p>
            </div>
            <div class="item-actions">
                <button class="btn-icon" onclick="deleteItem('${section}', '${item.id}')" title="حذف">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="item-body">
            <p class="item-description">${item.description || 'لا يوجد وصف'}</p>
            ${imagesHTML}
        </div>
    `;
    
    return div;
}

// Show Add Form with Section Pre-selected
function showAddForm(section) {
    switchSection('add');
    document.getElementById('itemSection').value = section;
    showNotification(`تم تحديد قسم ${getSectionName(section)}`, 'info');
}

// Save Item to Firebase
async function saveItem() {
    try {
        const form = document.getElementById('addItemForm');
        const formData = new FormData(form);
        
        // Validate required fields
        const section = formData.get('section');
        if (!section) {
            showNotification('يرجى اختيار القسم', 'error');
            return;
        }
        
        showLoading('جاري حفظ العنصر...');
        
        // Create item object
        const item = {
            id: generateId(),
            timestamp: Date.now()
        };
        
        // Add section-specific fields
        const sectionFields = getSectionFields(section);
        sectionFields.forEach(field => {
            const value = formData.get(field);
            if (value) item[field] = value;
        });
        
        // Add description
        const description = formData.get('description');
        if (description) item.description = description;
        
        // Upload images
        const imageFiles = document.getElementById('itemImages').files;
        if (imageFiles.length > 0) {
            const imageUrls = await uploadImages(imageFiles);
            item.imageUrls = imageUrls;
        }
        
        // Save to Firebase
        await saveItemToFirebase(section, item);
        
        // Clear form
        form.reset();
        document.getElementById('imagePreview').innerHTML = '';
        
        // Update UI
        await loadAllData();
        
        showNotification('تم حفظ العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ Error saving item:', error);
        showNotification('فشل في حفظ العنصر', 'error');
    }
}

// Save Item to Firebase
async function saveItemToFirebase(section, newItem) {
    try {
        const docRef = db.collection('portfolio').doc(section);
        const docSnap = await docRef.get();
        
        let items = [];
        if (docSnap.exists) {
            items = docSnap.data().items || [];
        }
        
        // Add new item
        items.unshift(newItem);
        
        // Save to Firebase
        await docRef.set({ items });
        
        // Update local data
        portfolioData[section] = items;
        
    } catch (error) {
        console.error(`❌ Error saving to ${section}:`, error);
        throw error;
    }
}

// Upload Images
async function uploadImages(imageFiles) {
    const imageUrls = [];
    
    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const imageUrl = await uploadImage(file);
        if (imageUrl) {
            imageUrls.push(imageUrl);
        }
    }
    
    return imageUrls;
}

// Upload Single Image
async function uploadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Store in cache for immediate display
            const imageId = generateId();
            imageCache.set(imageId, e.target.result);
            
            // In a real app, you would upload to Firebase Storage here
            // For this example, we'll use the data URL
            resolve(e.target.result);
        };
        
        reader.onerror = function(error) {
            console.error('❌ Error reading image:', error);
            reject(error);
        };
        
        reader.readAsDataURL(file);
    });
}

// Delete Item
async function deleteItem(section, itemId) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
        return;
    }
    
    try {
        showLoading('جاري الحذف...');
        
        // Remove from Firebase
        const docRef = db.collection('portfolio').doc(section);
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
            let items = docSnap.data().items || [];
            items = items.filter(item => item.id !== itemId);
            
            await docRef.set({ items });
            
            // Update local data
            portfolioData[section] = items;
            
            // Update UI
            if (currentSection === section) {
                loadSectionData(section);
            }
            
            // Update counts
            updateCounts();
            updateDashboardStats();
            
            showNotification('تم حذف العنصر بنجاح', 'success');
        }
        
    } catch (error) {
        console.error('❌ Error deleting item:', error);
        showNotification('فشل في حذف العنصر', 'error');
    }
}

// Generate ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Get Section Name
function getSectionName(section) {
    const sections = {
        'arabic': 'اللغة العربية',
        'english': 'اللغة الإنجليزية',
        'quran': 'القرآن الكريم',
        'math': 'الرياضيات',
        'science': 'العلوم',
        'activities': 'الأنشطة'
    };
    return sections[section] || section;
}

// Get Section Icon
function getSectionIcon(section) {
    const icons = {
        'arabic': 'fas fa-book',
        'english': 'fas fa-language',
        'quran': 'fas fa-quran',
        'math': 'fas fa-calculator',
        'science': 'fas fa-flask',
        'activities': 'fas fa-running',
        'dashboard': 'fas fa-tachometer-alt',
        'add': 'fas fa-plus-circle',
        'print': 'fas fa-print',
        'settings': 'fas fa-cog'
    };
    return icons[section] || 'fas fa-folder';
}

// Get Section Fields
function getSectionFields(section) {
    const fields = {
        'arabic': ['letter'],
        'english': ['letter'],
        'quran': ['surah', 'verses'],
        'math': ['concept'],
        'science': ['concept'],
        'activities': ['title']
    };
    return fields[section] || ['title'];
}

// Format Date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format Time
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// View Image
function viewImage(url) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${url}" alt="صورة مكبرة">
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal on click outside
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

// Show Loading
function showLoading(message) {
    const loading = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    
    if (loadingText) {
        loadingText.textContent = message || 'جاري التحميل...';
    }
    
    if (loading) {
        loading.style.display = 'flex';
    }
}

// Hide Loading
function hideLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Show Error
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'global-error';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <h3>حدث خطأ</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn-primary">
                    <i class="fas fa-redo"></i>
                    إعادة تحميل الصفحة
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
}

// Update UI
function updateUI() {
    // Update user info
    if (currentUser) {
        document.getElementById('userName').textContent = 'مستخدم ضيف';
    }
    
    // Update time
    updateLastSync();
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// Initialize Image Preview
function initImagePreview() {
    const imageInput = document.getElementById('itemImages');
    const previewContainer = document.getElementById('imagePreview');
    
    if (!imageInput || !previewContainer) return;
    
    imageInput.addEventListener('change', function() {
        previewContainer.innerHTML = '';
        
        Array.from(this.files).forEach(file => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const preview = document.createElement('div');
                preview.className = 'image-preview-item';
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="معاينة">
                    <button type="button" class="remove-preview" onclick="this.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                previewContainer.appendChild(preview);
            };
            
            reader.readAsDataURL(file);
        });
    });
}

// Export Data
async function exportData() {
    try {
        showLoading('جاري تصدير البيانات...');
        
        const dataStr = JSON.stringify(portfolioData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        hideLoading();
        showNotification('تم تصدير البيانات بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ Error exporting data:', error);
        showNotification('فشل في تصدير البيانات', 'error');
    }
}

// Import Data
async function importData() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            showLoading('جاري استيراد البيانات...');
            
            const reader = new FileReader();
            
            reader.onload = async function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // Validate data structure
                    if (typeof importedData !== 'object') {
                        throw new Error('تنسيق الملف غير صحيح');
                    }
                    
                    // Save each section to Firebase
                    for (const [section, items] of Object.entries(importedData)) {
                        if (Array.isArray(items)) {
                            const docRef = db.collection('portfolio').doc(section);
                            await docRef.set({ items });
                        }
                    }
                    
                    // Reload data
                    await loadAllData();
                    
                    showNotification('تم استيراد البيانات بنجاح', 'success');
                    
                } catch (error) {
                    console.error('❌ Error parsing imported data:', error);
                    showNotification('تنسيق الملف غير صحيح', 'error');
                }
            };
            
            reader.readAsText(file);
            
        } catch (error) {
            console.error('❌ Error importing data:', error);
            showNotification('فشل في استيراد البيانات', 'error');
        }
    };
    
    fileInput.click();
}

// Clear All Data
async function clearAllData() {
    if (!confirm('⚠️ تحذير: سيتم حذف جميع البيانات. هذا الإجراء لا يمكن التراجع عنه. هل أنت متأكد؟')) {
        return;
    }
    
    try {
        showLoading('جاري حذف جميع البيانات...');
        
        // Clear all sections
        const sections = ['arabic', 'english', 'quran', 'math', 'science', 'activities'];
        
        for (const section of sections) {
            await db.collection('portfolio').doc(section).delete();
        }
        
        // Clear local data
        portfolioData = {};
        
        // Update UI
        updateCounts();
        updateDashboardStats();
        loadRecentActivity();
        
        // Reload section data if needed
        if (currentSection !== 'dashboard') {
            loadSectionData(currentSection);
        }
        
        hideLoading();
        showNotification('تم حذف جميع البيانات', 'success');
        
    } catch (error) {
        console.error('❌ Error clearing data:', error);
        showNotification('فشل في حذف البيانات', 'error');
    }
}

// Print Portfolio
function printPortfolio() {
    window.print();
}

// Handle Online/Offline Status
window.addEventListener('online', function() {
    updateConnectionStatus('متصل');
    showNotification('تم استعادة الاتصال بالإنترنت', 'success');
    loadAllData();
});

window.addEventListener('offline', function() {
    updateConnectionStatus('غير متصل');
    showNotification('فقد الاتصال بالإنترنت', 'warning');
});

// Handle beforeunload
window.addEventListener('beforeunload', function(e) {
    if (currentSection === 'add') {
        const form = document.getElementById('addItemForm');
        const hasData = Array.from(form.elements).some(element => 
            (element.type !== 'submit' && element.value) || 
            (element.type === 'file' && element.files.length > 0)
        );
        
        if (hasData) {
            e.preventDefault();
            e.returnValue = 'لديك بيانات غير محفوظة. هل تريد مغادرة الصفحة؟';
            return 'لديك بيانات غير محفوظة. هل تريد مغادرة الصفحة؟';
        }
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize image preview
    initImagePreview();
    
    // Set current year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Set up export/import buttons if they exist
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const clearBtn = document.getElementById('clearBtn');
    const printBtn = document.getElementById('printBtn');
    
    if (exportBtn) exportBtn.addEventListener('click', exportData);
    if (importBtn) importBtn.addEventListener('click', importData);
    if (clearBtn) clearBtn.addEventListener('click', clearAllData);
    if (printBtn) printBtn.addEventListener('click', printPortfolio);
});

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('✅ ServiceWorker registered:', registration.scope);
            })
            .catch(function(error) {
                console.log('❌ ServiceWorker registration failed:', error);
            });
    });
}
