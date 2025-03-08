// BloodDonation component
class BloodDonation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: Store.getCurrentUser(),
            bloodBank: Store.getBloodBankStatus(),
            userRequests: [],
            allRequests: [],
            requestBloodType: '',
            requestAmount: 1,
            message: '',
            messageType: 'info', // info, success, error
            activeTab: 'donate', // donate, request, status
            eligibilityMessage: { type: 'success', message: 'You are eligible to donate blood.' },
            lastDonation: null,
            healthDetails: {
                weight: '',
                height: '',
                isDiabetic: false,
                hasHeartDisease: false,
                hasHypertension: false,
                hasCancer: false,
                hasHIV: false,
                hasHepatitis: false,
                isSmoker: false,
                alcoholConsumption: 'none',
                allergies: [],
                medications: []
            }
        };
        
        // Load user requests
        this.loadUserData();
    }

    loadUserData() {
        const currentUser = Store.getCurrentUser();
        
        if (!currentUser) {
            this.navigate('Login');
            return;
        }
        
        // Get user's blood requests
        const userRequests = Store.getUserBloodRequests(currentUser.id);
        
        // If user is a doctor, get all blood requests
        let allRequests = [];
        if (currentUser.role === 'doctor') {
            allRequests = Store.getAllBloodRequests();
        }
        
        // Get blood bank status
        const bloodBank = Store.getBloodBankStatus();
        
        // Get user's last donation
        const lastDonation = currentUser.bloodDonations && currentUser.bloodDonations.length > 0
            ? currentUser.bloodDonations[currentUser.bloodDonations.length - 1]
            : null;
        
        // Get user's health details
        const healthDetails = currentUser.healthDetails || {
            weight: '',
            height: '',
            isDiabetic: false,
            hasHeartDisease: false,
            hasHypertension: false,
            hasCancer: false,
            hasHIV: false,
            hasHepatitis: false,
            isSmoker: false,
            alcoholConsumption: 'none',
            allergies: [],
            medications: []
        };
        
        this.setState({
            currentUser,
            userRequests,
            allRequests,
            bloodBank,
            lastDonation,
            healthDetails
        });
        
        // Check eligibility
        if (currentUser.bloodType) {
            const eligibility = Store.checkDonorEligibility(currentUser.id);
            this.setState({
                eligibilityMessage: {
                    type: eligibility.eligible ? 'success' : 'error',
                    message: eligibility.reasons[0]
                }
            });
        } else {
            this.setState({
                eligibilityMessage: {
                    type: 'error',
                    message: 'Please set your blood type before donating.'
                }
            });
        }
    }

    template() {
        const { currentUser, bloodBank, userRequests, allRequests, activeTab, message, messageType, eligibilityMessage, healthDetails } = this.state;
        
        return `
            <div class="blood-donation-page">
                <header class="page-header">
                    <h1>MediVarta - Blood Donation Center</h1>
                    <div class="header-actions">
                        <button id="medicine-stock-btn" class="btn btn-primary">Medicine Stock</button>
                        <button id="reminder-btn" class="btn btn-primary">Reminders</button>
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

                <div class="tabs">
                    <button class="tab-btn ${activeTab === 'donate' ? 'active' : ''}" data-tab="donate">Donate Blood</button>
                    <button class="tab-btn ${activeTab === 'request' ? 'active' : ''}" data-tab="request">Request Blood</button>
                    <button class="tab-btn ${activeTab === 'status' ? 'active' : ''}" data-tab="status">Blood Bank Status</button>
                    ${currentUser.role === 'doctor' ? `
                        <button class="tab-btn ${activeTab === 'process' ? 'active' : ''}" data-tab="process">Process Requests</button>
                    ` : ''}
                </div>

                <div class="tab-content">
                    <!-- Donate Blood Tab -->
                    <div class="tab-pane ${activeTab === 'donate' ? 'active' : ''}" id="donate-tab">
                        ${eligibilityMessage ? `
                            <div class="eligibility-status ${eligibilityMessage.type}">
                                ${eligibilityMessage.message}
                            </div>
                        ` : ''}

                        ${!currentUser.bloodType ? `
                            <div class="blood-type-section">
                                <h3>Set Your Blood Type</h3>
                                <p>Please set your blood type before donating.</p>
                                <button id="edit-blood-type-btn" class="btn btn-primary">Set Blood Type</button>
                            </div>
                        ` : `
                            <div class="blood-type-section">
                                <h3>Your Blood Type: ${currentUser.bloodType}</h3>
                                <button id="edit-blood-type-btn" class="btn btn-secondary">Edit Blood Type</button>
                            </div>
                        `}

                        <div class="health-details-section">
                            <h3>Health Details</h3>
                            <form id="health-details-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="weight">Weight (kg):</label>
                                        <input type="number" id="weight" value="${healthDetails.weight}" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="height">Height (cm):</label>
                                        <input type="number" id="height" value="${healthDetails.height}" required>
                                    </div>
                                </div>

                                <div class="checkbox-group">
                                    <label>
                                        <input type="checkbox" id="isDiabetic" ${healthDetails.isDiabetic ? 'checked' : ''}>
                                        Diabetic
                                    </label>
                                    <label>
                                        <input type="checkbox" id="hasHeartDisease" ${healthDetails.hasHeartDisease ? 'checked' : ''}>
                                        Heart Disease
                                    </label>
                                    <label>
                                        <input type="checkbox" id="hasHypertension" ${healthDetails.hasHypertension ? 'checked' : ''}>
                                        Hypertension
                                    </label>
                                    <label>
                                        <input type="checkbox" id="hasCancer" ${healthDetails.hasCancer ? 'checked' : ''}>
                                        Cancer
                                    </label>
                                    <label>
                                        <input type="checkbox" id="hasHIV" ${healthDetails.hasHIV ? 'checked' : ''}>
                                        HIV
                                    </label>
                                    <label>
                                        <input type="checkbox" id="hasHepatitis" ${healthDetails.hasHepatitis ? 'checked' : ''}>
                                        Hepatitis
                                    </label>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="isSmoker">Smoking Status:</label>
                                        <select id="isSmoker">
                                            <option value="false" ${!healthDetails.isSmoker ? 'selected' : ''}>Non-smoker</option>
                                            <option value="true" ${healthDetails.isSmoker ? 'selected' : ''}>Smoker</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="alcoholConsumption">Alcohol Consumption:</label>
                                        <select id="alcoholConsumption">
                                            <option value="none" ${healthDetails.alcoholConsumption === 'none' ? 'selected' : ''}>None</option>
                                            <option value="occasional" ${healthDetails.alcoholConsumption === 'occasional' ? 'selected' : ''}>Occasional</option>
                                            <option value="moderate" ${healthDetails.alcoholConsumption === 'moderate' ? 'selected' : ''}>Moderate</option>
                                            <option value="heavy" ${healthDetails.alcoholConsumption === 'heavy' ? 'selected' : ''}>Heavy</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="allergies">Allergies (comma-separated):</label>
                                    <input type="text" id="allergies" value="${healthDetails.allergies.join(', ')}">
                                </div>
                                <div class="form-group">
                                    <label for="medications">Current Medications (comma-separated):</label>
                                    <input type="text" id="medications" value="${healthDetails.medications.join(', ')}">
                                </div>

                                <button type="submit" class="btn btn-primary">Update Health Details</button>
                            </form>
                        </div>

                        ${eligibilityMessage.type === 'success' ? `
                            <div class="donate-section">
                                <button id="donate-blood-btn" class="btn btn-primary">Donate Blood Now</button>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Request Blood Tab -->
                    <div class="tab-pane ${activeTab === 'request' ? 'active' : ''}" id="request-tab">
                        <div class="request-form">
                            <h3>Request Blood</h3>
                            <form id="request-blood-form">
                                <div class="form-group">
                                    <label for="request-blood-type">Blood Type:</label>
                                    <select id="request-blood-type" required>
                                        <option value="">Select Blood Type</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="request-units">Units:</label>
                                    <input type="number" id="request-units" min="1" value="1" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Submit Request</button>
                            </form>
                        </div>

                        <div class="your-requests">
                            <h3>Your Requests</h3>
                            ${userRequests.length > 0 ? `
                                <div class="requests-list">
                                    ${userRequests.map(request => `
                                        <div class="request-card ${request.status}">
                                            <div class="request-info">
                                                <span>Blood Type: ${request.bloodType}</span>
                                                <span>Units: ${request.units}</span>
                                                <span>Status: ${request.status}</span>
                                                <span>Date: ${new Date(request.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : '<p>No requests found</p>'}
                        </div>
                    </div>

                    <!-- Blood Bank Status Tab -->
                    <div class="tab-pane ${activeTab === 'status' ? 'active' : ''}" id="status-tab">
                        <div class="blood-bank-status">
                            <h3>Available Blood Units</h3>
                            <div class="blood-types-grid">
                                ${Object.entries(bloodBank).map(([type, units]) => `
                                    <div class="blood-type-card">
                                        <h4>${type}</h4>
                                        <span class="units">${units} units</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    ${currentUser.role === 'doctor' ? `
                        <!-- Process Requests Tab (Doctors Only) -->
                        <div class="tab-pane ${activeTab === 'process' ? 'active' : ''}" id="process-tab">
                            <div class="pending-requests">
                                <h3>Pending Requests</h3>
                                ${allRequests.filter(r => r.status === 'pending').length > 0 ? `
                                    <div class="requests-list">
                                        ${allRequests.filter(r => r.status === 'pending').map(request => `
                                            <div class="request-card pending">
                                                <div class="request-info">
                                                    <span>Patient ID: ${request.userId}</span>
                                                    <span>Blood Type: ${request.bloodType}</span>
                                                    <span>Units: ${request.units}</span>
                                                    <span>Credit Points: ${request.creditPoints}</span>
                                                    <span>Date: ${new Date(request.date).toLocaleDateString()}</span>
                                                </div>
                                                <div class="request-actions">
                                                    <button class="btn btn-success approve-request" data-request-id="${request.id}">Approve</button>
                                                    <button class="btn btn-danger reject-request" data-request-id="${request.id}">Reject</button>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : '<p>No pending requests</p>'}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- Blood Type Modal -->
            <div id="blood-type-modal" class="modal hidden">
                <div class="modal-content">
                    <h2>Set Blood Type</h2>
                    <div class="form-group">
                        <label for="blood-type">Select Blood Type:</label>
                        <select id="blood-type" required>
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button id="save-blood-type-btn" class="btn btn-primary">Save</button>
                        <button id="cancel-blood-type-btn" class="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            </div>
        `;
    }

    afterRender() {
        // Medicine Stock button handler
        const medicineStockBtn = document.getElementById('medicine-stock-btn');
        if (medicineStockBtn) {
            medicineStockBtn.addEventListener('click', () => {
                this.navigate('MedicineStock');
            });
        }
        
        // Reminder button handler
        const reminderBtn = document.getElementById('reminder-btn');
        if (reminderBtn) {
            reminderBtn.addEventListener('click', () => {
                this.navigate('Reminders');
            });
        }
        
        // Back button handler
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                const currentUser = Store.getCurrentUser();
                if (currentUser) {
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
                    this.navigate('Login');
                }
            });
        }
        
        // Logout button handler
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Store.logout();
                this.navigate('Login');
            });
        }
        
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.getAttribute('data-tab');
                this.setState({ activeTab: tab });
            });
        });
        
        // Donate blood button
        const donateBloodBtn = document.getElementById('donate-blood-btn');
        if (donateBloodBtn) {
            donateBloodBtn.addEventListener('click', () => {
                this.donateBlood();
            });
        }
        
        // Health details form
        const healthDetailsForm = document.getElementById('health-details-form');
        if (healthDetailsForm) {
            healthDetailsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateHealthDetails();
            });
        }
        
        // Blood type modal
        const editBloodTypeBtn = document.getElementById('edit-blood-type-btn');
        const modal = document.getElementById('blood-type-modal');
        const saveBloodTypeBtn = document.getElementById('save-blood-type-btn');
        const cancelBloodTypeBtn = document.getElementById('cancel-blood-type-btn');
        
        if (editBloodTypeBtn && modal) {
            // Show modal
            editBloodTypeBtn.addEventListener('click', () => {
                modal.classList.remove('hidden');
                // Pre-select current blood type if available
                const bloodTypeSelect = document.getElementById('blood-type');
                if (bloodTypeSelect && this.state.currentUser.bloodType) {
                    bloodTypeSelect.value = this.state.currentUser.bloodType;
                }
            });
            
            // Save blood type
            if (saveBloodTypeBtn) {
                saveBloodTypeBtn.addEventListener('click', () => {
                    this.updateBloodType();
                });
            }
            
            // Cancel/close modal
            if (cancelBloodTypeBtn) {
                cancelBloodTypeBtn.addEventListener('click', () => {
                    modal.classList.add('hidden');
                });
            }
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
        
        // Request blood form
        const requestBloodForm = document.getElementById('request-blood-form');
        if (requestBloodForm) {
            requestBloodForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.requestBlood();
            });
        }
        
        // Doctor's request processing buttons
        if (this.state.currentUser.role === 'doctor') {
            document.querySelectorAll('.approve-request').forEach(button => {
                button.addEventListener('click', () => {
                    const requestId = button.getAttribute('data-request-id');
                    this.approveRequest(requestId);
                });
            });
            
            document.querySelectorAll('.reject-request').forEach(button => {
                button.addEventListener('click', () => {
                    const requestId = button.getAttribute('data-request-id');
                    this.rejectRequest(requestId);
                });
            });
        }
        
        // Dismiss alert button
        const dismissBtn = document.querySelector('.dismiss-btn');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                this.setState({ message: '', messageType: 'info' });
            });
        }
    }

    donateBlood() {
        const result = Store.donateBlood(this.state.currentUser.id);
        
        if (result.success) {
            this.setState({
                message: 'Blood donation successful! Thank you for your donation.',
                messageType: 'success'
            });
            
            // Reload user data to update credit points and donation history
            this.loadUserData();
        } else {
            this.setState({
                message: result.message || 'Failed to donate blood.',
                messageType: 'error'
            });
        }
    }

    requestBlood() {
        const bloodType = document.getElementById('request-blood-type').value;
        const units = parseInt(document.getElementById('request-units').value);
        
        if (!bloodType) {
            this.setState({
                message: 'Please select a blood type.',
                messageType: 'error'
            });
            return;
        }
        
        if (!units || units < 1) {
            this.setState({
                message: 'Please enter a valid number of units.',
                messageType: 'error'
            });
            return;
        }
        
        const result = Store.requestBlood(this.state.currentUser.id, bloodType, units);
        
        if (result.success) {
            this.setState({
                message: 'Blood request submitted successfully.',
                messageType: 'success'
            });
            
            // Reload user data to update requests
            this.loadUserData();
        } else {
            this.setState({
                message: result.message || 'Failed to submit blood request.',
                messageType: 'error'
            });
        }
    }

    processRequests() {
        const results = Store.processBloodRequests();
        
        if (results.length > 0) {
            const approvedCount = results.filter(r => r.status === 'approved').length;
            const pendingCount = results.filter(r => r.status === 'pending').length;
            
            this.setState({
                message: `Processed ${results.length} requests: ${approvedCount} approved, ${pendingCount} still pending.`,
                messageType: 'success'
            });
            
            // Reload data
            this.loadUserData();
        } else {
            this.setState({
                message: 'No pending requests to process.',
                messageType: 'info'
            });
        }
    }

    updateHealthDetails() {
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const isDiabetic = document.getElementById('isDiabetic').checked;
        const hasHeartDisease = document.getElementById('hasHeartDisease').checked;
        const hasHypertension = document.getElementById('hasHypertension').checked;
        const hasCancer = document.getElementById('hasCancer').checked;
        const hasHIV = document.getElementById('hasHIV').checked;
        const hasHepatitis = document.getElementById('hasHepatitis').checked;
        const isSmoker = document.getElementById('isSmoker').value === 'true';
        const alcoholConsumption = document.getElementById('alcoholConsumption').value;
        const allergies = document.getElementById('allergies').value.split(',').map(a => a.trim()).filter(a => a);
        const medications = document.getElementById('medications').value.split(',').map(m => m.trim()).filter(m => m);
        
        const healthDetails = {
            weight,
            height,
            isDiabetic,
            hasHeartDisease,
            hasHypertension,
            hasCancer,
            hasHIV,
            hasHepatitis,
            isSmoker,
            alcoholConsumption,
            allergies,
            medications,
            lastUpdated: new Date().toISOString()
        };
        
        const result = Store.updateHealthDetails(this.state.currentUser.id, healthDetails);
        
        if (result) {
            this.setState({
                message: 'Health details updated successfully.',
                messageType: 'success',
                healthDetails
            });
            
            // Check eligibility after updating health details
            this.checkDonorEligibility();
        } else {
            this.setState({
                message: 'Failed to update health details.',
                messageType: 'error'
            });
        }
    }

    checkDonorEligibility() {
        const result = Store.checkDonorEligibility(this.state.currentUser.id);
        
        this.setState({
            eligibilityMessage: {
                type: result.eligible ? 'success' : 'error',
                message: result.reasons[0]
            }
        });
    }

    updateBloodType() {
        const bloodType = document.getElementById('blood-type').value;
        
        if (!bloodType) {
            this.setState({
                message: 'Please select a blood type.',
                messageType: 'error'
            });
            return;
        }
        
        const result = Store.updateBloodType(this.state.currentUser.id, bloodType);
        
        if (result.success) {
            this.setState({
                message: 'Blood type updated successfully.',
                messageType: 'success'
            });
            
            // Hide modal
            const modal = document.getElementById('blood-type-modal');
            if (modal) {
                modal.classList.add('hidden');
            }
            
            // Reload user data
            this.loadUserData();
        } else {
            this.setState({
                message: result.message || 'Failed to update blood type.',
                messageType: 'error'
            });
        }
    }

    approveRequest(requestId) {
        const result = Store.approveBloodRequest(parseInt(requestId));
        
        if (result.success) {
            this.setState({
                message: 'Blood request approved successfully.',
                messageType: 'success'
            });
            
            // Reload data
            this.loadUserData();
        } else {
            this.setState({
                message: result.message || 'Failed to approve request.',
                messageType: 'error'
            });
        }
    }

    rejectRequest(requestId) {
        const result = Store.rejectBloodRequest(parseInt(requestId));
        
        if (result.success) {
            this.setState({
                message: 'Blood request rejected.',
                messageType: 'success'
            });
            
            // Reload data
            this.loadUserData();
        } else {
            this.setState({
                message: result.message || 'Failed to reject request.',
                messageType: 'error'
            });
        }
    }

    // Add method to get compatible blood types
    getCompatibleBloodTypes(bloodType) {
        const compatibility = {
            'A+': ['A+', 'A-', 'O+', 'O-'],
            'A-': ['A-', 'O-'],
            'B+': ['B+', 'B-', 'O+', 'O-'],
            'B-': ['B-', 'O-'],
            'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            'AB-': ['A-', 'B-', 'AB-', 'O-'],
            'O+': ['O+', 'O-'],
            'O-': ['O-']
        };
        
        return bloodType && compatibility[bloodType] ? compatibility[bloodType] : [];
    }
} 