// contact.js

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");
    const message = document.getElementById('message');
    const counter = document.getElementById('message-counter');
    let lastSubmit = 0;

    // Remove default HTML5 validation popups
    if (form) {
        form.setAttribute('novalidate', 'novalidate');
    }

    // Helper to show error below field
    function showFieldError(field, msg) {
        let errorElem = field.parentElement.querySelector('.field-error');
        if (!errorElem) {
            errorElem = document.createElement('div');
            errorElem.className = 'field-error';
            field.parentElement.appendChild(errorElem);
        }
        errorElem.textContent = msg;
        errorElem.style.color = "#FF6584";
        errorElem.style.fontSize = "0.98rem";
        errorElem.style.marginTop = "6px";
        errorElem.style.fontFamily = "'Poppins',sans-serif";
        errorElem.style.transition = "color 0.2s";
    }

    function clearFieldError(field) {
        let errorElem = field.parentElement.querySelector('.field-error');
        if (errorElem) errorElem.textContent = "";
    }

    // Live character counter for message
    if (message && counter) {
        message.addEventListener('input', function() {
            counter.textContent = `${message.value.length} / 5000`;
            clearFieldError(message);
        });
    }

    // Clear errors on input
    ['name','email','phone','company','subject','message'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => clearFieldError(input));
        }
    });

    form.addEventListener("submit", async function(e) {
        const now = Date.now();
        if (now - lastSubmit < 30000) {
            e.preventDefault();
            formMessage.textContent = 'Please wait before sending another message.';
            formMessage.style.color = "#FF6584";
            return false;
        }
        lastSubmit = now;

        e.preventDefault();

        // Clear previous field errors
        ['name','email','phone','company','subject','message'].forEach(id => {
            const input = document.getElementById(id);
            if (input) clearFieldError(input);
        });
        formMessage.textContent = "";

        // Get trimmed values
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const company = form.company.value.trim();
        const subject = form.subject.value.trim();
        const messageValue = form.message.value.trim();

        // Field validation
        let hasError = false;
        if (!name) {
            showFieldError(form.name, "Full Name is required.");
            hasError = true;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFieldError(form.email, "Email is required.");
            hasError = true;
        }
        // Optionally validate phone number if required
        // if (!phone || !/^[\d\s\-\+\(\)]+$/.test(phone)) {
        //     showFieldError(form.phone, "Phone Number is required.");
        //     hasError = true;
        // }
        if (!subject) {
            showFieldError(form.subject, "Subject is required.");
            hasError = true;
        }
        if (!messageValue) {
            showFieldError(form.message, "Message is required.");
            hasError = true;
        }
        // Optionally validate company name if required
        // if (!company) {
        //     showFieldError(form.company, "Company Name is required.");
        //     hasError = true;
        // }

        if (hasError) return;

        formMessage.textContent = "Sending...";
        formMessage.style.color = "orange";

        try {
            const response = await fetch('http://localhost:3001/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, company, subject, message: messageValue })
            });
            const result = await response.json();

            if (result.success) {
                formMessage.textContent = "Thank you for contacting me!";
                formMessage.style.color = "green";
                form.reset();
                counter.textContent = "0 / 5000";
            } else {
                formMessage.textContent = "Error sending message. Please try again.";
                formMessage.style.color = "red";
            }
        } catch (err) {
            formMessage.textContent = "Error sending message. Please try again.";
            formMessage.style.color = "red";
        }

        // Optionally disable the button to prevent double submit
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            setTimeout(() => {
                submitBtn.disabled = false;
            }, 30000);
        }
    });
});
