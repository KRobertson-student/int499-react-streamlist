import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="placeholder-page not-found">
      <div className="panel placeholder-panel">
        <p className="eyebrow">Route Not Found</p>
        <h2 className="page-title">Page unavailable</h2>
        <p className="page-copy">
          This StreamList route does not exist. Return to the homepage to add,
          edit, complete, or search for titles.
        </p>
        <Link className="btn btn--primary btn--inline" to="/">
          Return to StreamList
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
