import { NavLink } from "react-router-dom";

import useAuth0 from "../auth/useAuth0";
import { Login, Logout } from "../auth/widgets";

import SearchBar from "./SearchBar";
import styles from "./styles.module.scss";

const Nav = () => (
  <nav className="navbar fixed-top navbar-expand-lg navbar-dark">
    <NavLink to="/" className={`navbar-brand ${styles.navbarBrand}`} end>
      <span className={styles.yellow}>
        Inve<span className={styles.green}>$</span>tory
      </span>
    </NavLink>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="discover" className="nav-link">
            Discover
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="mystocks" className="nav-link">
            My Stocks
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="addPortfolio" className="nav-link">
            Add Portfolio
          </NavLink>
        </li>
        <li className="nav-item">
          <SearchBar />
        </li>
      </ul>
      <Auth />
    </div>
  </nav>
);

const Auth = () => {
  const { isAuthenticated, user } = useAuth0();

  return isAuthenticated ? (
    <div className={styles.auth}>
      <img src={user.picture} alt="" />
      Hello, {user.given_name}
      <Logout />
    </div>
  ) : (
    <Login className={styles.button} />
  );
};

export default Nav;
