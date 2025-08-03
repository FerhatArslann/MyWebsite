document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    form.addEventListener("submit", async function(e) {
        e.preventDefault(); // Prevent default form submission (page reload)

        // Show a sending message to the user
        formMessage.textContent = "Sending...";
        formMessage.style.color = "orange";

        // Get trimmed values from the form fields
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        try {
            // Send form data to the backend API using fetch
            const response = await fetch('http://localhost:3001/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            const result = await response.json();

            // Show success or error message based on backend response
            if (result.success) {
                formMessage.textContent = "Thank you for contacting me!";
                formMessage.style.color = "green";
                form.reset(); // Clear the form fields
            } else {
                formMessage.textContent = "Error sending message. Please try again.";
                formMessage.style.color = "red";
            }
        } catch (err) {
            // Show error message if the request fails
            formMessage.textContent = "Error sending message. Please try again.";
            formMessage.style.color = "red";
        }
    });
});
