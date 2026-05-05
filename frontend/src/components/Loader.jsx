const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="page-loader">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
};

export default Loader;