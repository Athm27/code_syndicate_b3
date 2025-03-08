class Reminders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: Store.getCurrentUser(),
            reminders: Store.getUserReminders(),
            medicines: Store.getUserMedicines(),
            message: '',
            messageType: 'info',
            showAddModal: false,
            notifications: []
        };

        // Set up notification checking
        this.checkReminders();
        setInterval(() => this.checkReminders(), 60000); // Check every minute
    }

    template() {
        const { reminders, medicines, message, messageType, showAddModal, notifications } = this.state;

        return `
            <div class="reminders-page">
                <header class="page-header">
                    <h1>MediVarta - Medicine Reminders</h1>
                    <div class="header-actions">
                        <button id="add-reminder-btn" class="btn btn-primary">Add Reminder</button>
                        <button id="medicine-stock-btn" class="btn btn-secondary">Medicine Stock</button>
                        <button id="back-btn" class="btn btn-secondary">Back</button>
                        <button id="logout-btn" class="btn btn-danger">Logout</button>
                    </div>
                </header>

                ${message ? `
                    <div class="alert alert-${messageType}">
                        ${message}
                        <button class="dismiss-btn">&times;</button>
                    </div>
                ` : ''}

                ${notifications.map(notification => `
                    <div class="notification ${notification.type}">
                        <span>${notification.message}</span>
                        <button class="dismiss-btn" data-id="${notification.id}">&times;</button>
                    </div>
                `).join('')}

                <div class="reminders-grid">
                    ${reminders.length > 0 ? reminders.map(reminder => `
                        <div class="reminder-card ${reminder.active ? 'active' : 'inactive'}">
                            <div class="reminder-info">
                                <h3>${reminder.medicineName}</h3>
                                <div class="reminder-details">
                                    <span>Time: ${reminder.time}</span>
                                    <span>Dosage: ${reminder.dosage}</span>
                                    <span>Frequency: ${reminder.frequency}</span>
                                </div>
                                <div class="reminder-days">
                                    ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => `
                                        <span class="day ${reminder.days.includes(index) ? 'active' : ''}">${day}</span>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="reminder-actions">
                                <label class="switch">
                                    <input type="checkbox" class="toggle-reminder" data-id="${reminder.id}" ${reminder.active ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </label>
                                <button class="btn btn-primary edit-reminder" data-id="${reminder.id}">Edit</button>
                                <button class="btn btn-danger delete-reminder" data-id="${reminder.id}">Delete</button>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="empty-state">
                            <p>No reminders set</p>
                            <button id="add-first-reminder-btn" class="btn btn-primary">Add Your First Reminder</button>
                        </div>
                    `}
                </div>

                <!-- Add/Edit Reminder Modal -->
                <div id="reminder-modal" class="modal ${showAddModal ? '' : 'hidden'}">
                    <div class="modal-content">
                        <h2>Add Reminder</h2>
                        <form id="reminder-form">
                            <div class="form-group">
                                <label for="medicine">Medicine:</label>
                                <select id="medicine" required>
                                    <option value="">Select Medicine</option>
                                    ${medicines.map(medicine => `
                                        <option value="${medicine.id}">${medicine.name}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="time">Time:</label>
                                    <input type="time" id="time" required>
                                </div>
                                <div class="form-group">
                                    <label for="frequency">Frequency:</label>
                                    <select id="frequency" required>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="custom">Custom Days</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group days-selector">
                                <label>Select Days:</label>
                                <div class="days-grid">
                                    ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => `
                                        <label class="day-checkbox">
                                            <input type="checkbox" value="${index}" class="day-input">
                                            ${day}
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="dosage">Dosage:</label>
                                <input type="text" id="dosage" placeholder="e.g., 1 tablet" required>
                            </div>
                            <div class="modal-actions">
                                <button type="submit" class="btn btn-primary">Save</button>
                                <button type="button" id="cancel-reminder-btn" class="btn btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    afterRender() {
        // Add reminder button
        const addReminderBtn = document.getElementById('add-reminder-btn');
        const addFirstReminderBtn = document.getElementById('add-first-reminder-btn');
        if (addReminderBtn) {
            addReminderBtn.addEventListener('click', () => {
                this.setState({ showAddModal: true });
            });
        }
        if (addFirstReminderBtn) {
            addFirstReminderBtn.addEventListener('click', () => {
                this.setState({ showAddModal: true });
            });
        }

        // Reminder form
        const reminderForm = document.getElementById('reminder-form');
        if (reminderForm) {
            reminderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveReminder();
            });
        }

        // Frequency change handler
        const frequencySelect = document.getElementById('frequency');
        const daysSelector = document.querySelector('.days-selector');
        if (frequencySelect && daysSelector) {
            frequencySelect.addEventListener('change', () => {
                if (frequencySelect.value === 'custom') {
                    daysSelector.style.display = 'block';
                } else {
                    daysSelector.style.display = 'none';
                }
            });
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancel-reminder-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.setState({ showAddModal: false });
            });
        }

        // Toggle reminders
        document.querySelectorAll('.toggle-reminder').forEach(toggle => {
            toggle.addEventListener('change', () => {
                const reminderId = toggle.getAttribute('data-id');
                this.toggleReminder(reminderId, toggle.checked);
            });
        });

        // Edit buttons
        document.querySelectorAll('.edit-reminder').forEach(button => {
            button.addEventListener('click', () => {
                const reminderId = button.getAttribute('data-id');
                this.editReminder(reminderId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-reminder').forEach(button => {
            button.addEventListener('click', () => {
                const reminderId = button.getAttribute('data-id');
                this.deleteReminder(reminderId);
            });
        });

        // Back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.navigate('BloodDonation');
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Store.logout();
                this.navigate('Login');
            });
        }

        // Dismiss alert
        const dismissBtn = document.querySelector('.dismiss-btn');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                this.setState({ message: '', messageType: 'info' });
            });
        }

        // Close modal when clicking outside
        const modal = document.getElementById('reminder-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.setState({ showAddModal: false });
                }
            });
        }

        // Medicine Stock button
        const medicineStockBtn = document.getElementById('medicine-stock-btn');
        if (medicineStockBtn) {
            medicineStockBtn.addEventListener('click', () => {
                this.navigate('MedicineStock');
            });
        }

        // Notification dismiss buttons
        document.querySelectorAll('.notification .dismiss-btn').forEach(button => {
            button.addEventListener('click', () => {
                const notificationId = button.getAttribute('data-id');
                this.dismissNotification(notificationId);
            });
        });
    }

    saveReminder() {
        const medicineId = document.getElementById('medicine').value;
        const time = document.getElementById('time').value;
        const frequency = document.getElementById('frequency').value;
        const dosage = document.getElementById('dosage').value;
        
        let days = [];
        if (frequency === 'daily') {
            days = [0, 1, 2, 3, 4, 5, 6];
        } else if (frequency === 'custom') {
            document.querySelectorAll('.day-input:checked').forEach(checkbox => {
                days.push(parseInt(checkbox.value));
            });
        }

        const reminder = {
            medicineId,
            time,
            frequency,
            days,
            dosage,
            active: true
        };

        const result = Store.saveReminder(reminder);

        if (result.success) {
            this.setState({
                message: 'Reminder saved successfully.',
                messageType: 'success',
                showAddModal: false,
                reminders: Store.getUserReminders()
            });
        } else {
            this.setState({
                message: result.message || 'Failed to save reminder.',
                messageType: 'error'
            });
        }
    }

    editReminder(reminderId) {
        const reminder = Store.getReminder(reminderId);
        if (reminder) {
            document.getElementById('medicine').value = reminder.medicineId;
            document.getElementById('time').value = reminder.time;
            document.getElementById('frequency').value = reminder.frequency;
            document.getElementById('dosage').value = reminder.dosage;

            // Set days
            document.querySelectorAll('.day-input').forEach(checkbox => {
                checkbox.checked = reminder.days.includes(parseInt(checkbox.value));
            });

            this.setState({ showAddModal: true });
        }
    }

    toggleReminder(reminderId, active) {
        const result = Store.toggleReminder(reminderId, active);
        if (result.success) {
            this.setState({
                message: `Reminder ${active ? 'activated' : 'deactivated'} successfully.`,
                messageType: 'success',
                reminders: Store.getUserReminders()
            });
        } else {
            this.setState({
                message: result.message || 'Failed to toggle reminder.',
                messageType: 'error'
            });
        }
    }

    deleteReminder(reminderId) {
        const result = Store.deleteReminder(reminderId);
        if (result.success) {
            this.setState({
                message: 'Reminder deleted successfully.',
                messageType: 'success',
                reminders: Store.getUserReminders()
            });
        } else {
            this.setState({
                message: result.message || 'Failed to delete reminder.',
                messageType: 'error'
            });
        }
    }

    checkReminders() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentDay = now.getDay();

        this.state.reminders.forEach(reminder => {
            if (!reminder.active) return;

            const [reminderHour, reminderMinute] = reminder.time.split(':').map(Number);
            
            if (reminder.days.includes(currentDay) &&
                reminderHour === currentHour &&
                Math.abs(reminderMinute - currentMinute) <= 1) {
                
                const medicine = this.state.medicines.find(m => m.id === reminder.medicineId);
                if (medicine) {
                    this.showNotification({
                        id: Date.now(),
                        message: `Time to take ${medicine.name}: ${reminder.dosage}`,
                        type: 'warning'
                    });
                }
            }
        });
    }

    showNotification(notification) {
        const notifications = [...this.state.notifications, notification];
        this.setState({ notifications });

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            this.dismissNotification(notification.id);
        }, 10000);
    }

    dismissNotification(id) {
        const notifications = this.state.notifications.filter(n => n.id !== id);
        this.setState({ notifications });
    }
} 