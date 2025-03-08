// MedicineReminder component
class MedicineReminder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: Store.getCurrentUser(),
            medicines: [],
            selectedMedicineId: '',
            time: '',
            days: {
                Monday: false,
                Tuesday: false,
                Wednesday: false,
                Thursday: false,
                Friday: false,
                Saturday: false,
                Sunday: false
            },
            error: ''
        };
        
        // Load medicines
        this.loadMedicines();
    }

    loadMedicines() {
        const currentUser = Store.getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'patient') {
            this.navigate('Login');
            return;
        }
        
        const medicines = Store.getPatientMedicines(currentUser.id);
        
        this.setState({
            currentUser,
            medicines,
            selectedMedicineId: medicines.length > 0 ? medicines[0].id : ''
        });
    }

    template() {
        const { medicines, selectedMedicineId, time, days, error } = this.state;
        
        // Create navbar but only use its template
        const navbarTemplate = new Navbar({ showBackButton: true }).template();
        
        return `
            ${navbarTemplate}
            <div class="container mx-auto p-4 page-transition">
                <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-semibold mb-6">Set Medicine Reminder</h2>
                    
                    ${error ? `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">${error}</div>` : ''}
                    
                    ${medicines.length > 0 ? `
                        <form id="reminder-form" class="space-y-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="medicine">
                                    Medicine
                                </label>
                                <select 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    id="medicine"
                                    required
                                >
                                    ${medicines.map(medicine => `
                                        <option value="${medicine.id}" ${medicine.id === selectedMedicineId ? 'selected' : ''}>
                                            ${medicine.name} (${medicine.dosage})
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="time">
                                    Time
                                </label>
                                <input 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    id="time" 
                                    type="time" 
                                    value="${time}"
                                    required
                                >
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">
                                    Days
                                </label>
                                <div class="grid grid-cols-7 gap-2">
                                    ${Object.keys(days).map(day => `
                                        <div class="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                id="${day.toLowerCase()}" 
                                                class="day-checkbox mr-2"
                                                ${days[day] ? 'checked' : ''}
                                            >
                                            <label for="${day.toLowerCase()}" class="text-sm">${day.substring(0, 3)}</label>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="flex items-center justify-between pt-4">
                                <button 
                                    class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                    type="submit"
                                >
                                    Set Reminder
                                </button>
                                <button 
                                    id="cancel-btn"
                                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                    type="button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ` : `
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-pills text-4xl mb-2"></i>
                            <p>No medicines added yet. Please add a medicine first.</p>
                            <button 
                                id="add-medicine-btn"
                                class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                type="button"
                            >
                                Add Medicine
                            </button>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    afterRender() {
        // Set up the navbar event listeners
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                // Use the goBack method from the Component class
                if (!this.goBack()) {
                    // If there's no history, navigate to the appropriate dashboard
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
                }
            });
        }
        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Store.logout();
                this.navigate('Login');
            });
        }
        
        if (this.state.medicines.length > 0) {
            // Add event listeners for form
            document.getElementById('reminder-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSetReminder();
            });
            
            document.getElementById('cancel-btn').addEventListener('click', () => {
                this.navigate('PatientDashboard');
            });
            
            // Add input event listeners
            document.getElementById('medicine').addEventListener('change', (e) => {
                this.setState({ selectedMedicineId: parseInt(e.target.value) });
            });
            
            document.getElementById('time').addEventListener('input', (e) => {
                this.setState({ time: e.target.value });
            });
            
            // Add checkbox event listeners
            const dayCheckboxes = document.querySelectorAll('.day-checkbox');
            dayCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const day = e.target.id.charAt(0).toUpperCase() + e.target.id.slice(1);
                    const newDays = { ...this.state.days };
                    newDays[day] = e.target.checked;
                    this.setState({ days: newDays });
                });
            });
        } else {
            // Add medicine button
            const addMedicineBtn = document.getElementById('add-medicine-btn');
            if (addMedicineBtn) {
                addMedicineBtn.addEventListener('click', () => {
                    this.navigate('MedicineForm');
                });
            }
        }
    }

    handleSetReminder() {
        const { selectedMedicineId, time, days } = this.state;
        
        // Validate inputs
        if (!selectedMedicineId || !time) {
            this.setState({ error: 'Please select a medicine and time' });
            return;
        }
        
        const selectedDays = Object.keys(days).filter(day => days[day]);
        
        if (selectedDays.length === 0) {
            this.setState({ error: 'Please select at least one day' });
            return;
        }
        
        // Add reminder
        const newReminder = Store.addReminder(selectedMedicineId, time, selectedDays);
        
        if (newReminder) {
            // Navigate back to dashboard
            this.navigate('PatientDashboard');
            
            // Show success alert
            const medicine = this.state.medicines.find(m => m.id === parseInt(selectedMedicineId));
            
            new Alert({
                message: `Reminder set for ${medicine ? medicine.name : 'medicine'} at ${time}`,
                type: 'success'
            }).mount('body');
        } else {
            this.setState({ error: 'Failed to set reminder' });
        }
    }
} 