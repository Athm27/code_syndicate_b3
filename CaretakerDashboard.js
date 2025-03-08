// CaretakerDashboard component
class CaretakerDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: Store.getCurrentUser(),
            patients: [],
            patientMedicines: {},
            patientReminders: {},
            patientMedicalHistory: {}
        };
        
        // Load data
        this.loadData();
    }

    loadData() {
        const currentUser = Store.getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'caretaker') {
            this.navigate('Login');
            return;
        }
        
        const data = Store.getData();
        const patients = data.users.filter(u => 
            u.role === 'patient' && 
            currentUser.patients.includes(u.id)
        );
        
        const patientMedicines = {};
        const patientReminders = {};
        const patientMedicalHistory = {};
        
        patients.forEach(patient => {
            patientMedicines[patient.id] = Store.getPatientMedicines(patient.id);
            patientReminders[patient.id] = Store.getPatientReminders(patient.id);
            patientMedicalHistory[patient.id] = Store.getPatientMedicalHistory(patient.id);
        });
        
        this.setState({
            currentUser,
            patients,
            patientMedicines,
            patientReminders,
            patientMedicalHistory
        });
    }

    template() {
        const { currentUser, patients } = this.state;
        
        return `
            <div class="dashboard caretaker-dashboard">
                <header class="dashboard-header">
                    <h1>Welcome, ${currentUser.username}</h1>
                    <div class="header-actions">
                        <button id="blood-donation-btn" class="btn btn-primary">Blood Donation</button>
                        <button id="link-patient-btn" class="btn btn-secondary">Link New Patient</button>
                        <button id="logout-btn" class="btn btn-danger">Logout</button>
                    </div>
                </header>

                <!-- Link Patient Modal -->
                <div id="link-patient-modal" class="modal hidden">
                    <div class="modal-content">
                        <h2>Link New Patient</h2>
                        <div class="form-group">
                            <label for="patient-username">Patient Username:</label>
                            <input type="text" id="patient-username" class="form-control" required>
                        </div>
                        <div class="modal-actions">
                            <button id="confirm-link-btn" class="btn btn-primary">Link Patient</button>
                            <button id="cancel-link-btn" class="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>

                <div class="dashboard-content">
                    <section class="patients-section">
                        <h2>Your Patients</h2>
                        ${patients.length > 0 ? `
                            <div class="patients-list">
                                ${patients.map(patient => `
                                    <div class="patient-card">
                                        <h3>${patient.username}</h3>
                                        <div class="patient-actions">
                                            <button class="btn btn-primary view-medicines" data-patient-id="${patient.id}">
                                                View Medicines
                                            </button>
                                            <button class="btn btn-info view-reminders" data-patient-id="${patient.id}">
                                                View Reminders
                                            </button>
                                            <button class="btn btn-secondary view-history" data-patient-id="${patient.id}">
                                                Medical History
                                            </button>
                                        </div>
                                        
                                        <div class="medicines-list hidden" id="medicines-${patient.id}">
                                            <h4>Medicines</h4>
                                            ${this.state.patientMedicines[patient.id]?.length > 0 
                                                ? this.state.patientMedicines[patient.id].map(medicine => `
                                                    <div class="medicine-item">
                                                        <span>${medicine.name} - ${medicine.dosage}</span>
                                                        <span>Stock: ${medicine.stock}</span>
                                                    </div>
                                                `).join('')
                                                : '<p>No medicines found</p>'
                                            }
                                        </div>
                                        
                                        <div class="reminders-list hidden" id="reminders-${patient.id}">
                                            <h4>Reminders</h4>
                                            ${this.state.patientReminders[patient.id]?.length > 0
                                                ? this.state.patientReminders[patient.id].map(reminder => `
                                                    <div class="reminder-item">
                                                        <span>${reminder.title}</span>
                                                        <span>Time: ${reminder.time}</span>
                                                    </div>
                                                `).join('')
                                                : '<p>No reminders found</p>'
                                            }
                                        </div>
                                        
                                        <div class="medical-history hidden" id="history-${patient.id}">
                                            <h4>Medical History</h4>
                                            ${this.state.patientMedicalHistory[patient.id]?.length > 0
                                                ? this.state.patientMedicalHistory[patient.id].map(record => `
                                                    <div class="history-item">
                                                        <span>${record.date}</span>
                                                        <span>${record.description}</span>
                                                    </div>
                                                `).join('')
                                                : '<p>No medical history found</p>'
                                            }
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<p>No patients linked yet. Use the "Link New Patient" button to add patients.</p>'}
                    </section>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Store.logout();
                this.navigate('Login');
            });
        }

        // Blood Donation button
        const bloodDonationBtn = document.getElementById('blood-donation-btn');
        if (bloodDonationBtn) {
            bloodDonationBtn.addEventListener('click', () => {
                this.navigate('BloodDonation');
            });
        }

        // Link Patient button
        const linkPatientBtn = document.getElementById('link-patient-btn');
        const linkPatientModal = document.getElementById('link-patient-modal');
        const cancelLinkBtn = document.getElementById('cancel-link-btn');
        const confirmLinkBtn = document.getElementById('confirm-link-btn');

        if (linkPatientBtn) {
            linkPatientBtn.addEventListener('click', () => {
                linkPatientModal.classList.remove('hidden');
            });
        }

        if (cancelLinkBtn) {
            cancelLinkBtn.addEventListener('click', () => {
                linkPatientModal.classList.add('hidden');
                document.getElementById('patient-username').value = '';
            });
        }

        if (confirmLinkBtn) {
            confirmLinkBtn.addEventListener('click', () => {
                const patientUsername = document.getElementById('patient-username').value;
                if (!patientUsername) {
                    this.showNotification('Please enter a patient username', 'error');
                    return;
                }

                const data = Store.getData();
                const patient = data.users.find(u => u.username === patientUsername && u.role === 'patient');
                
                if (!patient) {
                    this.showNotification('Patient not found', 'error');
                    return;
                }

                const result = Store.linkPatient(this.state.currentUser.id, patient.id);
                
                if (result.success) {
                    this.showNotification('Patient linked successfully', 'success');
                    linkPatientModal.classList.add('hidden');
                    document.getElementById('patient-username').value = '';
                    this.loadData(); // Reload dashboard data
                } else {
                    this.showNotification(result.message || 'Failed to link patient', 'error');
                }
            });
        }

        // View buttons for each patient
        document.querySelectorAll('.view-medicines').forEach(button => {
            button.addEventListener('click', (e) => {
                const patientId = e.target.dataset.patientId;
                const medicinesList = document.getElementById(`medicines-${patientId}`);
                medicinesList.classList.toggle('hidden');
            });
        });

        document.querySelectorAll('.view-reminders').forEach(button => {
            button.addEventListener('click', (e) => {
                const patientId = e.target.dataset.patientId;
                const remindersList = document.getElementById(`reminders-${patientId}`);
                remindersList.classList.toggle('hidden');
            });
        });

        document.querySelectorAll('.view-history').forEach(button => {
            button.addEventListener('click', (e) => {
                const patientId = e.target.dataset.patientId;
                const historyList = document.getElementById(`history-${patientId}`);
                historyList.classList.toggle('hidden');
            });
        });
    }
} 