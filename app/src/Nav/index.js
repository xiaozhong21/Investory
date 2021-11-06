import { NavLink } from "react-router-dom";

import useAuth0 from "../auth/useAuth0";
import { Login, Logout } from "../auth/widgets";

import SearchBar from "./SearchBar";
import styles from "./styles.module.scss";

const Nav = () => (
  <nav className={styles.nav}>
    <ul>
      <li>
        <NavLink to="/" end>
          About{" "}
          <span className={styles.yellow}>
            Inve<span className={styles.green}>$</span>tory
          </span>
        </NavLink>
      </li>
      <li>
        <NavLink to="discover">Discover</NavLink>
      </li>
      <li>
        <NavLink to="addPortfolio">Backtest Portfolio</NavLink>
      </li>
      <li>
        <NavLink to="mystocks">My Stocks</NavLink>
      </li>
      <li>
        <SearchBar />
      </li>
      <li>
        <Auth />
      </li>
    </ul>
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
    <Login />
  );
};

export default Nav;
