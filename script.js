// نظام ملف الإنجاز - المعلمة فريال الغماري
console.log('🎓 نظام ملف الإنجاز - جاري التحميل...');

// ⚡ إعدادات Cloudinary الخاصة بك - المعدلة
const CLOUDINARY_CONFIG = {
    cloudName: 'djnzshpmw', // ✅ هذا هو Cloud Name الصحيح
    uploadPreset: 'فريال ملف انجاز', // ✅ الـ Preset الذي أنشأته
    apiUrl: 'CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@djnzshpmw' // ✅ تأكد من كتابة cloud name هنا أيضاً
};

// البيانات العالمية
let portfolioData = {
    arabic: [],
    english: [],
    quran: [],
    math: [],
    science: [],
    activities: []
};

let currentSubject = null;
let isFirebaseConnected = false;

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تهيئة التطبيق...');
    
    try {
        // 1. إعداد الأحداث
        setupEventListeners();
        
        // 2. تحميل البيانات
        loadData();
        
        // 3. عرض الصفحة الرئيسية
        updateDashboard();
        
        console.log('✅ تم تهيئة التطبيق بنجاح');
        console.log('☁️ Cloudinary Config:', CLOUDINARY_CONFIG);
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة التطبيق:', error);
        showToast('حدث خطأ في تحميل التطبيق', 'error');
    }
});

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
    document.getElementById('itemForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        await saveItem();
    });
    
    // معاينة الصور
    document.getElementById('image1').addEventListener('change', function(e) {
        previewImage(e.target, 'preview1');
    });
    
    document.getElementById('image2').addEventListener('change', function(e) {
        previewImage(e.target, 'preview2');
    });
    
    console.log('✅ تم إعداد واجهة المستخدم');
}

// ==============================================
// ☁️ نظام Cloudinary المجاني - النهائي
// ==============================================

// تحميل البيانات
async function loadData() {
    console.log('📥 جاري تحميل البيانات...');
    
    try {
        // محاولة Firebase فقط (لبيانات النصوص)
        if (window.firebaseDb) {
            await loadFromFirebase();
        } else {
            console.log('⚠️ Firebase غير متوفر، استخدام التخزين المحلي');
            loadFromLocalStorage();
        }
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        loadFromLocalStorage();
    }
}

// تحميل من Firebase
async function loadFromFirebase() {
    try {
        console.log('🔗 جاري تحميل البيانات من Firebase...');
        
        // جلب كل الأقسام مرة واحدة
        const querySnapshot = await window.firebaseDb
            .collection('portfolio_items')
            .orderBy('timestamp', 'desc')
            .limit(500)
            .get();
        
        if (!querySnapshot.empty) {
            // إعادة تعيين البيانات
            portfolioData = {
                arabic: [],
                english: [],
                quran: [],
                math: [],
                science: [],
                activities: []
            };
            
            // تصنيف العناصر حسب القسم
            querySnapshot.forEach(doc => {
                const item = doc.data();
                const subject = item.subject || 'activities';
                
                if (portfolioData[subject]) {
                    portfolioData[subject].push(item);
                }
            });
            
            console.log(`✅ تم تحميل ${querySnapshot.size} عنصر من Firebase`);
            isFirebaseConnected = true;
            showToast('تم تحميل البيانات بنجاح', 'success');
        } else {
            console.log('📭 لا توجد بيانات في Firebase');
            isFirebaseConnected = true;
        }
        
        updateDashboard();
        
    } catch (error) {
        console.warn('⚠️ فشل تحميل Firebase:', error.message);
        isFirebaseConnected = false;
        loadFromLocalStorage();
    }
}

// تحميل من التخزين المحلي
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('teacherPortfolioCloud');
    if (savedData) {
        try {
            portfolioData = JSON.parse(savedData);
            console.log('✅ تم تحميل البيانات من التخزين المحلي');
            showToast('تم تحميل البيانات المحفوظة', 'info');
        } catch (e) {
            console.error('❌ خطأ في تحليل البيانات المحلية:', e);
            loadSampleData();
        }
    } else {
        loadSampleData();
    }
    updateDashboard();
}

// تحميل بيانات نموذجية
function loadSampleData() {
    console.log('📝 جاري تحميل بيانات نموذجية...');
    
    portfolioData = {
        arabic: [
            {
                id: '1',
                subject: 'arabic',
                title: 'حرف الألف',
                description: 'تعلم حرف الألف مع نشاط الرسم والتلوين',
                imageUrls: [
                    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80'
                ],
                date: '١٤٤٥/٠٣/١٥',
                timestamp: Date.now()
            }
        ],
        english: [
            {
                id: '2',
                subject: 'english',
                title: 'حرف A',
                description: 'Learning letter A with fun activities',
                imageUrls: [
                    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80'
                ],
                date: '١٤٤٥/٠٣/١٤',
                timestamp: Date.now() - 86400000
            }
        ],
        quran: [],
        math: [],
        science: [],
        activities: []
    };
    
    localStorage.setItem('teacherPortfolioCloud', JSON.stringify(portfolioData));
    showToast('تم تحميل بيانات نموذجية', 'info');
}

// حفظ العنصر
async function saveItem() {
    console.log('💾 جاري حفظ العنصر...');
    
    const subject = document.getElementById('itemSubject').value;
    const name = document.getElementById('itemName').value.trim();
    const description = document.getElementById('itemDesc').value.trim();
    
    if (!name) {
        showToast('الرجاء إدخال العنوان', 'error');
        return;
    }
    
    try {
        showToast('جارٍ حفظ العنصر...', 'info');
        
        // إنشاء العنصر
        const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const item = {
            id: itemId,
            subject: subject,
            title: name,
            description: description,
            date: new Date().toLocaleDateString('ar-SA'),
            timestamp: Date.now(),
            imageUrls: [],
            lastUpdated: Date.now()
        };
        
        // إضافة حقول خاصة
        switch(subject) {
            case 'arabic':
                item.letter = name;
                break;
            case 'english':
                item.letter = name;
                break;
            case 'quran':
                item.surah = name;
                break;
            case 'math':
            case 'science':
                item.concept = name;
                break;
        }
        
        // رفع الصور إلى Cloudinary
        const image1 = document.getElementById('image1').files[0];
        const image2 = document.getElementById('image2').files[0];
        
        console.log('📸 معالجة الصور...');
        
        if (image1) {
            console.log('🔼 رفع الصورة الأولى إلى Cloudinary...');
            const url1 = await uploadToCloudinary(image1, 'image1');
            if (url1) {
                item.imageUrls.push(url1);
                console.log('✅ تم رفع الصورة الأولى');
            }
        }
        
        if (image2) {
            console.log('🔼 رفع الصورة الثانية إلى Cloudinary...');
            const url2 = await uploadToCloudinary(image2, 'image2');
            if (url2) {
                item.imageUrls.push(url2);
                console.log('✅ تم رفع الصورة الثانية');
            }
        }
        
        // إضافة إلى البيانات المحلية
        portfolioData[subject].unshift(item);
        
        // حفظ في التخزين المحلي
        localStorage.setItem('teacherPortfolioCloud', JSON.stringify(portfolioData));
        console.log('✅ تم الحفظ في التخزين المحلي');
        
        // محاولة الحفظ في Firebase
        try {
            if (window.firebaseDb) {
                await window.firebaseDb.collection('portfolio_items').doc(itemId).set({
                    ...item,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('✅ تم الحفظ في Firebase');
            }
        } catch (firebaseError) {
            console.warn('⚠️ فشل الحفظ في Firebase:', firebaseError.message);
        }
        
        // تحديث الواجهة
        updateDashboard();
        updateSection(subject);
        
        // إغلاق النموذج
        closeModal();
        
        showToast('تم إضافة العنصر بنجاح', 'success');
        
    } catch (error) {
        console.error('❌ خطأ في حفظ العنصر:', error);
        showToast('حدث خطأ في حفظ العنصر: ' + error.message, 'error');
    }
}

// رفع الصورة إلى Cloudinary - النسخة المحسنة
async function uploadToCloudinary(imageFile, imageName = 'image') {
    try {
        if (!imageFile) return null;
        
        console.log(`☁️ رفع ${imageName} إلى Cloudinary...`);
        
        // 1. ضغط الصورة أولاً (للمساحة المجانية)
        const compressedImage = await compressImageForUpload(imageFile);
        
        // 2. إعداد FormData
        const formData = new FormData();
        formData.append('file', compressedImage);
        formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
        formData.append('folder', 'teacher-portfolio'); // لتنظيم الصور
        
        // 3. إرسال الطلب إلى Cloudinary
        const response = await fetch(CLOUDINARY_CONFIG.apiUrl, {
            method: 'POST',
            body: formData
        });
        
        // 4. معالجة الرد
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Cloudinary error:', errorData);
            
            // تحقق من الأخطاء الشائعة
            if (response.status === 400) {
                throw new Error('الـ Preset غير صحيح أو غير مفعل');
            } else if (response.status === 401) {
                throw new Error('مشكلة في Cloud Name أو الـ API');
            }
            
            throw new Error(`فشل رفع الصورة (${response.status})`);
        }
        
        const data = await response.json();
        
        // 5. الحصول على رابط مضغوط ومناسب للويب
        let imageUrl = data.secure_url;
        
        // تحسين الرابط للويب (تخفيض الحجم وجودة تلقائية)
        if (imageUrl.includes('/upload/')) {
            imageUrl = imageUrl.replace('/upload/', '/upload/w_800,f_auto,q_auto/');
        }
        
        console.log(`✅ Cloudinary upload successful: ${imageUrl}`);
        return imageUrl;
        
    } catch (error) {
        console.warn(`⚠️ فشل رفع ${imageName} إلى Cloudinary:`, error.message);
        
        // بديل: استخدام ImgBB كنسخة احتياطية
        try {
            console.log('🔄 محاولة رفع إلى ImgBB كبديل...');
            const imgbbUrl = await uploadToImgBB(imageFile);
            if (imgbbUrl) {
                console.log(`✅ تم رفع ${imageName} إلى ImgBB بدلاً من Cloudinary`);
                return imgbbUrl;
            }
        } catch (imgbbError) {
            console.warn('⚠️ فشل رفع إلى ImgBB:', imgbbError.message);
        }
        
        // آخر بديل: استخدام Base64 محلياً
        try {
            const base64Url = await convertToBase64(imageFile);
            console.log(`📦 استخدام Base64 محلي لـ ${imageName}`);
            return base64Url;
        } catch (e) {
            console.error(`❌ فشل جميع محاولات رفع ${imageName}:`, e);
            return null;
        }
    }
}

// رفع إلى ImgBB (مجاني - نسخة احتياطية)
async function uploadToImgBB(imageFile) {
    try {
        // مفتاح API عام لـ ImgBB (للاختبار فقط)
        const IMGBB_API_KEY = 'a8d5ff3b9c8b7e7f5c9d4a2b1c3e5f6a'; // مفتاح عام للاختبار
        
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('فشل رفع إلى ImgBB');
        }
        
        const data = await response.json();
        return data.data.url;
        
    } catch (error) {
        throw error;
    }
}

// ضغط الصورة للرفع
function compressImageForUpload(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // حساب الأبعاد الجديدة
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // رسم الصورة المضغوطة
                ctx.drawImage(img, 0, 0, width, height);
                
                // تحويل إلى Blob
                canvas.toBlob(
                    blob => resolve(blob),
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// تحويل إلى Base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ==============================================
// 🔄 باقي الدوال (نفس النسخة السابقة)
// ==============================================

// تحديث لوحة التحكم
function updateDashboard() {
    console.log('📊 تحديث لوحة التحكم...');
    
    // حساب الإحصائيات
    const totalItems = Object.values(portfolioData).reduce((sum, arr) => sum + arr.length, 0);
    const totalImages = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.reduce((imgSum, item) => imgSum + (item.imageUrls ? item.imageUrls.length : 0), 0), 0);
    
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const recentItems = Object.values(portfolioData).reduce((sum, arr) => 
        sum + arr.filter(item => {
            const itemDate = new Date(item.timestamp || Date.now());
            return itemDate.getMonth() === thisMonth && itemDate.getFullYear() === thisYear;
        }).length, 0);
    
    // تحديث DOM
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalImages').textContent = totalImages;
    document.getElementById('recentItems').textContent = recentItems;
    
    const completionRate = totalItems > 0 ? Math.min(100, Math.floor((totalItems / 100) * 100)) : 0;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
    
    // تحديث حالة الاتصال
    updateConnectionStatus();
    
    // تحديث العناصر الحديثة
    updateRecentItems();
    
    // تحديث كل قسم
    Object.keys(portfolioData).forEach(subject => {
        updateSection(subject);
    });
}

// تحديث حالة الاتصال
function updateConnectionStatus() {
    const footerStats = document.getElementById('connectionStatus');
    if (footerStats) {
        if (isFirebaseConnected) {
            footerStats.innerHTML = 'Cloudinary + Firebase <span style="color: #4CAF50;">(متصل)</span>';
        } else {
            footerStats.innerHTML = 'Cloudinary + Firebase <span style="color: #f44336;">(غير متصل)</span>';
        }
    }
}

// ... باقي الدوال بنفس النسخة السابقة ...
// [يتبع نفس باقي الدوال بدون تغيير]
