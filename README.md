# MediRemind - Medicine Reminder System

A simple web application for managing medicine reminders, built with HTML, CSS (TailwindCSS), and vanilla JavaScript.

## Features

- **User Authentication & Roles**

  - Simple user login and registration (using localStorage)
  - Three user roles: Patient, Caretaker, Doctor
  - Patients can link multiple caretakers

- **Medicine Stock Monitoring & Ordering**

  - Patients can log their medicines and track stock levels
  - Low stock alerts
  - Basic mockup of medicine ordering

- **Medicine Reminders**

  - Set reminders for medicine intake
  - Browser notifications for reminders

- **Real-time Notifications**
  - Alerts when medicine reminder is due
  - Alerts to caretakers if patient misses a reminder

## How to Use

1. **Open the application**

   - Simply open the `index.html` file in a web browser

2. **Login or Register**

   - Use the demo accounts or create your own account
   - Demo accounts:
     - Patient: username: `patient1`, password: `password`
     - Caretaker: username: `caretaker1`, password: `password`
     - Doctor: username: `doctor1`, password: `password`

3. **Patient Dashboard**

   - Add medicines and set stock levels
   - Create reminders for medicine intake
   - Update stock or order more medicine when running low

4. **Caretaker Dashboard**

   - Monitor patients' medicine stock levels
   - Receive alerts when patients miss medication

5. **Doctor Dashboard**
   - Monitor patients' medication adherence
   - View patients' medicine schedules

## Technical Details

- **Data Storage**: All data is stored in the browser's localStorage
- **Component System**: Custom React-like component system for better maintainability
- **Styling**: TailwindCSS for responsive design
- **Notifications**: Browser alerts for medicine reminders

## Project Structure

```
├── index.html              # Main HTML file
├── styles.css              # Custom CSS styles
├── js/
│   ├── app.js              # Main application logic
│   ├── component.js        # Component system
│   └── store.js            # Data management
├── components/
│   ├── Auth/               # Authentication components
│   │   ├── Login.js
│   │   └── Register.js
│   ├── Dashboard/          # Dashboard components
│   │   ├── PatientDashboard.js
│   │   ├── CaretakerDashboard.js
│   │   └── DoctorDashboard.js
│   ├── Medicine/           # Medicine-related components
│   │   ├── MedicineForm.js
│   │   ├── MedicineList.js
│   │   └── MedicineReminder.js
│   └── Shared/             # Shared components
│       ├── Alert.js
│       └── Navbar.js
```

## Limitations

- This is a frontend-only application with no backend or database
- Data is stored in localStorage and will be lost if browser storage is cleared
- Notifications only work when the application is open in the browser

## Future Improvements

- Backend integration with a real database
- Mobile app version with push notifications
- More advanced reminder settings (recurring, custom frequencies)
- Integration with real pharmacies for ordering
