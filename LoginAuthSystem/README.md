# FlowAuth — Login Authentication System

FlowAuth is a premium, secure, and fully responsive user authentication interface designed with modern glassmorphism aesthetics. It incorporates user registration (sign up), credentials validation (sign in), session protection (route guarding), and local account storage.

---

## 🌟 Features

- **User Registration (Sign Up)**:
  - Form validation for fields (Name length, Email structure).
  - Real-time password strength indicator (checks for length, capitals, numbers, and special characters).
  - Confirm password field check.
  - Prevents duplicate registration of the same email.
- **User Login (Sign In)**:
  - Validates formatting before submit.
  - Show/Hide password toggle option.
  - Authenticates credentials against registered users stored in browser storage.
  - Features visual "shake" feedback on validation failures.
- **Protected Space Dashboard**:
  - Restricts access so only authenticated users with valid tokens can view it.
  - Greeting adapts dynamically depending on the hour of the day (Morning, Afternoon, Evening).
  - Automatically generates profile avatars based on user name initials.
  - Displays user profile data, session metrics, and live security activity logs.
- **Route Guards**:
  - Immediately redirects unauthenticated users trying to reach `dashboard.html` back to the login screen.
  - Instantly redirects logged-in users visiting the login/registration pages to the dashboard panel.
- **State Persistence**:
  - Stored entirely client-side using `localStorage` for registered user records and active session persistence.

---

## 🛠️ Technologies Used

- **HTML5**: Structured semantic layout, navigation, dynamic head-level guard scripts.
- **CSS3**: Variables, flexbox, custom forms, keyframe animations, glassmorphism overlays.
- **JavaScript (Vanilla)**: LocalStorage manipulation, state checkers, time analysis, route guards.
- **FontAwesome**: High-definition icons for input fields and navigation widgets.

---

## 📂 Folder Structure

```
LoginAuthSystem/
├── index.html       # Sign In page (Default redirection landing)
├── signup.html      # Create Account page with password strength bar
├── dashboard.html   # Logged-in page displaying profile details and logs
├── style.css        # Central stylesheet supporting glass effects and animations
├── script.js        # Auth engine dealing with accounts, validation, and sessions
└── README.md        # Technical project documentation
```

---

## 🚀 How to Run the Project

1. **Locate the files** on your computer.
2. **Double-click** the `index.html` file to open the Sign In panel in any browser.
3. Use the page interface to register a new user, sign in with your credentials, browse the dashboard, and log out securely.

---

## 👤 Author

- **Abhishek Singh**
- *Oasis Infobyte Web Development & Designing Internship (Level 2 Task 4)*
