// Contact Form and Authentication Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.getElementById('newsletter-form');
    const contactSubmitBtn = document.getElementById('contact-submit');
    const newsletterSubmitBtn = document.getElementById('newsletter-submit');
    const authModal = document.getElementById('auth-modal');
    const closeModal = document.querySelector('.close-modal');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const resetBtn = document.getElementById('reset-btn');
    const successBtn = document.getElementById('success-btn');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLoginLink = document.getElementById('back-to-login-link');
    
    // Fix input field focus issues
    const allInputs = document.querySelectorAll('input, textarea');
    allInputs.forEach(input => {
        // Make sure inputs are clickable
        input.addEventListener('click', function(e) {
            this.focus();
        });
        
        // Add focus animation
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--accent-color)';
        });
        
        // Remove focus animation
        input.addEventListener('blur', function() {
            this.style.borderColor = '';
        });
    });
    
    // Current form data storage
    let currentFormData = null;
    let currentFormType = null;
    
    // Initialize Firebase-like storage
    const userDatabase = {
        users: JSON.parse(localStorage.getItem('users')) || [],
        
        addUser: function(name, email, password) {
            const user = {
                id: Date.now().toString(),
                name: name,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };
            
            this.users.push(user);
            this.saveToStorage();
            return user;
        },
        
        findUserByEmail: function(email) {
            return this.users.find(user => user.email === email);
        },
        
        saveToStorage: function() {
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    };
    
    // Message database
    const messageDatabase = {
        messages: JSON.parse(localStorage.getItem('messages')) || [],
        
        addMessage: function(name, email, message) {
            const newMessage = {
                id: Date.now().toString(),
                name: name,
                email: email,
                message: message,
                createdAt: new Date().toISOString()
            };
            
            this.messages.push(newMessage);
            this.saveToStorage();
            
            // Send to admin email (simulated)
            console.log(`Message sent to admin: ${JSON.stringify(newMessage)}`);
            return newMessage;
        },
        
        saveToStorage: function() {
            localStorage.setItem('messages', JSON.stringify(this.messages));
        }
    };
    
    // Newsletter database
    const newsletterDatabase = {
        subscribers: JSON.parse(localStorage.getItem('subscribers')) || [],
        
        addSubscriber: function(email) {
            // Check if already subscribed
            if (this.subscribers.includes(email)) {
                return { success: false, message: 'You are already subscribed!' };
            }
            
            this.subscribers.push(email);
            this.saveToStorage();
            
            // Send to admin email (simulated)
            console.log(`New subscriber: ${email}`);
            return { success: true, message: 'Successfully subscribed to the newsletter!' };
        },
        
        saveToStorage: function() {
            localStorage.setItem('subscribers', JSON.stringify(this.subscribers));
        }
    };
    
    // Add animation to buttons
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Event Listeners
    if (contactSubmitBtn) {
        contactSubmitBtn.addEventListener('click', handleContactSubmit);
    }
    
    if (newsletterSubmitBtn) {
        newsletterSubmitBtn.addEventListener('click', handleNewsletterSubmit);
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeAuthModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === authModal) {
            closeAuthModal();
        }
    });
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Form submissions
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', handleSignup);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', handlePasswordReset);
    }
    
    if (successBtn) {
        successBtn.addEventListener('click', closeAuthModal);
    }
    
    // Links
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab('forgot-password');
        });
    }
    
    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab('login');
        });
    }
    
    // Functions
    function handleContactSubmit() {
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');
        
        if (!nameInput.value || !emailInput.value || !messageInput.value) {
            // Shake the form to indicate error
            contactForm.classList.add('shake');
            setTimeout(() => {
                contactForm.classList.remove('shake');
            }, 500);
            
            // Highlight empty fields
            if (!nameInput.value) nameInput.style.borderColor = 'red';
            if (!emailInput.value) emailInput.style.borderColor = 'red';
            if (!messageInput.value) messageInput.style.borderColor = 'red';
            
            return;
        }
        
        // Store form data for after authentication
        currentFormData = {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value
        };
        
        currentFormType = 'contact';
        
        // Show login modal
        openAuthModal();
    }
    
    function handleNewsletterSubmit() {
        const emailInput = document.getElementById('newsletter-email');
        
        if (!emailInput.value) {
            // Shake the form to indicate error
            newsletterForm.classList.add('shake');
            setTimeout(() => {
                newsletterForm.classList.remove('shake');
            }, 500);
            
            // Highlight empty field
            emailInput.style.borderColor = 'red';
            
            return;
        }
        
        // Store form data for after authentication
        currentFormData = {
            email: emailInput.value
        };
        
        currentFormType = 'newsletter';
        
        // Show login modal
        openAuthModal();
    }
    
    function openAuthModal() {
        authModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        switchTab('login'); // Default to login tab
        
        // Focus the first input field
        setTimeout(() => {
            const firstInput = document.querySelector('#login-tab input');
            if (firstInput) firstInput.focus();
        }, 300);
    }
    
    function closeAuthModal() {
        authModal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    function switchTab(tabId) {
        // Hide all tabs with fade out effect
        tabContents.forEach(content => {
            content.style.opacity = '0';
            setTimeout(() => {
                content.classList.remove('active');
                
                // Show selected tab with fade in effect
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                    setTimeout(() => {
                        content.style.opacity = '1';
                        
                        // Focus the first input in the tab
                        const firstInput = content.querySelector('input');
                        if (firstInput) firstInput.focus();
                    }, 50);
                }
            }, 200);
        });
        
        // Remove active class from all buttons
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        if (tabId === 'login' || tabId === 'signup') {
            document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
        }
    }
    
    function handleLogin() {
        const loginForm = document.getElementById('login-form');
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        
        if (!email || !password) {
            // Shake the form to indicate error
            loginForm.classList.add('shake');
            setTimeout(() => {
                loginForm.classList.remove('shake');
            }, 500);
            
            // Highlight empty fields
            if (!email) loginForm.querySelector('input[type="email"]').style.borderColor = 'red';
            if (!password) loginForm.querySelector('input[type="password"]').style.borderColor = 'red';
            
            return;
        }
        
        // Check if user exists
        const user = userDatabase.findUserByEmail(email);
        
        if (!user || user.password !== password) {
            // Shake the form to indicate error
            loginForm.classList.add('shake');
            setTimeout(() => {
                loginForm.classList.remove('shake');
            }, 500);
            
            alert('Invalid email or password');
            return;
        }
        
        // Process the form data based on type
        processFormAfterAuth(user);
    }
    
    function handleSignup() {
        const signupForm = document.getElementById('signup-form');
        const name = signupForm.querySelector('input[type="text"]').value;
        const email = signupForm.querySelector('input[type="email"]').value;
        const password = signupForm.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = signupForm.querySelectorAll('input[type="password"]')[1].value;
        
        if (!name || !email || !password || !confirmPassword) {
            // Shake the form to indicate error
            signupForm.classList.add('shake');
            setTimeout(() => {
                signupForm.classList.remove('shake');
            }, 500);
            
            // Highlight empty fields
            if (!name) signupForm.querySelector('input[type="text"]').style.borderColor = 'red';
            if (!email) signupForm.querySelector('input[type="email"]').style.borderColor = 'red';
            if (!password) signupForm.querySelectorAll('input[type="password"]')[0].style.borderColor = 'red';
            if (!confirmPassword) signupForm.querySelectorAll('input[type="password"]')[1].style.borderColor = 'red';
            
            return;
        }
        
        if (password !== confirmPassword) {
            // Shake the form to indicate error
            signupForm.classList.add('shake');
            setTimeout(() => {
                signupForm.classList.remove('shake');
            }, 500);
            
            // Highlight password fields
            signupForm.querySelectorAll('input[type="password"]')[0].style.borderColor = 'red';
            signupForm.querySelectorAll('input[type="password"]')[1].style.borderColor = 'red';
            
            alert('Passwords do not match');
            return;
        }
        
        // Check if user already exists
        if (userDatabase.findUserByEmail(email)) {
            // Shake the form to indicate error
            signupForm.classList.add('shake');
            setTimeout(() => {
                signupForm.classList.remove('shake');
            }, 500);
            
            alert('Email already registered. Please login instead.');
            switchTab('login');
            return;
        }
        
        // Create new user
        const user = userDatabase.addUser(name, email, password);
        
        // Process the form data based on type
        processFormAfterAuth(user);
    }
    
    function handlePasswordReset() {
        const resetForm = document.getElementById('reset-form');
        const email = resetForm.querySelector('input[type="email"]').value;
        
        if (!email) {
            // Shake the form to indicate error
            resetForm.classList.add('shake');
            setTimeout(() => {
                resetForm.classList.remove('shake');
            }, 500);
            
            // Highlight empty field
            resetForm.querySelector('input[type="email"]').style.borderColor = 'red';
            
            return;
        }
        
        // Check if user exists
        const user = userDatabase.findUserByEmail(email);
        
        if (!user) {
            // Shake the form to indicate error
            resetForm.classList.add('shake');
            setTimeout(() => {
                resetForm.classList.remove('shake');
            }, 500);
            
            alert('No account found with this email address');
            return;
        }
        
        // Show success message
        showSuccessMessage('Password reset link has been sent to your email address.');
    }
    
    function processFormAfterAuth(user) {
        if (!currentFormData || !currentFormType) {
            closeAuthModal();
            return;
        }
        
        if (currentFormType === 'contact') {
            // Process contact form
            messageDatabase.addMessage(
                currentFormData.name,
                currentFormData.email,
                currentFormData.message
            );
            
            // Clear form
            document.getElementById('contact-name').value = '';
            document.getElementById('contact-email').value = '';
            document.getElementById('contact-message').value = '';
            
            // Show success message
            showSuccessMessage('Your message has been sent successfully!');
            
        } else if (currentFormType === 'newsletter') {
            // Process newsletter form
            const result = newsletterDatabase.addSubscriber(currentFormData.email);
            
            // Clear form
            document.getElementById('newsletter-email').value = '';
            
            // Show success message
            showSuccessMessage(result.message);
        }
        
        // Reset current form data
        currentFormData = null;
        currentFormType = null;
    }
    
    function showSuccessMessage(message) {
        document.getElementById('success-text').textContent = message;
        switchTab('success-message');
    }
}); 