document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check if the user has a preference stored
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || !localStorage.getItem('darkMode');

    // Set initial mode
    body.classList.toggle('light-mode', !isDarkMode);
    updateButtonText();
    Prism.highlightAll(); // Highlight code on initial load

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isDarkMode = !body.classList.contains('light-mode');
        localStorage.setItem('darkMode', isDarkMode);
        updateButtonText();
        Prism.highlightAll(); // Re-highlight code after changing theme
    });

    function updateButtonText() {
        darkModeToggle.textContent = body.classList.contains('light-mode') ? 'Dark Mode' : 'Light Mode';
    }
});
