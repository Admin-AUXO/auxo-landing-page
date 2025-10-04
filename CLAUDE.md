# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for AUXO Data Labs - a "coming soon" landing page with interactive elements. The site is a simple, modern placeholder showcasing the company's brand identity and mission statement while the full website is being developed.

## Architecture

**Stack**: Pure HTML/CSS/JavaScript (no build process or frameworks)

**Structure**:
- `index.html` - Single-page structure with hero section, manifesto, founders section, and footer
- `style.css` - CSS with custom properties for brand colors (#A3E635 accent green, #111111 dark background)
- `script.js` - Initializes three libraries: AOS (scroll animations), Typed.js (typing effect), and tsParticles (animated particle background)
- `deploy.sh` - GitHub Pages deployment script (force pushes to gh-pages branch)

**Key Libraries** (loaded via CDN):
- Typed.js 2.0.12 - Animated typing effect in hero
- tsParticles 2.9.3 - Interactive particle background
- AOS 2.3.1 - Scroll-triggered animations

**Brand Identity**:
- Primary font: Montserrat (body text, weights: 400, 600, 800)
- Monospace font: Fira Code (hero text)
- SVG logo: 2x2 grid with letters A, U, X, O
- Color scheme defined in CSS custom properties at style.css:9-16

## Development Workflow

**Local Development**:
- No build step required - open `index.html` directly in browser
- All changes are immediately visible on page refresh

**Deployment**:
- Run `./deploy.sh` after updating GitHub credentials in the script
- Script initializes git, commits all files, and force pushes to gh-pages branch
- **Important**: Update placeholders `<YOUR_GITHUB_USERNAME>` and `<YOUR_REPOSITORY_NAME>` in deploy.sh:26 before first use

## Code Patterns

**Animation Timing**: AOS animations use 800ms duration (script.js:5), Typed.js typing speed is 50ms (script.js:17)

**Responsive Design**: Uses clamp() for fluid typography (style.css:78), mobile breakpoint at 768px (style.css:168)

**Particle Configuration**: 80 particles with repulse interaction on hover (script.js:27-83)
