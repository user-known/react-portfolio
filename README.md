# Vignesh Balakumar: portfolio (React)

A portfolio site built with React, Vite and React Router. The design, animations and content come from the earlier
plain-HTML version, now split into components, hooks and separate CSS files.

**Pages:** Home, About, Projects (filterable), Case study (one template, built from data) and an Admin page for editing projects.

## Quick start

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install        # install dependencies (once)
npm run dev        # start the site at http://localhost:5173
npm test           # run the tests
npm run build      # build the site into dist/
npm run preview    # serve the built site locally
```

## Project structure

```
index.html                  page shell, theme and fonts
vite.config.js              Vite and test settings
.github/workflows/deploy.yml  builds and publishes to GitHub Pages
public/images/              your project images (the data refers to them as images/name.jpg)
src/
  main.jsx                  entry point (router and data provider)
  App.jsx                   the routes
  data/projects.json        all projects and categories: the one file the site reads
  context/                  ProjectsContext: gives every page the project list
  pages/                    Home, About, Projects, CaseStudy, Admin, NotFound
  components/               Nav, Footer, Cover, ProjectRow, ProjectCard, HeroStack, Accordion, ...
  components/case/          case study pieces: Viewer, Slider, Diamond, Stat, Rail, ProgressBar
  admin/                    admin pieces: CardEditor, CaseEditor, PublishPanel, caseSchema
  hooks/                    useInView, useScrollY, useTheme, useReducedMotion, useCopy, ...
  lib/                      utils (links, covers, email), github (commits), draft (unpublished edits)
  styles/                   one CSS file per area, loaded in order by styles/index.css
  test/                     tests (Vitest and Testing Library)
```

## Styles

All CSS lives in `src/styles/`, one file per area (`nav.css`, `hero.css`, `case-study.css`, and so on).
`styles/index.css` imports them in the right order, and `main.jsx` imports that one file.

- **Colours, fonts and widths** are variables in `tokens.css`. The dark theme overrides the same variables there.
- **Motion:** reveal, highlight and entrance animations are in `animations.css`. Everything switches off when a visitor
  has "reduce motion" turned on.
- **Responsive rules** are in `responsive.css`, loaded last.

## Editing content

### Projects (use the admin page)

1. Open the site and go to `/#/admin` (for example `http://localhost:5173/#/admin`).
2. Click **New**, fill in the **Project card** tab, and tick "Show on the home page" if it belongs in Selected work.
3. On the **Case study page** tab, tick "Show a case study page", and fill in only the sections you need. A section with
   nothing in it is left out of the page and the side menu.
4. **Preview page** opens your unpublished draft in a new tab.
5. When you are happy, either:
   - click **Download file** and replace `src/data/projects.json` with it, then commit; or
   - open "Publish straight to GitHub", enter your details and click **Publish to GitHub**. This commits
     `src/data/projects.json` for you, and the deploy workflow rebuilds the site.

Edits are kept as a draft in your browser until you publish or discard them. A draft exists only in that browser.

You can also edit `src/data/projects.json` by hand. The fields match the admin: each project has card fields
(`client`, `title`, `industry`, `year`, `tags`, `cats`, `colors`, `featured`, `image`, `url`) and a `case` object.

### Images

Put images in `public/images/` and refer to them as `images/name.jpg` in the admin or the data. With GitHub connected,
the admin's **Upload image** buttons add the file to `public/images/` for you. Keep images under about 1.5 MB.
A project without an image uses its gradient cover.

### Other content

The home page bullets and FAQ are in `src/pages/Home.jsx`. The about page story, timeline and skills are at the top of
`src/pages/About.jsx`. Your email address and social links are in `src/lib/utils.js` (`EMAIL` and `LINKS`).

### Before going live

- Set your real email and LinkedIn/Behance links in `src/lib/utils.js` and `<title>` in `index.html`.
- Replace the placeholder text ("Add your one-line project title here", and so on) in `src/data/projects.json`.
- General Sans is loaded from Fontshare in `index.html`. Check its licence for your use. DM Sans is the fallback.

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` tests and builds the site on every push to `main`, then publishes it.

1. Create a repository and push this project to the `main` branch.
2. In the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Push again (or run the workflow from the **Actions** tab). The site appears at
   `https://<username>.github.io/<repository>/`.

The site uses hash URLs (`/#/about`), so every page works on GitHub Pages without extra server settings.
`vite.config.js` sets `base: "./"`, so it works under any repository name.

Publishing from the admin commits a file, which starts the workflow, so changes appear after a minute or two.

## How the data flows

```
src/data/projects.json ──► ProjectsContext ──► Home / Projects / CaseStudy
                                  ▲
   Admin edits ──► draft in the browser (localStorage) ──► shown only with ?preview=1
   Admin "Publish" ──► commits src/data/projects.json ──► workflow rebuilds the site
```

- The public site only ever reads the published `projects.json`.
- A project's card links to `/projects/<page name>` when its case study is switched on, to its custom link if you set
  one, and nowhere otherwise.
- The admin is a normal page at `/#/admin`. It is hidden from search engines but not password protected: anyone can open
  it, and nothing is published without a GitHub token. If you do not want it on the live site, delete the `admin`
  route in `src/App.jsx` and use it only locally.

## Tests

`npm test` runs 18 tests that render the real pages: the home page, project filtering, case study pages built from data
(including missing sections and unknown projects), the About page, theme switching, and the admin (adding, editing,
deleting, draft saving, preview and file export). The deploy workflow runs them before every build.

## Licence

Personal portfolio. Add the licence you want here.
