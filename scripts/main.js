// main.js

// DOM-elementtien latauksen jälkeen suoritettavat toiminnot
document.addEventListener("DOMContentLoaded", function() {
    // Projektien animointi
    animateProjects();
    
    // Scroll-animaatiot
    initScrollAnimations();
    
    // Navigaation aktiivisen linkin korostus
    highlightActiveNavLink();
});

// Projektien sisääntuloanimaatio
function animateProjects() {
    const projects = document.querySelectorAll(".project");
    
    projects.forEach((project, index) => {
        project.style.opacity = "0";
        project.style.transform = "translateY(50px)";
        project.style.transition = "all 0.5s ease";
        
        // Porrastettu animaatio
        setTimeout(() => {
            project.style.opacity = "1";
            project.style.transform = "translateY(0)";
        }, index * 200);
    });
}

// Scroll-pohjaisten animaatioiden alustus
function initScrollAnimations() {
    const sections = document.querySelectorAll("section");
    
    const observerOptions = {
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.classList.add("fade-in");
        observer.observe(section);
    });
}

// Aktiivisen navigaatiolinkin korostus
function highlightActiveNavLink() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav a");
    
    window.addEventListener("scroll", () => {
        let current = "";
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute("id");
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").slice(1) === current) {
                link.classList.add("active");
            }
        });
    });
}

// Scroll-to-top functionality
document.querySelector(".scroll-up a").addEventListener("click", function(event) {
    event.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll-to-top button visibility
window.addEventListener("scroll", function() {
    const scrollUpButton = document.querySelector(".scroll-up");
    if (window.scrollY > 300) {
        scrollUpButton.style.display = "block";
    } else {
        scrollUpButton.style.display = "none";
    }
});
