# WordPress import into EmDash

Imported locally on 2026-11-19 through EmDash Exporter, from https://www.glass.no.

## What came over

- 110 pages, 31 posts and 1 WooCommerce product (`speil`).
- 559 media files, with 4,242 image URLs in the content rewritten to local media.
- Yoast SEO titles and descriptions: 81 of 110 pages and 26 of 31 posts have a title, 83 and 29 a description.
- Site title, tagline, logo and favicon.
- One category (`uncategorized`) with 32 assignments, and one menu.

Pages that imported empty, such as `glassmester`, `temperert-glass`, `smijern-hub` and `salgs-og-leveringsbetingelser`, are empty on the live site too.

## What didn't come over

### Layout and styling

The live theme is Kadence with Kadence Blocks Pro. Most of the content is Kadence blocks, which EmDash keeps as raw HTML blocks without their generated CSS:

| Block | Count | Imported as |
| --- | --- | --- |
| `kadence/advancedheading` | 5,801 | HTML heading, unstyled |
| `kadence/image` | 1,875 | HTML figure |
| `kadence/singlebtn` | 990 | Block comment only, renders nothing |
| `kadence/spacer` | 444 | HTML |
| `kadence/advancedgallery` | 376 | HTML |
| `kadence/single-icon` | 221 | HTML |
| `core/block` (reusable blocks) | 206 | Reference only |
| `kadence/form` | 104 | Not working, needs a replacement |
| `core/shortcode` | 102 | Text only |
| `kadence/column`, `infobox`, `tableofcontents` | 84 | HTML |

The header, footer and navigation come from Kadence's header and footer builder, so they aren't in the content.

### Plugins with no counterpart yet

- **Cal.com** booking (`book-befaring`)
- **Kadence forms**, protected by Cloudflare Turnstile
- **Google Tag Manager** and **Google Site Kit**
- **Cookiebot** cookie consent on the live site; Complianz is installed as well (the `cmplz_hide_cookiebanner` field)
- **Trustindex** reviews (shortcode)
- **WooCommerce**, **WooCommerce Payments** and **Uni CPO**: the shop pages `butikk`, `handlekurv`, `kassen`, `min-konto` and `refund_returns`, and the product `speil`
- **Ultimate Member**: `login`, `register`, `account`, `members`, `user`, `password-reset` and `logout`

### URLs

`live-urls.txt` lists the 141 URLs in the live sitemaps. Every page and post lives at `/{slug}/` with a trailing slash, and the new site matches: 137 of them return 200 locally. The other four are WordPress archives and need a redirect or 410: `/author/admin/`, `/category/uncategorized/`, `/produkt/speil/` and `/produktkategori/ukategorisert/`.

The live site also redirects `/blog/{slug}/` to `/{slug}/`. Its other redirects aren't exported.

## Conversion to EmDash blocks

`convert/` is a one-time tool, and is deleted once the move is done. It reads the WXR export, which keeps Kadence's rows and columns, and rewrites the imported entries in place:

```bash
node migration/convert/run.ts <export.xml> [dry-run.json] [--write]
```

- **Pages** get a `layout` blocks field with five block types: `section` (one to four rich-text columns and a background), `cards`, `faq`, `contact_form` and `reviews`. Across 108 pages that's 723 sections, 135 card grids, 82 contact forms, 79 review blocks and 36 FAQs.
- **Posts** stay rich text, with rows and columns flattened in reading order.
- **Buttons** are paragraphs holding a single link, which the theme renders as a button. Every "Book befaring" reusable block and Cal.com shortcode becomes one linking to `/book-befaring/`.
- **Yoast titles and descriptions** move into EmDash's SEO panel. Posts now live at `/{slug}` like on the live site.
- **Rows Kadence hid on desktop** are dropped (291), because they were mobile copies of desktop rows.
- **Dropped:** spacers, icons, tables of contents, the contact forms inside 22 posts, and one FAQ question with no answer. Ten images were already deleted in WordPress and broken on the live site.
- **Matching images to media:** by filename, or by SHA-1 for ambiguous names such as `image.png`. Hashes are cached in `convert/.hash-cache.json`, which isn't committed.

`menus.ts` rebuilds the main menu from the live header, linking items to pages rather than URLs. `write-seed.ts` writes `seed/seed.json` from the same block types, so a fresh database gets the schema.

### Leftover pages to decide on

`about` is the live "Om oss" page and `prosjekter` is "Siste prosjekter", so both stay. `services`, `projects`, `project` and `eksempel-side` look like theme demos. With the Ultimate Member and WooCommerce pages above, they're probably safe to drop, with a 410 or a redirect for any that are indexed.

## Theme

The theme is rebuilt in Astro with the live site's Kadence palette, Raleway and Playfair Display. Pages render their `layout` blocks, and posts render rich text with a booking banner. `/blogg/` lists the posts. Trailing slashes are enforced in `src/middleware.ts`, which also rewrites the sitemaps to use them and lists `hjem` as `/`.

Not built yet:

- **The contact form doesn't send.** It's markup only. Leads should go to the CRM, with Turnstile.
- **Reviews blocks render nothing.** Trustindex needs a replacement.
- **Analytics and cookie consent:** Google Tag Manager and Site Kit, behind vanilla-cookieconsent as ADR 0041 proposes.
- **Search**, which the live header has.
