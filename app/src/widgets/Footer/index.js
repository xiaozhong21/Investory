import filledHeart from "../../images/filledHeart.svg";
import github from "../../images/github.svg";
import linkedIn from "../../images/linkedIn.svg";

import styles from "./styles.module.scss";

const Footer = () => (
  <ul className={styles.footer}>
    <li>
      <a href="https://github.com/xiaozhong21" target="_blank" rel="noreferrer">
        <img src={github} alt="github logo" />
      </a>
    </li>
    <li>
      <span>
        Made with <img src={filledHeart} alt="filled heart icon}" /> by Xiao
        Zhong &copy; 2021
      </span>
    </li>
    <li>
      <a
        href="https://www.linkedin.com/in/xiaozhong/"
        target="_blank"
        rel="noreferrer"
      >
        <img src={linkedIn} alt="linkedIn logo" />
      </a>
    </li>
  </ul>
);

export default Footer;
