// Key for localStorage
const STORAGE_KEY = 'complaintSysData';

/**
 * Handle form submission
 * @param {Event} event 
 */
function handleFormSubmit(event) {
    event.preventDefault();

    // Get form elements
    const name = document.getElementById('name').value.trim();
    const city = document.getElementById('city').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const email = document.getElementById('email').value.trim();
    const complaintText = document.getElementById('complaint').value.trim();

    // Basic validation
    if (!name || !city || !mobile || !email || !complaintText) {
        alert("Please fill in all fields.");
        return;
    }

    // Create complaint object
    const newComplaint = {
        id: Date.now().toString(),
        name,
        city,
        mobile,
        email,
        complaintText,
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
    };

    // Save to localStorage
    saveComplaint(newComplaint);

    // Simulate SMS on Mobile
    alert(`SMS Sent to ${mobile}:\n"Dear ${name}, your complaint from ${city} has been registered successfully. ID: ${newComplaint.id}"`);

    // Reset form and redirect
    document.getElementById('complaintForm').reset();
    window.location.href = 'index.html';
}

/**
 * Save a single complaint to localStorage
 * @param {Object} complaint 
 */
function saveComplaint(complaint) {
    let complaints = getComplaints();
    complaints.unshift(complaint); // Add to the beginning (newest first)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

/**
 * Get all complaints from localStorage
 * @returns {Array}
 */
function getComplaints() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

/**
 * Load and display complaints on the index page
 */
function loadComplaints() {
    const container = document.getElementById('complaintsContainer');
    if (!container) return; // Not on the index page

    const complaints = getComplaints();

    if (complaints.length === 0) {
        container.innerHTML = `<div class="empty-state">
            <h3>No complaints found.</h3>
            <p style="margin-top:0.5rem">Everything is running smoothly.</p>
        </div>`;
        return;
    }

    container.innerHTML = ''; // Clear loading/empty state

    complaints.forEach(item => {
        const card = document.createElement('div');
        card.className = 'complaint-card';
        card.innerHTML = `
            <div class="card-header">
                <span class="card-title">${escapeHTML(item.name)}</span>
                <span class="card-date">${item.date}</span>
            </div>
            <div class="card-body">
                <p>${escapeHTML(item.complaintText)}</p>
            </div>
            <div class="card-footer">
                <span>📍 ${escapeHTML(item.city)}</span>
                <span>✉️ ${escapeHTML(item.email)}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Utility to escape HTML to prevent XSS
 * @param {string} str 
 */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}
