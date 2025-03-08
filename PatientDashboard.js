// PatientDashboard component
class PatientDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: Store.getCurrentUser(),
            medicines: [],
            reminders: [],
            lowStockMedicines: [],
            medicalHistory: []
        };
        
        // Load data
        this.loadData();
    }

    loadData() {
        const currentUser = Store.getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'patient') {
            this.navigate('Login');
            return;
        }
        
        const medicines = Store.getPatientMedicines(currentUser.id);
        const reminders = Store.getPatientReminders(currentUser.id);
        const lowStockMedicines = Store.getLowStockMedicines(currentUser.id);
        const medicalHistory = Store.getPatientMedicalHistory(currentUser.id);
        
        this.setState({
            currentUser,
            medicines,
            reminders,
            lowStockMedicines,
            medicalHistory
        });
    }

    template() {
        const { currentUser, medicines, reminders, lowStockMedicines, medicalHistory } = this.state;
        
        // Create navbar but only use its template
        const navbarTemplate = new Navbar({ showBackButton: false }).template();
        
        return `
            ${navbarTemplate}
            <div class="container mx-auto p-4 page-transition">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-bold">Patient Dashboard</h1>
                    <div class="flex space-x-2">
                        <button id="blood-donation-btn" class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded clickable">
                            <i class="fas fa-tint mr-2 blood-drop"></i>Blood Donation
                        </button>
                        <button id="link-caretaker-btn" class="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded clickable">
                            <i class="fas fa-user-plus mr-2"></i>Link with Caretaker
                        </button>
                    </div>
                </div>
                
                <!-- Medical History Section -->
                <div class="dashboard-section p-6 mb-6 patient-section hover-lift">
                    <div class="flex justify-between items-center mb-4 dashboard-section-header pb-2">
                        <h2 class="text-xl font-semibold">Medical History</h2>
                    </div>
                    
                    ${medicalHistory.length > 0 ? `
                        <div class="overflow-x-auto">
                            <table class="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th class="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase">Date</th>
                                        <th class="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase">Diagnosis</th>
                                        <th class="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase">Symptoms</th>
                                        <th class="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase">Doctor</th>
                                        <th class="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${medicalHistory.map(record => `
                                        <tr class="clickable">
                                            <td class="py-2 px-4 border-b border-gray-200">${new Date(record.date).toLocaleDateString()}</td>
                                            <td class="py-2 px-4 border-b border-gray-200">${record.diagnosis}</td>
                                            <td class="py-2 px-4 border-b border-gray-200">${record.symptoms.join(', ')}</td>
                                            <td class="py-2 px-4 border-b border-gray-200">${record.doctorName || 'Unknown'}</td>
                                            <td class="py-2 px-4 border-b border-gray-200">
                                                <button class="view-medical-record-btn bg-blue-100 text-blue-600 hover:bg-blue-200 px-2 py-1 rounded text-sm clickable" data-id="${record.id}">
                                                    <i class="fas fa-eye"></i> View
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : `
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-file-medical text-4xl mb-2"></i>
                            <p>No medical records available.</p>
                        </div>
                    `}
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Left Column: Medicine Stock -->
                    <div class="md:col-span-2">
                        <div class="dashboard-section p-6 mb-6 patient-section hover-lift">
                            <div class="flex justify-between items-center mb-4 dashboard-section-header pb-2">
                                <h2 class="text-xl font-semibold">My Medicines</h2>
                                <button id="add-medicine-btn" class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded clickable">
                                    <i class="fas fa-plus mr-2"></i>Add Medicine
                                </button>
                            </div>
                            
                            ${lowStockMedicines.length > 0 ? `
                                <div class="alert-warning border-l-4 p-4 mb-4 notification">
                                    <div class="flex">
                                        <div class="py-1"><i class="fas fa-exclamation-triangle"></i></div>
                                        <div class="ml-3">
                                            <p class="font-bold">Low Stock Alert</p>
                                            <p>You have ${lowStockMedicines.length} medicine(s) running low on stock.</p>
                                        </div>
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${medicines.length > 0 ? `
                                <div class="overflow-x-auto">
                                    <table class="min-w-full bg-white">
                                        <thead>
                                            <tr>
                                                <th class="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase">Name</th>
                                                <th class="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase">Dosage</th>
                                                <th class="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase">Stock</th>
                                                <th class="py-2 px-4 border-b border-gray-200 text-left text-xs font-semibold uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${medicines.map(medicine => `
                                                <tr class="clickable medicine-card">
                                                    <td class="py-2 px-4 border-b border-gray-200">${medicine.name}</td>
                                                    <td class="py-2 px-4 border-b border-gray-200">${medicine.dosage}</td>
                                                    <td class="py-2 px-4 border-b border-gray-200">
                                                        <span class="inline-flex items-center ${medicine.stock <= medicine.lowStockThreshold ? 'text-red-600' : 'text-green-600'}">
                                                            ${medicine.stock} units
                                                            ${medicine.stock <= medicine.lowStockThreshold ? '<i class="fas fa-exclamation-circle ml-1"></i>' : ''}
                                                        </span>
                                                    </td>
                                                    <td class="py-2 px-4 border-b border-gray-200">
                                                        <div class="flex space-x-2">
                                                            <button class="update-stock-btn bg-blue-100 text-blue-600 hover:bg-blue-200 px-2 py-1 rounded text-sm clickable" data-id="${medicine.id}">
                                                                <i class="fas fa-edit"></i> Update
                                                            </button>
                                                            <button class="order-btn bg-green-100 text-green-600 hover:bg-green-200 px-2 py-1 rounded text-sm clickable" data-id="${medicine.id}">
                                                                <i class="fas fa-shopping-cart"></i> Order
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            ` : `
                                <div class="text-center py-8 text-gray-500">
                                    <i class="fas fa-pills text-4xl mb-2"></i>
                                    <p>No medicines added yet.</p>
                                </div>
                            `}
                        </div>
                    </div>
                    
                    <!-- Right Column: Reminders -->
                    <div>
                        <div class="dashboard-section p-6 patient-section hover-lift">
                            <div class="flex justify-between items-center mb-4 dashboard-section-header pb-2">
                                <h2 class="text-xl font-semibold">Reminders</h2>
                                <button id="add-reminder-btn" class="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded clickable">
                                    <i class="fas fa-plus mr-2"></i>Add Reminder
                                </button>
                            </div>
                            
                            ${reminders.length > 0 ? `
                                <div class="space-y-4">
                                    ${reminders.map(reminder => {
                                        const medicine = medicines.find(m => m.id === reminder.medicineId) || { name: 'Unknown', dosage: '' };
                                        return `
                                            <div class="border rounded-lg p-4 ${reminder.taken ? 'bg-gray-50' : 'bg-blue-50'} clickable reminder-card">
                                                <div class="flex justify-between">
                                                    <h3 class="font-semibold">${medicine.name}</h3>
                                                    <span class="text-sm ${reminder.taken ? 'text-green-600' : 'text-blue-600'}">
                                                        ${reminder.taken ? '<i class="fas fa-check-circle"></i> Taken' : '<i class="fas fa-clock"></i> Pending'}
                                                    </span>
                                                </div>
                                                <p class="text-sm text-gray-600">${medicine.dosage}</p>
                                                <div class="mt-2 flex justify-between items-center">
                                                    <div>
                                                        <span class="text-sm bg-gray-100 px-2 py-1 rounded">
                                                            <i class="fas fa-clock mr-1"></i>${reminder.time}
                                                        </span>
                                                        <span class="text-xs text-gray-500 ml-2">
                                                            ${reminder.days.join(', ')}
                                                        </span>
                                                    </div>
                                                    ${!reminder.taken ? `
                                                        <button class="take-medicine-btn bg-green-100 text-green-600 hover:bg-green-200 px-2 py-1 rounded text-sm clickable" data-id="${reminder.id}">
                                                            Mark as Taken
                                                        </button>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            ` : `
                                <div class="text-center py-8 text-gray-500">
                                    <i class="fas fa-bell text-4xl mb-2"></i>
                                    <p>No reminders set yet.</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
                
                <!-- Medicine Stock Update Modal -->
                <div id="update-stock-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="modal-content rounded-lg p-6 w-full max-w-md">
                        <h2 class="text-xl font-semibold mb-4">Update Medicine Stock</h2>
                        <form id="update-stock-form">
                            <input type="hidden" id="medicine-id">
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="medicine-name">
                                    Medicine
                                </label>
                                <input 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100" 
                                    id="medicine-name" 
                                    type="text"
                                    readonly
                                >
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="current-stock">
                                    Current Stock
                                </label>
                                <input 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100" 
                                    id="current-stock" 
                                    type="text"
                                    readonly
                                >
                            </div>
                            <div class="mb-6">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="new-stock">
                                    New Stock
                                </label>
                                <input 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    id="new-stock" 
                                    type="number"
                                    min="0"
                                    required
                                >
                            </div>
                            <div class="flex items-center justify-between">
                                <button 
                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                    type="submit"
                                >
                                    Update
                                </button>
                                <button 
                                    id="cancel-update"
                                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                    type="button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <!-- Order Medicine Modal -->
                <div id="order-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="modal-content rounded-lg p-6 w-full max-w-md">
                        <h2 class="text-xl font-semibold mb-4">Order Medicine</h2>
                        <form id="order-form">
                            <input type="hidden" id="order-medicine-id">
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="order-medicine-name">
                                    Medicine
                                </label>
                                <input 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100" 
                                    id="order-medicine-name" 
                                    type="text"
                                    readonly
                                >
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="order-quantity">
                                    Quantity
                                </label>
                                <input 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    id="order-quantity" 
                                    type="number"
                                    min="1"
                                    value="10"
                                    required
                                >
                            </div>
                            <div class="mb-6">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="order-notes">
                                    Notes (Optional)
                                </label>
                                <textarea 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    id="order-notes" 
                                    rows="3"
                                ></textarea>
                            </div>
                            <div class="flex items-center justify-between">
                                <button 
                                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                    type="submit"
                                >
                                    Place Order
                                </button>
                                <button 
                                    id="cancel-order"
                                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                    type="button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Medical Record Detail Modal -->
                <div id="medical-record-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="modal-content rounded-lg p-6 w-full max-w-2xl">
                        <div class="flex justify-between items-center mb-4 modal-header p-2 rounded-t">
                            <h2 class="text-xl font-semibold">Medical Record Details</h2>
                            <button id="close-medical-record-modal" class="text-gray-300 hover:text-white clickable">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div id="medical-record-content" class="space-y-4 medical-record p-4">
                            <!-- Content will be populated dynamically -->
                        </div>
                        <div class="mt-6 flex justify-end">
                            <button id="close-record-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline clickable">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    afterRender() {
        // Set up the navbar event listeners
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Store.logout();
                this.navigate('Login');
            });
        }
        
        // Blood donation button
        const bloodDonationBtn = document.getElementById('blood-donation-btn');
        if (bloodDonationBtn) {
            bloodDonationBtn.addEventListener('click', () => {
                this.navigate('BloodDonation');
            });
        }
        
        // Link caretaker button
        const linkCaretakerBtn = document.getElementById('link-caretaker-btn');
        if (linkCaretakerBtn) {
            linkCaretakerBtn.addEventListener('click', () => {
                this.navigate('MedicineList');
            });
        }
        
        // Add medicine button
        const addMedicineBtn = document.getElementById('add-medicine-btn');
        if (addMedicineBtn) {
            addMedicineBtn.addEventListener('click', () => {
                this.navigate('MedicineForm');
            });
        }
        
        // Add reminder button
        const addReminderBtn = document.getElementById('add-reminder-btn');
        if (addReminderBtn) {
            addReminderBtn.addEventListener('click', () => {
                this.navigate('MedicineReminder');
            });
        }
        
        // Update stock buttons
        const updateStockBtns = document.querySelectorAll('.update-stock-btn');
        updateStockBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const medicineId = btn.getAttribute('data-id');
                this.showUpdateStockModal(medicineId);
            });
        });
        
        // Order buttons
        const orderBtns = document.querySelectorAll('.order-btn');
        orderBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const medicineId = btn.getAttribute('data-id');
                this.showOrderModal(medicineId);
            });
        });
        
        // Take medicine buttons
        const takeMedicineBtns = document.querySelectorAll('.take-medicine-btn');
        takeMedicineBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const reminderId = btn.getAttribute('data-id');
                this.takeMedicine(reminderId);
            });
        });
        
        // Update stock form
        const updateStockForm = document.getElementById('update-stock-form');
        if (updateStockForm) {
            updateStockForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateStock();
            });
        }
        
        // Cancel update button
        const cancelUpdateBtn = document.getElementById('cancel-update');
        if (cancelUpdateBtn) {
            cancelUpdateBtn.addEventListener('click', () => {
                this.hideUpdateStockModal();
            });
        }
        
        // Order form
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.placeOrder();
            });
        }
        
        // Cancel order button
        const cancelOrderBtn = document.getElementById('cancel-order');
        if (cancelOrderBtn) {
            cancelOrderBtn.addEventListener('click', () => {
                this.hideOrderModal();
            });
        }
        
        // Medical record view buttons
        document.querySelectorAll('.view-medical-record-btn').forEach(button => {
            button.addEventListener('click', () => {
                const recordId = button.getAttribute('data-id');
                this.showMedicalRecordModal(recordId);
            });
        });
        
        // Close medical record modal
        document.getElementById('close-medical-record-modal').addEventListener('click', () => {
            this.hideMedicalRecordModal();
        });
        
        document.getElementById('close-record-btn').addEventListener('click', () => {
            this.hideMedicalRecordModal();
        });
    }

    showUpdateStockModal(medicineId) {
        const medicine = this.state.medicines.find(m => m.id === parseInt(medicineId));
        
        if (!medicine) return;
        
        document.getElementById('medicine-id').value = medicine.id;
        document.getElementById('medicine-name').value = `${medicine.name} (${medicine.dosage})`;
        document.getElementById('current-stock').value = medicine.stock;
        document.getElementById('new-stock').value = medicine.stock;
        
        document.getElementById('update-stock-modal').classList.remove('hidden');
    }

    hideUpdateStockModal() {
        document.getElementById('update-stock-modal').classList.add('hidden');
    }

    updateStock() {
        const medicineId = document.getElementById('medicine-id').value;
        const newStock = document.getElementById('new-stock').value;
        
        if (!medicineId || !newStock) return;
        
        const updatedMedicine = Store.updateMedicineStock(medicineId, newStock);
        
        if (updatedMedicine) {
            this.hideUpdateStockModal();
            this.loadData();
            
            // Show success alert
            new Alert({
                message: 'Medicine stock updated successfully',
                type: 'success'
            }).mount('body');
        }
    }

    showOrderModal(medicineId) {
        const medicine = this.state.medicines.find(m => m.id === parseInt(medicineId));
        
        if (!medicine) return;
        
        document.getElementById('order-medicine-id').value = medicine.id;
        document.getElementById('order-medicine-name').value = `${medicine.name} (${medicine.dosage})`;
        
        document.getElementById('order-modal').classList.remove('hidden');
    }

    hideOrderModal() {
        document.getElementById('order-modal').classList.add('hidden');
    }

    placeOrder() {
        const medicineId = document.getElementById('order-medicine-id').value;
        const quantity = document.getElementById('order-quantity').value;
        
        if (!medicineId || !quantity) return;
        
        const medicine = this.state.medicines.find(m => m.id === parseInt(medicineId));
        
        if (!medicine) return;
        
        // In a real app, this would send an order to a backend
        // For this demo, we'll just update the stock
        const newStock = parseInt(medicine.stock) + parseInt(quantity);
        const updatedMedicine = Store.updateMedicineStock(medicineId, newStock);
        
        if (updatedMedicine) {
            this.hideOrderModal();
            this.loadData();
            
            // Show success alert
            new Alert({
                message: `Order placed successfully. ${quantity} units of ${medicine.name} will be delivered soon.`,
                type: 'success'
            }).mount('body');
        }
    }

    takeMedicine(reminderId) {
        const updatedReminder = Store.markReminderAsTaken(reminderId);
        
        if (updatedReminder) {
            this.loadData();
            
            // Show success alert
            const medicine = this.state.medicines.find(m => m.id === updatedReminder.medicineId);
            
            new Alert({
                message: `${medicine ? medicine.name : 'Medicine'} marked as taken`,
                type: 'success'
            }).mount('body');
        }
    }

    showMedicalRecordModal(recordId) {
        const record = this.state.medicalHistory.find(r => r.id === parseInt(recordId));
        if (!record) return;
        
        const contentElement = document.getElementById('medical-record-content');
        contentElement.innerHTML = `
            <div class="bg-blue-50 p-4 rounded-lg">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-500">Date</p>
                        <p class="font-semibold">${new Date(record.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Doctor</p>
                        <p class="font-semibold">${record.doctorName || 'Unknown'}</p>
                    </div>
                </div>
            </div>
            
            <div>
                <h3 class="font-semibold text-lg">Diagnosis</h3>
                <p class="p-2 bg-gray-50 rounded">${record.diagnosis}</p>
            </div>
            
            <div>
                <h3 class="font-semibold text-lg">Symptoms</h3>
                <div class="flex flex-wrap gap-2">
                    ${record.symptoms.map(symptom => `
                        <span class="bg-gray-100 px-2 py-1 rounded text-sm">${symptom}</span>
                    `).join('')}
                </div>
            </div>
            
            <div>
                <h3 class="font-semibold text-lg">Notes</h3>
                <p class="p-2 bg-gray-50 rounded whitespace-pre-line">${record.notes || 'No notes provided.'}</p>
            </div>
            
            ${record.attachments && record.attachments.length > 0 ? `
                <div>
                    <h3 class="font-semibold text-lg">Attachments</h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                        ${record.attachments.map(attachment => `
                            <div class="border p-2 rounded">
                                <p class="text-sm truncate">${attachment.name}</p>
                                <a href="${attachment.url}" target="_blank" class="text-blue-500 hover:underline text-sm">View</a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        
        document.getElementById('medical-record-modal').classList.remove('hidden');
    }

    hideMedicalRecordModal() {
        document.getElementById('medical-record-modal').classList.add('hidden');
    }
} 