// Travis Scott Chatbot
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the chatbot when the page is loaded
    initChatbot();
});

function initChatbot() {
    // Create chatbot UI if it doesn't exist
    if (!document.getElementById('travis-chatbot')) {
        createChatbotUI();
    }
    
    // Set up event listeners
    setupChatbotListeners();
}

function createChatbotUI() {
    // Create the main chatbot container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'travis-chatbot';
    chatbotContainer.className = 'chatbot-container';
    
    // Create the chatbot header
    const chatbotHeader = document.createElement('div');
    chatbotHeader.className = 'chatbot-header';
    chatbotHeader.innerHTML = `
        <div class="chatbot-title">
            <img src="https://i.imgur.com/JWxMjmZ.png" alt="Cactus Jack Logo" class="chatbot-logo">
            <h3>Travis Scott Bot</h3>
        </div>
        <button id="chatbot-toggle" class="chatbot-toggle">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Create the chatbot messages area
    const chatbotMessages = document.createElement('div');
    chatbotMessages.id = 'chatbot-messages';
    chatbotMessages.className = 'chatbot-messages';
    
    // Add welcome message
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'chatbot-message bot-message';
    welcomeMessage.innerHTML = `
        <div class="message-content">
            <p>Hey, I'm the Travis Scott Bot! Ask me anything about Travis Scott's music, tours, biography, or collaborations.</p>
        </div>
    `;
    chatbotMessages.appendChild(welcomeMessage);
    
    // Create the chatbot input area
    const chatbotInput = document.createElement('div');
    chatbotInput.className = 'chatbot-input';
    chatbotInput.innerHTML = `
        <input type="text" id="chatbot-input-field" placeholder="Ask about Travis Scott...">
        <button id="chatbot-send">
            <i class="fas fa-paper-plane"></i>
        </button>
    `;
    
    // Assemble the chatbot
    chatbotContainer.appendChild(chatbotHeader);
    chatbotContainer.appendChild(chatbotMessages);
    chatbotContainer.appendChild(chatbotInput);
    
    // Create the chatbot toggle button (initially visible)
    const chatbotButton = document.createElement('button');
    chatbotButton.id = 'chatbot-button';
    chatbotButton.className = 'chatbot-button';
    chatbotButton.innerHTML = `
        <i class="fas fa-comment"></i>
    `;
    
    // Add the chatbot to the page
    document.body.appendChild(chatbotContainer);
    document.body.appendChild(chatbotButton);
    
    // Initially hide the chatbot
    chatbotContainer.style.display = 'none';
}

function setupChatbotListeners() {
    // Toggle chatbot visibility
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotContainer = document.getElementById('travis-chatbot');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    
    if (chatbotButton) {
        chatbotButton.addEventListener('click', function() {
            chatbotContainer.style.display = 'flex';
            chatbotButton.style.display = 'none';
            // Focus on input field
            document.getElementById('chatbot-input-field').focus();
        });
    }
    
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function() {
            chatbotContainer.style.display = 'none';
            chatbotButton.style.display = 'flex';
        });
    }
    
    // Send message on button click
    const sendButton = document.getElementById('chatbot-send');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    // Send message on Enter key
    const inputField = document.getElementById('chatbot-input-field');
    if (inputField) {
        inputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function sendMessage() {
    const inputField = document.getElementById('chatbot-input-field');
    const messagesContainer = document.getElementById('chatbot-messages');
    
    if (!inputField || !messagesContainer) return;
    
    const userMessage = inputField.value.trim();
    if (userMessage === '') return;
    
    // Add user message to chat
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'chatbot-message user-message';
    userMessageElement.innerHTML = `
        <div class="message-content">
            <p>${escapeHTML(userMessage)}</p>
        </div>
    `;
    messagesContainer.appendChild(userMessageElement);
    
    // Clear input field
    inputField.value = '';
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chatbot-message bot-message typing';
    typingIndicator.innerHTML = `
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typingIndicator);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Process the message and get a response
    setTimeout(() => {
        // Remove typing indicator
        messagesContainer.removeChild(typingIndicator);
        
        // Add bot response
        const botResponse = generateTravisResponse(userMessage);
        const botMessageElement = document.createElement('div');
        botMessageElement.className = 'chatbot-message bot-message';
        botMessageElement.innerHTML = `
            <div class="message-content">
                <p>${botResponse}</p>
            </div>
        `;
        messagesContainer.appendChild(botMessageElement);
        
        // Scroll to bottom again
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

function generateTravisResponse(userMessage) {
    // Convert to lowercase for easier matching
    const message = userMessage.toLowerCase();
    
    // Travis Scott knowledge base
    if (message.includes('album') || message.includes('music') || message.includes('song')) {
        return getRandomResponse([
            "Travis Scott's discography includes major albums like 'Rodeo', 'Birds in the Trap Sing McKnight', 'Astroworld', and 'Utopia'. Which one do you want to know more about?",
            "Travis is known for hits like 'Sicko Mode', 'Goosebumps', and 'Highest in the Room'. His music blends hip-hop with psychedelic elements.",
            "Travis Scott's latest album 'Utopia' was released in 2023 after much anticipation. It features collaborations with artists like Beyoncé, The Weeknd, and Bad Bunny.",
            "Travis is constantly evolving his sound. His production style is known for heavy bass, auto-tuned vocals, and atmospheric beats."
        ]);
    }
    
    if (message.includes('tour') || message.includes('concert') || message.includes('show')) {
        return getRandomResponse([
            "Travis Scott's 'Circus Maximus' tour is supporting his 'Utopia' album. Check the official website for the latest dates and locations.",
            "Travis is known for his energetic live performances. His concerts often feature elaborate stage designs and pyrotechnics.",
            "The Astroworld Festival was Travis Scott's own music festival that ran from 2018 to 2021 in Houston, Texas.",
            "Travis Scott's shows are famous for their mosh pits and high energy. He encourages fans to 'rage' and create memorable experiences."
        ]);
    }
    
    if (message.includes('bio') || message.includes('life') || message.includes('born') || message.includes('family')) {
        return getRandomResponse([
            "Travis Scott's real name is Jacques Bermon Webster II. He was born on April 30, 1992, in Houston, Texas.",
            "Travis got his stage name from a favorite uncle named Travis and Kid Cudi's real first name, Scott.",
            "Travis attended the University of Texas San Antonio before dropping out to pursue music full-time.",
            "Travis has a daughter named Stormi Webster with Kylie Jenner, born in February 2018. They also have a son born in 2022."
        ]);
    }
    
    if (message.includes('collab') || message.includes('feature') || message.includes('work with')) {
        return getRandomResponse([
            "Travis Scott has collaborated with numerous artists including Drake, The Weeknd, Kendrick Lamar, and Kid Cudi.",
            "Beyond music, Travis has done major collaborations with brands like Nike, McDonald's, Fortnite, and PlayStation.",
            "The Travis Scott x Nike collaborations, especially the Air Jordan 1 'Cactus Jack', are some of the most sought-after sneakers in the world.",
            "Travis Scott's label, Cactus Jack Records, has signed artists like Don Toliver and Sheck Wes."
        ]);
    }
    
    if (message.includes('cactus jack') || message.includes('logo') || message.includes('brand')) {
        return getRandomResponse([
            "Cactus Jack is Travis Scott's nickname and the name of his record label and brand.",
            "The Cactus Jack logo features a stylized smiley face with X's for eyes and a downturned mouth.",
            "Travis Scott's Cactus Jack brand has expanded into merchandise, food, beverages, and even a collaboration with Dior.",
            "The Cactus Jack Foundation was established by Travis to provide educational and creative resources for youth in Houston."
        ]);
    }
    
    if (message.includes('astroworld')) {
        return getRandomResponse([
            "'Astroworld' is Travis Scott's third studio album, released in 2018. It's named after a closed theme park in Houston that Travis visited as a child.",
            "'Astroworld' features the hit single 'Sicko Mode' with Drake, which became Travis's first #1 hit on the Billboard Hot 100.",
            "The 'Astroworld' album cover was shot by photographer David LaChapelle and features a golden inflatable of Travis's head as the entrance to a carnival.",
            "The Astroworld Festival was created by Travis to bring the album's carnival theme to life as a music festival in his hometown of Houston."
        ]);
    }
    
    if (message.includes('utopia')) {
        return getRandomResponse([
            "'Utopia' is Travis Scott's fourth studio album, released in July 2023 after several delays.",
            "'Utopia' features collaborations with artists like Beyoncé, The Weeknd, Bad Bunny, and Future.",
            "The album was accompanied by a film called 'Circus Maximus' directed by Travis Scott himself.",
            "'Utopia' debuted at #1 on the Billboard 200 chart and received generally positive reviews from critics."
        ]);
    }
    
    // Default responses if no specific topic is matched
    return getRandomResponse([
        "I'm here to chat about all things Travis Scott! Ask me about his music, tours, collaborations, or personal life.",
        "Travis Scott, also known as La Flame or Cactus Jack, is one of the most influential artists in modern hip-hop. What would you like to know about him?",
        "Did you know Travis Scott's 'Astroworld' was named after a theme park in his hometown of Houston? What else would you like to learn about Travis?",
        "Travis Scott is known for his unique blend of hip-hop, psychedelic music, and auto-tuned vocals. Ask me anything specific about his career or life!"
    ]);
}

function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
} 