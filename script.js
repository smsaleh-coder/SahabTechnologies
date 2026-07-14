document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    const sunIcon = themeToggleButton.querySelector('.fa-sun');
    const moonIcon = themeToggleButton.querySelector('.fa-moon');

    // Function to apply theme based on preference
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline-block';
        } else {
            body.classList.remove('dark-theme');
            moonIcon.style.display = 'inline-block';
            sunIcon.style.display = 'none';
        }
    };

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Optional: Check system preference
        // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // applyTheme(prefersDark ? 'dark' : 'light');
        applyTheme('light'); // Default to light
    }


    themeToggleButton.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-theme');
        const newTheme = isDark ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Save preference
    });

    // --- Mobile Navigation Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });


    // --- Testimonial Slider ---
    const testimonials = document.querySelectorAll('.testimonial');
    const prevButton = document.querySelector('.testimonial-nav.prev');
    const nextButton = document.querySelector('.testimonial-nav.next');
    let currentTestimonialIndex = 0;
    let testimonialInterval;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (i === index) {
                testimonial.classList.add('active');
            }
        });
    }

    function nextTestimonial() {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        showTestimonial(currentTestimonialIndex);
        resetInterval();
    }

    function prevTestimonial() {
        currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonialIndex);
        resetInterval();
    }

    function startInterval() {
        // Stop existing interval before starting a new one
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(nextTestimonial, 7000); // Rotate every 7 seconds
    }

    function resetInterval() {
        clearInterval(testimonialInterval);
        startInterval();
    }


    if (prevButton && nextButton && testimonials.length > 0) {
        prevButton.addEventListener('click', prevTestimonial);
        nextButton.addEventListener('click', nextTestimonial);

        // Initialize slider
        showTestimonial(currentTestimonialIndex);
        startInterval(); // Start automatic rotation

        // Optional: Pause on hover
        const slider = document.querySelector('.testimonial-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
            slider.addEventListener('mouseleave', startInterval);
        }
    }


    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after animation
                // observer.unobserve(entry.target);
            }
            // Optional: Remove 'visible' class when element scrolls out of view
            // else {
            //     entry.target.classList.remove('visible');
            // }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
        // rootMargin: "-50px 0px -50px 0px" // Adjust trigger point
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });


    // --- Contact Form Handling (Simulation) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        // Check if NOT using Formspree (by checking if the action URL is the placeholder)
        const useSimulation = contactForm.getAttribute('action') === 'https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT';

        if (useSimulation) {
            contactForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Prevent default Formspree submission for simulation

                // Basic validation (optional enhancement)
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const message = document.getElementById('message').value.trim();

                if (!name || !email || !message) {
                    formStatus.textContent = 'Please fill out all fields.';
                    formStatus.style.color = 'red';
                    return;
                }

                if (!/\S+@\S+\.\S+/.test(email)) {
                    formStatus.textContent = 'Please enter a valid email address.';
                    formStatus.style.color = 'red';
                    return;
                }


                // Simulate submission
                formStatus.textContent = 'Sending message... (Simulation)';
                formStatus.style.color = 'var(--primary-color-light)'; // Use theme color
                if (body.classList.contains('dark-theme')) {
                    formStatus.style.color = 'var(--primary-color-dark)';
                }


                // Simulate network delay
                setTimeout(() => {
                    formStatus.textContent = 'Message sent successfully! (Simulation)';
                    formStatus.style.color = 'green';
                    contactForm.reset(); // Clear the form

                    // Optionally clear status after a few seconds
                    setTimeout(() => formStatus.textContent = '', 3000);
                }, 1500);
            });
        } else {
            // If using Formspree, you might want confirmation handling
            // Formspree handles redirection/AJAX, but you could add JS for better UX
            contactForm.addEventListener('submit', () => {
                // Optional: Disable button while submitting
                const submitButton = contactForm.querySelector('button[type="submit"]');
                if (submitButton) submitButton.disabled = true;
                formStatus.textContent = 'Submitting...';
                formStatus.style.color = 'var(--primary-color-light)';
                if (body.classList.contains('dark-theme')) {
                    formStatus.style.color = 'var(--primary-color-dark)';
                }
                // Formspree will handle the rest based on its settings
                // You might clear the status manually or rely on Formspree's success page
            });
        }
    }

    // --- Footer Current Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded