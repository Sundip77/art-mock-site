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
            
            // Send welcome email
            sendEmail(email, 'Welcome to Travis Scott Fan Website', 
                `<h2>Welcome to the Travis Scott Fan Community!</h2>
                <p>Hi ${name},</p>
                <p>Thank you for creating an account on our Travis Scott Fan Website. You now have access to exclusive content and features.</p>
                <p>Your account details:</p>
                <ul>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Account Created:</strong> ${new Date().toLocaleString()}</li>
                </ul>
                <p>Stay tuned for the latest updates on Travis Scott's music, tours, and merchandise!</p>
                <p>Best regards,<br>The Travis Scott Fan Team</p>`
            );
            
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
            
            // Send confirmation email to user
            sendEmail(email, 'We received your message', 
                `<h2>Thank You for Contacting Us!</h2>
                <p>Hi ${name},</p>
                <p>We have received your message and will get back to you as soon as possible.</p>
                <p><strong>Your message:</strong></p>
                <p style="background-color: #f5f5f5; padding: 10px; border-left: 3px solid #ff6b00;">${message}</p>
                <p>Best regards,<br>The Travis Scott Fan Team</p>`
            );
            
            // Send notification to admin
            sendEmail('sandeepwork77@gmail.com', 'New Contact Form Submission', 
                `<h2>New Message from Travis Scott Fan Website</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Message:</strong></p>
                <p style="background-color: #f5f5f5; padding: 10px; border-left: 3px solid #ff6b00;">${message}</p>`
            );
            
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
            
            // Send welcome email to subscriber
            sendEmail(email, 'Welcome to Travis Scott Newsletter', 
                `<h2>Welcome to the Travis Scott Newsletter!</h2>
                <p>Thank you for subscribing to our newsletter. You'll now receive the latest updates on Travis Scott's music, tours, and merchandise.</p>
                <p><strong>Subscription details:</strong></p>
                <ul>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Subscribed on:</strong> ${new Date().toLocaleString()}</li>
                </ul>
                <p>Stay tuned for exciting news and exclusive content!</p>
                <p>Best regards,<br>The Travis Scott Fan Team</p>`
            );
            
            // Send notification to admin
            sendEmail('sandeepwork77@gmail.com', 'New Newsletter Subscription', 
                `<h2>New Newsletter Subscription</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>`
            );
            
            return { success: true, message: 'Successfully subscribed to the newsletter!' };
        },
        
        saveToStorage: function() {
            localStorage.setItem('subscribers', JSON.stringify(this.subscribers));
        }
    };
    
    // Email sending function (simulated)
    function sendEmail(to, subject, htmlContent) {
        // In a real implementation, this would connect to an email service API
        // For now, we'll log to console and use localStorage to simulate
        console.log(`Sending email to: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Content: ${htmlContent}`);
        
        // Store in localStorage for demo purposes
        const emails = JSON.parse(localStorage.getItem('sent_emails')) || [];
        emails.push({
            to: to,
            subject: subject,
            content: htmlContent,
            sentAt: new Date().toISOString()
        });
        localStorage.setItem('sent_emails', JSON.stringify(emails));
        
        // In a real implementation, you would use a service like EmailJS, SendGrid, etc.
        // Example with EmailJS (would require their library):
        /*
        emailjs.send('service_id', 'template_id', {
            to_email: to,
            subject: subject,
            message_html: htmlContent
        }).then(function(response) {
            console.log('Email sent successfully:', response);
        }, function(error) {
            console.error('Email failed to send:', error);
        });
        */
    }
    
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
        
        // Send login notification email
        sendEmail(email, 'Login Notification - Travis Scott Fan Website', 
            `<h2>New Login to Your Account</h2>
            <p>Hi ${user.name},</p>
            <p>We detected a new login to your Travis Scott Fan Website account.</p>
            <p><strong>Login details:</strong></p>
            <ul>
                <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                <li><strong>Browser:</strong> ${navigator.userAgent}</li>
            </ul>
            <p>If this wasn't you, please secure your account immediately by changing your password.</p>
            <p>Best regards,<br>The Travis Scott Fan Team</p>`
        );
        
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
        
        // Send password reset email
        sendEmail(email, 'Password Reset - Travis Scott Fan Website', 
            `<h2>Password Reset Request</h2>
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password for the Travis Scott Fan Website.</p>
            <p>Click the link below to reset your password:</p>
            <p><a href="https://laflamee.netlify.app/reset-password?token=123456789" style="background-color: #ff6b00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Best regards,<br>The Travis Scott Fan Team</p>`
        );
        
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
            
            // Show success message with details
            showSuccessMessage(
                'Your message has been sent successfully!',
                'Message Sent',
                currentFormData.email,
                'Contact Form Submission'
            );
            
        } else if (currentFormType === 'newsletter') {
            // Process newsletter form
            const result = newsletterDatabase.addSubscriber(currentFormData.email);
            
            // Clear form
            document.getElementById('newsletter-email').value = '';
            
            // Show success message with details
            showSuccessMessage(
                result.message,
                result.success ? 'Subscribed' : 'Already Subscribed',
                currentFormData.email,
                'Newsletter Subscription'
            );
        }
        
        // Reset current form data
        currentFormData = null;
        currentFormType = null;
    }
    
    function showSuccessMessage(message, status = 'Completed', email = '', action = '') {
        // Update success message content
        document.getElementById('success-text').textContent = message;
        
        // Update success details
        document.getElementById('success-status').textContent = status;
        document.getElementById('success-email').textContent = email || 'your@email.com';
        document.getElementById('success-action').textContent = action;
        document.getElementById('success-time').textContent = new Date().toLocaleString();
        
        // Show success tab
        switchTab('success-message');
    }
}); 