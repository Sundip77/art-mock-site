// Supabase Authentication and Database Operations
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://lxrtrsvyjzjekmalwjck.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4cnRyc3Z5anpqZWttYWx3amNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNjM4NDgsImV4cCI6MjA1NjkzOTg0OH0.YH6yD4HKcMeU4LArS_wokrVW93YjrdkTSmTheakwnW8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication functions
export async function signUp(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        
        if (error) throw error;
        
        // Send welcome email
        await sendWelcomeEmail(email);
        
        return { success: true, data };
    } catch (error) {
        console.error('Error signing up:', error.message);
        return { success: false, error: error.message };
    }
}

export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        
        if (error) throw error;
        
        // Store user info in local storage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return { success: true, data };
    } catch (error) {
        console.error('Error signing in:', error.message);
        return { success: false, error: error.message };
    }
}

export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) throw error;
        
        // Clear user info from local storage
        localStorage.removeItem('user');
        
        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error.message);
        return { success: false, error: error.message };
    }
}

export async function resetPassword(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) throw error;
        
        return { success: true };
    } catch (error) {
        console.error('Error resetting password:', error.message);
        return { success: false, error: error.message };
    }
}

export async function getCurrentUser() {
    try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Error getting current user:', error.message);
        return { success: false, error: error.message };
    }
}

// Database operations
export async function createUserProfile(userId, profileData) {
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
        
        return { success: true, data };
    } catch (error) {
        console.error('Error creating user profile:', error.message);
        return { success: false, error: error.message };
    }
}

export async function getUserProfile(userId) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error) throw error;
        
        return { success: true, profile: data };
    } catch (error) {
        console.error('Error getting user profile:', error.message);
        return { success: false, error: error.message };
    }
}

export async function updateUserProfile(userId, profileData) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('user_id', userId);
        
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error updating user profile:', error.message);
        return { success: false, error: error.message };
    }
}

// Newsletter subscription
export async function subscribeToNewsletter(email, name) {
    try {
        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .insert([
                { 
                    email,
                    name,
                    subscribed_at: new Date().toISOString(),
                }
            ]);
        
        if (error) throw error;
        
        // Send confirmation email
        await sendSubscriptionConfirmationEmail(email, name);
        
        return { success: true, data };
    } catch (error) {
        console.error('Error subscribing to newsletter:', error.message);
        return { success: false, error: error.message };
    }
}

// Contact form submission
export async function submitContactForm(formData) {
    try {
        const { data, error } = await supabase
            .from('contact_submissions')
            .insert([
                { 
                    ...formData,
                    submitted_at: new Date().toISOString(),
                }
            ]);
        
        if (error) throw error;
        
        // Send confirmation email to user
        await sendContactConfirmationEmail(formData.email, formData.name);
        
        // Send notification email to admin
        await sendAdminNotificationEmail(formData);
        
        return { success: true, data };
    } catch (error) {
        console.error('Error submitting contact form:', error.message);
        return { success: false, error: error.message };
    }
}

// Email functions
async function sendWelcomeEmail(email) {
    try {
        // This would typically call a server function or API endpoint
        // For now, we'll just log it
        console.log(`Welcome email would be sent to ${email}`);
        
        // In a real implementation, you would use Supabase Edge Functions
        // to send emails using a service like SendGrid, Mailgun, etc.
        
        return { success: true };
    } catch (error) {
        console.error('Error sending welcome email:', error.message);
        return { success: false, error: error.message };
    }
}

async function sendSubscriptionConfirmationEmail(email, name) {
    try {
        console.log(`Subscription confirmation email would be sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('Error sending subscription confirmation email:', error.message);
        return { success: false, error: error.message };
    }
}

async function sendContactConfirmationEmail(email, name) {
    try {
        console.log(`Contact form confirmation email would be sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('Error sending contact confirmation email:', error.message);
        return { success: false, error: error.message };
    }
}

async function sendAdminNotificationEmail(formData) {
    try {
        console.log(`Admin notification email would be sent with data:`, formData);
        return { success: true };
    } catch (error) {
        console.error('Error sending admin notification email:', error.message);
        return { success: false, error: error.message };
    }
} 