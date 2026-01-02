// نظام ملف الإنجاز - النسخة المعدلة (Firebase فقط)
console.log('🎓 نظام ملف الإنجاز - Firebase Edition');

// إعدادات Firebase
let firebaseDb = null;
let portfolioData = {
    arabic: [],
    english: [],
    quran: [],
    math: [],
    science: [],
    activities: []
};
let currentSubject = 'arabic';

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 بدء تهيئة التطبيق...');
    
    // إخفاء شاشة التحميل بعد تأخير قصير
    setTimeout(async () => {
        try {
            await initializeApp();
        } catch (error) {
            console.error('❌ خطأ في التهيئة:', error);
            showToast('حدث خطأ في تحميل التطبيق', 'error');
        }
    }, 1000);
});

// تهيئة Firebase والتطبيق
async function initializeApp() {
    console.log('🔥 تهيئة Firebase...');
    
    try {
        // تحميل Firebase
        await loadFirebase();
        
        // تهيئة Firebase
        if (typeof firebase !== 'undefined') {
            const firebaseConfig = {
                apiKey: "AIzaSyCwZ_E7qNO7G9gQPDaG8HqLry-z8xH8Y-s",
                authDomain: "teacher-portfolio-c38fd.firebaseapp.com",
                projectId: "teacher-portfolio-c38fd",
                storageBucket: "teacher-portfolio-c38fd.appspot.com",
                messagingSenderId: "983974392506",
                appId: "1:983974392506:web:2d3027963a055113f30075"
            };
            
            // تهيئة Firebase إذا لم يكن معتمداً
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            firebaseDb = firebase.firestore();
            
            console.log('✅ Firebase متصل بنجاح');
            
            // إخفاء شاشة التحميل
            document.getElementById('loading').style.display = 'none';
            document.querySelector('.app').style.display = 'block';
            
            // إعداد الأحداث
            setupEventListeners();
            
            // تحميل البيانات
            await loadData();
            
            // تحديث الواجهة
            updateDashboard();
            
            console.log('🎉 التطبيق جاهز للاستخدام');
            
        } else {
            throw new Error('Firebase غير متوفر');
        }
        
    } catch (error) {
        console.error('❌ خطأ في الاتصال بـ Firebase:', error);
        
        // استخدم النظام المحلي كنسخة احتياطية
        document.getElementById('loading').style.display = 'none';
        document.querySelector('.app').style.display = 'block';
        
        setupEventListeners();
        loadLocalData();
        updateDashboard();
        
        showToast('يعمل النظام في الوضع المحلي', 'warning');
    }
}

// تحميل Firebase الديناميكي
function loadFirebase() {
    return new Promise((resolve, reject) => {
        if (typeof firebase !== 'undefined') {
            resolve();
            return;
        }
        
        const scripts = [
            'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js',
            'https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js'
        ];
        
        let loaded = 0;
        
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                loaded++;
                if (loaded === scripts.length) {
                    resolve();
                }
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    });
}

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
    const itemForm = document.getElementById('itemForm');
    if (itemForm) {
        itemForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await saveItem();
        });
    }
    
    // أزرار الإضافة السريعة
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            showAddModal(subject);
        });
    });
    
    // معاينة الصور
    const image1Input = document.getElementById('image1');
    const image2Input = document.getElementById('image2');
    
    if (image1Input) {
        image1Input.addEventListener('change', function(e) {
            previewImage(e.target, 'preview1');
        });
    }
    
    if (image2Input) {
        image2Input.addEventListener('change', function(e) {
            previewImage(e.target, 'preview2');
        });
    }
    
    // زر الإضافة الرئيسي
    const addButton = document.querySelector('.btn-primary');
    if (addButton) {
        addButton.addEventListener('click', function() {
            showSubjectSelection();
        });
    }
    
    console.log('✅ تم إعداد واجهة المستخدم');
}

// تحميل البيانات من Firebase
async function loadData() {
    console.log('📥 جاري تحميل البيانات من Firebase...');
    
    try {
        showToast('جاري تحميل البيانات...', 'info');
        
        // جلب جميع العناصر
        const querySnapshot = await firebaseDb
            .collection('portfolio_items')
            .orderBy('timestamp', 'desc')
            .limit(100)
            .get();
        
        // إعادة تعيين البيانات
        portfolioData = {
            arabic: [],
            english: [],
            quran: [],
            math: [],
            science: [],
            activities: []
        };
        
        if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                const item = doc.data();
                const subject = item.subject || 'activities';
                
                if (portfolioData[subject]) {
                    portfolioData[subject].push(item);
                }
            });
            
            console.log(`✅ تم تحميل ${querySnapshot.size} عنصر من Firebase`);
            showToast(`تم تحميل ${querySnapshot.size} عنصر`, 'success');
        } else {
            console.log('📭 لا توجد بيانات في Firebase');
            loadSampleData();
            showToast('تم تحميل بيانات تجريبية', 'info');
        }
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        showToast('فشل تحميل البيانات من السحابة', 'error');
        loadSampleData();
    }
}

// تحميل البيانات المحلية (نسخة احتياطية)
function loadLocalData() {
    console.log('📁 جاري تحميل البيانات المحلية...');
    
    try {
        const savedData = localStorage.getItem('teacherPortfolio');
        if (savedData) {
            portfolioData = JSON.parse(savedData);
            console.log('✅ تم تحميل البيانات من التخزين المحلي');
        } else {
            loadSampleData();
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات المحلية:', error);
        loadSampleData();
    }
}

// تحميل بيانات تجريبية
function loadSampleData() {
    portfolioData = {
        arabic: [
            {
                id: '1',
                subject: 'arabic',
                title: 'حرف الألف',
                description: 'نشاط تعليمي لحرف الألف مع التلوين',
                imageUrls: [
                    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80'
                ],
                date: '١٤٤٥/٠٣/١٥',
                timestamp: Date.now()
            }
        ],
        english: [
            {
                id: '2',
                subject: 'english',
                title: 'Letter A',
                description: 'Learning letter A with activities',
                imageUrls: [
                    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&q=80'
                ],
                date: '١٤٤٥/٠٣/١٠',
                timestamp: Date.now() - 86400000
            }
        ],
        quran: [
            {
                id: '3',
                subject: 'quran',
                title: 'سورة الفاتحة',
                description: 'حفظ وتلاوة سورة الفاتحة',
                imageUrls: [
                    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'
                ],
                date: '١٤٤٥/٠٣/٠٥',
                timestamp: Date.now() - 172800000
            }
        ],
        math: [],
        science: [],
        activities: []
    };
    
    console.log('📝 تم تحميل بيانات تجريبية');
}

// حفظ العنصر في Firebase
async function saveItem() {
    console.log('💾 جاري حفظ العنصر...');
    
    const subject = document.getElementById('itemSubject').value;
    const title = document.getElementById('itemTitle').value.trim();
    const description = document.getElementById('itemDesc').value.trim();
    
    if (!title) {
        showToast('الرجاء إدخال العنوان', 'error');
        return;
    }
    
    // إذا لم يكن Firebase متصلاً، استخدم التخزين المحلي
    if (!firebaseDb) {
        saveItemLocally(subject, title, description);
        return;
    }
    
    try {
        showToast('جارٍ حفظ العنصر في السحابة...', 'info');
        
        // إنشاء معرّف فريد للعنصر
        const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // إنشاء العنصر الأساسي
        const item = {
            id: itemId,
            subject: subject,
            title: title,
            description: description || 'لا يوجد وصف',
            date: new Date().toLocaleDateString('ar-SA'),
            timestamp: Date.now(),
            imageUrls: [],
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // إضافة حقول خاصة حسب المادة
        switch(subject) {
            case 'arabic':
                item.type = 'حرف عربي';
                break;
            case 'english':
                item.type = 'كلمة إنجليزية';
                break;
            case 'quran':
                item.type = 'سورة قرآنية';
                break;
            case 'math':
                item.type = 'مفهوم رياضي';
                break;
            case 'science':
                item.type = 'تجربة علمية';
                break;
            case 'activities':
                item.type = 'نشاط مدرسي';
                break;
        }
        
        // معالجة الصور (ضغط وتحويل إلى Base64)
        const imagePromises = [];
        const image1 = document.getElementById('image1').files[0];
        const image2 = document.getElementById('image2').files[0];
        
        if (image1) {
            imagePromises.push(compressAndConvertImage(image1));
        }
        
        if (image2) {
            imagePromises.push(compressAndConvertImage(image2));
        }
        
        // انتظار معالجة جميع الصور
        if (imagePromises.length > 0) {
            const compressedImages = await Promise.all(imagePromises);
            item.imageUrls = compressedImages.filter(img => img !== null);
        }
        
        // حفظ في Firebase
        await firebaseDb.collection('portfolio_items').doc(itemId).set(item);
        
        console.log(`✅ تم حفظ العنصر في Firebase: ${itemId}`);
        
        // إضافة إلى البيانات الحالية للتحديث الفوري
        portfolioData[subject].unshift(item);
        
        // تحديث الواجهة
        updateDashboard();
        updateSection(subject);
        
        // إغلاق النموذج
        closeModal();
        
        showToast('تم إضافة العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حفظ العنصر:', error);
        
        // المحاولة بحفظ محلي كنسخة احتياطية
        if (error.message.includes('quota') || error.message.includes('permission')) {
            saveItemLocally(subject, title, description);
        } else {
            showToast('حدث خطأ في حفظ العنصر: ' + error.message, 'error');
        }
    }
}

// حفظ العنصر محلياً (نسخة احتياطية)
function saveItemLocally(subject, title, description) {
    console.log('💾 حفظ محلي (نسخة احتياطية)...');
    
    const item = {
        id: Date.now().toString(),
        subject: subject,
        title: title,
        description: description || 'لا يوجد وصف',
        date: new Date().toLocaleDateString('ar-SA'),
        timestamp: Date.now(),
        imageUrls: []
    };
    
    // إضافة الصور المحلية
    const image1 = document.getElementById('image1').files[0];
    const image2 = document.getElementById('image2').files[0];
    
    const readerPromises = [];
    
    if (image1) {
        readerPromises.push(convertToBase64(image1));
    }
    
    if (image2) {
        readerPromises.push(convertToBase64(image2));
    }
    
    // إذا كانت هناك صور، انتظر تحويلها
    if (readerPromises.length > 0) {
        Promise.all(readerPromises).then(base64Images => {
            item.imageUrls = base64Images;
            completeLocalSave(subject, item);
        });
    } else {
        completeLocalSave(subject, item);
    }
}

// إكمال الحفظ المحلي
function completeLocalSave(subject, item) {
    // إضافة إلى البيانات المحلية
    portfolioData[subject].unshift(item);
    
    // حفظ في localStorage
    localStorage.setItem('teacherPortfolio', JSON.stringify(portfolioData));
    
    // تحديث الواجهة
    updateDashboard();
    updateSection(subject);
    
    // إغلاق النموذج
    closeModal();
    
    showToast('تم الحفظ محلياً (غير متصل بالسحابة)', 'warning');
}

// ضغط وتحويل الصورة
function compressAndConvertImage(file) {
    return new Promise((resolve) => {
        // التحقق من حجم الملف (1MB كحد أقصى)
        if (file.size > 1024 * 1024) {
            console.warn('⚠️ الملف كبير جداً، سيتم تخطيه');
            resolve(null);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // إنشاء canvas للضغط
                const canvas = document.createElement('canvas');
                const maxWidth = 800;
                const maxHeight = 600;
                
                let width = img.width;
                let height = img.height;
                
                // حساب الأبعاد الجديدة مع الحفاظ على التناسب
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
                
                // رسم الصورة المضغوطة
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // تحويل إلى JPEG بجودة 70%
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                resolve(compressedBase64);
            };
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
    });
}

// تحويل إلى Base64
function convertToBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
    });
}

// تحديث لوحة التحكم
function updateDashboard() {
    console.log('📊 تحديث لوحة التحكم...');
    
    // حساب الإحصائيات
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.imageUrls ? item.imageUrls.length : 0), 0), 0);
    
    // حساب العناصر الحديثة (آخر 7 أيام)
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentItems = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.filter(item => (item.timestamp || 0) > oneWeekAgo).length, 0);
    
    // تحديث DOM
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalImages').textContent = totalImages;
    document.getElementById('recentItems').textContent = recentItems;
    
    const completionRate = totalItems > 0 ? Math.min(100, Math.floor((totalItems / 100) * 100)) : 0;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
    
    // تحديث العناصر الحديثة
    updateRecentItems();
    
    // تحديث حالة الاتصال
    updateConnectionStatus();
}

// تحديث حالة الاتصال
function updateConnectionStatus() {
    const statusElement = document.getElementById('connectionStatus');
    if (statusElement) {
        statusElement.innerHTML = firebaseDb ? 
            '<span style="color: #4CAF50;">● متصل بالسحابة</span>' : 
            '<span style="color: #f44336;">● غير متصل (يعمل محلياً)</span>';
    }
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
    const description = item.description || 'لا يوجد وصف';
    
    // استخدام صور افتراضية إذا كانت الصور فارغة
    const image1 = item.imageUrls && item.imageUrls[0] ? item.imageUrls[0] : getDefaultImage(subject, 1);
    const image2 = item.imageUrls && item.imageUrls[1] ? item.imageUrls[1] : getDefaultImage(subject, 2);
    
    card.innerHTML = `
        <div class="item-header">
            <div class="item-title">${title}</div>
            <div class="item-date">${date}</div>
        </div>
        <div class="item-body">
            <div class="item-description">${description}</div>
            <div class="item-images">
                <div class="item-image" onclick="viewImage('${image1}')">
                    <img src="${image1}" alt="الصورة الأولى" 
                         onerror="this.src='${getDefaultImage(subject, 1)}'">
                </div>
                <div class="item-image" onclick="viewImage('${image2}')">
                    <img src="${image2}" alt="الصورة الثانية" 
                         onerror="this.src='${getDefaultImage(subject, 2)}'">
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
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
            'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&q=80'
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
            padding: 30px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        ">
            <h3 style="margin-bottom: 20px; color: #333;">اختر القسم</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <button onclick="showAddModal('arabic'); this.closest('.modal').remove()" style="
                    padding: 15px;
                    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                ">
                    <i class="fas fa-book"></i>
                    <span>العربية</span>
                </button>
                
                <button onclick="showAddModal('english'); this.closest('.modal').remove()" style="
                    padding: 15px;
                    background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                ">
                    <i class="fas fa-language"></i>
                    <span>الإنجليزية</span>
                </button>
                
                <button onclick="showAddModal('quran'); this.closest('.modal').remove()" style="
                    padding: 15px;
                    background: linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                ">
                    <i class="fas fa-book-quran"></i>
                    <span>القرآن</span>
                </button>
                
                <button onclick="showAddModal('math'); this.closest('.modal').remove()" style="
                    padding: 15px;
                    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                ">
                    <i class="fas fa-calculator"></i>
                    <span>الرياضيات</span>
                </button>
                
                <button onclick="showAddModal('science'); this.closest('.modal').remove()" style="
                    padding: 15px;
                    background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                ">
                    <i class="fas fa-flask"></i>
                    <span>العلوم</span>
                </button>
                
                <button onclick="showAddModal('activities'); this.closest('.modal').remove()" style="
                    padding: 15px;
                    background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 1rem;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                ">
                    <i class="fas fa-chalkboard-teacher"></i>
                    <span>النشاطات</span>
                </button>
            </div>
            <button onclick="this.closest('.modal').remove()" style="
                margin-top: 20px;
                padding: 10px 20px;
                background: #f1f3f5;
                border: none;
                border-radius: 8px;
                color: #666;
                cursor: pointer;
                font-size: 0.9rem;
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

// تعديل العنصر
async function editItem(subject, itemId) {
    const item = portfolioData[subject].find(i => i.id === itemId);
    if (!item) {
        showToast('العنصر غير موجود', 'error');
        return;
    }
    
    currentSubject = subject;
    
    document.getElementById('modalTitle').textContent = 'تعديل العنصر';
    document.getElementById('itemSubject').value = subject;
    document.getElementById('itemTitle').value = item.title || '';
    document.getElementById('itemDesc').value = item.description || '';
    
    // مسح معاينات الصور القديمة
    document.getElementById('preview1').innerHTML = '';
    document.getElementById('preview2').innerHTML = '';
    
    // إضافة معاينات للصور الموجودة
    if (item.imageUrls && item.imageUrls[0]) {
        document.getElementById('preview1').innerHTML = 
            `<img src="${item.imageUrls[0]}" alt="الصورة الحالية">`;
    }
    
    if (item.imageUrls && item.imageUrls[1]) {
        document.getElementById('preview2').innerHTML = 
            `<img src="${item.imageUrls[1]}" alt="الصورة الحالية">`;
    }
    
    document.getElementById('addModal').style.display = 'flex';
    document.getElementById('itemForm').dataset.editId = itemId;
}

// حذف العنصر
async function deleteItem(subject, itemId) {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذه العملية.')) {
        return;
    }
    
    try {
        showToast('جارٍ حذف العنصر...', 'info');
        
        // حذف من Firebase إذا كان متصلاً
        if (firebaseDb) {
            await firebaseDb.collection('portfolio_items').doc(itemId).delete();
        }
        
        // حذف من البيانات المحلية
        portfolioData[subject] = portfolioData[subject].filter(item => item.id !== itemId);
        
        // حفظ التغييرات محلياً
        localStorage.setItem('teacherPortfolio', JSON.stringify(portfolioData));
        
        console.log(`✅ تم حذف العنصر: ${itemId}`);
        
        // تحديث الواجهة
        updateDashboard();
        updateSection(subject);
        
        showToast('تم حذف العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حذف العنصر:', error);
        showToast('حدث خطأ في حذف العنصر', 'error');
    }
}

// عرض الصورة
function viewImage(url) {
    if (!url) return;
    
    document.getElementById('viewerImage').src = url;
    document.getElementById('imageViewer').style.display = 'flex';
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
                        ${item.imageUrls && item.imageUrls.length > 0 ? `
                            <div class="print-images">
                                ${item.imageUrls.map((img, index) => 
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
    const container = document.getElementById('toastContainer') || createToastContainer();
    
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
            <div class="toast-title">${getToastTitle(type)}</div>
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

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    document.body.appendChild(container);
    return container;
}

function getToastTitle(type) {
    const titles = {
        success: 'نجاح',
        error: 'خطأ',
        info: 'معلومة',
        warning: 'تحذير'
    };
    return titles[type] || 'إشعار';
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

console.log('🎉 النظام جاهز! يتم التركيز على Firebase مع نسخة احتياطية محلية.');
