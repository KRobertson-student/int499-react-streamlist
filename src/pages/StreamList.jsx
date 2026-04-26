import { useState } from 'react';

function StreamList() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Please enter a movie or TV show title.');
      setStatus('');
      return;
    }

    console.log('StreamList entry:', trimmedTitle);
    setStatus(`"${trimmedTitle}" was sent to the browser console.`);
    setTitle('');
    setError('');
  };

  return (
    <section className="streamlist-page">
      <article className="panel">
        <p className="page-kicker">Homepage</p>
        <h2 className="page-title">Build your StreamList</h2>
        <p className="page-copy">
          Enter a movie or TV show title below. This Week 1 version focuses on React
          Router navigation, reusable components, user input, and CSS styling.
        </p>

        <form className="stream-form" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="stream-title">
            Movie or TV show title
          </label>

          <div className="input-row">
            <input
              id="stream-title"
              className="text-input"
              type="text"
              placeholder="Example: Stranger Things"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (error) {
                  setError('');
                }
              }}
            />

            <button className="btn btn--primary" type="submit">
              Submit
            </button>
          </div>
        </form>

        <p className="helper-text">
          Submitted titles are logged to the browser console.
        </p>

        {error ? <p className="message message--error">{error}</p> : null}
        {status ? <p className="message message--success">{status}</p> : null}
      </article>
    </section>
  );
}

export default StreamList;
