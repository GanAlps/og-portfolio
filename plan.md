# Portfolio Customization Plan

## Color Theme

| Setting | Current | Proposed | Why |
|---|---|---|---|
| `neutral` | `gray` | `slate` | Cooler undertone, feels more technical and polished |
| `brand` | `cyan` | `violet` | Premium and distinctive — most SDE portfolios default to blue, this sets you apart |
| `accent` | `red` | `cyan` | Fresh, modern; complements violet without clashing |
| `border` | `playful` | `rounded` | Playful is too bubbly; rounded is clean and professional |

---

## Phases

### Phase 1 — Foundation + Home + Header/Footer [x]

**Global config (`once-ui.config.ts`):**
- [ ] Apply new color theme (slate/violet/cyan/rounded)
- [ ] Set `baseURL` placeholder
- [ ] Disable `/gallery` route (keep code)
- [ ] Update `schema` name/email
- [ ] Update `sameAs` to LinkedIn only (remove threads/discord)
- [ ] Remove template `protectedRoutes` entry

**Personal info (`content.tsx`):**
- [ ] Name → Osho Gupta, role → Senior Software Development Engineer, location → `America/Los_Angeles`
- [ ] Update email
- [ ] Social → keep only GitHub, LinkedIn, Email; remove Instagram, Threads

**Header:** Verify Seattle timezone renders correctly once location is updated (no structural changes)

**Footer:**
- [ ] Remove Instagram/Threads icons — show only GitHub, LinkedIn, Email
- [ ] Keep Once UI attribution (required by CC license)

**Home page (`src/app/page.tsx` + `content.tsx` `home` object):**
- [ ] Remove the `featured` badge
- [ ] Update `headline` and `subline`
- [ ] Remove `<Mailchimp />` component from page
- [ ] Keep Projects preview and blog preview sections

---

### Phase 2 — About Page [x]

**`content.tsx` `about` object:**
- [ ] Set `calendar.display: false`
- [ ] Write intro paragraph
- [ ] Replace work experience with real jobs
- [ ] Replace education with real institutions
- [ ] Update technical skills to SDE stack

**`src/app/about/page.tsx`:** No structural changes needed.

---

### Phase 3 — Work / Projects Page [x]

- [ ] Delete 3 template `.mdx` project files
- [ ] Add ~10 new `.mdx` project stubs with correct frontmatter
- [ ] One complete example project to establish format

---

### Phase 4 — Blog Page [x]

- [ ] Delete all template blog `.mdx` posts
- [ ] Update `content.tsx` `blog` object (title + description)
- [ ] Add one dummy post so the blog page renders correctly

---

### Phase 5 — Gallery Page [ ]

- [ ] Already disabled via `routes` in Phase 1 — no further work needed
- [ ] Code stays intact for future use

---

## Content Needed (before Phase 2 & 3)

**Phase 2 — About:**
- Work history: companies, dates, role, 2–3 bullet achievements each
- Education
- Tech stack / skills list
- GitHub and LinkedIn URLs

**Phase 3 — Work:**
Per project: title, one-line summary, tech tags, link (GitHub or live demo), cover image (or placeholder)
