---
id: 0001
title: restaurant-website-constitution
stage: constitution
date: 2026-02-03
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: unknown
command: /sp.constitution
labels: ["constitution", "restaurant", "web-development", "standards"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

claude code /sp.constitution "Build a modern restaurant website with the following requirements:

CORE PAGES:
- Home: hero section, featured dishes, restaurant story, location/hours
- Menu: categorized dishes with images, descriptions, prices, dietary filters
- Reservations: booking form with date/time picker, party size, special requests
- About: restaurant story, chef profiles, values/sourcing
- Contact: location map, contact form, hours, phone/email

TECHNICAL:
- Responsive design (mobile-first)
- Fast loading (<3s), optimized images
- Accessibility (WCAG 2.1 AA)
- SEO optimized
- Integration ready for booking system API

DESIGN:
- Brand colors and typography reflecting cuisine style
- High-quality food photography showcase
- Clean, appetizing UI with intuitive navigation
- CTA buttons for reservations

FUNCTIONALITY:
- Image galleries for dishes/ambiance
- Dietary/allergen filtering
- Social media integration
- Google Maps embed
- Newsletter signup
- Mobile-optimized menu (QR code ready)

Use Docusaurus for content management, implement with modern CSS/React components, ensure performance and mobile UX excellence."

## Response snapshot

Created a comprehensive constitution for the Aziz Restaurant website project, defining core principles, technical standards, and development workflow requirements based on the specified restaurant website requirements.

## Outcome

- ✅ Impact: Established foundational constitution with 6 core principles covering UX, performance, accessibility, and technical standards
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with project-specific constitution
- 🔁 Next prompts: /sp.specify to create feature specification based on requirements
- 🧠 Reflection: Constitution provides clear guidelines for implementation decisions and quality standards

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
