// main.js

document.addEventListener("DOMContentLoaded", function() {
    const projects = document.querySelectorAll(".project");

    projects.forEach((project, index) => {
        project.style.opacity = "0";
        project.style.transform = "translateY(50px)";
        project.style.transition = "opacity 0.5s ease, transform 0.5s ease";

        setTimeout(() => {
            project.style.opacity = "1";
            project.style.transform = "translateY(0)";
        }, index * 300);
    });
});
