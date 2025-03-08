class ConsultationSection extends Component {
    constructor(props) {
        super(props);
    }

    template() {
        return `
            <section class="consultation-section">
                <h2>Consult top doctors online for any health concern</h2>
                <p>Private online consultations with verified doctors in all specialties</p>
                
                <div class="consultation-grid">
                    <div class="consultation-card">
                        <div class="icon">👩‍⚕️</div>
                        <h3>Period Issues or Pregnancy</h3>
                        <button class="consult-now-btn">CONSULT NOW</button>
                    </div>

                    <div class="consultation-card">
                        <div class="icon">🧴</div>
                        <h3>Acne, pimple or skin issues</h3>
                        <button class="consult-now-btn">CONSULT NOW</button>
                    </div>

                    <div class="consultation-card emergency">
                        <div class="icon">💔</div>
                        <h3>Cardiac Arrest</h3>
                        <button class="consult-now-btn">EMERGENCY CONSULT</button>
                    </div>

                    <div class="consultation-card">
                        <div class="icon">🤒</div>
                        <h3>Cold, cough or fever</h3>
                        <button class="consult-now-btn">CONSULT NOW</button>
                    </div>

                    <div class="consultation-card">
                        <div class="icon">👶</div>
                        <h3>Child not feeling well</h3>
                        <button class="consult-now-btn">CONSULT NOW</button>
                    </div>

                    <div class="consultation-card">
                        <div class="icon">🧠</div>
                        <h3>Depression or anxiety</h3>
                        <button class="consult-now-btn">CONSULT NOW</button>
                    </div>
                </div>
            </section>
        `;
    }

    afterRender() {
        // Add event listeners for consultation buttons
        document.querySelectorAll('.consult-now-btn').forEach(button => {
            button.addEventListener('click', () => {
                const consultationType = button.parentElement.querySelector('h3').textContent;
                this.handleConsultation(consultationType);
            });
        });
    }

    handleConsultation(type) {
        if (type === 'Cardiac Arrest') {
            // Handle emergency consultation
            this.navigate('EmergencyConsult');
        } else {
            // Handle regular consultation
            this.navigate('Consultation', { type });
        }
    }
} 