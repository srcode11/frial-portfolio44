/* ===== RESET & BASE STYLES ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f5f7fa;
    color: #333;
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
}

/* ===== LOADER ===== */
.loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.3s ease;
}

.loader-content {
    text-align: center;
    color: white;
}

.logo-circle {
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    font-size: 40px;
    animation: pulse 2s infinite;
}

.loader-content h3 {
    font-size: 24px;
    margin-bottom: 10px;
}

.loader-content p {
    opacity: 0.8;
}

.loader-bar {
    width: 300px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin: 30px auto 0;
    overflow: hidden;
}

.progress {
    width: 30%;
    height: 100%;
    background: white;
    border-radius: 2px;
    animation: loading 1.5s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

@keyframes loading {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(350%); }
}

/* ===== APP CONTAINER ===== */
.app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* ===== HEADER ===== */
.main-header {
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
}

.logo-section {
    display: flex;
    align-items: center;
    gap: 30px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 15px;
}

.logo i {
    font-size: 28px;
    color: #667eea;
}

.logo h1 {
    font-size: 22px;
    color: #333;
    margin: 0;
}

.header-info {
    display: flex;
    gap: 25px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #666;
    font-size: 14px;
}

.info-item i {
    color: #667eea;
}

.header-controls {
    display: flex;
    gap: 10px;
}

.header-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #ddd;
    background: white;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.header-btn:hover {
    background: #f5f7fa;
    transform: translateY(-2px);
}

.header-btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
}

.header-btn.primary:hover {
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* ===== STATS BAR ===== */
.stats-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 20px 30px;
    background: #f8f9fa;
}

.stat {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.stat i {
    font-size: 24px;
    color: #667eea;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea22 0%, #764ba222 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat h3 {
    font-size: 24px;
    color: #333;
    margin: 0 0 5px 0;
}

.stat p {
    font-size: 12px;
    color: #666;
    margin: 0;
}

/* ===== MAIN LAYOUT ===== */
.main-layout {
    display: flex;
    flex: 1;
}

/* ===== SIDEBAR ===== */
.sidebar {
    width: 250px;
    background: white;
    border-left: 1px solid #eee;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 170px);
    position: sticky;
    top: 170px;
}

.sidebar-menu {
    flex: 1;
    padding: 20px 0;
    overflow-y: auto;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 25px;
    color: #666;
    text-decoration: none;
    border-right: 3px solid transparent;
    transition: all 0.3s ease;
}

.menu-item:hover {
    background: #f8f9fa;
    color: #667eea;
}

.menu-item.active {
    background: linear-gradient(90deg, #667eea11 0%, #764ba211 100%);
    color: #667eea;
    border-right-color: #667eea;
}

.menu-item i {
    width: 20px;
    text-align: center;
}

.menu-divider {
    padding: 15px 25px;
    color: #999;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 1px;
}

.sidebar-footer {
    padding: 20px;
    border-top: 1px solid #eee;
}

.connection-status {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.status-dot.connected {
    background: #2ecc71;
    box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.2);
}

.logout-btn {
    width: 100%;
    padding: 12px;
    background: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 8px;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.logout-btn:hover {
    background: #ff6b6b;
    color: white;
    border-color: #ff6b6b;
}

/* ===== MAIN CONTENT ===== */
.main-content {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
    height: calc(100vh - 170px);
}

.content-section {
    display: none;
    animation: fadeIn 0.5s ease;
}

.content-section.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* ===== SECTION HEADER ===== */
.section-header {
    margin-bottom: 30px;
}

.section-header h2 {
    font-size: 28px;
    color: #333;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.section-header h2 i {
    color: #667eea;
}

.section-header p {
    color: #666;
    font-size: 16px;
}

.view-all {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
}

/* ===== QUICK ACTIONS ===== */
.quick-actions {
    background: white;
    border-radius: 15px;
    padding: 25px;
    margin-bottom: 30px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.quick-actions h3 {
    margin-bottom: 20px;
    color: #333;
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
}

.action-btn {
    padding: 20px;
    background: #f8f9fa;
    border: 2px solid #eee;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    color: #333;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-btn:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: transparent;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.action-btn i {
    font-size: 28px;
}

/* ===== ITEMS GRID ===== */
.items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.items-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 25px;
}

/* ===== ITEM CARD ===== */
.item-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    border: 1px solid #eee;
}

.item-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.item-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.item-title {
    font-size: 18px;
    color: #333;
    font-weight: 600;
}

.item-date {
    font-size: 12px;
    color: #999;
}

.item-actions {
    display: flex;
    gap: 10px;
}

.btn-icon {
    width: 35px;
    height: 35px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: white;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.btn-icon:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.item-body {
    padding: 20px;
}

.item-description {
    color: #666;
    line-height: 1.8;
    margin-bottom: 20px;
}

.item-images {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.item-image {
    aspect-ratio: 16/9;
    border-radius: 10px;
    overflow: hidden;
    background: #f8f9fa;
    cursor: pointer;
}

.item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.item-image:hover img {
    transform: scale(1.05);
}

.item-image.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    font-size: 32px;
}

/* ===== BUTTONS ===== */
.btn {
    padding: 12px 25px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
}

.btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn.secondary {
    background: #f8f9fa;
    color: #666;
    border: 1px solid #ddd;
}

.btn.secondary:hover {
    background: #e9ecef;
}

/* ===== SECTION CONTROLS ===== */
.section-controls {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

/* ===== OPTIONS GRID ===== */
.print-options,
.backup-options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
}

.option-card {
    background: white;
    border-radius: 15px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    border: 1px solid #eee;
}

.option-card i {
    font-size: 48px;
    color: #667eea;
    margin-bottom: 20px;
}

.option-card h3 {
    font-size: 20px;
    color: #333;
    margin-bottom: 10px;
}

.option-card p {
    color: #666;
    margin-bottom: 20px;
}

/* ===== FORM STYLES ===== */
.settings-form {
    max-width: 600px;
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.form-group {
    margin-bottom: 25px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 600;
}

.form-group input[type="text"],
.form-group input[type="password"],
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #eee;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #667eea;
}

input:checked + .slider:before {
    transform: translateX(30px);
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

/* ===== MODAL ===== */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 15px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    animation: modalIn 0.3s ease;
}

.modal-content.small {
    max-width: 400px;
}

@keyframes modalIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-header {
    padding: 25px 30px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    font-size: 20px;
    color: #333;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.close-btn:hover {
    background: #f8f9fa;
    color: #333;
}

.modal-body {
    padding: 30px;
    max-height: calc(90vh - 100px);
    overflow-y: auto;
}

/* ===== FORM IN MODAL ===== */
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.file-upload {
    position: relative;
}

.file-input {
    display: none;
}

.file-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 15px;
    background: #f8f9fa;
    border: 2px dashed #ddd;
    border-radius: 8px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
}

.file-label:hover {
    border-color: #667eea;
    color: #667eea;
}

.image-preview {
    margin-top: 15px;
    min-height: 100px;
    border-radius: 8px;
    overflow: hidden;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-preview img {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
}

/* ===== TOAST NOTIFICATIONS ===== */
.toast-container {
    position: fixed;
    bottom: 30px;
    left: 30px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.toast {
    background: white;
    border-radius: 10px;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: toastIn 0.3s ease;
    border-right: 4px solid;
    min-width: 300px;
    max-width: 400px;
}

@keyframes toastIn {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.toast.success {
    border-color: #2ecc71;
}

.toast.error {
    border-color: #e74c3c;
}

.toast.info {
    border-color: #3498db;
}

.toast.warning {
    border-color: #f39c12;
}

.toast i {
    font-size: 20px;
}

.toast.success i { color: #2ecc71; }
.toast.error i { color: #e74c3c; }
.toast.info i { color: #3498db; }
.toast.warning i { color: #f39c12; }

.toast-content {
    flex: 1;
}

.toast-title {
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
}

.toast-message {
    color: #666;
    font-size: 14px;
}

.toast-close {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 5px;
}

/* ===== EMPTY STATE ===== */
.empty-state {
    text-align: center;
    padding: 60px 30px;
    background: #f8f9fa;
    border-radius: 15px;
    border: 2px dashed #ddd;
    grid-column: 1 / -1;
}

.empty-state i {
    font-size: 64px;
    color: #667eea;
    margin-bottom: 20px;
    opacity: 0.5;
}

.empty-state h3 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
}

.empty-state p {
    color: #666;
    max-width: 400px;
    margin: 0 auto 20px;
}

/* ===== RECENT ITEMS ===== */
.recent-items {
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1200px) {
    .stats-bar {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .sidebar {
        width: 220px;
    }
}

@media (max-width: 992px) {
    .main-layout {
        flex-direction: column;
    }
    
    .sidebar {
        width: 100%;
        height: auto;
        position: static;
        border-left: none;
        border-bottom: 1px solid #eee;
    }
    
    .sidebar-menu {
        display: flex;
        overflow-x: auto;
        padding: 15px;
    }
    
    .menu-item {
        white-space: nowrap;
        border-right: none;
        border-bottom: 3px solid transparent;
    }
    
    .menu-item.active {
        border-right-color: transparent;
        border-bottom-color: #667eea;
    }
    
    .menu-divider {
        display: none;
    }
    
    .main-content {
        height: auto;
    }
}

@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
    
    .logo-section {
        flex-direction: column;
        gap: 15px;
    }
    
    .header-info {
        flex-direction: column;
        gap: 10px;
    }
    
    .stats-bar {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .main-content {
        padding: 20px;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .items-container {
        grid-template-columns: 1fr;
    }
    
    .print-options,
    .backup-options {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .actions-grid {
        grid-template-columns: 1fr;
    }
    
    .section-controls {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
        justify-content: center;
    }
    
    .modal-content {
        margin: 10px;
    }
    
    .toast {
        min-width: 250px;
        max-width: 300px;
    }
}

/* ===== UTILITY CLASSES ===== */
.mt-20 { margin-top: 20px; }
.mt-30 { margin-top: 30px; }
.mb-20 { margin-bottom: 20px; }
.mb-30 { margin-bottom: 30px; }
.text-center { text-align: center; }
.hidden { display: none !important; }
