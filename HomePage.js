// HomePage component
class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    template() {
        return `
            <div class="landing-page">
                <!-- Header/Navigation -->
                <header class="bg-white shadow-md py-4">
                    <div class="container mx-auto px-4 flex items-center justify-between">
                        <div class="flex items-center">
                            <h1 class="text-2xl font-bold text-primary">MediRemind</h1>
                        </div>
                        <div class="flex space-x-4">
                            <a href="#" id="find-doctors-link" class="text-gray-600 hover:text-primary">Find Doctors</a>
                            <a href="#" id="video-consult-link" class="text-gray-600 hover:text-primary">Video Consult</a>
                            <a href="#" id="surgeries-link" class="text-gray-600 hover:text-primary">Surgeries</a>
                        </div>
                        <div class="flex space-x-2">
                            <button id="login-btn" class="bg-white text-primary border border-primary hover:bg-primary hover:text-white px-4 py-2 rounded-md">Login</button>
                            <button id="register-btn" class="bg-primary text-white hover:bg-dark-accent px-4 py-2 rounded-md">Sign Up</button>
                        </div>
                    </div>
                </header>

                <!-- Search Section -->
                <section class="py-8">
                    <div class="container mx-auto px-4">
                        <div class="flex justify-center mb-8">
                            <div class="w-full max-w-3xl flex">
                                <div class="relative w-1/4">
                                    <input type="text" placeholder="Enter location" class="w-full border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary">
                                </div>
                                <div class="relative w-3/4">
                                    <input type="text" placeholder="Search for doctors, clinics, hospitals, etc." class="w-full border border-gray-300 border-l-0 rounded-r-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary">
                                    <button class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Services Section -->
                <section class="py-4">
                    <div class="container mx-auto px-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <!-- Instant Video Consultation -->
                            <div class="bg-white rounded-lg shadow-md overflow-hidden hover-lift">
                                <div class="p-6 flex items-center space-x-4">
                                    <div class="bg-blue-100 rounded-full p-4 w-24 h-24 flex items-center justify-center">
                                        <i class="fas fa-video text-4xl text-blue-500"></i>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-semibold mb-1">Instant Video Consultation</h3>
                                        <p class="text-sm text-gray-500">Connect within 60 secs</p>
                                    </div>
                                </div>
                                <button id="video-consult-btn" class="w-full py-3 text-center text-primary font-medium hover:bg-gray-50">CONSULT NOW</button>
                            </div>

                            <!-- Find Doctors Near You -->
                            <div class="bg-white rounded-lg shadow-md overflow-hidden hover-lift">
                                <div class="p-6 flex items-center space-x-4">
                                    <div class="bg-green-100 rounded-full p-4 w-24 h-24 flex items-center justify-center">
                                        <i class="fas fa-user-md text-4xl text-green-500"></i>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-semibold mb-1">Find Doctors Near You</h3>
                                        <p class="text-sm text-gray-500">Confirmed appointments</p>
                                    </div>
                                </div>
                                <button id="find-doctors-btn" class="w-full py-3 text-center text-primary font-medium hover:bg-gray-50">FIND NOW</button>
                            </div>

                            <!-- Surgeries -->
                            <div class="bg-white rounded-lg shadow-md overflow-hidden hover-lift">
                                <div class="p-6 flex items-center space-x-4">
                                    <div class="bg-purple-100 rounded-full p-4 w-24 h-24 flex items-center justify-center">
                                        <i class="fas fa-hospital text-4xl text-purple-500"></i>
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-semibold mb-1">Surgeries</h3>
                                        <p class="text-sm text-gray-500">Safe and trusted surgery centers</p>
                                    </div>
                                </div>
                                <button id="surgeries-btn" class="w-full py-3 text-center text-primary font-medium hover:bg-gray-50">EXPLORE</button>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Health Concerns Section -->
                <section class="py-8">
                    <div class="container mx-auto px-4">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-xl font-semibold">Consult top doctors online for any health concern</h2>
                            <a href="#" id="view-all-link" class="text-primary">View All Specialties</a>
                        </div>
                        <p class="text-gray-500 mb-6">Private online consultations with verified doctors in all specialties</p>
                        
                        <div class="grid grid-cols-2 md:grid-cols-6 gap-6">
                            <!-- Health Concern Items -->
                            <div class="text-center hover-lift">
                                <div class="bg-white rounded-full p-4 w-24 h-24 mx-auto flex items-center justify-center shadow-md mb-2">
                                    <i class="fas fa-venus text-pink-500 text-3xl"></i>
                                </div>
                                <h3 class="text-sm font-medium">Period Issues or Pregnancy</h3>
                                <button class="mt-2 text-primary text-xs">CONSULT NOW</button>
                            </div>
                            
                            <div class="text-center hover-lift">
                                <div class="bg-white rounded-full p-4 w-24 h-24 mx-auto flex items-center justify-center shadow-md mb-2">
                                    <i class="fas fa-allergies text-blue-400 text-3xl"></i>
                                </div>
                                <h3 class="text-sm font-medium">Acne, pimple or skin issues</h3>
                                <button class="mt-2 text-primary text-xs">CONSULT NOW</button>
                            </div>
                            
                            <div class="text-center hover-lift">
                                <div class="bg-white rounded-full p-4 w-24 h-24 mx-auto flex items-center justify-center shadow-md mb-2">
                                    <i class="fas fa-heartbeat text-red-400 text-3xl"></i>
                                </div>
                                <h3 class="text-sm font-medium">Performance issues in bed</h3>
                                <button class="mt-2 text-primary text-xs">CONSULT NOW</button>
                            </div>
                            
                            <div class="text-center hover-lift">
                                <div class="bg-white rounded-full p-4 w-24 h-24 mx-auto flex items-center justify-center shadow-md mb-2">
                                    <i class="fas fa-head-side-cough text-blue-500 text-3xl"></i>
                                </div>
                                <h3 class="text-sm font-medium">Cold, cough or fever</h3>
                                <button class="mt-2 text-primary text-xs">CONSULT NOW</button>
                            </div>
                            
                            <div class="text-center hover-lift">
                                <div class="bg-white rounded-full p-4 w-24 h-24 mx-auto flex items-center justify-center shadow-md mb-2">
                                    <i class="fas fa-baby text-yellow-400 text-3xl"></i>
                                </div>
                                <h3 class="text-sm font-medium">Child not feeling well</h3>
                                <button class="mt-2 text-primary text-xs">CONSULT NOW</button>
                            </div>
                            
                            <div class="text-center hover-lift">
                                <div class="bg-white rounded-full p-4 w-24 h-24 mx-auto flex items-center justify-center shadow-md mb-2">
                                    <i class="fas fa-brain text-red-500 text-3xl"></i>
                                </div>
                                <h3 class="text-sm font-medium">Depression or anxiety</h3>
                                <button class="mt-2 text-primary text-xs">CONSULT NOW</button>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Book Appointment Section -->
                <section class="py-8 bg-gray-50">
                    <div class="container mx-auto px-4">
                        <h2 class="text-xl font-semibold mb-2">Book an appointment for an in-clinic consultation</h2>
                        <p class="text-gray-500 mb-6">Find experienced doctors across all specialties</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <!-- Appointment Cards -->
                            <div class="bg-white rounded-lg shadow-md overflow-hidden hover-lift">
                                <img src="https://via.placeholder.com/300x200" alt="Dentist" class="w-full h-40 object-cover">
                                <div class="p-4">
                                    <h3 class="font-semibold mb-1">Dentist</h3>
                                    <p class="text-sm text-gray-500">Teething troubles? Schedule a dental checkup</p>
                                </div>
                            </div>
                            
                            <div class="bg-white rounded-lg shadow-md overflow-hidden hover-lift">
                                <img src="https://via.placeholder.com/300x200" alt="Gynecologist" class="w-full h-40 object-cover">
                                <div class="p-4">
                                    <h3 class="font-semibold mb-1">Gynecologist/Obstetrician</h3>
                                    <p class="text-sm text-gray-500">Explore for women's health, pregnancy and infertility treatments</p>
                                </div>
                            </div>
                            
                            <div class="bg-white rounded-lg shadow-md overflow-hidden hover-lift">
                                <img src="https://via.placeholder.com/300x200" alt="Dietitian" class="w-full h-40 object-cover">
                                <div class="p-4">
                                    <h3 class="font-semibold mb-1">Dietitian/Nutrition</h3>
                                    <p class="text-sm text-gray-500">Get guidance on eating right, weight management and sports nutrition</p>
                                </div>
                            </div>
                            
                            <div class="bg-white rounded-lg shadow-md overflow-hidden hover-lift">
                                <img src="https://via.placeholder.com/300x200" alt="Physiotherapist" class="w-full h-40 object-cover">
                                <div class="p-4">
                                    <h3 class="font-semibold mb-1">Physiotherapist</h3>
                                    <p class="text-sm text-gray-500">Pulled a muscle? Get it treated by a trained physiotherapist</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA Section -->
                <section class="py-16 bg-primary bg-opacity-5">
                    <div class="container mx-auto px-4">
                        <div class="flex flex-col md:flex-row items-center justify-between">
                            <div class="md:w-1/2 mb-8 md:mb-0">
                                <h2 class="text-2xl font-bold mb-4">Download the MediRemind app</h2>
                                <p class="text-gray-600 mb-6">Access video consultation with India's top doctors on the MediRemind app. Connect with doctors online, available 24/7, from the comfort of your home.</p>
                                
                                <div class="mb-6">
                                    <p class="mb-2 font-medium">Get the link to download the app</p>
                                    <div class="flex">
                                        <div class="relative w-12">
                                            <input type="text" value="+91" class="w-full border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary" readonly>
                                        </div>
                                        <input type="tel" placeholder="Enter phone number" class="flex-1 border border-gray-300 border-l-0 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary">
                                        <button class="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-dark-accent">Send SMS</button>
                                    </div>
                                </div>
                                
                                <div class="flex space-x-4">
                                    <a href="#" class="inline-block">
                                        <img src="https://via.placeholder.com/150x50" alt="Google Play" class="h-12">
                                    </a>
                                    <a href="#" class="inline-block">
                                        <img src="https://via.placeholder.com/150x50" alt="App Store" class="h-12">
                                    </a>
                                </div>
                            </div>
                            <div class="md:w-1/3">
                                <img src="https://via.placeholder.com/300x400" alt="MediRemind App" class="w-full rounded-lg shadow-lg">
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Footer -->
                <footer class="bg-dark py-12 text-white">
                    <div class="container mx-auto px-4">
                        <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
                            <div>
                                <h3 class="font-semibold mb-4">MediRemind</h3>
                                <ul class="space-y-2">
                                    <li><a href="#" class="text-gray-300 hover:text-white">About</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Blog</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Careers</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Press</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Contact Us</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 class="font-semibold mb-4">For patients</h3>
                                <ul class="space-y-2">
                                    <li><a href="#" class="text-gray-300 hover:text-white">Search for doctors</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Search for clinics</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Search for hospitals</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Book diagnostic tests</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Health app</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 class="font-semibold mb-4">For doctors</h3>
                                <ul class="space-y-2">
                                    <li><a href="#" class="text-gray-300 hover:text-white">Profile</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">For clinics</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Ray Tab</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">MediRemind Pro</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 class="font-semibold mb-4">For hospitals</h3>
                                <ul class="space-y-2">
                                    <li><a href="#" class="text-gray-300 hover:text-white">Insta by MediRemind</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Qikwell by MediRemind</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">MediRemind Profile</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">MediRemind Reach</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">MediRemind Drive</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 class="font-semibold mb-4">More</h3>
                                <ul class="space-y-2">
                                    <li><a href="#" class="text-gray-300 hover:text-white">Help</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Developers</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Privacy Policy</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Terms & Conditions</a></li>
                                    <li><a href="#" class="text-gray-300 hover:text-white">Healthcare Directory</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="mt-12 pt-8 border-t border-gray-700 text-center">
                            <p class="text-gray-400">© 2023 MediRemind. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        `;
    }

    afterRender() {
        // Login button
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.navigate('Login');
            });
        }
        
        // Register button
        const registerBtn = document.getElementById('register-btn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                this.navigate('Register');
            });
        }
        
        // Video consultation button
        const videoConsultBtn = document.getElementById('video-consult-btn');
        if (videoConsultBtn) {
            videoConsultBtn.addEventListener('click', () => {
                this.navigate('Login');
            });
        }
        
        // Find doctors button
        const findDoctorsBtn = document.getElementById('find-doctors-btn');
        if (findDoctorsBtn) {
            findDoctorsBtn.addEventListener('click', () => {
                this.navigate('Login');
            });
        }
        
        // All consult now buttons
        document.querySelectorAll('.text-primary.text-xs').forEach(button => {
            button.addEventListener('click', () => {
                this.navigate('Login');
            });
        });
    }
} 