// DoctorDashboard component
class DoctorDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: Store.getCurrentUser(),
            patients: [],
            patientMedicines: {},
            patientReminders: {}
        };
        
        // Load data
        this.loadData();
    }

    loadData() {
        const currentUser = Store.getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'doctor') {
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
        
        patients.forEach(patient => {
            patientMedicines[patient.id] = Store.getPatientMedicines(patient.id);
            patientReminders[patient.id] = Store.getPatientReminders(patient.id);
        });
        
        this.setState({
            currentUser,
            patients,
            patientMedicines,
            patientReminders
        });
    }

    template() {
        const { currentUser, patients, patientMedicines, patientReminders } = this.state;
        
        // Create navbar but only use its template
        const navbarTemplate = new Navbar({ showBackButton: false }).template();
        
        return `
            ${navbarTemplate}
            <div class="container mx-auto p-4 page-transition">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-bold">Doctor Dashboard</h1>
                    <div class="flex space-x-2">
                        <button id="blood-donation-btn" class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
                            <i class="fas fa-tint mr-2"></i>Blood Donation
                        </button>
                    </div>
                </div>
                
                ${patients.length > 0 ? `
                    <div class="grid grid-cols-1 gap-6">
                        ${patients.map(patient => {
                            const medicines = patientMedicines[patient.id] || [];
                            const reminders = patientReminders[patient.id] || [];
                            const adherenceRate = this.calculateAdherenceRate(reminders);
                            
                            return `
                                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div class="bg-purple-500 text-white p-4">
                                        <h2 class="text-xl font-semibold">${patient.username}</h2>
                                        <p class="text-sm text-purple-100">Patient</p>
                                    </div>
                                    
                                    <div class="p-4">
                                        <!-- Adherence Section -->
                                        <div class="mb-6">
                                            <h3 class="text-lg font-semibold mb-2">Medication Adherence</h3>
                                            
                                            ${reminders.length > 0 ? `
                                                <div class="bg-white border rounded-lg p-4">
                                                    <div class="flex items-center justify-between mb-2">
                                                        <span class="text-gray-700">Adherence Rate:</span>
                                                        <span class="font-bold ${this.getAdherenceColor(adherenceRate)}">${adherenceRate}%</span>
                                                    </div>
                                                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div class="h-2.5 rounded-full ${this.getAdherenceColor(adherenceRate)}" style="width: ${adherenceRate}%"></div>
                                                    </div>
                                                    <p class="text-sm text-gray-500 mt-2">Based on ${reminders.length} scheduled medication(s)</p>
                                                </div>
                                            ` : `
                                                <div class="text-center py-4 text-gray-500">
                                                    <i class="fas fa-chart-line text-2xl mb-2"></i>
                                                    <p>No medication data available yet.</p>
                                                </div>
                                            `}
                                        </div>
                                        
                                        <!-- Medicines Section -->
                                        <div class="mb-6">
                                            <h3 class="text-lg font-semibold mb-2">Current Medications</h3>
                                            
                                            ${medicines.length > 0 ? `
                                                <div class="overflow-x-auto">
                                                    <table class="min-w-full bg-white">
                                                        <thead>
                                                            <tr>
                                                                <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                                                                <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">Dosage</th>
                                                                <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">Stock</th>
                                                                <th class="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">Schedule</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            ${medicines.map(medicine => {
                                                                const medicineReminders = reminders.filter(r => r.medicineId === medicine.id);
                                                                const scheduleText = medicineReminders.length > 0 
                                                                    ? medicineReminders.map(r => r.time).join(', ')
                                                                    : 'No schedule';
                                                                
                                                                return `
                                                                    <tr>
                                                                        <td class="py-2 px-4 border-b border-gray-200">${medicine.name}</td>
                                                                        <td class="py-2 px-4 border-b border-gray-200">${medicine.dosage}</td>
                                                                        <td class="py-2 px-4 border-b border-gray-200">
                                                                            <span class="inline-flex items-center ${medicine.stock <= medicine.lowStockThreshold ? 'text-red-600' : 'text-green-600'}">
                                                                                ${medicine.stock} units
                                                                                ${medicine.stock <= medicine.lowStockThreshold ? '<i class="fas fa-exclamation-circle ml-1"></i>' : ''}
                                                                            </span>
                                                                        </td>
                                                                        <td class="py-2 px-4 border-b border-gray-200">${scheduleText}</td>
                                                                    </tr>
                                                                `;
                                                            }).join('')}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ` : `
                                                <div class="text-center py-4 text-gray-500">
                                                    <i class="fas fa-pills text-2xl mb-2"></i>
                                                    <p>No medications prescribed yet.</p>
                                                </div>
                                            `}
                                        </div>
                                        
                                        <!-- Reminders Section -->
                                        <div>
                                            <h3 class="text-lg font-semibold mb-2">Medication Schedule</h3>
                                            
                                            ${reminders.length > 0 ? `
                                                <div class="space-y-2">
                                                    ${reminders.map(reminder => {
                                                        const medicine = medicines.find(m => m.id === reminder.medicineId) || { name: 'Unknown', dosage: '' };
                                                        return `
                                                            <div class="border rounded-lg p-3 ${reminder.taken ? 'bg-green-50' : 'bg-gray-50'}">
                                                                <div class="flex justify-between">
                                                                    <h4 class="font-semibold">${medicine.name}</h4>
                                                                    <span class="text-sm ${reminder.taken ? 'text-green-600' : 'text-gray-600'}">
                                                                        ${reminder.taken ? '<i class="fas fa-check-circle"></i> Taken' : '<i class="fas fa-clock"></i> Scheduled'}
                                                                    </span>
                                                                </div>
                                                                <p class="text-sm text-gray-600">${medicine.dosage}</p>
                                                                <div class="mt-1">
                                                                    <span class="text-sm bg-gray-100 px-2 py-1 rounded">
                                                                        <i class="fas fa-clock mr-1"></i>${reminder.time}
                                                                    </span>
                                                                    <span class="text-xs text-gray-500 ml-2">
                                                                        ${reminder.days.join(', ')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        `;
                                                    }).join('')}
                                                </div>
                                            ` : `
                                                <div class="text-center py-4 text-gray-500">
                                                    <i class="fas fa-calendar-alt text-2xl mb-2"></i>
                                                    <p>No medication schedule set yet.</p>
                                                </div>
                                            `}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : `
                    <div class="bg-white rounded-lg shadow-md p-8 text-center">
                        <i class="fas fa-user-md text-4xl text-gray-400 mb-4"></i>
                        <h2 class="text-xl font-semibold mb-2">No Patients Assigned</h2>
                        <p class="text-gray-600 mb-4">You don't have any patients assigned to your care yet.</p>
                    </div>
                `}
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
    }

    calculateAdherenceRate(reminders) {
        if (reminders.length === 0) return 0;
        
        const takenCount = reminders.filter(r => r.taken).length;
        return Math.round((takenCount / reminders.length) * 100);
    }

    getAdherenceColor(rate) {
        if (rate >= 80) return 'bg-green-500 text-green-500';
        if (rate >= 50) return 'bg-yellow-500 text-yellow-500';
        return 'bg-red-500 text-red-500';
    }
} 