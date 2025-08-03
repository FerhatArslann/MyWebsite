document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            formMessage.textContent = "Please fill in all fields.";
            formMessage.style.color = "red";
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            const result = await response.json();
            if (result.success) {
                formMessage.textContent = "Thank you for contacting me!";
                formMessage.style.color = "green";
                form.reset();
            } else {
                formMessage.textContent = "Error sending message. Please try again.";
                formMessage.style.color = "red";
            }
        } catch (err) {
            formMessage.textContent = "Error sending message. Please try again.";
            formMessage.style.color = "red";
        }
    });
});