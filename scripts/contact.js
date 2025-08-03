document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        // Simple validation
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            formMessage.textContent = "Please fill in all fields.";
            formMessage.style.color = "red";
            return;
        }

        // Here you would send the data to your backend or email service
        // For demo, just show a success message
        formMessage.textContent = "Thank you for contacting me!";
        formMessage.style.color = "green";
        form.reset();
    });
});