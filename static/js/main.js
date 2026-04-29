document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentSlides = [];
    let currentTheme = 'minimal_white';
    let currentTopic = '';

    // DOM Elements
    const topicInput = document.getElementById('topic');
    const levelSelect = document.getElementById('level');
    const lengthSelect = document.getElementById('length');
    const themeSelect = document.getElementById('theme');
    
    const btnSuggest = document.getElementById('btn-suggest');
    const suggestionsList = document.getElementById('suggestions-list');
    
    const btnGenerate = document.getElementById('btn-generate');
    const btnRegenerate = document.getElementById('btn-regenerate');
    const btnBack = document.getElementById('btn-back');
    const btnDownload = document.getElementById('btn-download');
    const btnStartOver = document.getElementById('btn-start-over');
    
    const inputSection = document.getElementById('input-section');
    const previewSection = document.getElementById('preview-section');
    const successMessage = document.getElementById('success-message');
    const slidesContainer = document.getElementById('slides-container');
    
    const historyList = document.getElementById('history-list');

    // Initialize History
    loadHistory();

    // Event Listeners
    btnSuggest.addEventListener('click', fetchSuggestions);
    btnGenerate.addEventListener('click', generateOutline);
    btnRegenerate.addEventListener('click', generateOutline);
    
    btnBack.addEventListener('click', () => {
        showSection(inputSection);
    });
    
    btnStartOver.addEventListener('click', () => {
        topicInput.value = '';
        showSection(inputSection);
    });
    
    btnDownload.addEventListener('click', downloadPPT);

    // Functions
    function showSection(section) {
        inputSection.classList.add('hidden');
        previewSection.classList.add('hidden');
        successMessage.classList.add('hidden');
        
        section.classList.remove('hidden');
        section.classList.add('active');
    }

    function toggleLoader(button, isLoading) {
        const text = button.querySelector('.btn-text');
        const loader = button.querySelector('.loader');
        
        if (isLoading) {
            text.classList.add('hidden');
            loader.classList.remove('hidden');
            button.disabled = true;
        } else {
            text.classList.remove('hidden');
            loader.classList.add('hidden');
            button.disabled = false;
        }
    }

    async function fetchSuggestions() {
        const topic = topicInput.value.trim();
        if (!topic) {
            alert('Please enter a topic first.');
            return;
        }

        const originalText = btnSuggest.innerText;
        btnSuggest.innerText = 'Loading...';
        btnSuggest.disabled = true;

        try {
            const response = await fetch('/api/suggest-titles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic })
            });
            const data = await response.json();
            
            if (data.titles && data.titles.length > 0) {
                suggestionsList.innerHTML = '';
                data.titles.forEach(title => {
                    const chip = document.createElement('div');
                    chip.className = 'suggestion-chip';
                    chip.innerText = title;
                    chip.addEventListener('click', () => {
                        topicInput.value = title;
                        suggestionsList.classList.add('hidden');
                    });
                    suggestionsList.appendChild(chip);
                });
                suggestionsList.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            btnSuggest.innerText = originalText;
            btnSuggest.disabled = false;
        }
    }

    async function generateOutline() {
        const topic = topicInput.value.trim();
        if (!topic) {
            alert('Please enter a presentation topic.');
            return;
        }

        const level = levelSelect.value;
        const length = lengthSelect.value;
        currentTheme = themeSelect.value;
        currentTopic = topic;

        saveToHistory(topic);

        const btn = inputSection.classList.contains('hidden') ? btnRegenerate : btnGenerate;
        toggleLoader(btn, true);

        try {
            const response = await fetch('/api/generate-outline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, level, length })
            });
            
            const data = await response.json();
            if (data.slides && data.slides.length > 0) {
                currentSlides = data.slides;
                renderPreview(currentSlides);
                showSection(previewSection);
            } else {
                alert('Failed to generate outline. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            toggleLoader(btn, false);
        }
    }

    function renderPreview(slides) {
        slidesContainer.innerHTML = '';
        
        slides.forEach((slide, index) => {
            const card = document.createElement('div');
            card.className = 'slide-card';
            
            // Title Input
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.value = slide.title;
            titleInput.addEventListener('input', (e) => {
                currentSlides[index].title = e.target.value;
            });
            
            // Slide Number Badge
            const badge = document.createElement('div');
            badge.className = 'slide-number';
            badge.innerText = `Slide ${index + 1}`;
            card.appendChild(badge);
            
            card.appendChild(titleInput);
            
            // Bullets Container
            const bulletsContainer = document.createElement('div');
            bulletsContainer.className = 'slide-bullets';
            
            slide.bullets.forEach((bullet, bIndex) => {
                const bulletRow = document.createElement('div');
                bulletRow.className = 'slide-bullet';
                
                const textArea = document.createElement('textarea');
                textArea.value = bullet;
                textArea.rows = 2;
                textArea.addEventListener('input', (e) => {
                    currentSlides[index].bullets[bIndex] = e.target.value;
                });
                
                bulletRow.appendChild(textArea);
                bulletsContainer.appendChild(bulletRow);
            });
            
            card.appendChild(bulletsContainer);
            slidesContainer.appendChild(card);
        });
    }

    async function downloadPPT() {
        toggleLoader(btnDownload, true);
        
        try {
            const response = await fetch('/api/generate-ppt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: currentTopic,
                    theme: currentTheme,
                    slides: currentSlides
                })
            });
            
            if (response.ok) {
                // Handle file download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // create safe filename
                const safeName = currentTopic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                a.download = `${safeName}.pptx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                
                showSection(successMessage);
            } else {
                alert('Failed to generate PPT. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during download.');
        } finally {
            toggleLoader(btnDownload, false);
        }
    }

    // Local Storage History
    function saveToHistory(topic) {
        let history = JSON.parse(localStorage.getItem('ppt_history') || '[]');
        if (!history.includes(topic)) {
            history.unshift(topic);
            if (history.length > 5) history.pop();
            localStorage.setItem('ppt_history', JSON.stringify(history));
            loadHistory();
        }
    }

    function loadHistory() {
        let history = JSON.parse(localStorage.getItem('ppt_history') || '[]');
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = '<span style="color:var(--text-muted); font-size:0.85rem;">No recent topics</span>';
            return;
        }
        
        history.forEach(topic => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerText = topic;
            item.addEventListener('click', () => {
                topicInput.value = topic;
            });
            historyList.appendChild(item);
        });
    }
});
