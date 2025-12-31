// firebase-app.js
class PortfolioFirebase {
    constructor() {
        this.currentUser = null;
        this.portfolioData = {
            arabic: [],
            english: [],
            quran: [],
            math: [],
            science: [],
            activities: []
        };
        this.init();
    }

    async init() {
        try {
            // محاولة تسجيل الدخول كضيف
            await auth.signInAnonymously();
            
            auth.onAuthStateChanged((user) => {
                if (user) {
                    this.currentUser = user;
                    console.log('User signed in:', user.uid);
                    this.loadAllData();
                } else {
                    console.log('No user signed in');
                }
            });
        } catch (error) {
            console.error('Auth error:', error);
        }
    }

    // تحميل جميع البيانات
    async loadAllData() {
        try {
            const snapshot = await db.collection('portfolio').doc('data').get();
            if (snapshot.exists) {
                this.portfolioData = snapshot.data();
                console.log('Data loaded from Firestore');
                this.renderAllData();
            } else {
                // إنشاء وثيقة جديدة إذا لم توجد
                await db.collection('portfolio').doc('data').set(this.portfolioData);
                console.log('New document created');
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    // رفع صورة إلى Storage
    async uploadImage(file, subject, index) {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(null);
                return;
            }

            const fileName = `${Date.now()}_${subject}_${index}_${file.name}`;
            const storageRef = storage.ref(`portfolio-images/${fileName}`);
            const uploadTask = storageRef.put(file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // يمكن إضافة شريط تقدم هنا
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload: ${progress}%`);
                },
                (error) => {
                    console.error('Upload error:', error);
                    reject(error);
                },
                async () => {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    resolve(downloadURL);
                }
            );
        });
    }

    // إضافة عنصر جديد
    async addItem(subject, data, imageFiles) {
        try {
            const itemId = Date.now().toString();
            const item = {
                id: itemId,
                ...data,
                images: []
            };

            // رفع الصور إذا وجدت
            if (imageFiles[0]) {
                const imageUrl1 = await this.uploadImage(imageFiles[0], subject, '1');
                if (imageUrl1) item.images.push(imageUrl1);
            }

            if (imageFiles[1]) {
                const imageUrl2 = await this.uploadImage(imageFiles[1], subject, '2');
                if (imageUrl2) item.images.push(imageUrl2);
            }

            // إضافة العنصر إلى البيانات
            this.portfolioData[subject].push(item);

            // حفظ في Firestore
            await db.collection('portfolio').doc('data').update({
                [subject]: firebase.firestore.FieldValue.arrayUnion(item)
            });

            console.log('Item added successfully:', item);
            return item;

        } catch (error) {
            console.error('Error adding item:', error);
            throw error;
        }
    }

    // حذف عنصر
    async deleteItem(subject, itemId) {
        try {
            // إزالة من البيانات المحلية
            this.portfolioData[subject] = this.portfolioData[subject].filter(item => item.id !== itemId);

            // تحديث Firestore
            await db.collection('portfolio').doc('data').update({
                [subject]: this.portfolioData[subject]
            });

            console.log('Item deleted:', itemId);
            return true;

        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }

    // عرض البيانات
    renderAllData() {
        // سيتم استدعاء هذه الدالة من الملف الرئيسي
        if (window.renderPortfolioData) {
            window.renderPortfolioData(this.portfolioData);
        }
    }
}

// إنشاء نسخة واحدة من الكلاس
window.portfolioApp = new PortfolioFirebase();