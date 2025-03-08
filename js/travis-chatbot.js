// Travis Scott Chatbot
document.addEventListener('DOMContentLoaded', function() {
    // Check if chatbot toggle exists
    const chatbotToggle = document.getElementById('chatbot-toggle');
    if (chatbotToggle) {
        // Add click event listener if not already added in main.js
        if (!chatbotToggle.hasAttribute('data-chatbot-initialized')) {
            chatbotToggle.setAttribute('data-chatbot-initialized', 'true');
            chatbotToggle.addEventListener('click', function() {
                toggleChatbot();
            });
        }
    }
    
    // Check if chatbot already exists
    if (!document.getElementById('travis-chatbot')) {
        createChatbotElements();
    }
    
    // Set up chatbot functionality
    setupChatbotFunctionality();
});

// Create chatbot elements
function createChatbotElements() {
    const chatbotHTML = `
        <div id="travis-chatbot" class="chatbot-container">
            <div class="chatbot-header">
                <h3>Travis Scott AI</h3>
                <button id="chatbot-close" aria-label="Close chatbot">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="chatbot-messages" class="chatbot-messages">
                <div class="chatbot-message bot-message">
                    <div class="chatbot-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chatbot-content">
                        Hey, I'm Travis Scott's AI assistant. How can I help you today? IT'S LIT!
                    </div>
                </div>
            </div>
            <div class="chatbot-input-container">
                <input type="text" id="chatbot-input" placeholder="Type your message...">
                <button id="chatbot-send" aria-label="Send message">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    console.log('Chatbot elements created');
}

// Set up chatbot functionality
function setupChatbotFunctionality() {
    const chatbotContainer = document.getElementById('travis-chatbot');
    const chatbotCloseBtn = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    
    // Close button
    if (chatbotCloseBtn) {
        chatbotCloseBtn.addEventListener('click', function() {
            if (chatbotContainer) {
                chatbotContainer.classList.remove('active');
            }
        });
    }
    
    // Send button
    if (chatbotSend && chatbotInput) {
        chatbotSend.addEventListener('click', function() {
            sendMessage();
        });
    }
    
    // Enter key in input
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Toggle chatbot visibility
function toggleChatbot() {
    const chatbotContainer = document.getElementById('travis-chatbot');
    if (!chatbotContainer) {
        createChatbotElements();
        setupChatbotFunctionality();
        setTimeout(() => {
            document.getElementById('travis-chatbot').classList.add('active');
        }, 100);
    } else {
        chatbotContainer.classList.toggle('active');
    }
    
    // Focus input when opened
    if (chatbotContainer && chatbotContainer.classList.contains('active')) {
        setTimeout(() => {
            const input = document.getElementById('chatbot-input');
            if (input) input.focus();
        }, 300);
    }
}

// Send message
function sendMessage() {
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    if (!chatbotInput || !chatbotMessages) return;
    
    const message = chatbotInput.value.trim();
    if (message) {
        // Add user message
        addMessage('user', message);
        
        // Clear input
        chatbotInput.value = '';
        
        // Get bot response after a short delay
        setTimeout(() => {
            const response = getBotResponse(message);
            addMessage('bot', response);
            
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 500);
    }
}

// Add message to chat
function addMessage(sender, message) {
    const chatbotMessages = document.getElementById('chatbot-messages');
    if (!chatbotMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('chatbot-message', `${sender}-message`);
    
    const avatar = document.createElement('div');
    avatar.classList.add('chatbot-avatar');
    
    if (sender === 'bot') {
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
    } else {
        avatar.innerHTML = '<i class="fas fa-user"></i>';
    }
    
    const content = document.createElement('div');
    content.classList.add('chatbot-content');
    content.textContent = message;
    
    messageElement.appendChild(avatar);
    messageElement.appendChild(content);
    
    chatbotMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Get bot response
function getBotResponse(message) {
    message = message.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hey, I'm Travis Scott's AI assistant. What can I help you with?";
    } else if (message.includes('tour') || message.includes('concert')) {
        return "Check out the Tours section for my upcoming shows. Hope to see you there, it's lit!";
    } else if (message.includes('album') || message.includes('music')) {
        return "My latest album is 'Utopia'. You can stream it on all platforms. STRAIGHT UP!";
    } else if (message.includes('merch') || message.includes('clothing')) {
        return "You can find my official merch at shop.travisscott.com. CACTUS JACK!";
    } else if (message.includes('astroworld')) {
        return "Astroworld was a special album for me. Wish you were here!";
    } else if (message.includes('cactus jack')) {
        return "Cactus Jack is my record label and brand. IT'S LIT!";
    } else {
        return "That's dope! Feel free to explore the site for more info about my music, tours, and ventures.";
    }
} 