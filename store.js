// Simple data store using localStorage
const Store = {
    // Initial data structure
    initialData: {
        users: [
            {
                id: 1,
                username: 'patient1',
                password: 'password',
                role: 'patient',
                caretakers: [2],
                patients: [],
                doctor: 3,
                bloodType: 'O+',
                creditPoints: 0,
                bloodDonations: [],
                healthDetails: {
                    weight: 70, // in kg
                    height: 175, // in cm
                    isDiabetic: false,
                    hasHeartDisease: false,
                    hasHypertension: false,
                    hasCancer: false,
                    hasHIV: false,
                    hasHepatitis: false,
                    isSmoker: false,
                    alcoholConsumption: 'none', // none, occasional, moderate, heavy
                    allergies: [],
                    medications: [],
                    lastUpdated: '2023-01-01T00:00:00.000Z'
                }
            },
            {
                id: 2,
                username: 'caretaker1',
                password: 'password',
                role: 'caretaker',
                patients: [1],
                caretakers: [],
                bloodType: 'A+',
                creditPoints: 0,
                bloodDonations: [],
                healthDetails: {
                    weight: 65,
                    height: 170,
                    isDiabetic: false,
                    hasHeartDisease: false,
                    hasHypertension: false,
                    hasCancer: false,
                    hasHIV: false,
                    hasHepatitis: false,
                    isSmoker: false,
                    alcoholConsumption: 'none',
                    allergies: [],
                    medications: [],
                    lastUpdated: '2023-01-01T00:00:00.000Z'
                }
            },
            {
                id: 3,
                username: 'doctor1',
                password: 'password',
                role: 'doctor',
                patients: [1],
                caretakers: [],
                bloodType: 'B+',
                creditPoints: 0,
                bloodDonations: [],
                healthDetails: {
                    weight: 75,
                    height: 180,
                    isDiabetic: false,
                    hasHeartDisease: false,
                    hasHypertension: false,
                    hasCancer: false,
                    hasHIV: false,
                    hasHepatitis: false,
                    isSmoker: false,
                    alcoholConsumption: 'none',
                    allergies: [],
                    medications: [],
                    lastUpdated: '2023-01-01T00:00:00.000Z'
                }
            }
        ],
        medicines: [
            {
                id: 1,
                name: 'Paracetamol',
                dosage: '500mg',
                stock: 10,
                lowStockThreshold: 5,
                patientId: 1
            }
        ],
        reminders: [
            {
                id: 1,
                medicineId: 1,
                time: '08:00',
                days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                taken: false,
                patientId: 1
            }
        ],
        medicalHistory: [
            {
                id: 1,
                patientId: 1,
                doctorId: 3,
                date: '2023-01-15T10:30:00.000Z',
                diagnosis: 'Common Cold',
                symptoms: 'Fever, Cough, Runny Nose',
                notes: 'Patient advised to rest and stay hydrated.',
                attachments: []
            }
        ],
        prescriptions: [
            {
                id: 1,
                patientId: 1,
                doctorId: 3,
                date: '2023-01-15T10:30:00.000Z',
                medicines: [
                    {
                        name: 'Paracetamol',
                        dosage: '500mg',
                        frequency: 'Every 6 hours',
                        duration: '3 days'
                    },
                    {
                        name: 'Vitamin C',
                        dosage: '1000mg',
                        frequency: 'Once daily',
                        duration: '7 days'
                    }
                ],
                instructions: 'Take with food. Complete the full course.',
                active: true
            }
        ],
        bloodBank: {
            'A+': 5,
            'A-': 3,
            'B+': 4,
            'B-': 2,
            'AB+': 2,
            'AB-': 1,
            'O+': 6,
            'O-': 3
        },
        bloodRequests: [],
        donorEligibility: {
            minAge: 18,
            maxAge: 65,
            minWeight: 50, // in kg
            minHemoglobin: 12.5, // in g/dL
            minTimeBetweenDonations: 90, // in days
            disqualifyingConditions: [
                'isDiabetic',
                'hasHeartDisease',
                'hasCancer',
                'hasHIV',
                'hasHepatitis'
            ]
        },
        currentUser: null,
        appointments: [
            {
                id: 1,
                patientId: 1,
                doctorId: 3,
                requestedBy: 1, // patientId or caretakerId
                requestedByRole: 'patient',
                date: '2023-06-15T10:00:00.000Z',
                reason: 'Regular checkup',
                status: 'approved', // pending, approved, rejected, completed
                notes: '',
                createdAt: '2023-06-10T08:30:00.000Z'
            }
        ]
    },

    // Initialize store
    init() {
        if (!localStorage.getItem('mediremind')) {
            localStorage.setItem('mediremind', JSON.stringify(this.initialData));
        } else {
            // Check if existing data needs to be updated
            const data = this.getData();
            let needsUpdate = false;
            
            // Ensure all users have caretakers and patients arrays
            data.users.forEach(user => {
                if (!user.caretakers) {
                    user.caretakers = [];
                    needsUpdate = true;
                }
                if (!user.patients) {
                    user.patients = [];
                    needsUpdate = true;
                }
                if (user.bloodType === undefined) {
                    user.bloodType = this.getRandomBloodType();
                    needsUpdate = true;
                }
                if (user.creditPoints === undefined) {
                    user.creditPoints = 0;
                    needsUpdate = true;
                }
                if (!user.bloodDonations) {
                    user.bloodDonations = [];
                    needsUpdate = true;
                }
                if (!user.healthDetails) {
                    user.healthDetails = {
                        weight: 70,
                        height: 175,
                        isDiabetic: false,
                        hasHeartDisease: false,
                        hasHypertension: false,
                        hasCancer: false,
                        hasHIV: false,
                        hasHepatitis: false,
                        isSmoker: false,
                        alcoholConsumption: 'none',
                        allergies: [],
                        medications: [],
                        lastUpdated: new Date().toISOString()
                    };
                    needsUpdate = true;
                }
            });
            
            // Ensure bloodBank exists
            if (!data.bloodBank) {
                data.bloodBank = this.initialData.bloodBank;
                needsUpdate = true;
            }
            
            // Ensure bloodRequests exists
            if (!data.bloodRequests) {
                data.bloodRequests = [];
                needsUpdate = true;
            }
            
            // Ensure medicalHistory exists
            if (!data.medicalHistory) {
                data.medicalHistory = this.initialData.medicalHistory;
                needsUpdate = true;
            }
            
            // Ensure prescriptions exists
            if (!data.prescriptions) {
                data.prescriptions = this.initialData.prescriptions;
                needsUpdate = true;
            }
            
            // Ensure donorEligibility exists
            if (!data.donorEligibility) {
                data.donorEligibility = this.initialData.donorEligibility;
                needsUpdate = true;
            }
            
            // Ensure appointments exists
            if (!data.appointments) {
                data.appointments = this.initialData.appointments;
            }
            
            if (needsUpdate) {
                this.saveData(data);
            }
        }
    },

    // Get random blood type (for initialization)
    getRandomBloodType() {
        const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        return bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
    },

    // Get all data
    getData() {
        return JSON.parse(localStorage.getItem('mediremind'));
    },

    // Save data
    saveData(data) {
        localStorage.setItem('mediremind', JSON.stringify(data));
    },

    // Get current user
    getCurrentUser() {
        const data = this.getData();
        if (!data.currentUser) return null;
        
        // Find the user in the users array to get the most up-to-date data
        const currentUser = data.users.find(u => u.id === data.currentUser.id);
        return currentUser || data.currentUser;
    },

    // Login user
    login(username, password) {
        const data = this.getData();
        const user = data.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Make sure user has caretakers and patients arrays
            if (!user.caretakers) user.caretakers = [];
            if (!user.patients) user.patients = [];
            if (user.bloodType === undefined) user.bloodType = this.getRandomBloodType();
            if (user.creditPoints === undefined) user.creditPoints = 0;
            if (!user.bloodDonations) user.bloodDonations = [];
            if (!user.healthDetails) {
                user.healthDetails = {
                    weight: 70,
                    height: 175,
                    isDiabetic: false,
                    hasHeartDisease: false,
                    hasHypertension: false,
                    hasCancer: false,
                    hasHIV: false,
                    hasHepatitis: false,
                    isSmoker: false,
                    alcoholConsumption: 'none',
                    allergies: [],
                    medications: [],
                    lastUpdated: new Date().toISOString()
                };
            }
            
            data.currentUser = user;
            this.saveData(data);
            return user;
        }
        
        return null;
    },

    // Logout user
    logout() {
        const data = this.getData();
        data.currentUser = null;
        this.saveData(data);
    },

    // Register user
    register(username, password, role) {
        const data = this.getData();
        const newId = data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1;
        
        const newUser = {
            id: newId,
            username,
            password,
            role,
            caretakers: [],
            patients: [],
            doctor: null,
            bloodType: this.getRandomBloodType(),
            creditPoints: 0,
            bloodDonations: [],
            healthDetails: {
                weight: 70,
                height: 175,
                isDiabetic: false,
                hasHeartDisease: false,
                hasHypertension: false,
                hasCancer: false,
                hasHIV: false,
                hasHepatitis: false,
                isSmoker: false,
                alcoholConsumption: 'none',
                allergies: [],
                medications: [],
                lastUpdated: new Date().toISOString()
            }
        };
        
        data.users.push(newUser);
        this.saveData(data);
        return newUser;
    },

    // Update user health details
    updateHealthDetails(userId, healthDetails) {
        const data = this.getData();
        const userIndex = data.users.findIndex(u => u.id === parseInt(userId));
        
        if (userIndex === -1) return false;
        
        // Update health details
        data.users[userIndex].healthDetails = {
            ...data.users[userIndex].healthDetails,
            ...healthDetails,
            lastUpdated: new Date().toISOString()
        };
        
        this.saveData(data);
        return data.users[userIndex];
    },

    // Check donor eligibility
    checkDonorEligibility(userId) {
        const data = this.getData();
        const user = data.users.find(u => u.id === parseInt(userId));
        
        if (!user) return { eligible: false, reasons: ['User not found'] };
        
        const eligibility = data.donorEligibility;
        const reasons = [];
        
        // Check last donation date
        const lastDonation = user.bloodDonations.length > 0 
            ? new Date(user.bloodDonations[user.bloodDonations.length - 1].date) 
            : null;
        
        const now = new Date();
        if (lastDonation && (now - lastDonation) < (eligibility.minTimeBetweenDonations * 24 * 60 * 60 * 1000)) {
            const daysToWait = eligibility.minTimeBetweenDonations - Math.floor((now - lastDonation) / (24 * 60 * 60 * 1000));
            reasons.push(`Last donation was too recent. Please wait ${daysToWait} more days.`);
        }
        
        // Check weight
        if (user.healthDetails.weight < eligibility.minWeight) {
            reasons.push(`Weight is below minimum requirement of ${eligibility.minWeight}kg.`);
        }
        
        // Check disqualifying conditions
        eligibility.disqualifyingConditions.forEach(condition => {
            if (user.healthDetails[condition]) {
                const conditionName = condition.replace('has', '').replace('is', '');
                reasons.push(`Health condition: ${conditionName}`);
            }
        });
        
        return {
            eligible: reasons.length === 0,
            reasons: reasons.length > 0 ? reasons : ['You are eligible to donate blood.']
        };
    },

    // Add medicine
    addMedicine(name, dosage, stock, lowStockThreshold) {
        const data = this.getData();
        const currentUser = this.getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'patient') return null;
        
        const newId = data.medicines.length > 0 ? Math.max(...data.medicines.map(m => m.id)) + 1 : 1;
        
        const newMedicine = {
            id: newId,
            name,
            dosage,
            stock: parseInt(stock),
            lowStockThreshold: parseInt(lowStockThreshold),
            patientId: currentUser.id
        };
        
        data.medicines.push(newMedicine);
        this.saveData(data);
        return newMedicine;
    },

    // Update medicine stock
    updateMedicineStock(medicineId, newStock) {
        const data = this.getData();
        const medicineIndex = data.medicines.findIndex(m => m.id === parseInt(medicineId));
        
        if (medicineIndex !== -1) {
            data.medicines[medicineIndex].stock = parseInt(newStock);
            this.saveData(data);
            return data.medicines[medicineIndex];
        }
        
        return null;
    },

    // Add reminder
    addReminder(medicineId, time, days) {
        const data = this.getData();
        const currentUser = this.getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'patient') return null;
        
        const newId = data.reminders.length > 0 ? Math.max(...data.reminders.map(r => r.id)) + 1 : 1;
        
        const newReminder = {
            id: newId,
            medicineId: parseInt(medicineId),
            time,
            days,
            taken: false,
            patientId: currentUser.id
        };
        
        data.reminders.push(newReminder);
        this.saveData(data);
        return newReminder;
    },

    // Mark reminder as taken
    markReminderAsTaken(reminderId) {
        const data = this.getData();
        const reminderIndex = data.reminders.findIndex(r => r.id === parseInt(reminderId));
        
        if (reminderIndex !== -1) {
            data.reminders[reminderIndex].taken = true;
            this.saveData(data);
            return data.reminders[reminderIndex];
        }
        
        return null;
    },

    // Link caretaker to patient
    linkCaretaker(patientId, caretakerId) {
        const data = this.getData();
        const patientIndex = data.users.findIndex(u => u.id === parseInt(patientId) && u.role === 'patient');
        const caretakerIndex = data.users.findIndex(u => u.id === parseInt(caretakerId) && u.role === 'caretaker');
        
        if (patientIndex !== -1 && caretakerIndex !== -1) {
            // Initialize caretakers array if it doesn't exist
            if (!data.users[patientIndex].caretakers) {
                data.users[patientIndex].caretakers = [];
            }
            
            // Initialize patients array if it doesn't exist
            if (!data.users[caretakerIndex].patients) {
                data.users[caretakerIndex].patients = [];
            }
            
            // Add caretaker to patient's caretakers if not already there
            if (!data.users[patientIndex].caretakers.includes(parseInt(caretakerId))) {
                data.users[patientIndex].caretakers.push(parseInt(caretakerId));
            }
            
            // Add patient to caretaker's patients if not already there
            if (!data.users[caretakerIndex].patients.includes(parseInt(patientId))) {
                data.users[caretakerIndex].patients.push(parseInt(patientId));
            }
            
            this.saveData(data);
            return true;
        }
        
        return false;
    },

    // Link doctor to patient
    linkDoctor(patientId, doctorId) {
        const data = this.getData();
        const patientIndex = data.users.findIndex(u => u.id === parseInt(patientId) && u.role === 'patient');
        const doctorIndex = data.users.findIndex(u => u.id === parseInt(doctorId) && u.role === 'doctor');
        
        if (patientIndex !== -1 && doctorIndex !== -1) {
            // Set doctor for patient
            data.users[patientIndex].doctor = parseInt(doctorId);
            
            // Add patient to doctor's patients if not already there
            if (!data.users[doctorIndex].patients) {
                data.users[doctorIndex].patients = [];
            }
            
            if (!data.users[doctorIndex].patients.includes(parseInt(patientId))) {
                data.users[doctorIndex].patients.push(parseInt(patientId));
            }
            
            this.saveData(data);
            return true;
        }
        
        return false;
    },

    // Get patient's medicines
    getPatientMedicines(patientId) {
        const data = this.getData();
        return data.medicines.filter(m => m.patientId === parseInt(patientId));
    },

    // Get patient's reminders
    getPatientReminders(patientId) {
        const data = this.getData();
        return data.reminders.filter(r => r.patientId === parseInt(patientId));
    },

    // Get medicine by ID
    getMedicineById(medicineId) {
        const data = this.getData();
        return data.medicines.find(m => m.id === parseInt(medicineId));
    },

    // Get low stock medicines for patient
    getLowStockMedicines(patientId) {
        const medicines = this.getPatientMedicines(patientId);
        return medicines.filter(m => m.stock <= m.lowStockThreshold);
    },

    // Get user by ID
    getUserById(userId) {
        const data = this.getData();
        return data.users.find(u => u.id === parseInt(userId));
    },

    // Get patient's medical history
    getPatientMedicalHistory(patientId) {
        const data = this.getData();
        return data.medicalHistory.filter(h => h.patientId === parseInt(patientId));
    },

    // Get patient's prescriptions
    getPatientPrescriptions(patientId) {
        const data = this.getData();
        return data.prescriptions.filter(p => p.patientId === parseInt(patientId));
    },

    // Add medical history entry
    addMedicalHistory(patientId, diagnosis, symptoms, notes, attachments = []) {
        const data = this.getData();
        const currentUser = this.getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'doctor') return null;
        
        const newId = data.medicalHistory.length > 0 ? Math.max(...data.medicalHistory.map(h => h.id)) + 1 : 1;
        
        const newEntry = {
            id: newId,
            patientId: parseInt(patientId),
            doctorId: currentUser.id,
            date: new Date().toISOString(),
            diagnosis,
            symptoms,
            notes,
            attachments
        };
        
        data.medicalHistory.push(newEntry);
        this.saveData(data);
        return newEntry;
    },

    // Add prescription
    addPrescription(patientId, medicines, instructions) {
        const data = this.getData();
        const currentUser = this.getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'doctor') return null;
        
        const newId = data.prescriptions.length > 0 ? Math.max(...data.prescriptions.map(p => p.id)) + 1 : 1;
        
        const newPrescription = {
            id: newId,
            patientId: parseInt(patientId),
            doctorId: currentUser.id,
            date: new Date().toISOString(),
            medicines,
            instructions,
            active: true
        };
        
        data.prescriptions.push(newPrescription);
        this.saveData(data);
        return newPrescription;
    },

    // Update prescription status
    updatePrescriptionStatus(prescriptionId, active) {
        const data = this.getData();
        const prescriptionIndex = data.prescriptions.findIndex(p => p.id === parseInt(prescriptionId));
        
        if (prescriptionIndex !== -1) {
            data.prescriptions[prescriptionIndex].active = active;
            this.saveData(data);
            return data.prescriptions[prescriptionIndex];
        }
        
        return null;
    },

    // Update blood type
    updateBloodType(userId, bloodType) {
        const data = this.getData();
        const userIndex = data.users.findIndex(u => u.id === parseInt(userId));
        
        if (userIndex === -1) return { success: false, message: 'User not found' };
        
        data.users[userIndex].bloodType = bloodType;
        this.saveData(data);
        
        return { success: true };
    },

    // Donate blood
    donateBlood(userId, units = 1) {
        const data = this.getData();
        const userIndex = data.users.findIndex(u => u.id === parseInt(userId));
        
        if (userIndex === -1) return { success: false, message: 'User not found' };
        
        const user = data.users[userIndex];
        const eligibility = this.checkDonorEligibility(userId);
        
        if (!eligibility.eligible) {
            return { success: false, message: eligibility.reasons[0] };
        }
        
        // Add donation record
        const donation = {
            id: user.bloodDonations.length + 1,
            date: new Date().toISOString(),
            units: units,
            bloodType: user.bloodType
        };
        
        user.bloodDonations.push(donation);
        
        // Update blood bank
        if (!data.bloodBank) data.bloodBank = {};
        if (!data.bloodBank[user.bloodType]) data.bloodBank[user.bloodType] = 0;
        data.bloodBank[user.bloodType] += units;
        
        // Award credit points
        user.creditPoints += 10 * units;
        
        this.saveData(data);
        return { success: true };
    },

    // Request blood
    requestBlood(userId, bloodType, units = 1) {
        const data = this.getData();
        const userIndex = data.users.findIndex(u => u.id === parseInt(userId));
        
        if (userIndex === -1) return { success: false, message: 'User not found' };
        
        const user = data.users[userIndex];
        
        // Check blood bank
        if (!data.bloodBank || !data.bloodBank[bloodType] || data.bloodBank[bloodType] < units) {
            return { success: false, message: 'Requested blood type not available in sufficient quantity' };
        }
        
        // Add request
        if (!data.bloodRequests) data.bloodRequests = [];
        
        const request = {
            id: data.bloodRequests.length + 1,
            userId: userId,
            bloodType: bloodType,
            units: units,
            date: new Date().toISOString(),
            status: 'pending',
            creditPoints: user.creditPoints
        };
        
        data.bloodRequests.push(request);
        this.saveData(data);
        
        return { success: true };
    },

    // Approve blood request
    approveBloodRequest(requestId) {
        const data = this.getData();
        if (!data.bloodRequests) return { success: false, message: 'No requests found' };
        
        const requestIndex = data.bloodRequests.findIndex(r => r.id === requestId);
        if (requestIndex === -1) return { success: false, message: 'Request not found' };
        
        const request = data.bloodRequests[requestIndex];
        if (request.status !== 'pending') return { success: false, message: 'Request already processed' };
        
        // Check blood bank
        if (!data.bloodBank[request.bloodType] || data.bloodBank[request.bloodType] < request.units) {
            return { success: false, message: 'Blood not available in sufficient quantity' };
        }
        
        // Update blood bank
        data.bloodBank[request.bloodType] -= request.units;
        
        // Update request status
        request.status = 'approved';
        request.processedDate = new Date().toISOString();
        
        // Reset credit points of requester
        const userIndex = data.users.findIndex(u => u.id === request.userId);
        if (userIndex !== -1) {
            data.users[userIndex].creditPoints = 0;
        }
        
        this.saveData(data);
        return { success: true };
    },

    // Reject blood request
    rejectBloodRequest(requestId) {
        const data = this.getData();
        if (!data.bloodRequests) return { success: false, message: 'No requests found' };
        
        const requestIndex = data.bloodRequests.findIndex(r => r.id === requestId);
        if (requestIndex === -1) return { success: false, message: 'Request not found' };
        
        const request = data.bloodRequests[requestIndex];
        if (request.status !== 'pending') return { success: false, message: 'Request already processed' };
        
        // Update request status
        request.status = 'rejected';
        request.processedDate = new Date().toISOString();
        
        this.saveData(data);
        return { success: true };
    },

    // Link patient to caretaker
    linkPatient(caretakerId, patientId) {
        const data = this.getData();
        const caretakerIndex = data.users.findIndex(u => u.id === parseInt(caretakerId));
        const patientIndex = data.users.findIndex(u => u.id === parseInt(patientId));
        
        if (caretakerIndex === -1 || patientIndex === -1) {
            return { success: false, message: 'User not found' };
        }
        
        const caretaker = data.users[caretakerIndex];
        const patient = data.users[patientIndex];
        
        if (caretaker.role !== 'caretaker' || patient.role !== 'patient') {
            return { success: false, message: 'Invalid roles' };
        }
        
        if (!caretaker.patients.includes(patientId)) {
            caretaker.patients.push(patientId);
        }
        
        if (!patient.caretakers.includes(caretakerId)) {
            patient.caretakers.push(caretakerId);
        }
        
        this.saveData(data);
        return { success: true };
    },

    // Get blood bank status
    getBloodBankStatus() {
        const data = this.getData();
        return data.bloodBank;
    },

    // Get user's blood requests
    getUserBloodRequests(userId) {
        const data = this.getData();
        return data.bloodRequests.filter(r => r.userId === parseInt(userId));
    },

    // Get all blood requests (for doctor)
    getAllBloodRequests() {
        const data = this.getData();
        return data.bloodRequests;
    },

    // Reset store to initial data (for debugging)
    reset() {
        localStorage.setItem('mediremind', JSON.stringify(this.initialData));
        return this.initialData;
    },

    // Get appointments for a patient
    getPatientAppointments(patientId) {
        const data = this.getData();
        return data.appointments.filter(a => a.patientId === parseInt(patientId));
    },

    // Get appointments for a doctor
    getDoctorAppointments(doctorId) {
        const data = this.getData();
        return data.appointments.filter(a => a.doctorId === parseInt(doctorId));
    },

    // Book an appointment
    bookAppointment(patientId, doctorId, date, reason) {
        const data = this.getData();
        const currentUser = this.getCurrentUser();
        
        if (!currentUser) return { success: false, message: 'You must be logged in to book an appointment.' };
        
        // Validate if the doctor exists
        const doctor = data.users.find(u => u.id === parseInt(doctorId) && u.role === 'doctor');
        if (!doctor) return { success: false, message: 'Doctor not found.' };
        
        // Validate if the patient exists
        const patient = data.users.find(u => u.id === parseInt(patientId) && u.role === 'patient');
        if (!patient) return { success: false, message: 'Patient not found.' };
        
        // Check if current user is the patient or a caretaker of the patient
        const isPatient = currentUser.id === parseInt(patientId);
        const isCaretaker = currentUser.role === 'caretaker' && currentUser.patients.includes(parseInt(patientId));
        
        if (!isPatient && !isCaretaker) {
            return { success: false, message: 'You are not authorized to book an appointment for this patient.' };
        }
        
        // Create new appointment
        const newId = data.appointments.length > 0 ? Math.max(...data.appointments.map(a => a.id)) + 1 : 1;
        
        const newAppointment = {
            id: newId,
            patientId: parseInt(patientId),
            doctorId: parseInt(doctorId),
            requestedBy: currentUser.id,
            requestedByRole: currentUser.role,
            date: new Date(date).toISOString(),
            reason,
            status: 'pending',
            notes: '',
            createdAt: new Date().toISOString()
        };
        
        data.appointments.push(newAppointment);
        this.saveData(data);
        
        return { success: true, message: 'Appointment booked successfully. Waiting for doctor approval.', appointment: newAppointment };
    },

    // Update appointment status
    updateAppointmentStatus(appointmentId, status, notes = '') {
        const data = this.getData();
        const currentUser = this.getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'doctor') {
            return { success: false, message: 'Only doctors can update appointment status.' };
        }
        
        const appointmentIndex = data.appointments.findIndex(a => a.id === parseInt(appointmentId));
        
        if (appointmentIndex === -1) {
            return { success: false, message: 'Appointment not found.' };
        }
        
        const appointment = data.appointments[appointmentIndex];
        
        // Check if the doctor is assigned to this appointment
        if (appointment.doctorId !== currentUser.id) {
            return { success: false, message: 'You are not authorized to update this appointment.' };
        }
        
        // Update appointment
        appointment.status = status;
        if (notes) appointment.notes = notes;
        
        data.appointments[appointmentIndex] = appointment;
        this.saveData(data);
        
        return { success: true, message: `Appointment ${status} successfully.`, appointment };
    }
};

// Initialize store when script loads
Store.init(); 