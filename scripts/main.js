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

    // Header background toggle on scroll
    const header = document.querySelector('.glass-header');
    if (header) {
        header.classList.remove('active');
        window.addEventListener('scroll', function() {
            if (window.scrollY > 0) {
                header.classList.add('active');
            } else {
                header.classList.remove('active');
            }
        });
    }

    // Open modal on popup icon click
    document.querySelectorAll('.project-image .popup-icon').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const imgSrc = icon.parentElement.querySelector('img').src;
            const modal = document.getElementById('image-modal');
            const modalImg = document.getElementById('modal-img');
            if (modal && modalImg) {
                modalImg.src = imgSrc;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal on X button click
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.onclick = function() {
            const modal = document.getElementById('image-modal');
            if (modal) modal.classList.remove('active');
            document.body.style.overflow = '';
        };
    }

    // Close modal when clicking outside the image
    const imageModal = document.getElementById('image-modal');
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal) {
                imageModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

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

// Remove persistent focus highlight after clicking a social link
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseup', function() {
        this.blur();
    });
    link.addEventListener('mouseleave', function() {
        this.blur();
    });
});

// Add non-breaking space before the last word in each paragraph of .about-text
document.querySelectorAll('.about-text p').forEach(p => {
    p.innerHTML = p.innerHTML.replace(/\s+([^\s<]+)\s*$/, '&nbsp;$1');
});

// === Popup Image Modal Setup (unified) ===
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = modal ? modal.querySelector('.close-modal') : null;

    if (!modal || !modalImg) return;

    // Open when clicking popup icon OR the image container
    document.querySelectorAll('.project-image').forEach(container => {
        container.addEventListener('click', e => {
            const imgEl = container.querySelector('img');
            if (!imgEl) return;
            // If user clicked the icon or anywhere on image container
            if (e.target.closest('.popup-icon') || e.currentTarget === container) {
                modalImg.src = imgEl.src;
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.classList.add('lock-scroll');
            }
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        modalImg.src = '';
        document.body.classList.remove('lock-scroll');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Click outside image closes
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });

    // ESC key closes
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
});
// === End Popup Image Modal Setup ===
