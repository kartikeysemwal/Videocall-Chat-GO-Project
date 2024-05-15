const Header = () => {
  return (
    <section className="section">
      <div className="container">
        <header>
          <nav
            className="navbar"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <a className="navbar-item title" href="/">
                <strong>Chat Room</strong>
              </a>
            </div>
            <div className="navbar-item">
              <p className="subtitle"></p>
            </div>
          </nav>
        </header>
      </div>
    </section>
  );
};

export default Header;
