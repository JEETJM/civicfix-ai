const Loader = ({ text = "Loading..." }) => {
  return (
    <main className="loader-page">
      <div className="loader-card">
        <div className="loader-logo">
          <span></span>
        </div>

        <div className="loader-spinner"></div>

        <h2>{text}</h2>
        <p>Please wait while CivicFix AI prepares your data.</p>
      </div>
    </main>
  );
};

export default Loader;