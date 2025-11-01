// scipt.js (Located in the 'frontend' folder, executed by index.html)

// Get the main form element by its ID
const mainForm = document.getElementById('mainForm');

// ======= POPUP FOR FORM (MAIN & SIDEBAR) =======
const modal = document.getElementById("loginmodel");
const openLinks = [document.getElementById("loginlink"), document.getElementById("poplink")];
const closeBtn = document.querySelector(".close");

// Open form popup from both "Let's Work" links
openLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        closeAllPopups(); 
        modal.style.display = "flex";
    });
});

// Close form popup
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// ======= SUCCESS POPUP AND SUBMISSION LOGIC (INTEGRATED) =======
const successPopup = document.querySelector(".submiteform");
const closeSuccess = document.querySelector(".close1");
const submitButton = document.getElementById('submite'); // Get the submit button

mainForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop the default form submission (page reload)

    // Collect data from the form using FormData for robustness
    const formData = new FormData(mainForm);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Client-side validation
    if (
        data.name.trim() === "" ||
        data.email.trim() === "" ||
        data.prompt.trim() === "" ||
        data.about.trim() === ""
    ) {
        alert("Please fill out all required fields before submitting!");
        return;
    }

    // Indicate sending status
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
        // 🎯 Send data to the backend API endpoint
        const response = await fetch('http://localhost:5500/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            // Log the detailed error from the server console
            throw new Error(result.message || 'Server failed to process submission.');
        }

        // Submission successful:
        mainForm.reset(); // Clear the form fields
        modal.style.display = "none"; // Close the main form popup
        successPopup.style.display = "flex"; // Show the success popup

    } catch (err) {
        // This displays the error you were seeing, telling you to check the server.
        console.error('Submission Error:', err); 
        alert(`Failed to submit the form! Details: ${err.message}. Please check your server console for the Nodemailer error.`);

    } finally {
        // Reset the button regardless of success/failure
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
});

// Close success popup
closeSuccess.addEventListener("click", () => {
    successPopup.style.display = "none";
});

// ======= SIDEBAR and other existing logic (unchanged) =======
const sideBarBtn = document.getElementById("btn");
const closeBtn2 = document.querySelector(".close2");
const sidebar = document.querySelector(".asidebar");

// Open sidebar
sideBarBtn.addEventListener("click", () => {
    closeAllPopups();
    sidebar.style.display = "block";
});

// Close sidebar
closeBtn2.addEventListener("click", () => {
    sidebar.style.display = "none";
});

// ======= CLICK OUTSIDE POPUP TO CLOSE =======
window.addEventListener("click", (event) => {
    if (event.target === modal) modal.style.display = "none";
    if (event.target === successPopup) successPopup.style.display = "none";
    if (event.target === sidebar) sidebar.style.display = "none";
});

// ======= HELPER FUNCTION TO CLOSE ALL =======
function closeAllPopups() {
    modal.style.display = "none";
    sidebar.style.display = "none";
}
// ======= SCROLL ANIMATION HELPER (Left as is) =======
(function() {
    const els = document.querySelectorAll('[data-animate]');
    if (!('IntersectionObserver' in window)) {
        els.forEach(e => e.classList.add('in-view'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target); // animate once
            }
        });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
})();