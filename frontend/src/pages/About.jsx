const About = () => {
  return (
    <main className="simple-page">
      <section className="simple-card">
        <span>CivicFix AI</span>
        <h1>About the Project</h1>
        <p>
          CivicFix AI is an intelligent civic issue prioritization and resolution
          tracking platform. It helps citizens submit civic issues with photo,
          location, and description. The system uses AI-assisted logic to classify
          problems, calculate urgency score, detect duplicates, route complaints,
          and track resolution.
        </p>

        <div className="feature-list">
          <p>Smart City + Civic Tech + Social Impact</p>
          <p>MERN Stack Software Project</p>
          <p>AI Priority + Duplicate Detection</p>
          <p>Public Heatmap + Role Dashboards</p>
        </div>
      </section>
    </main>
  );
};

export default About;