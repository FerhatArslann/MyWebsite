// main.js

// Actions to perform after DOM elements have loaded
document.addEventListener("DOMContentLoaded", function() {
    // Animate projects
    animateProjects();
    
    // Scroll animations
    initScrollAnimations();
    
    // Highlight active navigation link
    highlightActiveNavLink();
    
    // Fade-in effect for hero title and subtitle
    const heroTitle = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    if (heroTitle) {
        heroTitle.classList.add('fade-in-up');
    }
    if (subtitle) {
        subtitle.classList.add('fade-in-up');
    }

    // Skill card hover lift effect with JS for smoothness and mobile tap support
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('lifted');
            card.classList.add('text-scaled');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('lifted');
            card.classList.remove('text-scaled');
        });
        // Optional: tap effect for mobile
        card.addEventListener('touchstart', () => {
            card.classList.add('lifted');
            card.classList.add('text-scaled');
        });
        card.addEventListener('touchend', () => {
            card.classList.remove('lifted');
            card.classList.remove('text-scaled');
        });
    });
});

// Project entrance animation
function animateProjects() {
    const projects = document.querySelectorAll(".project");
    
    projects.forEach((project, index) => {
        project.style.opacity = "0";
        project.style.transform = "translateY(50px)";
        project.style.transition = "all 0.5s ease";
        
        // Staggered animation
        setTimeout(() => {
            project.style.opacity = "1";
            project.style.transform = "translateY(0)";
        }, index * 200);
    });
}

// Initialize scroll-based animations
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

// Highlight the active navigation link
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

// Navigation hamburger menu toggle
document.addEventListener("DOMContentLoaded", function() {
    // Hamburger menu toggle for mobile/tablet
    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector(".main-nav");
    const navLinks = document.querySelectorAll(".nav-links a");

    if (navToggle && mainNav) {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.addEventListener("click", function() {
            const isOpen = mainNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        // Close nav when a link is clicked (mobile/tablet UX)
        navLinks.forEach(link => {
            link.addEventListener("click", function() {
                if (mainNav.classList.contains("open")) {
                    mainNav.classList.remove("open");
                    navToggle.setAttribute("aria-expanded", "false");
                }
            });
        });
    }

    // Scroll-to-top functionality
    const scrollUpAnchor = document.querySelector(".scroll-up a");
    if (scrollUpAnchor) {
        scrollUpAnchor.addEventListener("click", function(event) {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll-to-top button visibility
    const scrollUpButton = document.querySelector(".scroll-up");
    window.addEventListener("scroll", function() {
        if (scrollUpButton) {
            scrollUpButton.style.display = window.scrollY > 300 ? "block" : "none";
        }
    });
});
