# FlowAuth — Login Authentication System

FlowAuth is a premium, secure, and fully responsive user authentication interface designed with modern glassmorphism aesthetics. It incorporates user registration (sign up), traditional sign-in credentials validation, **Google OAuth Integration ("Continue with Google")**, session protection (route guarding), and local account storage.

---

## 🌟 Features

- **Google OAuth Integration ("Continue with Google")**:
  - Incorporates the official **Google Identity Services SDK**.
  - Operates automatically in a **fully simulated sandbox mode** out-of-the-box (no Google credentials setup required to test).
  - Can be easily switched to a **live Google Sign-In client** by configuring a Client ID in `script.js`.
  - Automatically registers new Google-authenticated users and extracts their profile pictures to render inside the dashboard.
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
  - Renders user Google profile pictures if authenticated with Google, or fallback initials avatar badges.
  - Displays user profile data, session metrics, and live security activity logs.
- **Route Guards**:
  - Immediately redirects unauthenticated users trying to reach `dashboard.html` back to the login screen.
  - Instantly redirects logged-in users visiting the login/registration pages to the dashboard panel.
- **State Persistence**:
  - Stored entirely client-side using `localStorage` for registered user records and active session persistence.

---

## ⚙️ Google Sign-In Configuration

By default, FlowAuth runs in **Simulated Mode** so you can test it locally. To enable real Google Sign-In:

1. Go to the **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Create a project and set up your OAuth Consent Screen.
3. Create an **OAuth Client ID** (Web Application type).
4. Add your authorized origins (e.g., `http://localhost:8000` or your host URL).
5. Open **`script.js`** and locate the variable at the top:
   ```javascript
   const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
   ```
6. Replace `'YOUR_GOOGLE_CLIENT_ID...'` with your actual client ID. The application will automatically swap from Simulation Mode to the live Google Authentication iframe.

---

## 🛠️ Technologies Used

- **HTML5**: Structured semantic layout, navigation, dynamic head-level guard scripts.
- **CSS3**: Variables, flexbox, custom forms, keyframe animations, glassmorphism overlays.
- **JavaScript (Vanilla)**: LocalStorage manipulation, state checkers, JWT decoders, Google SDK integrations.
- **Google Identity Services SDK**: Secure authentication framework.
- **FontAwesome**: High-definition icons for input fields and navigation widgets.

---

## 📂 Folder Structure

```
LoginAuthSystem/
├── index.html       # Sign In page (Default redirection landing with Google buttons)
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
