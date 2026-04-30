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
- Movies and Cart are placeholder pages for Week 4.
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

## Run the Project

These steps are only needed if you want to run the project locally.

Install dependencies:

```bash
npm install
```

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
