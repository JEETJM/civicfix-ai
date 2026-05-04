import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="simple-page">
      <section className="simple-card">
        <span>404</span>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link className="primary-btn" to="/">
          Go Home
        </Link>
      </section>
    </main>
  );
};

export default NotFound;