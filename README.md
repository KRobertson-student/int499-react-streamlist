# StreamList

StreamList is a React project built with Vite, React, React Router, and custom CSS.

## Live Project

View the deployed project here:

https://krobertson-student.github.io/int499-react-streamlist/

## How to Review

The live link above is the easiest way to view the project. No installation is required.

To review the source code, browse the files in this GitHub repository. The main React app starts in `src/main.jsx`, and the routed page layout is in `src/App.jsx`.

## Weekly Notes

### Week 1

- The StreamList homepage accepts a movie or TV show title from the user.
- Submitted titles were logged to the browser console for the first event-handling version.
- The app includes navigation for StreamList, Movies, Cart, and About pages.
- Movies and Cart were initially included as routed pages for later weekly work.
- About is a placeholder page for Week 5.

---

### Week 2

- The StreamList homepage now displays submitted user entries in a visible list.
- Users can add new movie or TV show titles through the form.
- The input field clears after a successful submission.
- Each list entry includes controls to mark the title complete, edit the title, or delete the entry.
- The list can be filtered by All, Active, and Complete views.
- Google Fonts provides the Inter typeface and Material Symbols icon library.
- Reusable React patterns are used for list actions, icon buttons, status messages, and helper utilities.
- Custom CSS styles the list manager, action buttons, completion state, edit form, and responsive layout.
- A small Node test suite verifies the title trimming, entry creation, and list filtering helper behavior.

---

### Week 3

- The Movies route now searches the TMDB Search Movie API on a separate page.
- Movie results display the title, release year, TMDB rating, overview, and poster artwork when TMDB provides it.
- Users can select a movie result to review more details in a focused detail panel.
- Recent movie searches, the current search, loaded results, and the selected movie are stored in localStorage for refresh persistence.
- StreamList entries, the current filter, and the draft title are stored in localStorage so the Week 2 list no longer resets after a refresh.
- The Movies page includes the required TMDB attribution notice.
- Helper tests now cover localStorage persistence utilities, TMDB URL creation, TMDB result formatting, and recent-search behavior.

---

### Week 4 AI Testing: Part 1

- The React application was reviewed with OpenAI Codex as the AI coding assistant.
- The review covered the routed app structure, StreamList title-management workflow, TMDB movie-search workflow, helper utilities, persistence behavior, and existing automated tests.
- Existing verification was run before reconstruction: `npm test` passed 11 tests, and `npm run build` completed successfully.
- Codex recommended extracting repeated duplicate-title validation from the add-title and edit-title handlers into a reusable helper.
- The recommendation was implemented with a new `hasDuplicateTitle` helper in `src/streamListUtils.js`.
- `src/pages/StreamList.jsx` now uses the helper for both new entries and edited entries, reducing repeated logic while preserving the same user-facing validation behavior.
- Two helper tests were added to confirm duplicate titles are detected regardless of spacing or letter case, and that the entry currently being edited is not falsely treated as its own duplicate.
- Codex also recommended adding a graceful fallback for unmatched routes.
- `src/App.jsx` now includes a catch-all route, and `src/pages/NotFound.jsx` provides a clear page-unavailable message with a link back to StreamList.
- Final verification after reconstruction: `npm test` passed 13 tests, and `npm run build` completed successfully.
- Presentation discussion points: explain which AI tool was used, what areas of the app were tested, what recommendations were implemented, why repeated validation was extracted, why the not-found route improves the user experience, and how the final test/build results support the quality of the reconstruction.

## Run the Project

These steps are only needed if you want to run the project locally.

Install dependencies:

```bash
npm install
```

Create a local `.env` file with a TMDB API key before using the Movies search page:

```bash
VITE_TMDB_API_KEY=your_tmdb_api_key
```

For the deployed GitHub Pages build, add the same value as a repository secret named `VITE_TMDB_API_KEY`.

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run the helper tests:

```bash
npm test
```
