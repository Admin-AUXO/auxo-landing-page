document.addEventListener('DOMContentLoaded', function () {

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
    footer.innerHTML = `<p>${CONTENT.footer.copyright} | <a href="${CONTENT.footer.links.linkedin.url}" target="_blank">${CONTENT.footer.links.linkedin.text}</a> | <a href="${CONTENT.footer.links.email.url}">${CONTENT.footer.links.email.text}</a></p>`;

    // 1. AOS (Animate On Scroll) Initialization
    AOS.init({
        duration: 800,
        once: true
    });

    // 2. Typed.js Initialization with updated text
    const typedOptions = {
        strings: CONTENT.typedStrings,
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: false,
        showCursor: true,
        cursorChar: '_',
    };
    new Typed('#typed-element', typedOptions);

    // 3. tsParticles - Data Flow Visualization with Randomization

    // Generate random configuration for unique experience
    const randomParticleCount = Math.floor(Math.random() * 40) + 50; // 50-90 particles
    const randomSpeed = (Math.random() * 0.6) + 0.3; // 0.3-0.9 speed
    const randomDirection = ['right', 'left', 'top', 'bottom', 'top-right', 'top-left', 'bottom-right', 'bottom-left'][Math.floor(Math.random() * 8)];
    const randomLinkDistance = Math.floor(Math.random() * 100) + 100; // 100-200px
    const randomOpacity = (Math.random() * 0.15) + 0.1; // 0.1-0.25
    const randomAnimSpeed = (Math.random() * 2) + 0.5; // 0.5-2.5 animation speed
    const randomShapeType = Math.random() > 0.5 ? ["circle", "square"] : Math.random() > 0.5 ? ["circle", "triangle"] : ["circle"];
    const randomConnectDistance = Math.floor(Math.random() * 100) + 120; // 120-220px

    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
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
                value: { min: 0.1, max: 0.4 },
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
                value: { min: 1, max: 3 },
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
});