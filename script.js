// AI Study Assistant - Fixed JavaScript

// API Configuration
const API_URL = 'https://ai-study-assistant-endpoints-production.up.railway.app';

// Global variables
let currentCardIndex = 0;
let flashcards = [];
let quizQuestions = [];
let selectedCardType = 'qa';
let selectedSummaryStyle = 'bullet_points';

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing application...');

    // Check API health
    checkApiHealth();

    // Tab switching
    setupTabs();

    // Option card selection
    setupOptionCards();

    // Setup form submissions
    setupFormSubmissions();

    // Setup button event listeners
    setupButtonListeners();

    console.log('Application initialized');
});

// Check API Health
async function checkApiHealth() {
    try {
        console.log('Checking API health...');
        const response = await fetch(`${API_URL}/health`);

        if (!response.ok) {
            throw new Error(`API health check failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Health:', data);

        if (data.status === 'healthy') {
            showMessage('API connection established successfully!', 'success');
        } else {
            showMessage('API is available but reporting issues.', 'error');
        }
    } catch (error) {
        console.error('API Health Check Error:', error);
        showMessage('Failed to connect to the API. Please check your connection.', 'error');
    }
}

// Setup Tabs
function setupTabs() {
    console.log('Setting up tabs...');
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Tab clicked:', this.getAttribute('data-tab'));
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all tabs and buttons
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });

            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            // Add active class to selected tab and button
            const tabElement = document.getElementById(`${tabId}-tab`);
            if (tabElement) {
                tabElement.classList.add('active');
                this.classList.add('active');

                // Hide any previous results
                document.querySelectorAll('.results-section').forEach(section => {
                    section.style.display = 'none';
                });

                // Hide any messages
                hideMessages();
            } else {
                console.error(`Tab element with ID "${tabId}-tab" not found`);
            }
        });
    });
}

// Setup Option Cards
function setupOptionCards() {
    console.log('Setting up option cards...');

    // Card type selection
    const cardTypeOptions = document.querySelectorAll('.option-card[data-type]');
    cardTypeOptions.forEach(option => {
        option.addEventListener('click', function() {
            console.log('Card type selected:', this.getAttribute('data-type'));
            cardTypeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedCardType = this.getAttribute('data-type');
        });
    });

    // Summary style selection
    const summaryStyleOptions = document.querySelectorAll('.option-card[data-style]');
    summaryStyleOptions.forEach(option => {
        option.addEventListener('click', function() {
            console.log('Summary style selected:', this.getAttribute('data-style'));
            summaryStyleOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedSummaryStyle = this.getAttribute('data-style');
        });
    });
}

// Setup Form Submissions
function setupFormSubmissions() {
    console.log('Setting up form submissions...');

    // Flashcards form
    const flashcardsForm = document.getElementById('flashcards-form');
    if (flashcardsForm) {
        flashcardsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Flashcards form submitted');
            generateFlashcards();
        });
    } else {
        console.error('Flashcards form not found');
    }

    // Summary form
    const summaryForm = document.getElementById('summary-form');
    if (summaryForm) {
        summaryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Summary form submitted');
            generateSummary();
        });
    } else {
        console.error('Summary form not found');
    }

    // Quiz form
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Quiz form submitted');
            generateQuiz();
        });
    } else {
        console.error('Quiz form not found');
    }

    // Concept map form
    const conceptMapForm = document.getElementById('concept-map-form');
    if (conceptMapForm) {
        conceptMapForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Concept map form submitted');
            generateConceptMap();
        });
    } else {
        console.error('Concept map form not found');
    }

    // Study guide form
    const studyGuideForm = document.getElementById('study-guide-form');
    if (studyGuideForm) {
        studyGuideForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Study guide form submitted');
            generateStudyGuide();
        });
    } else {
        console.error('Study guide form not found');
    }
}

// Setup Button Listeners
function setupButtonListeners() {
    console.log('Setting up button event listeners...');

    // Flashcard controls
    document.getElementById('prev-card-btn')?.addEventListener('click', previousCard);
    document.getElementById('flip-card-btn')?.addEventListener('click', flipCard);
    document.getElementById('next-card-btn')?.addEventListener('click', nextCard);
    document.getElementById('mark-correct-btn')?.addEventListener('click', markCorrect);
    document.getElementById('mark-incorrect-btn')?.addEventListener('click', markIncorrect);
    document.getElementById('download-flashcards-btn')?.addEventListener('click', downloadFlashcards);

    // Quiz controls
    document.getElementById('check-answers-btn')?.addEventListener('click', checkAnswers);
    document.getElementById('reset-quiz-btn')?.addEventListener('click', resetQuiz);
    document.getElementById('download-quiz-btn')?.addEventListener('click', downloadQuiz);

    // Summary controls
    document.getElementById('download-summary-btn')?.addEventListener('click', downloadSummary);
    document.getElementById('copy-summary-btn')?.addEventListener('click', copySummary);

    // Concept map controls
    document.getElementById('download-concept-map-btn')?.addEventListener('click', downloadConceptMap);

    // Study guide controls
    document.getElementById('download-study-guide-btn')?.addEventListener('click', downloadStudyGuide);
    document.getElementById('copy-study-guide-btn')?.addEventListener('click', copyStudyGuide);
}

// Generate Flashcards
async function generateFlashcards() {
    console.log('Generating flashcards...');
    const textElement = document.getElementById('flashcard-text');
    if (!textElement) {
        console.error('Element with ID "flashcard-text" not found');
        showMessage('Error: Could not find the text input element.', 'error');
        return;
    }

    const text = textElement.value.trim();
    if (!text) {
        showMessage('Please enter some study material to generate flashcards.', 'error');
        return;
    }

    const subject = document.getElementById('subject')?.value.trim() || '';
    const difficulty = document.getElementById('difficulty')?.value || 'medium';
    const count = parseInt(document.getElementById('card-count')?.value || '5');

    showLoading('flashcards-tab');
    hideMessages();

    try {
        const requestBody = {
            text,
            subject,
            difficulty,
            count,
            card_type: selectedCardType,
            include_explanations: true
        };

        console.log('Sending request to API:', `${API_URL}/generate-flashcards`);
        console.log('Request body:', requestBody);

        const response = await fetch(`${API_URL}/generate-flashcards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Flashcards API response:', data);

        if (!data || !data.flashcards || !Array.isArray(data.flashcards) || data.flashcards.length === 0) {
            throw new Error('No flashcards were generated.');
        }

        flashcards = data.flashcards;
        currentCardIndex = 0;
        displayFlashcards();

        hideLoading('flashcards-tab');
        document.getElementById('flashcards-results').style.display = 'block';
        showMessage('Flashcards generated successfully!', 'success');
    } catch (error) {
        console.error('Flashcards generation error:', error);
        hideLoading('flashcards-tab');
        showMessage(`Failed to generate flashcards: ${error.message}`, 'error');
    }
}

// Display Flashcards
function displayFlashcards() {
    console.log('Displaying flashcards...');
    const container = document.getElementById('flashcard-container');
    if (!container) {
        console.error('Flashcard container not found');
        return;
    }

    container.innerHTML = '';

    if (flashcards.length === 0) {
        console.error('No flashcards to display');
        return;
    }

    const card = flashcards[currentCardIndex];
    const flashcardElement = document.createElement('div');
    flashcardElement.className = 'flashcard';

    // Front of card (question)
    const frontElement = document.createElement('div');
    frontElement.className = 'flashcard-front';
    frontElement.innerHTML = `
        <div class="flashcard-question">${card.question}</div>
        <div class="flashcard-meta">
            <span class="badge">${card.difficulty || 'Medium'}</span>
            <span class="badge">${card.card_type || 'Q&A'}</span>
        </div>
    `;

    // Back of card (answer)
    const backElement = document.createElement('div');
    backElement.className = 'flashcard-back';
    backElement.innerHTML = `
        <div class="flashcard-answer">${card.answer}</div>
        ${card.explanation ? `<div class="flashcard-explanation">${card.explanation}</div>` : ''}
    `;

    flashcardElement.appendChild(frontElement);
    flashcardElement.appendChild(backElement);
    container.appendChild(flashcardElement);

    // Update card counter
    const cardCounter = document.createElement('div');
    cardCounter.className = 'card-counter';
    cardCounter.textContent = `Card ${currentCardIndex + 1} of ${flashcards.length}`;
    cardCounter.style.textAlign = 'center';
    cardCounter.style.marginTop = '15px';
    container.appendChild(cardCounter);
}

// Flip Card
function flipCard() {
    console.log('Flipping card...');
    const flashcard = document.querySelector('.flashcard');
    if (flashcard) {
        flashcard.classList.toggle('flipped');
    } else {
        console.error('No flashcard found to flip');
    }
}

// Navigate to Previous Card
function previousCard() {
    console.log('Navigating to previous card...');
    if (currentCardIndex > 0) {
        currentCardIndex--;
        displayFlashcards();
    } else {
        console.log('Already at the first card');
    }
}

// Navigate to Next Card
function nextCard() {
    console.log('Navigating to next card...');
    if (currentCardIndex < flashcards.length - 1) {
        currentCardIndex++;
        displayFlashcards();
    } else {
        console.log('Already at the last card');
    }
}

// Mark Card as Correct
function markCorrect() {
    console.log('Marking card as correct...');
    if (flashcards.length === 0) return;

    flashcards[currentCardIndex].status = 'correct';
    nextCard();
}

// Mark Card as Incorrect
function markIncorrect() {
    console.log('Marking card as incorrect...');
    if (flashcards.length === 0) return;

    flashcards[currentCardIndex].status = 'incorrect';
    nextCard();
}

// Download Flashcards
function downloadFlashcards() {
    console.log('Downloading flashcards...');
    if (flashcards.length === 0) {
        console.error('No flashcards to download');
        return;
    }

    const fileName = 'flashcards.json';
    const fileContent = JSON.stringify(flashcards, null, 2);

    downloadFile(fileName, fileContent, 'application/json');
}

// Helper function to download a file
function downloadFile(fileName, content, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Show Loading
function showLoading(tabId) {
    console.log(`Showing loading for ${tabId}...`);
    const tab = document.getElementById(tabId);
    if (!tab) {
        console.error(`Tab with ID "${tabId}" not found`);
        return;
    }

    const loadingElement = tab.querySelector('.loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    } else {
        console.error(`Loading element not found in tab "${tabId}"`);
    }
}

// Hide Loading
function hideLoading(tabId) {
    console.log(`Hiding loading for ${tabId}...`);
    const tab = document.getElementById(tabId);
    if (!tab) {
        console.error(`Tab with ID "${tabId}" not found`);
        return;
    }

    const loadingElement = tab.querySelector('.loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    } else {
        console.error(`Loading element not found in tab "${tabId}"`);
    }
}

// Show Message
function showMessage(message, type = 'error') {
    console.log(`Showing ${type} message: ${message}`);
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) {
        console.error('No active tab found');
        return;
    }

    const messageClass = type === 'error' ? 'error-message' : 'success-message';
    const messageElement = activeTab.querySelector(`.${messageClass}`);

    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    } else {
        console.error(`Message element with class "${messageClass}" not found in active tab`);
    }
}

// Hide Messages
function hideMessages() {
    console.log('Hiding all messages...');
    document.querySelectorAll('.message').forEach(message => {
        message.style.display = 'none';
    });
}

// Generate Summary
async function generateSummary() {
    console.log('Generating summary...');
    const textElement = document.getElementById('summary-text');
    if (!textElement) {
        console.error('Element with ID "summary-text" not found');
        showMessage('Error: Could not find the summary text input element.', 'error');
        return;
    }

    const text = textElement.value.trim();
    if (!text) {
        showMessage('Please enter some text to summarize.', 'error');
        return;
    }

    const lengthElement = document.getElementById('summary-length');
    if (!lengthElement) {
        console.error('Element with ID "summary-length" not found');
        showMessage('Error: Could not find the summary length element.', 'error');
        return;
    }
    const length = lengthElement.value.toLowerCase();

    showLoading('summary-tab');
    hideMessages();

    try {
        // Ensure we're using the exact format from the Postman tests
        const requestBody = {
            text: text,
            style: selectedSummaryStyle,
            length: length
        };

        console.log('Sending request to API:', `${API_URL}/summarize`);
        console.log('Request body:', requestBody);

        const response = await fetch(`${API_URL}/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Summary API response:', data);

        if (!data || !data.content) {
            throw new Error('No summary content was generated.');
        }

        displaySummary(data);

        hideLoading('summary-tab');
        document.getElementById('summary-results').style.display = 'block';
        showMessage('Summary generated successfully!', 'success');
    } catch (error) {
        console.error('Summary generation error:', error);
        hideLoading('summary-tab');
        showMessage(`Failed to generate summary: ${error.message}`, 'error');
    }
}

// Display Summary
function displaySummary(data) {
    console.log('Displaying summary...');
    const container = document.getElementById('summary-container');
    if (!container) {
        console.error('Summary container not found');
        return;
    }

    container.innerHTML = '';

    // Create summary content
    const summaryContent = document.createElement('div');
    summaryContent.className = 'summary-content';

    if (selectedSummaryStyle === 'bullet_points' && data.key_points && Array.isArray(data.key_points)) {
        const keyPointsList = document.createElement('ul');
        keyPointsList.className = 'key-points-list';

        data.key_points.forEach(point => {
            const li = document.createElement('li');
            li.innerHTML = point;
            keyPointsList.appendChild(li);
        });

        summaryContent.appendChild(keyPointsList);
    } else {
        summaryContent.innerHTML = data.content;
    }

    container.appendChild(summaryContent);
}

// Copy Summary to Clipboard
function copySummary() {
    console.log('Copying summary to clipboard...');
    const container = document.getElementById('summary-container');
    if (!container || container.innerHTML === '') {
        console.error('No summary content to copy');
        showMessage('No summary content to copy.', 'error');
        return;
    }

    // Create a temporary element to hold the text content
    const tempElement = document.createElement('div');
    tempElement.innerHTML = container.innerHTML;

    // Extract text content (remove HTML tags)
    const textContent = tempElement.textContent;

    // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(textContent)
        .then(() => {
            showMessage('Summary copied to clipboard!', 'success');
        })
        .catch(err => {
            console.error('Failed to copy summary:', err);
            showMessage('Failed to copy summary: ' + err, 'error');
        });
}

// Download Summary
function downloadSummary() {
    console.log('Downloading summary...');
    const container = document.getElementById('summary-container');
    if (!container || container.innerHTML === '') {
        console.error('No summary content to download');
        showMessage('No summary content to download.', 'error');
        return;
    }

    // Create a simple text file with the summary content
    const tempElement = document.createElement('div');
    tempElement.innerHTML = container.innerHTML;
    const textContent = tempElement.textContent;

    downloadFile('summary.txt', textContent, 'text/plain');
    showMessage('Summary downloaded successfully!', 'success');
}
// Generate Quiz
async function generateQuiz() {
    console.log('Generating quiz...');
    const textElement = document.getElementById('quiz-text');
    if (!textElement) {
        console.error('Element with ID "quiz-text" not found');
        showMessage('Error: Could not find the quiz text input element.', 'error');
        return;
    }

    const text = textElement.value.trim();
    if (!text) {
        showMessage('Please enter some study material to generate a quiz.', 'error');
        return;
    }

    const questionCountElement = document.getElementById('question-count');
    if (!questionCountElement) {
        console.error('Element with ID "question-count" not found');
        showMessage('Error: Could not find the question count element.', 'error');
        return;
    }
    const questionCount = parseInt(questionCountElement.value);

    const difficultyElement = document.getElementById('quiz-difficulty');
    if (!difficultyElement) {
        console.error('Element with ID "quiz-difficulty" not found');
        showMessage('Error: Could not find the quiz difficulty element.', 'error');
        return;
    }
    const difficulty = difficultyElement.value;

    showLoading('quiz-tab');
    hideMessages();

    try {
        const requestBody = {
            text,
            question_count: questionCount,
            question_types: ['multiple_choice', 'true_false', 'short_answer'],
            difficulty
        };

        console.log('Sending request to API:', `${API_URL}/create-quiz`);
        console.log('Request body:', requestBody);

        const response = await fetch(`${API_URL}/create-quiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Quiz API response:', data);

        if (!data || !data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
            throw new Error('No quiz questions were generated.');
        }

        quizQuestions = data.questions;
        displayQuiz();

        hideLoading('quiz-tab');
        document.getElementById('quiz-results').style.display = 'block';
        showMessage('Quiz generated successfully!', 'success');
    } catch (error) {
        console.error('Quiz generation error:', error);
        hideLoading('quiz-tab');
        showMessage(`Failed to generate quiz: ${error.message}`, 'error');
    }
}

// Display Quiz
function displayQuiz() {
    console.log('Displaying quiz...');
    const container = document.getElementById('quiz-container');
    if (!container) {
        console.error('Quiz container not found');
        return;
    }

    container.innerHTML = '';

    if (quizQuestions.length === 0) {
        console.error('No quiz questions to display');
        return;
    }

    quizQuestions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'quiz-question';
        questionElement.id = `question-${index}`;

        let questionContent = `
            <div class="question-header">
                <div class="question-number">Question ${index + 1}</div>
                <div class="question-type">${formatQuestionType(question.type)}</div>
            </div>
            <div class="question-text">${question.question}</div>
        `;

        // Different question types
        if (question.type === 'multiple_choice') {
            questionContent += '<div class="quiz-options">';

            if (question.options && Array.isArray(question.options)) {
                question.options.forEach((option, optIndex) => {
                    questionContent += `
                        <div class="quiz-option">
                            <input type="radio" id="q${index}_opt${optIndex}" name="q${index}" value="${option}">
                            <label for="q${index}_opt${optIndex}">${option}</label>
                        </div>
                    `;
                });
            }

            questionContent += '</div>';
        } else if (question.type === 'true_false') {
            questionContent += `
                <div class="quiz-options">
                    <div class="quiz-option">
                        <input type="radio" id="q${index}_true" name="q${index}" value="true">
                        <label for="q${index}_true">True</label>
                    </div>
                    <div class="quiz-option">
                        <input type="radio" id="q${index}_false" name="q${index}" value="false">
                        <label for="q${index}_false">False</label>
                    </div>
                </div>
            `;
        } else if (question.type === 'short_answer') {
            questionContent += `
                <div class="quiz-short-answer">
                    <input type="text" class="short-answer-input" data-question="${index}" placeholder="Type your answer here...">
                </div>
            `;
        }

        // Hidden explanation (will be shown after checking answers)
        questionContent += `
            <div class="quiz-explanation" id="explanation-${index}" style="display: none;">
                <strong>Explanation:</strong> ${question.explanation || 'No explanation provided.'}
            </div>
            <div class="quiz-feedback" id="feedback-${index}"></div>
        `;

        questionElement.innerHTML = questionContent;
        container.appendChild(questionElement);
    });
}

// Format Question Type
function formatQuestionType(type) {
    switch (type) {
        case 'multiple_choice': return 'Multiple Choice';
        case 'true_false': return 'True/False';
        case 'short_answer': return 'Short Answer';
        default: return type;
    }
}

// Check Quiz Answers
function checkAnswers() {
    console.log('Checking quiz answers...');
    if (!quizQuestions || quizQuestions.length === 0) {
        console.error('No quiz questions to check');
        showMessage('No quiz questions to check.', 'error');
        return;
    }

    let score = 0;
    let totalPoints = quizQuestions.length;

    quizQuestions.forEach((question, index) => {
        const questionElement = document.getElementById(`question-${index}`);
        const feedbackElement = document.getElementById(`feedback-${index}`);

        if (!questionElement || !feedbackElement) {
            console.error(`Question or feedback element not found for question ${index}`);
            return;
        }

        let userAnswer = '';
        let isCorrect = false;

        if (question.type === 'multiple_choice') {
            const selectedOption = questionElement.querySelector(`input[name="q${index}"]:checked`);
            if (selectedOption) {
                userAnswer = selectedOption.value;
                isCorrect = userAnswer === question.correct_answer;
            }
        } else if (question.type === 'true_false') {
            const selectedOption = questionElement.querySelector(`input[name="q${index}"]:checked`);
            if (selectedOption) {
                userAnswer = selectedOption.value;
                isCorrect = userAnswer.toLowerCase() === String(question.correct_answer).toLowerCase();
            }
        } else if (question.type === 'short_answer') {
            const inputElement = questionElement.querySelector('.short-answer-input');
            if (inputElement) {
                userAnswer = inputElement.value.trim();
                // Simple exact match - in a real app, you might want more sophisticated matching
                isCorrect = userAnswer.toLowerCase() === String(question.correct_answer).toLowerCase();
            }
        }

        // Update UI with feedback
        if (!userAnswer) {
            feedbackElement.innerHTML = '<div class="feedback-unanswered">Not answered</div>';
            feedbackElement.className = 'quiz-feedback unanswered';
        } else if (isCorrect) {
            feedbackElement.innerHTML = '<div class="feedback-correct">Correct!</div>';
            feedbackElement.className = 'quiz-feedback correct';
            score++;
        } else {
            feedbackElement.innerHTML = `<div class="feedback-incorrect">Incorrect. The correct answer is: ${question.correct_answer}</div>`;
            feedbackElement.className = 'quiz-feedback incorrect';
        }

        // Show explanation
        const explanationElement = document.getElementById(`explanation-${index}`);
        if (explanationElement) {
            explanationElement.style.display = 'block';
        }
    });

    // Show score at the top
    const scoreElement = document.createElement('div');
    scoreElement.className = 'quiz-score';
    scoreElement.innerHTML = `
        <h3>Your Score: ${score}/${totalPoints} (${Math.round((score/totalPoints) * 100)}%)</h3>
        <p>${getScoreMessage(score/totalPoints)}</p>
    `;

    const container = document.getElementById('quiz-container');
    if (container) {
        // Remove any existing score element
        const existingScore = container.querySelector('.quiz-score');
        if (existingScore) {
            existingScore.remove();
        }

        container.insertBefore(scoreElement, container.firstChild);
    }
}

// Get Score Message
function getScoreMessage(percentage) {
    if (percentage >= 0.9) return 'Excellent! You have mastered this material.';
    if (percentage >= 0.8) return 'Great job! You have a strong understanding.';
    if (percentage >= 0.7) return 'Good work! You understand most of the material.';
    if (percentage >= 0.6) return 'Not bad! You are on the right track.';
    return 'Keep studying! Review the material and try again.';
}

// Reset Quiz
function resetQuiz() {
    console.log('Resetting quiz...');
    const container = document.getElementById('quiz-container');
    if (!container) {
        console.error('Quiz container not found');
        return;
    }

    if (!quizQuestions || quizQuestions.length === 0) {
        console.error('No quiz questions to reset');
        return;
    }

    displayQuiz();
    showMessage('Quiz has been reset.', 'success');
}

// Download Quiz
function downloadQuiz() {
    console.log('Downloading quiz...');
    if (!quizQuestions || quizQuestions.length === 0) {
        console.error('No quiz questions to download');
        showMessage('No quiz questions to download.', 'error');
        return;
    }

    const fileName = 'quiz.json';
    const fileContent = JSON.stringify(quizQuestions, null, 2);

    downloadFile(fileName, fileContent, 'application/json');
    showMessage('Quiz downloaded successfully!', 'success');
}
// Generate Concept Map
async function generateConceptMap() {
    console.log('Generating concept map...');
    const textElement = document.getElementById('concept-map-text');
    if (!textElement) {
        console.error('Element with ID "concept-map-text" not found');
        showMessage('Error: Could not find the concept map text input element.', 'error');
        return;
    }

    const text = textElement.value.trim();
    if (!text) {
        showMessage('Please enter some text to create a concept map.', 'error');
        return;
    }

    showLoading('concept-map-tab');
    hideMessages();

    try {
        const requestBody = {
            text,
            max_concepts: 10,
            show_relationships: true
        };

        console.log('Sending request to API:', `${API_URL}/concept-map`);
        console.log('Request body:', requestBody);

        const response = await fetch(`${API_URL}/concept-map`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Concept Map API response:', data);

        if (!data || !data.concepts || !data.relationships) {
            throw new Error('No concept map was generated.');
        }

        visualizeConceptMap(data);

        hideLoading('concept-map-tab');
        document.getElementById('concept-map-results').style.display = 'block';
        showMessage('Concept map generated successfully!', 'success');
    } catch (error) {
        console.error('Concept map generation error:', error);
        hideLoading('concept-map-tab');
        showMessage(`Failed to generate concept map: ${error.message}`, 'error');
    }
}

// Visualize Concept Map
function visualizeConceptMap(data) {
    console.log('Visualizing concept map...');
    const container = document.getElementById('concept-map-container');
    if (!container) {
        console.error('Concept map container not found');
        return;
    }

    container.innerHTML = '';

    // Create SVG element for the concept map
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "500");
    svg.setAttribute("viewBox", "0 0 800 500");
    container.appendChild(svg);

    const concepts = data.concepts;
    const relationships = data.relationships;

    // Calculate positions for concepts in a circular layout
    const centerX = 400;
    const centerY = 250;
    const radius = 200;

    // Find the central concept
    const centralConcept = concepts.find(c => c.is_central) || concepts[0];
    const conceptPositions = {};

    // Position the central concept in the middle
    conceptPositions[centralConcept.name] = { x: centerX, y: centerY };

    // Position other concepts in a circle around the central concept
    const otherConcepts = concepts.filter(c => c !== centralConcept);
    otherConcepts.forEach((concept, index) => {
        const angle = (2 * Math.PI * index) / otherConcepts.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        conceptPositions[concept.name] = { x, y };
    });

    // Draw relationships (lines) first so they appear behind the concepts
    relationships.forEach(rel => {
        const fromPos = conceptPositions[rel.from];
        const toPos = conceptPositions[rel.to];

        if (fromPos && toPos) {
            // Create line
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", fromPos.x);
            line.setAttribute("y1", fromPos.y);
            line.setAttribute("x2", toPos.x);
            line.setAttribute("y2", toPos.y);
            line.setAttribute("stroke", "#6c7ae0");
            line.setAttribute("stroke-width", "2");
            svg.appendChild(line);

            // Create relationship label
            if (rel.label) {
                const text = document.createElementNS(svgNS, "text");
                const midX = (fromPos.x + toPos.x) / 2;
                const midY = (fromPos.y + toPos.y) / 2;
                text.setAttribute("x", midX);
                text.setAttribute("y", midY);
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("fill", "#555");
                text.setAttribute("font-size", "12");
                text.textContent = rel.label;

                // Add background to make text more readable
                const bg = document.createElementNS(svgNS, "rect");
                const padding = 3;
                // Estimate text size based on label length
                const textWidth = rel.label.length * 7;
                const textHeight = 16;
                bg.setAttribute("x", midX - textWidth / 2 - padding);
                bg.setAttribute("y", midY - textHeight + padding);
                bg.setAttribute("width", textWidth + padding * 2);
                bg.setAttribute("height", textHeight + padding);
                bg.setAttribute("fill", "white");
                bg.setAttribute("opacity", "0.7");
                svg.appendChild(bg);
                svg.appendChild(text);
            }
        }
    });

    // Draw concepts (nodes)
    concepts.forEach(concept => {
        const pos = conceptPositions[concept.name];
        if (!pos) return;

        // Create circle for concept
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", pos.x);
        circle.setAttribute("cy", pos.y);
        circle.setAttribute("r", concept.is_central ? 50 : 40);
        circle.setAttribute("fill", concept.is_central ? "#4a55e5" : "#6c7ae0");
        svg.appendChild(circle);

        // Create text for concept name
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", pos.x);
        text.setAttribute("y", pos.y);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("fill", "white");
        text.setAttribute("font-weight", concept.is_central ? "bold" : "normal");
        text.setAttribute("font-size", concept.is_central ? "16" : "14");

        // Handle long concept names by wrapping text
        const words = concept.name.split(' ');
        let line = '';
        let lineHeight = 16;
        let yOffset = concept.is_central ? -lineHeight/2 * (words.length - 1) : -lineHeight/2 * (words.length - 1);

        words.forEach(word => {
            if (line.length + word.length > 15) {
                const tspan = document.createElementNS(svgNS, "tspan");
                tspan.setAttribute("x", pos.x);
                tspan.setAttribute("y", pos.y + yOffset);
                tspan.textContent = line;
                text.appendChild(tspan);
                line = word;
                yOffset += lineHeight;
            } else {
                if (line) line += ' ';
                line += word;
            }
        });

        if (line) {
            const tspan = document.createElementNS(svgNS, "tspan");
            tspan.setAttribute("x", pos.x);
            tspan.setAttribute("y", pos.y + yOffset);
            tspan.textContent = line;
            text.appendChild(tspan);
        }

        svg.appendChild(text);
    });
}

// Download Concept Map
function downloadConceptMap() {
    console.log('Downloading concept map...');
    const container = document.getElementById('concept-map-container');
    if (!container || !container.querySelector('svg')) {
        console.error('No concept map to download');
        showMessage('No concept map to download.', 'error');
        return;
    }

    // Get SVG content
    const svg = container.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);

    downloadFile('concept_map.svg', svgData, 'image/svg+xml');
    showMessage('Concept map downloaded successfully!', 'success');
}
// Generate Study Guide
async function generateStudyGuide() {
    console.log('Generating study guide...');
    const textElement = document.getElementById('study-guide-text');
    if (!textElement) {
        console.error('Element with ID "study-guide-text" not found');
        showMessage('Error: Could not find the study guide text input element.', 'error');
        return;
    }

    const text = textElement.value.trim();
    if (!text) {
        showMessage('Please enter some study material to generate a study guide.', 'error');
        return;
    }

    const subjectElement = document.getElementById('study-guide-subject');
    if (!subjectElement) {
        console.error('Element with ID "study-guide-subject" not found');
        showMessage('Error: Could not find the study guide subject element.', 'error');
        return;
    }
    const subject = subjectElement.value.trim();

    // We don't need the level for the API request based on the Postman tests
    // But we'll keep the validation for UI consistency
    const levelElement = document.getElementById('study-guide-level');
    if (!levelElement) {
        console.error('Element with ID "study-guide-level" not found');
        showMessage('Error: Could not find the study guide level element.', 'error');
        return;
    }

    showLoading('study-guide-tab');
    hideMessages();

    try {
        const requestBody = {
            text: text,
            subject: subject,
            focus_areas: ["structure", "replication", "function"],
            include_examples: true
        };

        console.log('Sending request to API:', `${API_URL}/study-guide`);
        console.log('Request body:', requestBody);

        const response = await fetch(`${API_URL}/study-guide`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Study Guide API response:', data);

        if (!data || !data.key_concepts) {
            throw new Error('No study guide was generated.');
        }

        displayStudyGuide(data);

        hideLoading('study-guide-tab');
        document.getElementById('study-guide-results').style.display = 'block';
        showMessage('Study guide generated successfully!', 'success');
    } catch (error) {
        console.error('Study guide generation error:', error);
        hideLoading('study-guide-tab');
        showMessage(`Failed to generate study guide: ${error.message}`, 'error');
    }
}

// Display Study Guide
function displayStudyGuide(data) {
    console.log('Displaying study guide...');
    const container = document.getElementById('study-guide-container');
    if (!container) {
        console.error('Study guide container not found');
        return;
    }

    container.innerHTML = '';

    // Create title
    const title = document.createElement('h2');
    title.className = 'study-guide-title';
    title.textContent = data.title || 'Study Guide';
    container.appendChild(title);

    // Create overview if available
    if (data.overview) {
        const overview = document.createElement('div');
        overview.className = 'study-guide-overview';
        overview.innerHTML = `<p>${data.overview}</p>`;
        container.appendChild(overview);
    }

    // Create key concepts section
    const conceptsSection = document.createElement('div');
    conceptsSection.className = 'study-guide-section';

    const conceptsTitle = document.createElement('h3');
    conceptsTitle.className = 'section-title';
    conceptsTitle.textContent = 'Key Concepts';
    conceptsSection.appendChild(conceptsTitle);

    // Add key concepts
    if (data.key_concepts && Array.isArray(data.key_concepts)) {
        data.key_concepts.forEach(concept => {
            const conceptElement = document.createElement('div');
            conceptElement.className = 'guide-concept';

            const conceptTitle = document.createElement('h4');
            conceptTitle.className = 'concept-title';
            conceptTitle.textContent = concept.concept;
            conceptElement.appendChild(conceptTitle);

            if (concept.definition) {
                const definition = document.createElement('div');
                definition.className = 'concept-definition';
                definition.innerHTML = `<strong>Definition:</strong> ${concept.definition}`;
                conceptElement.appendChild(definition);
            }

            if (concept.explanation) {
                const explanation = document.createElement('div');
                explanation.className = 'concept-explanation';
                explanation.innerHTML = concept.explanation;
                conceptElement.appendChild(explanation);
            }

            if (concept.example) {
                const example = document.createElement('div');
                example.className = 'concept-example';
                example.innerHTML = `<strong>Example:</strong> ${concept.example}`;
                conceptElement.appendChild(example);
            }

            if (concept.importance) {
                const importance = document.createElement('div');
                importance.className = 'concept-importance';
                importance.innerHTML = `<strong>Importance:</strong> ${concept.importance}`;
                conceptElement.appendChild(importance);
            }

            conceptsSection.appendChild(conceptElement);
        });
    }

    container.appendChild(conceptsSection);

    // Add study tips if available
    if (data.study_tips && Array.isArray(data.study_tips)) {
        const tipsSection = document.createElement('div');
        tipsSection.className = 'study-guide-section';

        const tipsTitle = document.createElement('h3');
        tipsTitle.className = 'section-title';
        tipsTitle.textContent = 'Study Tips';
        tipsSection.appendChild(tipsTitle);

        const tipsList = document.createElement('ul');
        tipsList.className = 'study-tips-list';

        data.study_tips.forEach(tip => {
            const tipItem = document.createElement('li');
            tipItem.textContent = tip;
            tipsList.appendChild(tipItem);
        });

        tipsSection.appendChild(tipsList);
        container.appendChild(tipsSection);
    }

    // Add practice questions if available
    if (data.practice_questions && Array.isArray(data.practice_questions)) {
        const questionsSection = document.createElement('div');
        questionsSection.className = 'study-guide-section';

        const questionsTitle = document.createElement('h3');
        questionsTitle.className = 'section-title';
        questionsTitle.textContent = 'Practice Questions';
        questionsSection.appendChild(questionsTitle);

        data.practice_questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.className = 'practice-question';

            const questionText = document.createElement('p');
            questionText.className = 'question-text';
            questionText.innerHTML = `<strong>Q${index + 1}:</strong> ${question.question}`;
            questionElement.appendChild(questionText);

            const answerText = document.createElement('p');
            answerText.className = 'answer-text';
            answerText.innerHTML = `<strong>Answer:</strong> ${question.answer}`;
            questionElement.appendChild(answerText);

            questionsSection.appendChild(questionElement);
        });

        container.appendChild(questionsSection);
    }

    // Add review checklist if available
    if (data.review_checklist && Array.isArray(data.review_checklist)) {
        const checklistSection = document.createElement('div');
        checklistSection.className = 'study-guide-section';

        const checklistTitle = document.createElement('h3');
        checklistTitle.className = 'section-title';
        checklistTitle.textContent = 'Review Checklist';
        checklistSection.appendChild(checklistTitle);

        const checklist = document.createElement('ul');
        checklist.className = 'review-checklist';

        data.review_checklist.forEach(item => {
            const checklistItem = document.createElement('li');
            checklistItem.textContent = item;
            checklist.appendChild(checklistItem);
        });

        checklistSection.appendChild(checklist);
        container.appendChild(checklistSection);
    }
}

// Download Study Guide
function downloadStudyGuide() {
    console.log('Downloading study guide...');
    const container = document.getElementById('study-guide-container');
    if (!container || container.innerHTML === '') {
        console.error('No study guide to download');
        showMessage('No study guide to download.', 'error');
        return;
    }

    // Create a simple HTML document with the study guide content
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Study Guide</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1, h2, h3, h4 { color: #4a55e5; }
                .guide-concept { margin-bottom: 20px; border-left: 3px solid #6c7ae0; padding-left: 15px; }
                .concept-title { margin-bottom: 5px; }
                .concept-definition, .concept-explanation, .concept-example { margin-bottom: 10px; }
                .study-guide-summary { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            </style>
        </head>
        <body>
            ${container.innerHTML}
        </body>
        </html>
    `;

    downloadFile('study_guide.html', htmlContent, 'text/html');
    showMessage('Study guide downloaded successfully!', 'success');
}

// Copy Study Guide to Clipboard
function copyStudyGuide() {
    console.log('Copying study guide to clipboard...');
    const container = document.getElementById('study-guide-container');
    if (!container || container.innerHTML === '') {
        console.error('No study guide to copy');
        showMessage('No study guide to copy.', 'error');
        return;
    }

    // Create a temporary element to hold the text content
    const tempElement = document.createElement('div');
    tempElement.innerHTML = container.innerHTML;

    // Extract text content (remove HTML tags)
    const textContent = tempElement.textContent;

    // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(textContent)
        .then(() => {
            showMessage('Study guide copied to clipboard!', 'success');
        })
        .catch(err => {
            console.error('Failed to copy study guide:', err);
            showMessage('Failed to copy study guide: ' + err, 'error');
        });
}
