// Intro Animation Script - Logo Reveal Sequence
// Integrated from auxo.html with transition to main site

(function() {
    'use strict';

    // Wait for GSAP and DOM to be ready
    function initIntroAnimation() {
        if (typeof gsap === 'undefined') {
            setTimeout(initIntroAnimation, 50);
            return;
        }

        // --- SETUP ---
        const introContainer = document.getElementById('intro-animation');
        const stage = document.querySelector('.stage');
        const canvasContainer = document.querySelector('.canvas-container');
        const canvas = document.getElementById('rain');
        const grid = document.querySelector('.grid');
        const paths = grid.querySelectorAll('path');
        const board = document.querySelector('.board');
        const logo = document.querySelector('.logo');
        const logoTiles = logo.querySelectorAll('.logo-tile');
        const dataText = logo.querySelector('.data-text');
        const tagline = logo.querySelector('.tagline');
        const revealLine = logo.querySelector('.reveal-line');
        const scanline = document.getElementById('scanline');

        // Create tic-tac-toe board cells
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.i = i;
            const span = document.createElement('span');
            span.className = 'glyph';
            cell.appendChild(span);
            board.appendChild(cell);
        }

        const cellAt = i => board.querySelector(`.cell[data-i="${i}"]`);

        /**
         * CONFIGURATION - Editable timings and constants
         */
        const CONFIG = {
            // ACT I: MATRIX RAIN
            RAIN_FONT_SIZE: 18,
            RAIN_COLUMN_SPACING_FACTOR: 2,
            RAIN_KEYWORD_CHANCE: 0.015,
            RAIN_FADE_SPEED: 0.1,
            RAIN_INITIAL_SPEED: 0.8,
            RAIN_FREEZE_SPEED: 0.4,
            RAIN_FREEZE_START_TIME: 3.0,
            RAIN_FREEZE_DURATION: 3.0,
            RAIN_RESUME_DURATION: 1.0,
            RAIN_STOP_GENERATING_START_TIME: 7.0,
            RAIN_STOP_GENERATING_DURATION: 2.0,

            // ACT II: THE GAME
            GRID_DRAW_DURATION: 1.5,
            GRID_DRAW_STAGGER: 0.8,
            BOARD_FADEIN_DURATION: 0.3,
            GLYPH_POP_IN_DURATION: 0.35,
            GLYPH_PAUSE_MS: 110,
            GLYPH_FINAL_PAUSE_MS: 400,

            // ACT III: GENESIS FORGE
            VERDICT_DURATION: 0.4,
            VERDICT_PAUSE_DURATION: 0.8,
            DECONSTRUCTION_SCRAMBLE_DURATION: 1.5,
            DECONSTRUCTION_GRID_FADE_DURATION: 1.0,
            LOGO_FORGE_DURATION: 1.0,
            LOGO_FORGE_STAGGER: 0.15,

            // ACT IV: BRAND REVEAL
            REVEAL_PAUSE_DURATION: 1.5,
            REVEAL_LINE_DURATION: 0.6,
            REVEAL_TEXT_FADE_DURATION: 0.7,
            REVEAL_SCANLINE_DURATION: 0.7,

            // TRANSITION TO MAIN SITE
            TRANSITION_HOLD_DURATION: 1.0,
            TRANSITION_FADE_DURATION: 0.8
        };

        // --- AI LOGIC (Tic-Tac-Toe) ---
        function checkWinMultiple(b) {
            const w = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            const r = [];
            for (const l of w) {
                const [a, b1, c] = l;
                if (b[a] && b[a] === b[b1] && b[a] === b[c]) r.push(l);
            }
            return r.length ? r : null;
        }

        function checkDraw(b) {
            return b.every(c => c !== null);
        }

        function minimax(b, max) {
            const w = checkWinMultiple(b);
            if (w) {
                let win = b[w[0][0]];
                return win === 'X' ? 1 : -1;
            }
            if (checkDraw(b)) return 0;
            if (max) {
                let best = -Infinity;
                for (let i = 0; i < 9; i++) {
                    if (b[i] == null) {
                        b[i] = 'X';
                        let s = minimax(b, false);
                        b[i] = null;
                        best = Math.max(s, best);
                    }
                }
                return best;
            } else {
                let best = Infinity;
                for (let i = 0; i < 9; i++) {
                    if (b[i] == null) {
                        b[i] = 'O';
                        let s = minimax(b, true);
                        b[i] = null;
                        best = Math.min(s, best);
                    }
                }
                return best;
            }
        }

        function findBestMove(b, p) {
            const m = [];
            for (let i = 0; i < 9; i++) {
                if (b[i] == null) {
                    b[i] = p;
                    let s = minimax(b, p === 'O');
                    b[i] = null;
                    m.push({i, s});
                }
            }
            m.sort((a, b) => p === 'X' ? b.s - a.s : a.s - b.s);
            if (Math.random() < 0.14 && m.length > 1) {
                return m[Math.floor(Math.random() * (m.length - 1) + 1)].i;
            }
            return m[0]?.i ?? null;
        }

        function generateGame() {
            const b = Array.from({length: 9}, () => null);
            const m = [];
            let p = 'X';
            let won = false;
            let wL = null;
            while (!won && !checkDraw(b)) {
                let mv = findBestMove(b, p);
                if (mv == null) break;
                b[mv] = p;
                m.push({i: mv, ch: p});
                wL = checkWinMultiple(b);
                if (wL) won = true;
                p = p === 'X' ? 'O' : 'X';
            }
            let i = [];
            if (wL) {
                wL.forEach(l => i.push(...l));
                i = [...new Set(i)];
            }
            return {moves: m, outcome: won ? 'win' : 'draw', winningLine: i};
        }

        const game = generateGame();

        // --- ANIMATION ACTS ---

        async function runDataDeluge() {
            return new Promise(resolve => {
                const ctx = canvas.getContext('2d');
                const fit = () => {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                };
                fit();
                window.addEventListener('resize', fit, {passive: true});

                const words = ['INSIGHT', 'SESSION', 'QUERY', 'METRICS', 'PIXEL', 'DATA', 'ROI', 'CONVERSION', 'FUNNEL', 'SEGMENT', 'KPI', 'API'];
                const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン'.split('');
                const greenColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-green').trim();
                const whiteColor = '#FFFFFF';

                const fontSize = CONFIG.RAIN_FONT_SIZE;
                const columnWidth = fontSize * CONFIG.RAIN_COLUMN_SPACING_FACTOR;
                const cols = Math.floor(canvas.width / columnWidth);
                const rows = Math.floor(canvas.height / fontSize);

                class Column {
                    constructor(x) {
                        this.x = x;
                        this.y = Math.floor(Math.random() * -rows);
                        this.speedCounter = 0;
                        this.trail = [];
                        this.isWord = false;
                        this.word = '';
                        this.wordIndex = 0;
                        this.active = true;
                    }

                    reset() {
                        this.y = Math.floor(Math.random() * -rows * 0.5);
                        this.trail = [];
                    }

                    update() {
                        this.speedCounter += globalSpeed.value;
                        if (this.speedCounter >= 1) {
                            this.y++;
                            this.speedCounter = 0;

                            let newChar, color;

                            if (this.isWord) {
                                newChar = this.word[this.wordIndex];
                                color = whiteColor;
                                this.wordIndex++;
                                if (this.wordIndex >= this.word.length) this.isWord = false;
                            } else {
                                if (Math.random() < CONFIG.RAIN_KEYWORD_CHANCE) {
                                    this.isWord = true;
                                    this.word = words[Math.floor(Math.random() * words.length)];
                                    this.wordIndex = 0;
                                    newChar = this.word[this.wordIndex];
                                    color = whiteColor;
                                    this.wordIndex++;
                                } else {
                                    newChar = katakana[Math.floor(Math.random() * katakana.length)];
                                    color = greenColor;
                                }
                            }
                            this.trail.unshift({char: newChar, color: color});
                            if (this.trail.length > rows * 1.5) this.trail.pop();
                        }

                        if (this.y - this.trail.length > rows && this.active) {
                            this.reset();
                        }
                    }

                    draw(ctx) {
                        for (let i = 0; i < this.trail.length; i++) {
                            const item = this.trail[i];
                            const yPos = (this.y - i) * fontSize;
                            if (yPos < 0 || yPos > canvas.height) continue;
                            ctx.fillStyle = (i === 0) ? whiteColor : item.color;
                            ctx.fillText(item.char, this.x, yPos);
                        }
                    }
                }

                const columns = Array.from({length: cols}, (_, i) => new Column(i * columnWidth));
                let globalSpeed = {value: CONFIG.RAIN_INITIAL_SPEED};

                const drawRain = () => {
                    ctx.fillStyle = `rgba(0, 0, 0, ${CONFIG.RAIN_FADE_SPEED})`;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font = `${fontSize}px monospace`;

                    let activeColumns = 0;
                    columns.forEach(col => {
                        col.update();
                        col.draw(ctx);
                        if (col.active) activeColumns++;
                    });

                    if (activeColumns === 0 && columns.every(c => c.y - c.trail.length > rows)) {
                        gsap.ticker.remove(drawRain);
                        gsap.to(canvasContainer, {
                            opacity: 0,
                            duration: 0.5,
                            onComplete: () => {
                                canvasContainer.style.display = "none";
                                resolve();
                            }
                        });
                    }
                };
                gsap.ticker.add(drawRain);

                const tl = gsap.timeline();
                const resumeTime = CONFIG.RAIN_FREEZE_START_TIME + CONFIG.RAIN_FREEZE_DURATION;
                const stopTime = resumeTime + CONFIG.RAIN_RESUME_DURATION;

                tl.to(globalSpeed, {value: CONFIG.RAIN_FREEZE_SPEED, duration: CONFIG.RAIN_FREEZE_DURATION, ease: 'power2.inOut'}, CONFIG.RAIN_FREEZE_START_TIME);
                tl.to(globalSpeed, {value: CONFIG.RAIN_INITIAL_SPEED, duration: CONFIG.RAIN_RESUME_DURATION, ease: 'power2.out'}, resumeTime);
                tl.call(() => {
                    columns.forEach((col) => {
                        setTimeout(() => col.active = false, Math.random() * CONFIG.RAIN_STOP_GENERATING_DURATION * 1000);
                    });
                }, [], stopTime);
            });
        }

        async function runGame() {
            gsap.set(grid, {visibility: 'visible'});
            paths.forEach(p => {
                const len = p.getTotalLength();
                p.style.strokeDasharray = len;
                p.style.strokeDashoffset = len;
            });
            await gsap.to(paths, {strokeDashoffset: 0, duration: CONFIG.GRID_DRAW_DURATION, ease: 'power3.out', stagger: {amount: CONFIG.GRID_DRAW_STAGGER}});
            gsap.set(board, {visibility: 'visible', opacity: 0});
            await gsap.to(board, {opacity: 1, duration: CONFIG.BOARD_FADEIN_DURATION, ease: 'power1.in'});
            for (let idx = 0; idx < game.moves.length; idx++) {
                const move = game.moves[idx];
                const glyph = cellAt(move.i).querySelector('.glyph');
                glyph.textContent = move.ch;
                await gsap.fromTo(glyph, {opacity: 0, scale: 0.6}, {opacity: 1, scale: 1, duration: CONFIG.GLYPH_POP_IN_DURATION, ease: 'back.out(1.8)'});
                await new Promise(res => setTimeout(res, idx === game.moves.length - 1 ? CONFIG.GLYPH_FINAL_PAUSE_MS : CONFIG.GLYPH_PAUSE_MS));
            }
        }

        async function runGenesisForge() {
            const allGlyphs = game.moves.map(m => cellAt(m.i).querySelector('.glyph'));
            if (game.outcome === 'win') {
                const winningGlyphs = game.winningLine.map(i => cellAt(i).querySelector('.glyph'));
                const losingGlyphs = allGlyphs.filter(g => !winningGlyphs.includes(g));
                gsap.to(losingGlyphs, {opacity: 0.25, duration: CONFIG.VERDICT_DURATION});
                await gsap.to(winningGlyphs, {color: 'var(--accent-green)', duration: CONFIG.VERDICT_DURATION});
            } else {
                await gsap.to(allGlyphs, {color: 'var(--accent-red)', duration: CONFIG.VERDICT_DURATION});
            }
            await gsap.to({}, {duration: CONFIG.VERDICT_PAUSE_DURATION});

            const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890*&#%$@!';
            const scramblePromises = allGlyphs.map(glyph => new Promise(resolve => {
                const tl = gsap.timeline({onComplete: resolve});
                let iterations = 0;
                tl.to({}, {
                    duration: CONFIG.DECONSTRUCTION_SCRAMBLE_DURATION,
                    onUpdate: () => {
                        if (iterations++ % 2 === 0) {
                            glyph.textContent = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                        }
                    }
                });
            }));
            gsap.to(paths, {strokeWidth: 0, opacity: 0, filter: 'blur(5px)', duration: CONFIG.DECONSTRUCTION_GRID_FADE_DURATION, ease: 'power2.in'});
            await Promise.all(scramblePromises);
            await gsap.to(allGlyphs, {opacity: 0, duration: 0.3, stagger: 0.05});
            gsap.set([board, grid], {visibility: 'hidden'});
            gsap.set(logo, {visibility: 'visible'});
            await gsap.fromTo(logoTiles, {visibility: 'visible', opacity: 0, scale: 0.5, rotationY: -90}, {opacity: 1, scale: 1, rotationY: 0, duration: CONFIG.LOGO_FORGE_DURATION, stagger: CONFIG.LOGO_FORGE_STAGGER, ease: 'elastic.out(1, 0.6)'});
        }

        async function runBrandReveal() {
            await gsap.to({}, {duration: CONFIG.REVEAL_PAUSE_DURATION});
            const tl = gsap.timeline();
            tl.to(revealLine, {scaleX: 1, duration: CONFIG.REVEAL_LINE_DURATION, ease: 'power3.inOut'});
            tl.fromTo(dataText, {opacity: 0, y: 15}, {opacity: 1, y: 0, duration: CONFIG.REVEAL_TEXT_FADE_DURATION, ease: 'power2.out'}, "-=0.4");
            tl.fromTo(tagline, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: CONFIG.REVEAL_TEXT_FADE_DURATION, ease: 'power2.out'}, "-=0.5");
            await tl;
            await gsap.to({}, {duration: CONFIG.REVEAL_PAUSE_DURATION});
            await gsap.fromTo(scanline, {top: '-10%', opacity: 0}, {top: '110%', opacity: [0.6, 1, 0.6, 0], duration: CONFIG.REVEAL_SCANLINE_DURATION, ease: 'none'});
        }

        async function transitionToMainSite() {
            // Hold the final reveal state
            await gsap.to({}, {duration: CONFIG.TRANSITION_HOLD_DURATION});

            // Mark as transitioning
            introContainer.classList.add('transitioning');

            // Get hero logo for size calculation
            const heroLogo = document.getElementById('hero-logo');
            const heroLogoRect = heroLogo.getBoundingClientRect();
            const logoContainerRect = document.querySelector('.logo-container').getBoundingClientRect();

            // Calculate scale factor for smooth resize
            const scaleX = heroLogoRect.width / logoContainerRect.width;
            const scaleY = heroLogoRect.height / logoContainerRect.height;
            const scaleFactor = Math.min(scaleX, scaleY);

            // Fade out caption (Data Labs text and tagline) with slight downward motion
            await gsap.to([dataText, tagline, revealLine], {
                opacity: 0,
                y: 20,
                duration: CONFIG.TRANSITION_FADE_DURATION * 0.6,
                ease: 'power2.in',
                stagger: 0.05
            });

            // Create smooth transition timeline for logo
            const logoTransitionTimeline = gsap.timeline();

            // Simultaneously: shrink logo with subtle rotation and fade out background
            logoTransitionTimeline.to(document.querySelector('.logo-container'), {
                scale: scaleFactor,
                duration: CONFIG.TRANSITION_FADE_DURATION * 1.2,
                ease: 'power3.inOut'
            }, 0);

            logoTransitionTimeline.to(logoTiles, {
                boxShadow: '0 0 30px rgba(163, 230, 53, 0.4)',
                duration: CONFIG.TRANSITION_FADE_DURATION * 0.8,
                ease: 'power2.inOut'
            }, 0);

            // Fade out the entire intro animation container
            logoTransitionTimeline.to(introContainer, {
                opacity: 0,
                duration: CONFIG.TRANSITION_FADE_DURATION,
                ease: 'power2.inOut'
            }, CONFIG.TRANSITION_FADE_DURATION * 0.4);

            await logoTransitionTimeline;

            // Mark as complete and hide
            introContainer.classList.add('complete');

            // Show main site and trigger hero logo animation
            const mainSite = document.getElementById('main-site');

            mainSite.classList.add('active');
            heroLogo.classList.add('visible');

            // Signal that intro is complete - main site can now initialize
            window.dispatchEvent(new CustomEvent('introAnimationComplete'));
        }

        async function main() {
            gsap.set(stage, {autoAlpha: 1});
            await runDataDeluge();
            await runGame();
            await runGenesisForge();
            await runBrandReveal();
            await transitionToMainSite();
        }

        // Start the animation sequence
        window.addEventListener('load', main);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIntroAnimation);
    } else {
        initIntroAnimation();
    }
})();
