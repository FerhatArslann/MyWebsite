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
    if (heroTitle) heroTitle.classList.add('fade-in-up');
    if (subtitle) subtitle.classList.add('fade-in-up');

    // Header background toggle on scroll
    const header = document.querySelector('.glass-header');
    if (header) {
        header.classList.remove('active');
        window.addEventListener('scroll', function() {
            header.classList.toggle('active', window.scrollY > 0);
        });
    }

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
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Scroll-to-top button visibility
    const scrollUpButton = document.querySelector(".scroll-up");
    window.addEventListener("scroll", function() {
        if (scrollUpButton) {
            scrollUpButton.style.display = window.scrollY > 300 ? "block" : "none";
        }
    });

    // === Popup Image Modal Setup (fixed first-open bug) ===
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const counterEl = document.getElementById('modal-counter');
    const closeBtn = modal?.querySelector('.close-modal');
    const prevBtn = modal?.querySelector('.nav-btn.prev');
    const nextBtn = modal?.querySelector('.nav-btn.next');
    if (modal && modalImg && counterEl) {
        let gallery = [];
        let index = 0;

        function resetStateClasses() {
            modal.classList.remove('hide-prev','hide-next','no-nav');
        }

        function updateNavVisibility() {
            resetStateClasses();
            if (gallery.length === 1) {
                modal.classList.add('no-nav');
                return;
            }
            if (index === 0) modal.classList.add('hide-prev');
            if (index === gallery.length - 1) modal.classList.add('hide-next');
        }

        function updateImage(initial = false) {
            if (!gallery.length) return;
            const src = gallery[index];
            modalImg.classList.remove('fade');
            modalImg.src = src;
            counterEl.textContent = `${index + 1} / ${gallery.length}`;
            updateNavVisibility();
            [index - 1, index + 1].forEach(i => {
                if (i >= 0 && i < gallery.length) {
                    const im = new Image();
                    im.src = gallery[i];
                }
            });
        }

        function openModal(images, startIdx = 0) {
            gallery = images;
            index = Math.min(Math.max(0, startIdx), gallery.length - 1);
            modal.classList.add('active');
            modal.setAttribute('aria-hidden','false');
            document.body.classList.add('lock-scroll');
            updateImage(true);
        }

        function closeModal() {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden','true');
            document.body.classList.remove('lock-scroll');
            resetStateClasses();
            gallery = [];
            index = 0;
            modalImg.src = '';
            counterEl.textContent = '';
        }

        function next() {
            if (index >= gallery.length - 1) return;
            index++;
            updateImage();
        }
        function prev() {
            if (index <= 0) return;
            index--;
            updateImage();
        }

        document.querySelectorAll('.project-image').forEach(container => {
            container.addEventListener('click', e => {
                if (!e.target.closest('.popup-icon') && e.currentTarget !== container) return;
                const dataAttr = container.getAttribute('data-images');
                let images = [];
                if (dataAttr) {
                    images = dataAttr.split(',').map(s => s.trim()).filter(Boolean);
                } else {
                    const single = container.querySelector('img')?.getAttribute('src');
                    if (single) images = [single];
                }
                if (images.length) openModal(images, 0);
            });
        });

        closeBtn?.addEventListener('click', closeModal);
        prevBtn?.addEventListener('click', prev);
        nextBtn?.addEventListener('click', next);

        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

        document.addEventListener('keydown', e => {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') closeModal();
            else if (e.key === 'ArrowRight') next();
            else if (e.key === 'ArrowLeft') prev();
        });

        let startX = null;
        modal.addEventListener('touchstart', e => startX = e.changedTouches[0].clientX);
        modal.addEventListener('touchend', e => {
            if (startX == null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
            startX = null;
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
        setTimeout(() => {
            project.style.opacity = "1";
            project.style.transform = "translateY(0)";
        }, index * 200);
    });
}

// Initialize scroll-based animations
function initScrollAnimations() {
    const sections = document.querySelectorAll("section");
    const observerOptions = { threshold: 0.2 };
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

// Remove persistent focus highlight after clicking a social link
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseup', function() { this.blur(); });
    link.addEventListener('mouseleave', function() { this.blur(); });
});

// Add non-breaking space before the last word in each paragraph of .about-text
document.querySelectorAll('.about-text p').forEach(p => {
    p.innerHTML = p.innerHTML.replace(/\s+([^\s<]+)\s*$/, '&nbsp;$1');
});
