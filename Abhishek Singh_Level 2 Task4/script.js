/**
 * FlowAuth - Secure Frontend Login Authentication System Engine
 * Utilizes LocalStorage for user accounts and active session persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Shared Elements
    const notificationBanner = document.getElementById('notification-banner');
    const closeNotification = document.getElementById('close-notification');

    // --------------------------------------------------------------------------
    // UTILITIES & HELPER FUNCTIONS
    // --------------------------------------------------------------------------
    
    // Email Validation Regex (standard RFC 5322)
    const isValidEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase().trim());
    };

    // Show Notification Banner
    const showNotification = (message, type = 'info') => {
        if (!notificationBanner) return;
        
        const messageSpan = notificationBanner.querySelector('.notification-message');
        messageSpan.textContent = message;
        
        // Reset classes
        notificationBanner.className = 'notification';
        notificationBanner.classList.add(type);
        
        // Remove hidden class
        notificationBanner.classList.remove('hidden');
    };

    // Close Notification Banner
    if (closeNotification) {
        closeNotification.addEventListener('click', () => {
            notificationBanner.classList.add('hidden');
        });
    }

    // Helper: Retrieve LocalStorage Users List
    const getUsers = () => {
        return JSON.parse(localStorage.getItem('oibsip_users')) || [];
    };

    // Helper: Save Users List to LocalStorage
    const saveUsers = (users) => {
        localStorage.setItem('oibsip_users', JSON.stringify(users));
    };

    // Toggle Password Visibility Handler
    const setupPasswordToggle = (inputId, buttonId) => {
        const passwordInput = document.getElementById(inputId);
        const toggleButton = document.getElementById(buttonId);
        
        if (passwordInput && toggleButton) {
            toggleButton.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Toggle Icon Class
                const icon = toggleButton.querySelector('i');
                if (icon) {
                    if (type === 'text') {
                        icon.className = 'fa-regular fa-eye-slash';
                    } else {
                        icon.className = 'fa-regular fa-eye';
                    }
                }
            });
        }
    };

    // Apply Shake Animation to Element on Validation Failure
    const applyShake = (element) => {
        if (!element) return;
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 400);
    };

    // Form Field Feedback Helper
    const setFieldStatus = (inputField, errorSpan, isValid) => {
        const inputGroup = inputField.closest('.input-group');
        if (!inputGroup) return;

        if (isValid) {
            inputGroup.classList.remove('invalid');
        } else {
            inputGroup.classList.add('invalid');
        }
    };

    // --------------------------------------------------------------------------
    // SIGN UP PAGE ENGINE (signup.html)
    // --------------------------------------------------------------------------
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const nameInput = document.getElementById('signup-name');
        const emailInput = document.getElementById('signup-email');
        const passwordInput = document.getElementById('signup-password');
        const confirmPasswordInput = document.getElementById('signup-confirm-password');
        const strengthBar = document.getElementById('strength-bar');
        const strengthLabel = document.getElementById('strength-label');

        // Setup toggles
        setupPasswordToggle('signup-password', 'toggle-password');
        setupPasswordToggle('signup-confirm-password', 'toggle-confirm-password');

        // Live Password Strength Check
        const checkPasswordStrength = (password) => {
            let score = 0;
            if (!password) return score;

            if (password.length >= 8) score++;
            if (/[A-Z]/.test(password)) score++;
            if (/[0-9]/.test(password)) score++;
            if (/[^A-Za-z0-9]/.test(password)) score++;

            return score;
        };

        const updateStrengthUI = (score) => {
            if (!strengthBar || !strengthLabel) return;
            
            // Map scores to progress and styles
            let width = '0%';
            let color = 'var(--danger)';
            let label = 'Very Weak';

            switch (score) {
                case 1:
                    width = '25%';
                    color = '#ef4444'; // Red
                    label = 'Weak';
                    break;
                case 2:
                    width = '50%';
                    color = '#f59e0b'; // Amber
                    label = 'Medium (Add symbol/upper/number)';
                    break;
                case 3:
                    width = '75%';
                    color = '#3b82f6'; // Blue
                    label = 'Strong';
                    break;
                case 4:
                    width = '100%';
                    color = '#10b981'; // Success Green
                    label = 'Very Strong';
                    break;
                default:
                    width = '0%';
                    color = 'var(--card-border)';
                    label = 'Enter a password';
            }

            strengthBar.style.width = width;
            strengthBar.style.backgroundColor = color;
            strengthLabel.textContent = label;
            strengthLabel.style.color = score > 0 ? color : 'var(--text-muted)';
        };

        passwordInput.addEventListener('input', () => {
            const pwdValue = passwordInput.value;
            const strengthScore = checkPasswordStrength(pwdValue);
            updateStrengthUI(strengthScore);
        });

        // Submit Sign Up Form
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Form validations
            const isNameValid = name.length >= 3;
            const isEmailValid = isValidEmail(email);
            const isPasswordValid = checkPasswordStrength(password) >= 2 && password.length >= 8;
            const isConfirmValid = password === confirmPassword && confirmPassword.length > 0;

            setFieldStatus(nameInput, document.getElementById('name-error'), isNameValid);
            setFieldStatus(emailInput, document.getElementById('email-error'), isEmailValid);
            setFieldStatus(passwordInput, document.getElementById('password-error'), isPasswordValid);
            setFieldStatus(confirmPasswordInput, document.getElementById('confirm-password-error'), isConfirmValid);

            if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
                // Apply visual shake feedback to incorrect fields
                if (!isNameValid) applyShake(nameInput.closest('.input-group'));
                if (!isEmailValid) applyShake(emailInput.closest('.input-group'));
                if (!isPasswordValid) applyShake(passwordInput.closest('.input-group'));
                if (!isConfirmValid) applyShake(confirmPasswordInput.closest('.input-group'));
                
                showNotification('Please correct validation errors on the form.', 'error');
                return;
            }

            // Check if user already exists
            const users = getUsers();
            const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

            if (userExists) {
                applyShake(emailInput.closest('.input-group'));
                emailInput.closest('.input-group').classList.add('invalid');
                showNotification('Email address is already registered!', 'error');
                return;
            }

            // Create and Store New User
            const newUser = {
                id: 'US_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                name: name,
                email: email,
                password: password, // client side storage only (in production, hash passwords)
                loginsCount: 0
            };

            users.push(newUser);
            saveUsers(users);

            // Redirect to Login Page with query success indicator
            window.location.href = 'index.html?signup=success';
        });
    }

    // --------------------------------------------------------------------------
    // GOOGLE OAUTH IDENTITY SERVICES & MOCK FLOWS
    // --------------------------------------------------------------------------
    const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

    // Decode base64 JWT payload client-side (for real Google credentials)
    const decodeJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('JWT decoding failed:', e);
            return null;
        }
    };

    // Shared Sign-in Handler for Google logins (Real & Simulated)
    const loginWithGoogleAccount = (email, name, pictureUrl, googleId) => {
        const users = getUsers();
        let userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

        if (userIndex === -1) {
            // Automatically sign up user if not exists
            const newUser = {
                id: 'G_' + googleId.substring(0, 10),
                name: name,
                email: email,
                password: 'google_oauth_bypass_' + Math.random().toString(36).substr(2, 5),
                loginsCount: 1,
                picture: pictureUrl
            };
            users.push(newUser);
            saveUsers(users);
            userIndex = users.length - 1;
        } else {
            // Update counter and picture
            users[userIndex].picture = pictureUrl;
            users[userIndex].loginsCount = (users[userIndex].loginsCount || 0) + 1;
            saveUsers(users);
        }

        // Set session
        const sessionData = {
            id: users[userIndex].id,
            name: name,
            email: email,
            loginsCount: users[userIndex].loginsCount,
            picture: pictureUrl
        };
        localStorage.setItem('oibsip_session', JSON.stringify(sessionData));

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    };

    // Google Sign-In Callback (for real Google auth)
    const handleGoogleCallback = (response) => {
        const payload = decodeJwt(response.credential);
        if (payload && payload.email) {
            loginWithGoogleAccount(payload.email, payload.name, payload.picture, payload.sub);
        } else {
            showNotification('Google Authentication failed. Try again.', 'error');
        }
    };

    // Initialize Google elements on page load
    const initializeGoogleAuth = () => {
        const googleBtnDiv = document.getElementById('google-signin-btn');
        const mockGoogleBtn = document.getElementById('mock-google-signin-btn');
        
        if (!googleBtnDiv || !mockGoogleBtn) return;

        const isPlaceholder = GOOGLE_CLIENT_ID.startsWith('YOUR_GOOGLE_CLIENT_ID');

        if (isPlaceholder) {
            // Enable simulated selection modal
            googleBtnDiv.style.display = 'none';
            mockGoogleBtn.style.display = 'flex';

            const mockModal = document.getElementById('mock-google-modal');
            const cancelBtn = document.getElementById('cancel-google-btn');
            const accountItems = document.querySelectorAll('.google-account-item');

            mockGoogleBtn.addEventListener('click', () => {
                mockModal.classList.remove('hidden');
            });

            cancelBtn.addEventListener('click', () => {
                mockModal.classList.add('hidden');
            });

            accountItems.forEach(item => {
                item.addEventListener('click', () => {
                    const email = item.getAttribute('data-email');
                    const name = item.getAttribute('data-name');
                    const pic = item.getAttribute('data-pic');
                    const mockId = 'MOCK_' + Math.random().toString(36).substr(2, 9).toUpperCase();
                    
                    mockModal.classList.add('hidden');
                    loginWithGoogleAccount(email, name, pic, mockId);
                });
            });
        } else {
            // Enable real Google Sign-In
            mockGoogleBtn.style.display = 'none';
            googleBtnDiv.style.display = 'flex';

            window.addEventListener('load', () => {
                if (typeof google !== 'undefined') {
                    google.accounts.id.initialize({
                        client_id: GOOGLE_CLIENT_ID,
                        callback: handleGoogleCallback
                    });
                    google.accounts.id.renderButton(
                        googleBtnDiv,
                        { theme: "outline", size: "large", width: "100%", shape: "rectangular" }
                    );
                } else {
                    console.warn('Google client library could not be loaded. Displaying mock fallback.');
                    googleBtnDiv.style.display = 'none';
                    mockGoogleBtn.style.display = 'flex';
                }
            });
        }
    };

    // --------------------------------------------------------------------------
    // SIGN IN PAGE ENGINE (index.html)
    // --------------------------------------------------------------------------
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');

        setupPasswordToggle('login-password', 'toggle-password');
        initializeGoogleAuth();

        // Check for redirect queries
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('signup') === 'success') {
            showNotification('Registration successful! Please log in.', 'success');
        } else if (urlParams.get('logout') === 'success') {
            showNotification('You have logged out successfully.', 'info');
        } else if (urlParams.get('error') === 'unauthorized') {
            showNotification('Access denied. Please sign in first.', 'error');
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            const isEmailValid = isValidEmail(email);
            const isPasswordValid = password.length > 0;

            setFieldStatus(emailInput, document.getElementById('email-error'), isEmailValid);
            setFieldStatus(passwordInput, document.getElementById('password-error'), isPasswordValid);

            if (!isEmailValid || !isPasswordValid) {
                if (!isEmailValid) applyShake(emailInput.closest('.input-group'));
                if (!isPasswordValid) applyShake(passwordInput.closest('.input-group'));
                return;
            }

            // Authenticate Credential Checks
            const users = getUsers();
            const foundUserIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

            if (foundUserIndex === -1) {
                applyShake(emailInput.closest('.input-group'));
                showNotification('No account found with this email.', 'error');
                return;
            }

            const user = users[foundUserIndex];

            if (user.password !== password) {
                applyShake(passwordInput.closest('.input-group'));
                showNotification('Incorrect password. Please try again.', 'error');
                return;
            }

            // Authentication Successful
            user.loginsCount++;
            users[foundUserIndex] = user;
            saveUsers(users); // Update login counter

            // Set Active Session Tokens
            const sessionData = {
                id: user.id,
                name: user.name,
                email: user.email,
                loginsCount: user.loginsCount,
                picture: user.picture || null
            };
            localStorage.setItem('oibsip_session', JSON.stringify(sessionData));

            // Redirect to Dashboard panel
            window.location.href = 'dashboard.html';
        });
    }

    // --------------------------------------------------------------------------
    // PROTECTED DASHBOARD ENGINE (dashboard.html)
    // --------------------------------------------------------------------------
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        // Read Session Tokens
        const session = JSON.parse(localStorage.getItem('oibsip_session'));
        
        if (!session) {
            // Guard fallback redirection
            window.location.href = 'index.html?error=unauthorized';
            return;
        }

        // DOM elements to fill
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const profileId = document.getElementById('profile-id');
        const userBadgeName = document.getElementById('user-badge-name');
        const welcomeGreeting = document.getElementById('welcome-greeting');
        const sessionCount = document.getElementById('session-count');
        const avatarLetters = document.getElementById('avatar-letters');
        const logTime = document.getElementById('log-session-time');

        // Fill user profile data
        profileName.textContent = session.name;
        profileEmail.textContent = session.email;
        profileId.textContent = session.id;
        userBadgeName.textContent = session.name;
        sessionCount.textContent = session.loginsCount || 1;

        // Dynamic Time Greeting Generator
        const currentHour = new Date().getHours();
        let greeting = 'Hello';
        if (currentHour < 12) {
            greeting = 'Good Morning';
        } else if (currentHour < 18) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }
        welcomeGreeting.textContent = `${greeting}, ${session.name}!`;

        // Profile Avatar Initials or Picture
        if (avatarLetters && session.name) {
            if (session.picture) {
                avatarLetters.innerHTML = `<img src="${session.picture}" alt="${session.name}">`;
                avatarLetters.style.padding = '0';
            } else {
                const parts = session.name.split(' ');
                let initials = parts[0].charAt(0).toUpperCase();
                if (parts.length > 1) {
                    initials += parts[parts.length - 1].charAt(0).toUpperCase();
                }
                avatarLetters.textContent = initials;
            }
        }

        // Fill activity logs dynamic stamp
        if (logTime) {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            logTime.textContent = `Today at ${timeStr}`;
        }

        // Handle Logout Action
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('oibsip_session');
            window.location.href = 'index.html?logout=success';
        });
    }
});
