<!--
Sync Impact Report:
Version change: N/A -> 1.0.0
Added sections: Core Principles (6), Technical Standards, Development Workflow
Removed sections: None
Modified principles: None (new constitution)
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/commands/*.md ⚠ pending
- README.md ⚠ pending
Follow-up TODOs: None
-->
# Aziz Restaurant Website Constitution

## Core Principles

### I. User Experience Excellence
Every feature and design element must prioritize the end-user experience, focusing on intuitive navigation, fast loading times, and accessible interfaces. The website must be mobile-first responsive with pages loading under 3 seconds and meeting WCAG 2.1 AA accessibility standards.

### II. Content Management Efficiency
All website content must be manageable through Docusaurus CMS, enabling easy updates to menu items, hours, contact information, and promotional content without requiring developer intervention. Content should be structured for SEO optimization.

### III. Performance and Optimization (NON-NEGOTIABLE)
All assets must be optimized for performance: images compressed and served in modern formats (WebP/AVIF), lazy-loading implemented for off-screen content, and code splitting utilized to minimize initial bundle sizes. PageSpeed scores must maintain 90+ on mobile and desktop.

### IV. Visual Appeal and Brand Consistency
The website must showcase high-quality food photography and maintain consistent brand identity across all pages. Typography, color schemes, and visual elements must reflect the restaurant's cuisine style and create an appetizing user experience.

### V. Cross-Platform Compatibility
The website must function flawlessly across all major browsers and devices. Responsive design must adapt seamlessly from mobile to desktop, with special attention to QR code menu functionality for mobile users.

### VI. Functional Integrity
All interactive elements must work reliably: reservation forms submit properly, contact forms deliver messages, Google Maps embed displays correctly, and dietary/allergen filtering functions as expected.

## Technical Standards
- Technology Stack: Docusaurus v3+, React, modern CSS (Flexbox/Grid), JavaScript ES6+
- Responsive Framework: Mobile-first approach with breakpoints at 375px, 768px, 1024px, 1440px
- Performance: Lighthouse scores 90+ for Performance, Accessibility, Best Practices, SEO
- Accessibility: WCAG 2.1 AA compliance with semantic HTML, ARIA labels, keyboard navigation
- SEO: Proper meta tags, structured data markup, sitemap generation, social sharing optimization
- Image Optimization: WebP/AVIF formats with fallbacks, proper sizing, alt text for all images
- API Integration: Ready for third-party booking system integration with standardized endpoints
- Browser Support: Chrome, Firefox, Safari, Edge (latest 2 versions)

## Development Workflow
- Version Control: Git with feature branch workflow, descriptive commit messages following conventional commits
- Code Quality: ESLint/Prettier configuration, TypeScript where beneficial, peer code reviews
- Testing: Unit tests for components, accessibility testing, cross-browser validation
- Deployment: Automated CI/CD pipeline with staging environment validation
- Documentation: Inline code comments for complex logic, README updates for new features
- Quality Gates: All tests pass, accessibility audit passes, performance budget met before merge

## Governance
This constitution serves as the authoritative guide for all development decisions on the Aziz Restaurant website project. All features, designs, and implementations must comply with these principles. Deviations require explicit approval and documentation of trade-offs. Regular compliance audits should verify adherence to performance, accessibility, and user experience standards.

**Version**: 1.0.0 | **Ratified**: 2026-02-03 | **Last Amended**: 2026-02-03
