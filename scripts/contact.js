// contact.js

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");
    const message = document.getElementById('message');
    const counter = document.getElementById('message-counter');
    let messageTimeout = null;

    // Use localStorage to persist cooldown across page refresh
    function getCooldownEnd() {
        return parseInt(localStorage.getItem('contactCooldownEnd') || "0", 10);
    }
    function setCooldownEnd(ts) {
        localStorage.setItem('contactCooldownEnd', ts.toString());
    }
    function clearCooldownEnd() {
        localStorage.removeItem('contactCooldownEnd');
    }

    let canSend = true;

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

    // Placeholder text only shown when clicking (focusing) on the field before submit
    const placeholders = {
        name: "Please enter your full name",
        email: "Please enter your email address",
        phone: "Please enter your phone number",
        company: "Please enter your company name",
        subject: "Please enter a subject",
        message: "Please enter your message"
    };

    Object.keys(placeholders).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('focus', () => {
                if (!input.value) input.placeholder = placeholders[id];
            });
            input.addEventListener('blur', () => {
                input.placeholder = "";
            });
            input.addEventListener('input', () => clearFieldError(input));
        }
    });

    form.addEventListener("submit", async function(e) {
        const now = Date.now();
        e.preventDefault();

        // Clear previous field errors
        Object.keys(placeholders).forEach(id => {
            const input = document.getElementById(id);
            if (input) clearFieldError(input);
        });

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
        if (phone) {
            const phonePattern = /^[\d\+\-\(\)\.\s]{7,20}$/;
            if (!phonePattern.test(phone)) {
                showFieldError(form.phone, "Phone number is invalid. Allowed symbols: + ( ) - . space");
                hasError = true;
            }
        }
        if (!subject) {
            showFieldError(form.subject, "Subject is required.");
            hasError = true;
        }
        if (!messageValue) {
            showFieldError(form.message, "Message is required.");
            hasError = true;
        }

        // Only show cooldown notification if cooldown is active AND user tries to submit again
        const cooldownEnd = getCooldownEnd();
        if (cooldownEnd > now) {
            formMessage.textContent = 'Please wait before sending another message.';
            formMessage.style.color = "#FF6584";
            clearTimeout(messageTimeout);
            messageTimeout = setTimeout(() => {
                formMessage.textContent = "";
                canSend = true;
                clearCooldownEnd();
            }, cooldownEnd - now);
            // Continue to show field errors if any
            return false;
        }

        if (hasError) {
            canSend = true;
            formMessage.textContent = "";
            return;
        }

        formMessage.textContent = "Sending...";
        formMessage.style.color = "#fac460ff";

        try {
            const response = await fetch('http://localhost:3001/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, company, subject, message: messageValue })
            });
            const result = await response.json();

            if (result.success) {
                clearTimeout(messageTimeout);
                formMessage.textContent = "Thank you for contacting me!";
                formMessage.style.color = "#61ff66ff";
                form.reset();
                counter.textContent = "0 / 5000";
                Object.keys(placeholders).forEach(id => {
                    const input = document.getElementById(id);
                    if (input) input.placeholder = "";
                });
                // Set cooldown end timestamp in localStorage
                const cooldownEndTime = Date.now() + 60000;
                setCooldownEnd(cooldownEndTime);

                // Hide success message after 10 seconds
                messageTimeout = setTimeout(() => {
                    formMessage.textContent = "";
                }, 10000);
            } else {
                formMessage.textContent = "Error sending message. Please try again.";
                formMessage.style.color = "#FF6584";
                canSend = true;
            }
        } catch (err) {
            formMessage.textContent = "Error sending message. Please try again.";
            formMessage.style.color = "#FF6584";
            canSend = true;
        }
    });
});
