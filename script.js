// ==============================================
// نظام ملف الإنجاز - إصدار خفيف وسريع
// ==============================================

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
let useFirebase = false;

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء التطبيق...');
    
    // إخفاء التحميل
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
    }, 1000);
    
    // إعداد الواجهة
    setupUI();
    
    // محاولة الاتصال بـ Firebase
    tryFirebaseConnection();
    
    // تحميل البيانات
    loadData();
    
    // تحديث الواجهة
    updateUI();
});

// ===== إعداد الواجهة =====
function setupUI() {
    // إعداد التبويبات
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.getAttribute('data-tab'));
        });
    });
    
    // إعداد Form الإضافة
    document.getElementById('addForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveItem();
    });
}

// ===== محاولة الاتصال بـ Firebase =====
function tryFirebaseConnection() {
    try {
        if (firebase.apps.length > 0) {
            useFirebase = true;
            document.getElementById('status').textContent = '🌐 متصل بالسحابة';
            document.getElementById('storageInfo').textContent = '💾 التخزين: سحابي';
            console.log('✅ Firebase جاهز');
        }
    } catch (e) {
        useFirebase = false;
        document.getElementById('status').textContent = '💻 عمل محلي';
        console.log('⚠️ استخدام التخزين المحلي');
    }
}

// ===== تبديل التبويبات =====
function switchTab(tabId) {
    // تحديث الأزرار
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // تحديث المحتوى
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.getElementById(tabId).classList.add('active');
    
    currentTab = tabId;
    
    // إذا كان تبويب عرض الكل، عرض كل العناصر
    if (tabId === 'viewall') {
        renderAllItems();
    }
}

// ===== تحميل البيانات =====
function loadData() {
    // المحاولة من Firebase أولاً
    if (useFirebase) {
        loadFromFirebase();
    } else {
        // المحاولة من localStorage
        const saved = localStorage.getItem('teacherPortfolio');
        if (saved) {
            try {
                portfolioData = JSON.parse(saved);
                console.log('✅ تم تحميل البيانات المحلية');
                showToast('تم تحميل البيانات المحلية');
            } catch (e) {
                console.log('❌ خطأ في تحليل البيانات');
            }
        }
    }
}

// ===== تحميل من Firebase =====
async function loadFromFirebase() {
    try {
        const db = firebase.firestore();
        const snapshot = await db.collection('portfolio').doc('data').get();
        
        if (snapshot.exists) {
            portfolioData = snapshot.data();
            console.log('✅ تم تحميل البيانات من Firebase');
            showToast('تم تحميل البيانات من السحابة');
        }
    } catch (error) {
        console.log('❌ خطأ في تحميل Firebase:', error);
        useFirebase = false;
    }
}

// ===== حفظ البيانات =====
async function saveData() {
    // حفظ نسخة محلية
    localStorage.setItem('teacherPortfolio', JSON.stringify(portfolioData));
    
    // محاولة حفظ في Firebase
    if (useFirebase) {
        try {
            const db = firebase.firestore();
            await db.collection('portfolio').doc('data').set(portfolioData);
            console.log('✅ تم الحفظ في Firebase');
        } catch (error) {
            console.log('❌ خطأ في حفظ Firebase:', error);
        }
    }
}

// ===== تحديث الواجهة =====
function updateUI() {
    updateStats();
    updateRecentItems();
    renderAllSections();
}

// ===== تحديث الإحصائيات =====
function updateStats() {
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.images ? item.images.length : 0), 0), 0);
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalImages').textContent = totalImages;
}

// ===== تحديث العناصر الحديثة =====
function updateRecentItems() {
    const container = document.getElementById('recentList');
    if (!container) return;
    
    // جمع جميع العناصر
    const allItems = [];
    Object.keys(portfolioData).forEach(subject => {
        portfolioData[subject].forEach(item => {
            allItems.push({ ...item, subject });
        });
    });
    
    // ترتيب حسب التاريخ
    allItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // عرض آخر 5 عناصر
    const recentItems = allItems.slice(0, 5);
    
    container.innerHTML = '';
    
    if (recentItems.length === 0) {
        container.innerHTML = '<p style="color:#6c757d;text-align:center;">لا توجد عناصر بعد</p>';
        return;
    }
    
    recentItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'recent-item';
        
        const title = item.letter || item.surah || item.concept || item.title || 'عنصر جديد';
        const subject = getSubjectName(item.subject);
        const time = item.date || formatDate(new Date(item.timestamp || Date.now()));
        
        div.innerHTML = `
            <div class="recent-icon">
                <i class="${getSubjectIcon(item.subject)}"></i>
            </div>
            <div class="recent-content">
                <h4>${title}</h4>
                <p>${subject}</p>
            </div>
            <div class="recent-time">${time}</div>
        `;
        
        container.appendChild(div);
    });
}

// ===== عرض جميع الأقسام =====
function renderAllSections() {
    ['arabic', 'english', 'quran', 'math', 'science', 'activities'].forEach(subject => {
        renderSection(subject);
    });
}

// ===== عرض قسم معين =====
function renderSection(subject) {
    const container = document.getElementById(`${subject}Items`);
    if (!container) return;
    
    const items = portfolioData[subject] || [];
    
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="${getSubjectIcon(subject)}"></i>
                <p>لا توجد عناصر في هذا القسم</p>
            </div>
        `;
        return;
    }
    
    // ترتيب العناصر
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // عرض العناصر
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const title = item.letter || item.surah || item.concept || item.title || 'عنصر';
        const date = item.date || formatDate(new Date(item.timestamp || Date.now()));
        
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${title}</div>
                    <div class="item-date">${date}</div>
                </div>
                <button class="delete-btn" onclick="deleteItem('${subject}', '${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="item-body">${item.description || 'لا يوجد وصف'}</div>
            <div class="item-images">
                <div class="item-image" onclick="viewImage('${item.images?.[0] || ''}')">
                    ${item.images && item.images[0] ? 
                        `<img src="${item.images[0]}" alt="الصورة">` : 
                        '<div class="item-image empty"><i class="fas fa-image"></i></div>'
                    }
                </div>
                <div class="item-image" onclick="viewImage('${item.images?.[1] || ''}')">
                    ${item.images && item.images[1] ? 
                        `<img src="${item.images[1]}" alt="الصورة">` : 
                        '<div class="item-image empty"><i class="fas fa-image"></i></div>'
                    }
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// ===== عرض جميع العناصر =====
function renderAllItems() {
    const container = document.getElementById('allItems');
    if (!container) return;
    
    let allItems = [];
    Object.keys(portfolioData).forEach(subject => {
        portfolioData[subject].forEach(item => {
            allItems.push({ ...item, subject });
        });
    });
    
    allItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    container.innerHTML = '';
    
    if (allItems.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <p>لا توجد عناصر في الملف</p>
            </div>
        `;
        return;
    }
    
    allItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const title = item.letter || item.surah || item.concept || item.title || 'عنصر';
        const date = item.date || formatDate(new Date(item.timestamp || Date.now()));
        const subject = getSubjectName(item.subject);
        
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${title}</div>
                    <div class="item-date">${date} - ${subject}</div>
                </div>
            </div>
            <div class="item-body">${item.description || 'لا يوجد وصف'}</div>
            ${item.images && item.images.length > 0 ? `
                <div class="item-images">
                    ${item.images.map(img => `
                        <div class="item-image" onclick="viewImage('${img}')">
                            <img src="${img}" alt="الصورة">
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        container.appendChild(card);
    });
}

// ===== عرض نافذة الإضافة =====
function showAddModal(subject) {
    const titles = {
        arabic: 'إضافة حرف عربي',
        english: 'إضافة كلمة إنجليزية',
        quran: 'إضافة سورة قرآنية',
        math: 'إضافة مفهوم رياضي',
        science: 'إضافة تجربة علمية',
        activities: 'إضافة نشاط مدرسي'
    };
    
    document.getElementById('modalTitle').textContent = titles[subject] || 'إضافة جديد';
    document.getElementById('modalSubject').value = subject;
    
    // إعادة تعيين النموذج
    document.getElementById('addForm').reset();
    document.getElementById('preview1').innerHTML = '';
    document.getElementById('preview2').innerHTML = '';
    
    // إظهار النافذة
    document.getElementById('addModal').style.display = 'flex';
}

// ===== إغلاق النوافذ =====
function closeModal() {
    document.getElementById('addModal').style.display = 'none';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// ===== معاينة الصورة قبل الرفع =====
function previewImage(input, previewId) {
    const file = input.files[0];
    if (!file) return;
    
    // تصغير الصورة تلقائياً
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // إنشاء canvas لتصغير الصورة
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // تحديد الحجم الأقصى
            const maxWidth = 800;
            const maxHeight = 600;
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }
            
            if (height > maxHeight) {
                width = (maxHeight / height) * width;
                height = maxHeight;
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // تحويل إلى base64 بجودة 80%
            const compressedImage = canvas.toDataURL('image/jpeg', 0.8);
            
            // عرض المعاينة
            const preview = document.getElementById(previewId);
            preview.innerHTML = `<img src="${compressedImage}" style="max-width:100%;">`;
            
            // حفظ الصورة المصغرة في input
            input.dataset.compressed = compressedImage;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ===== حفظ العنصر =====
async function saveItem() {
    const subject = document.getElementById('modalSubject').value;
    const title = document.getElementById('itemTitle').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    
    if (!title) {
        alert('الرجاء إدخال العنوان');
        return;
    }
    
    try {
        showToast('جارٍ الحفظ...');
        
        // إنشاء العنصر
        const item = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            date: new Date().toLocaleDateString('ar-SA'),
            title: title,
            description: description,
            images: []
        };
        
        // إضافة حقول إضافية
        if (subject === 'arabic' || subject === 'english') {
            item.letter = title;
        } else if (subject === 'quran') {
            item.surah = title;
        } else if (subject === 'math' || subject === 'science') {
            item.concept = title;
        }
        
        // معالجة الصور المصغرة
        const image1 = document.getElementById('image1');
        const image2 = document.getElementById('image2');
        
        if (image1.files[0] && image1.dataset.compressed) {
            const compressed = await uploadImage(image1.dataset.compressed, subject);
            if (compressed) item.images.push(compressed);
        }
        
        if (image2.files[0] && image2.dataset.compressed) {
            const compressed = await uploadImage(image2.dataset.compressed, subject);
            if (compressed) item.images.push(compressed);
        }
        
        // إضافة إلى البيانات
        portfolioData[subject].push(item);
        
        // حفظ البيانات
        await saveData();
        
        // تحديث الواجهة
        updateUI();
        renderSection(subject);
        
        // إغلاق النافذة
        closeModal();
        
        showToast('✅ تم الحفظ بنجاح');
        switchTab(subject);
        
    } catch (error) {
        console.error('❌ خطأ:', error);
        showToast('❌ خطأ في الحفظ');
    }
}

// ===== رفع الصورة (بسيط) =====
async function uploadImage(base64Data, subject) {
    if (!useFirebase) {
        // استخدام base64 مباشرة للتخزين المحلي
        return base64Data;
    }
    
    try {
        // محاولة رفع إلى Firebase
        const storage = firebase.storage();
        const fileName = `${subject}_${Date.now()}.jpg`;
        const storageRef = storage.ref().child(`portfolio/${fileName}`);
        
        // تحويل base64 إلى blob
        const response = await fetch(base64Data);
        const blob = await response.blob();
        
        // الرفع
        const snapshot = await storageRef.put(blob);
        const url = await snapshot.ref.getDownloadURL();
        
        return url;
    } catch (error) {
        console.log('❌ خطأ في رفع الصورة، استخدام base64:', error);
        return base64Data;
    }
}

// ===== حذف العنصر =====
async function deleteItem(subject, itemId) {
    if (!confirm('هل تريد حذف هذا العنصر؟')) return;
    
    try {
        portfolioData[subject] = portfolioData[subject].filter(item => item.id !== itemId);
        
        await saveData();
        updateUI();
        
        if (currentTab === subject || currentTab === 'viewall') {
            if (currentTab === 'viewall') {
                renderAllItems();
            } else {
                renderSection(subject);
            }
        }
        
        showToast('🗑️ تم الحذف');
    } catch (error) {
        showToast('❌ خطأ في الحذف');
    }
}

// ===== عرض الصورة =====
function viewImage(url) {
    if (!url) return;
    
    document.getElementById('modalImage').src = url;
    document.getElementById('imageModal').style.display = 'flex';
}

// ===== طباعة الكل =====
function printAll() {
    // حفظ التبويب الحالي
    const current = currentTab;
    
    // التبديل إلى عرض الكل
    switchTab('viewall');
    
    // الانتظار قليلاً ثم الطباعة
    setTimeout(() => {
        window.print();
        
        // العودة للتبويب السابق
        setTimeout(() => {
            switchTab(current);
        }, 500);
    }, 500);
}

// ===== نسخة احتياطية =====
function backupData() {
    const data = JSON.stringify(portfolioData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ملف-الإنجاز-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    showToast('💾 تم إنشاء نسخة احتياطية');
}

// ===== دوال مساعدة =====
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

function getSubjectName(subject) {
    const names = {
        arabic: 'عربي',
        english: 'إنجليزي',
        quran: 'قرآن',
        math: 'رياضيات',
        science: 'علوم',
        activities: 'نشاطات'
    };
    return names[subject] || subject;
}

function formatDate(date) {
    return date.toLocaleDateString('ar-SA');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== جعل الدوال متاحة عالمياً =====
window.showAddModal = showAddModal;
window.closeModal = closeModal;
window.closeImageModal = closeImageModal;
window.previewImage = previewImage;
window.saveItem = saveItem;
window.deleteItem = deleteItem;
window.viewImage = viewImage;
window.printAll = printAll;
window.backupData = backupData;
window.switchTab = switchTab;

console.log('✅ التطبيق جاهز للاستخدام!');
