import { NavLink } from "react-router-dom";

import useAuth0 from "../../auth/useAuth0";
import { Login, Logout } from "../../auth/widgets";

import styles from "./styles.module.scss";

const Nav = () => (
  <nav className={styles.nav}>
    <ul>
      <li>
        <NavLink to="/" end>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="discover">Discover</NavLink>
      </li>
      <li>
        <NavLink to="mystocks">My Stocks</NavLink>
      </li>
      <li>
        <NavLink to="addPortfolio">Backtest Portfolio</NavLink>
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
    <>
      <img src={user.picture} alt="" />
      Hello, {user.given_name} <Logout />
    </>
  ) : (
    <Login />
  );
};

export default Nav;
