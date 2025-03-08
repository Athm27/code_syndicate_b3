// Main application
const App = {
    // Current active component
    currentComponent: null,
    
    // Navigation history
    navigationHistory: [],
    
    // Current history position
    historyPosition: -1,

    // Initialize application
    init() {
        // Check if user is logged in
        const currentUser = Store.getCurrentUser();
        
        if (currentUser) {
            // Navigate to appropriate dashboard based on role
            switch (currentUser.role) {
                case 'patient':
                    this.navigate('PatientDashboard');
                    break;
                case 'caretaker':
                    this.navigate('CaretakerDashboard');
                    break;
                case 'doctor':
                    this.navigate('DoctorDashboard');
                    break;
                default:
                    this.navigate('Login');
            }
        } else {
            // Navigate to home page for non-logged in users
            this.navigate('HomePage');
        }

        // Setup reminder checker
        this.setupReminderChecker();
    },

    // Navigate to a component
    navigate(componentName, props = {}) {
        // Unmount current component if exists
        if (this.currentComponent) {
            this.currentComponent = null;
        }
        
        // Add to navigation history
        if (this.historyPosition < this.navigationHistory.length - 1) {
            // If we navigated back and then to a new page, truncate the forward history
            this.navigationHistory = this.navigationHistory.slice(0, this.historyPosition + 1);
        }
        
        this.navigationHistory.push({ componentName, props });
        this.historyPosition = this.navigationHistory.length - 1;

        // Create and mount new component
        switch (componentName) {
            case 'HomePage':
                this.currentComponent = new HomePage(props).mount('#app');
                break;
            case 'Login':
                this.currentComponent = new Login(props).mount('#app');
                break;
            case 'Register':
                this.currentComponent = new Register(props).mount('#app');
                break;
            case 'PatientDashboard':
                this.currentComponent = new PatientDashboard(props).mount('#app');
                break;
            case 'CaretakerDashboard':
                this.currentComponent = new CaretakerDashboard(props).mount('#app');
                break;
            case 'DoctorDashboard':
                this.currentComponent = new DoctorDashboard(props).mount('#app');
                break;
            case 'MedicineForm':
                this.currentComponent = new MedicineForm(props).mount('#app');
                break;
            case 'MedicineReminder':
                this.currentComponent = new MedicineReminder(props).mount('#app');
                break;
            case 'MedicineList':
                this.currentComponent = new MedicineList(props).mount('#app');
                break;
            case 'BloodDonation':
                this.currentComponent = new BloodDonation(props).mount('#app');
                break;
            default:
                this.currentComponent = new HomePage(props).mount('#app');
        }
    },
    
    // Go back to previous page
    goBack() {
        if (this.historyPosition > 0) {
            this.historyPosition--;
            const { componentName, props } = this.navigationHistory[this.historyPosition];
            
            // Unmount current component if exists
            if (this.currentComponent) {
                this.currentComponent = null;
            }
            
            // Create and mount previous component
            switch (componentName) {
                case 'HomePage':
                    this.currentComponent = new HomePage(props).mount('#app');
                    break;
                case 'Login':
                    this.currentComponent = new Login(props).mount('#app');
                    break;
                case 'Register':
                    this.currentComponent = new Register(props).mount('#app');
                    break;
                case 'PatientDashboard':
                    this.currentComponent = new PatientDashboard(props).mount('#app');
                    break;
                case 'CaretakerDashboard':
                    this.currentComponent = new CaretakerDashboard(props).mount('#app');
                    break;
                case 'DoctorDashboard':
                    this.currentComponent = new DoctorDashboard(props).mount('#app');
                    break;
                case 'MedicineForm':
                    this.currentComponent = new MedicineForm(props).mount('#app');
                    break;
                case 'MedicineReminder':
                    this.currentComponent = new MedicineReminder(props).mount('#app');
                    break;
                case 'MedicineList':
                    this.currentComponent = new MedicineList(props).mount('#app');
                    break;
                case 'BloodDonation':
                    this.currentComponent = new BloodDonation(props).mount('#app');
                    break;
                default:
                    this.currentComponent = new HomePage(props).mount('#app');
            }
            
            return true;
        }
        
        return false;
    },

    // Setup reminder checker
    setupReminderChecker() {
        // Check for reminders every minute
        setInterval(() => {
            const currentUser = Store.getCurrentUser();
            
            // Only check if user is logged in
            if (!currentUser) return;
            
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
            
            // If user is a patient, check their reminders
            if (currentUser.role === 'patient') {
                const reminders = Store.getPatientReminders(currentUser.id);
                
                reminders.forEach(reminder => {
                    const medicine = Store.getMedicineById(reminder.medicineId);
                    
                    // Check if reminder is due now and not taken
                    if (reminder.time === currentTime && reminder.days.includes(currentDay) && !reminder.taken) {
                        // Show notification
                        this.showNotification(`Time to take ${medicine.name} (${medicine.dosage})`, 'reminder', reminder.id);
                    }
                });
            }
            
            // If user is a caretaker, check their patients' reminders
            if (currentUser.role === 'caretaker') {
                currentUser.patients.forEach(patientId => {
                    const reminders = Store.getPatientReminders(patientId);
                    
                    reminders.forEach(reminder => {
                        const medicine = Store.getMedicineById(reminder.medicineId);
                        
                        // Check if reminder is due 15 minutes ago and not taken
                        const reminderTime = reminder.time.split(':');
                        const reminderDate = new Date();
                        reminderDate.setHours(parseInt(reminderTime[0]));
                        reminderDate.setMinutes(parseInt(reminderTime[1]));
                        
                        const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60000);
                        
                        if (reminderDate >= fifteenMinutesAgo && reminderDate <= now && 
                            reminder.days.includes(currentDay) && !reminder.taken) {
                            // Show notification to caretaker
                            this.showNotification(`Patient missed ${medicine.name} (${medicine.dosage})`, 'missed', reminder.id);
                        }
                    });
                });
            }
        }, 60000); // Check every minute
    },

    // Show notification
    showNotification(message, type, id) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg notification z-50 ${type === 'reminder' ? 'bg-blue-100' : 'bg-red-100'}`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'reminder' ? 'fa-bell' : 'fa-exclamation-circle'} mr-2 ${type === 'reminder' ? 'text-blue-500' : 'text-red-500'}"></i>
                <p class="font-medium">${message}</p>
            </div>
            <div class="mt-2 flex justify-end">
                ${type === 'reminder' ? `<button id="taken-${id}" class="bg-green-500 text-white px-3 py-1 rounded mr-2">Taken</button>` : ''}
                <button id="dismiss-${id}" class="bg-gray-300 text-gray-700 px-3 py-1 rounded">Dismiss</button>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Add event listeners
        if (type === 'reminder') {
            document.getElementById(`taken-${id}`).addEventListener('click', () => {
                Store.markReminderAsTaken(id);
                notification.remove();
            });
        }
        
        document.getElementById(`dismiss-${id}`).addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 30 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 30000);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});