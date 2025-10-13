// Main Site Script - Initializes after intro animation completes
// Handles Typed.js, tsParticles, AOS, and content population

(function() {
    'use strict';

    let mainSiteInitialized = false;

    function initMainSite() {
        // Prevent double initialization
        if (mainSiteInitialized) return;
        mainSiteInitialized = true;

        // Check if required libraries are loaded
        if (typeof Typed === 'undefined' || typeof tsParticles === 'undefined' || typeof AOS === 'undefined') {
            setTimeout(initMainSite, 100);
            return;
        }

        // 0. Populate page content from constants
        document.getElementById('page-title').textContent = CONTENT.title;
        document.getElementById('manifesto-heading').textContent = CONTENT.manifesto.heading;
        document.getElementById('manifesto-tag').textContent = CONTENT.manifesto.tag;
        document.getElementById('manifesto-description').textContent = CONTENT.manifesto.description;

        document.getElementById('founders-heading').textContent = CONTENT.founders.heading;
        const foundersContainer = document.getElementById('founders-container');
        CONTENT.founders.cards.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'founder-card';
            cardDiv.innerHTML = `
                <h3>${card.title}</h3>
                <p>${card.description}</p>
            `;
            foundersContainer.appendChild(cardDiv);
        });

        const footer = document.getElementById('footer');
        footer.innerHTML = `<p>${CONTENT.footer.copyright} | <a href="${CONTENT.footer.links.linkedin.url}" target="_blank" rel="noopener noreferrer">${CONTENT.footer.links.linkedin.text}</a> | <a href="${CONTENT.footer.links.email.url}">${CONTENT.footer.links.email.text}</a></p>`;

        // 1. AOS (Animate On Scroll) Initialization
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });

        // 2. Typed.js Initialization with updated text
        const typedOptions = {
            strings: CONTENT.typedStrings,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            startDelay: 500,
            loop: false,
            showCursor: true,
            cursorChar: '_',
        };
        new Typed('#typed-element', typedOptions);

        // 3. tsParticles - Data Flow Visualization with Randomization

        // Detect device type for performance optimization
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isTablet = window.matchMedia('(max-width: 1024px) and (min-width: 769px)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Skip particles if user prefers reduced motion
        if (prefersReducedMotion) {
            return;
        }

        // Generate random configuration for unique experience - optimized for device
        let randomParticleCount, randomSpeed, randomLinkDistance, randomConnectDistance;

        if (isMobile) {
            randomParticleCount = Math.floor(Math.random() * 15) + 20; // 20-35 particles for mobile
            randomSpeed = (Math.random() * 0.3) + 0.2; // 0.2-0.5 slower speed
            randomLinkDistance = Math.floor(Math.random() * 50) + 80; // 80-130px shorter links
            randomConnectDistance = Math.floor(Math.random() * 50) + 80; // 80-130px
        } else if (isTablet) {
            randomParticleCount = Math.floor(Math.random() * 25) + 35; // 35-60 particles for tablet
            randomSpeed = (Math.random() * 0.4) + 0.25; // 0.25-0.65 speed
            randomLinkDistance = Math.floor(Math.random() * 70) + 90; // 90-160px
            randomConnectDistance = Math.floor(Math.random() * 70) + 100; // 100-170px
        } else {
            randomParticleCount = Math.floor(Math.random() * 40) + 50; // 50-90 particles for desktop
            randomSpeed = (Math.random() * 0.6) + 0.3; // 0.3-0.9 speed
            randomLinkDistance = Math.floor(Math.random() * 100) + 100; // 100-200px
            randomConnectDistance = Math.floor(Math.random() * 100) + 120; // 120-220px
        }

        const randomDirection = ['right', 'left', 'top', 'bottom', 'top-right', 'top-left', 'bottom-right', 'bottom-left'][Math.floor(Math.random() * 8)];
        const randomOpacity = (Math.random() * 0.15) + 0.1; // 0.1-0.25
        const randomAnimSpeed = (Math.random() * 2) + 0.5; // 0.5-2.5 animation speed
        const randomShapeType = Math.random() > 0.5 ? ["circle", "square"] : Math.random() > 0.5 ? ["circle", "triangle"] : ["circle"];

        tsParticles.load("tsparticles", {
            fpsLimit: isMobile ? 30 : 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: !isMobile,
                        mode: "connect",
                    },
                    resize: true,
                },
                modes: {
                    connect: {
                        distance: randomConnectDistance,
                        links: {
                            opacity: 0.5
                        },
                        radius: randomConnectDistance + 80
                    },
                },
            },
            particles: {
                color: {
                    value: "#A3E635",
                },
                links: {
                    color: "#A3E635",
                    distance: randomLinkDistance,
                    enable: true,
                    opacity: randomOpacity,
                    width: 1,
                    triangles: {
                        enable: true,
                        opacity: randomOpacity * 0.3
                    }
                },
                move: {
                    direction: randomDirection,
                    enable: true,
                    outModes: {
                        default: "out",
                    },
                    random: Math.random() > 0.5,
                    speed: randomSpeed,
                    straight: Math.random() > 0.3,
                },
                number: {
                    density: {
                        enable: true,
                        area: 1000,
                    },
                    value: randomParticleCount,
                },
                opacity: {
                    value: {min: 0.1, max: 0.4},
                    animation: {
                        enable: true,
                        speed: randomAnimSpeed,
                        minimumValue: 0.1,
                        sync: false
                    }
                },
                shape: {
                    type: randomShapeType,
                },
                size: {
                    value: {min: 1, max: 3},
                    animation: {
                        enable: true,
                        speed: randomAnimSpeed,
                        minimumValue: 0.5,
                        sync: false
                    }
                },
            },
            background: {
                color: "#000000"
            },
            detectRetina: true,
        });
    }

    // Listen for intro animation completion
    window.addEventListener('introAnimationComplete', initMainSite);

    // Fallback: If intro animation is disabled (e.g., reduced motion preference)
    // or if the event doesn't fire, initialize after a delay
    window.addEventListener('load', function() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            // Initialize immediately if reduced motion is preferred
            initMainSite();
        } else {
            // Fallback timeout in case intro animation fails
            setTimeout(function() {
                if (!mainSiteInitialized) {
                    console.warn('Intro animation did not complete, initializing main site as fallback');
                    const mainSite = document.getElementById('main-site');
                    const introAnimation = document.getElementById('intro-animation');
                    if (introAnimation) {
                        introAnimation.classList.add('complete');
                    }
                    if (mainSite) {
                        mainSite.classList.add('active');
                        const heroLogo = document.getElementById('hero-logo');
                        if (heroLogo) {
                            heroLogo.classList.add('visible');
                        }
                    }
                    initMainSite();
                }
            }, 30000); // 30 second fallback timeout
        }
    });
})();
