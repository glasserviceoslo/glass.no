# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Homeowners and housing co-ops in the Oslo area who need windows, glass, doors, shower solutions, glass railings, mirrors or VELUX roof windows replaced or installed. They come to book a free, no-obligation on-site survey (befaring) or to ask for a quote.

## Product Purpose

glass.no is the marketing site of Glass-Service Svendsen og Sønn AS. It explains the services and products well enough for a homeowner to trust the company, and turns that trust into a booked survey or a sent contact form. Success is booked surveys and contact requests.

## Positioning

- A family glazier in Oslo since 1889, more than 130 years in the trade.
- Free, no-obligation survey, then made to measure and installed by its own fitters.
- Installs known brands: NorDan, VELUX, Gilje, Lyssand, Diplomat Dører, Vemundvik Snekkerfabrikk, Fjerdingstad and Nordvest Vinduet.
- Competitive prices and time-limited campaigns, such as 50 % off Gilje windows and balcony doors.

## Operating Context

- Most product pages share one template: page hero, brand logos, why choose us, photo rows, FAQ, booking band, process steps with the contact form, and a long SEO guide.
- Booking runs through Cal.com popups and the /book-befaring/ page. The contact form posts to /api/kontakt.
- Publishers are not developers. They edit pages as stacks of blocks in the EmDash admin, as they did with Kadence in WordPress.

## Capabilities and Constraints

- Built with EmDash on Astro, deployed to Cloudflare Workers, D1 and R2.
- Existing client text is SEO-optimised and stays word for word. Casing is changed in CSS only, never in the text.
- Every layout change must work as an EmDash block that publishers can edit, not as a one-off page.
- Undecided: the Trustindex reviews widget or another Google review source, and the contact webhook with Turnstile.

## Brand Commitments

- Name and logo: glass.no / Glass-Service Svendsen og Sønn AS.
- Brand red #ed4c4c and navy #040037.
- Buttons follow glass.no: white text on brand red.

## Evidence on Hand

- Client photography and product cutouts in the EmDash media library, imported from WordPress.
- Brand partner logos for the eight partners above.
- Phone +47 91 58 49 40, post@glass.no, Pilestredet 41A, 0166 Oslo, opening hours Monday to Friday 08:00–17:00.
- No testimonials on hand yet; the Trustindex widget is pending. Do not invent reviews, customer names or figures.

## Product Principles

1. Every page leads to a free survey; the booking action is never more than a screen away.
2. Trust comes from facts the company can prove: its history since 1889, its own fitters and its brand partners.
3. The client's words are the product's SEO; design shapes them and never rewrites them.
4. What publishers can edit stays simple: a page is a stack of designed blocks.

## Accessibility & Inclusion

WCAG 2.1 AA. Note: white text on brand red #ed4c4c measures 3.7:1, below AA for body-size text; it passes only at large-text sizes (18.66px bold and up).
