// Supabase client initialization
const supabaseUrl = 'https://lxrtrsvyjzjekmalwjck.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4cnRyc3Z5anpqZWttYWx3amNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNjM4NDgsImV4cCI6MjA1NjkzOTg0OH0.YH6yD4HKcMeU4LArS_wokrVW93YjrdkTSmTheakwnW8';

// Initialize Supabase client when script loads
let supabase;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase client
    supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);
    
    // Set up auth state change listener
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            console.log('User signed in:', session.user);
            updateUIForSignedInUser(session.user);
        } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            updateUIForSignedOutUser();
        }
    });
    
    // Check if user is already signed in
    checkCurrentUser();
    
    // Set up event listeners for auth forms
    setupAuthForms();
    
    // Set up event listeners for newsletter and contact forms
    setupNewsletterForm();
    setupContactForm();
});

// Check if user is already signed in
async function checkCurrentUser() {
    try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error('Error checking current user:', error.message);
            return;
        }
        
        if (data && data.user) {
            console.log('User is already signed in:', data.user);
            updateUIForSignedInUser(data.user);
        } else {
            console.log('No user is signed in');
            updateUIForSignedOutUser();
        }
    } catch (error) {
        console.error('Error checking current user:', error.message);
    }
}

// Update UI for signed in user
function updateUIForSignedInUser(user) {
    // Update navigation
    const authLinks = document.querySelectorAll('.auth-link');
    authLinks.forEach(link => {
        if (link.classList.contains('sign-in-link')) {
            link.style.display = 'none';
        } else if (link.classList.contains('sign-up-link')) {
            link.style.display = 'none';
        } else if (link.classList.contains('sign-out-link')) {
            link.style.display = 'block';
        } else if (link.classList.contains('profile-link')) {
            link.style.display = 'block';
        }
    });
    
    // Update user profile display
    const userProfileElements = document.querySelectorAll('.user-profile');
    userProfileElements.forEach(element => {
        element.textContent = user.email;
    });
    
    // Show user-specific content
    const userContent = document.querySelectorAll('.user-content');
    userContent.forEach(element => {
        element.style.display = 'block';
    });
    
    // Hide guest-specific content
    const guestContent = document.querySelectorAll('.guest-content');
    guestContent.forEach(element => {
        element.style.display = 'none';
    });
}

// Update UI for signed out user
function updateUIForSignedOutUser() {
    // Update navigation
    const authLinks = document.querySelectorAll('.auth-link');
    authLinks.forEach(link => {
        if (link.classList.contains('sign-in-link')) {
            link.style.display = 'block';
        } else if (link.classList.contains('sign-up-link')) {
            link.style.display = 'block';
        } else if (link.classList.contains('sign-out-link')) {
            link.style.display = 'none';
        } else if (link.classList.contains('profile-link')) {
            link.style.display = 'none';
        }
    });
    
    // Hide user-specific content
    const userContent = document.querySelectorAll('.user-content');
    userContent.forEach(element => {
        element.style.display = 'none';
    });
    
    // Show guest-specific content
    const guestContent = document.querySelectorAll('.guest-content');
    guestContent.forEach(element => {
        element.style.display = 'block';
    });
}

// Set up event listeners for auth forms
function setupAuthForms() {
    // Sign up form
    const signUpForm = document.getElementById('signup-form');
    if (signUpForm) {
        const signUpBtn = document.getElementById('signup-btn');
        if (signUpBtn) {
            signUpBtn.addEventListener('click', async function() {
                const email = signUpForm.querySelector('input[type="email"]').value;
                const password = signUpForm.querySelector('input[type="password"]').value;
                
                try {
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                    });
                    
                    if (error) throw error;
                    
                    console.log('Sign up successful:', data);
                    showSuccessMessage('signup-success');
                    
                    // Create user profile
                    const name = signUpForm.querySelector('input[type="text"]').value;
                    await createUserProfile(data.user.id, { name, email });
                    
                } catch (error) {
                    console.error('Error signing up:', error.message);
                    showErrorMessage('signup-error', error.message);
                }
            });
        }
    }
    
    // Sign in form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', async function() {
                const email = loginForm.querySelector('input[type="email"]').value;
                const password = loginForm.querySelector('input[type="password"]').value;
                
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });
                    
                    if (error) throw error;
                    
                    console.log('Sign in successful:', data);
                    showSuccessMessage('login-success');
                    
                } catch (error) {
                    console.error('Error signing in:', error.message);
                    showErrorMessage('login-error', error.message);
                }
            });
        }
    }
    
    // Sign out button
    const signOutBtn = document.getElementById('sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async function() {
            try {
                const { error } = await supabase.auth.signOut();
                
                if (error) throw error;
                
                console.log('Sign out successful');
                
            } catch (error) {
                console.error('Error signing out:', error.message);
            }
        });
    }
    
    // Reset password form
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', async function() {
                const email = resetForm.querySelector('input[type="email"]').value;
                
                try {
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: `${window.location.origin}/reset-password`,
                    });
                    
                    if (error) throw error;
                    
                    console.log('Password reset email sent');
                    showSuccessMessage('reset-success');
                    
                } catch (error) {
                    console.error('Error resetting password:', error.message);
                    showErrorMessage('reset-error', error.message);
                }
            });
        }
    }
}

// Set up event listeners for newsletter form
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        const submitBtn = document.getElementById('newsletter-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', async function() {
                const email = document.getElementById('newsletter-email').value;
                
                try {
                    const { data, error } = await supabase
                        .from('newsletter_subscribers')
                        .insert([
                            { 
                                email,
                                subscribed_at: new Date().toISOString(),
                            }
                        ]);
                    
                    if (error) throw error;
                    
                    console.log('Newsletter subscription successful');
                    showSuccessMessage('newsletter-success');
                    
                    // Clear form
                    document.getElementById('newsletter-email').value = '';
                    
                } catch (error) {
                    console.error('Error subscribing to newsletter:', error.message);
                    showErrorMessage('newsletter-error', error.message);
                }
            });
        }
    }
}

// Set up event listeners for contact form
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitBtn = document.getElementById('contact-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', async function() {
                const name = document.getElementById('contact-name').value;
                const email = document.getElementById('contact-email').value;
                const message = document.getElementById('contact-message').value;
                
                try {
                    const { data, error } = await supabase
                        .from('contact_submissions')
                        .insert([
                            { 
                                name,
                                email,
                                message,
                                submitted_at: new Date().toISOString(),
                            }
                        ]);
                    
                    if (error) throw error;
                    
                    console.log('Contact form submission successful');
                    
                    // Update success message
                    document.getElementById('success-text').textContent = 'Your message has been sent successfully.';
                    document.getElementById('success-email').textContent = email;
                    document.getElementById('success-action').textContent = 'Message sent';
                    document.getElementById('success-time').textContent = 'Just now';
                    
                    // Show success message
                    showTab('success-message');
                    
                    // Clear form
                    document.getElementById('contact-name').value = '';
                    document.getElementById('contact-email').value = '';
                    document.getElementById('contact-message').value = '';
                    
                } catch (error) {
                    console.error('Error submitting contact form:', error.message);
                    showErrorMessage('contact-error', error.message);
                }
            });
        }
    }
}

// Create user profile
async function createUserProfile(userId, profileData) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .insert([
                { 
                    user_id: userId,
                    ...profileData,
                    created_at: new Date().toISOString(),
                }
            ]);
        
        if (error) throw error;
        
        console.log('User profile created:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error creating user profile:', error.message);
        return { success: false, error: error.message };
    }
}

// Helper functions
function showSuccessMessage(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function showErrorMessage(id, message) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function showTab(id) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show the selected tab
    const selectedTab = document.getElementById(id);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
} 