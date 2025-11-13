// --- APPS SCRIPT FORM SUBMISSION LOGIC ---
function setupContactFormHandler() {
    const form = document.getElementById('contactForm');
    if (!form) return; 

    // Ensure these elements exist in the HTML structure
    const statusMessage = document.getElementById('formStatusMessage'); 
    const submitButton = document.getElementById('submitButton');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!statusMessage || !submitButton) {
             // Fallback for debugging
             console.error("Form feedback elements not found. Check HTML IDs.");
             return;
        }

        // 1. Initial UI Feedback (Sending...)
        statusMessage.textContent = 'Sending message...';
        statusMessage.className = 'text-center font-semibold text-gray-500 mt-4';
        submitButton.disabled = true;
        // The innerHTML changes below assume you have a CSS class/utility for font-weight and margin.
        submitButton.innerHTML = '<i data-lucide="loader-circle" class="animate-spin w-4 h-4 mr-2"></i> Sending...';
        lucide.createIcons(); 

        // 2. Prepare Form Data (using URLSearchParams for Apps Script compatibility)
        const formData = new FormData(form);
        const data = new URLSearchParams();
        for (const pair of formData) {
            data.append(pair[0], pair[1]);
        }

        // 3. Fetch Request
        fetch(WEB_APP_URL, {
            method: 'POST',
            body: data
        })
        .then(response => {
            // FIX: The Apps Script returns TEXT, not JSON, so we just check the status.
            if (response.ok) {
                // Success path
                statusMessage.textContent = 'Message successfully sent! We will be in touch shortly.';
                statusMessage.className = 'text-center font-semibold text-green-500 mt-4';
                form.reset(); 
            } else {
                // Failure path (e.g., HTTP 404 or 500)
                throw new Error('Server error: Apps Script URL failed to respond correctly.');
            }
        })
        .catch(error => {
            console.error('Submission Error:', error);
            statusMessage.textContent = 'Failed to send message. Please check the Apps Script deployment or try again later.';
            statusMessage.className = 'text-center font-semibold text-red-500 mt-4';
        })
        .finally(() => {
            // 4. Final UI Reset
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message <i data-lucide="send"></i>';
            lucide.createIcons(); 
        });
    });
}