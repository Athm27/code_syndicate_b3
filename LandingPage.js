class LandingPage extends Component {
    constructor(props) {
        super(props);
    }

    template() {
        return `
            <div class="landing-page">
                <!-- Hero Section -->
                <section class="hero-section">
                    <div class="hero-content">
                        <div class="hero-text">
                            <span class="hero-badge">Best Healthcare Management</span>
                            <h1 class="hero-title">Your Complete Healthcare Management Solution</h1>
                            <p class="hero-subtitle">Let us help you build the healthcare management tools to provide better care management, workflow efficiency, and patient experience.</p>
                            <button class="btn btn-primary" id="get-started-btn">Get Started</button>
                            
                            <div class="stats-row">
                                <div class="stat-item">
                                    <span class="stat-number">500+</span>
                                    <span class="stat-label">Facilities</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number">100+</span>
                                    <span class="stat-label">Years</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number">24/7</span>
                                    <span class="stat-label">Support</span>
                                </div>
                            </div>
                        </div>
                        <div class="hero-image">
                            <img src="assets/doctor-patient.jpg" alt="Healthcare Professional with Patient">
                        </div>
                    </div>
                </section>

                <!-- Features Section -->
                <section class="features-section">
                    <div class="section-header">
                        <h2 class="section-title">Features</h2>
                    </div>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">📋</div>
                            <h3>Health Records</h3>
                            <p>Access to your health records and vital info.</p>
                            <a href="#" class="learn-more">Learn More →</a>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">💊</div>
                            <h3>Hospital Network</h3>
                            <p>Connect with medical experts and healthcare providers.</p>
                            <a href="#" class="learn-more">Learn More →</a>
                        </div>
                    </div>
                </section>

                <!-- Services Section -->
                <section class="services-section">
                    <div class="section-header">
                        <h2 class="section-title">Comprehensive Healthcare Solutions</h2>
                        <p class="section-subtitle">Everything you need to manage your healthcare journey.</p>
                    </div>
                    <div class="services-grid">
                        <div class="service-card">
                            <div class="service-icon">🩸</div>
                            <h3>Blood Bank</h3>
                            <p>Find and donate blood with our network.</p>
                            <ul class="service-features">
                                <li>24/7 availability</li>
                                <li>Blood type matching</li>
                                <li>Donation tracking</li>
                            </ul>
                        </div>
                        <div class="service-card">
                            <div class="service-icon">🚑</div>
                            <h3>Emergency Care</h3>
                            <p>Immediate medical attention when you need it most.</p>
                            <ul class="service-features">
                                <li>24/7 support</li>
                                <li>Quick response</li>
                                <li>Expert attention</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <!-- Testimonials Section -->
                <section class="testimonials-section">
                    <div class="section-header">
                        <h2 class="section-title">What Our Users Say</h2>
                        <p class="section-subtitle">Real experiences from our valued users</p>
                    </div>
                    <div class="testimonials-grid">
                        <div class="testimonial-card">
                            <p class="testimonial-text">"MediVarta has revolutionized how I manage my healthcare. It's incredibly easy to use!"</p>
                            <div class="testimonial-author">
                                <img src="assets/user-avatar.jpg" alt="User" class="author-avatar">
                                <div class="author-info">
                                    <h4>James Peterson</h4>
                                    <p>Patient since 2023</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Contact Section -->
                <section class="contact-section">
                    <div class="section-header">
                        <h2 class="section-title">Get in Touch</h2>
                        <p class="section-subtitle">We're here to help you 24/7</p>
                    </div>
                    <div class="contact-grid">
                        <div class="contact-info">
                            <div class="contact-item">
                                <div class="contact-icon">📞</div>
                                <div class="contact-details">
                                    <h3>Phone</h3>
                                    <p>+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div class="contact-item">
                                <div class="contact-icon">✉️</div>
                                <div class="contact-details">
                                    <h3>Email</h3>
                                    <p>support@medivarta.com</p>
                                </div>
                            </div>
                            <div class="contact-item">
                                <div class="contact-icon">📍</div>
                                <div class="contact-details">
                                    <h3>Address</h3>
                                    <p>123 Healthcare Ave, Medical District</p>
                                </div>
                            </div>
                        </div>
                        <form class="contact-form" id="contact-form">
                            <input type="text" placeholder="Full Name" required>
                            <input type="email" placeholder="Email Address" required>
                            <input type="text" placeholder="Subject" required>
                            <textarea placeholder="Message" required></textarea>
                            <button type="submit" class="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                </section>
            </div>
        `;
    }

    afterRender() {
        // Get Started Button
        const getStartedBtn = document.getElementById('get-started-btn');
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => {
                if (Store.isLoggedIn()) {
                    this.navigate('Dashboard');
                } else {
                    this.navigate('Register');
                }
            });
        }

        // Contact Form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Handle form submission
                alert('Thank you for your message. We will get back to you soon!');
                contactForm.reset();
            });
        }
    }
} 