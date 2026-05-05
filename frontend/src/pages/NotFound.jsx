import { Link } from "react-router-dom";
import { Home, ShieldAlert } from "lucide-react";

const NotFound = () => {
  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <div className="not-found-icon">
          <ShieldAlert size={42} />
        </div>

        <h1>404</h1>
        <h2>Page Not Found</h2>

        <p>
          The page you are trying to open does not exist or may have been moved.
        </p>

        <Link to="/" className="primary-btn">
          <Home size={18} />
          Back to Home
        </Link>
      </section>
    </main>
  );
};

export default NotFound;