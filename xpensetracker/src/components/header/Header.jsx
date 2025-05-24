import React from "react";
import styles from "./Header.module.css"; // Optional if you have a CSS module

function Header() {
  return (
    <header className={styles.header}> {/* Add className for styling or test hooks */}
      <h1>Expense Tracker</h1>
    </header>
  );
}

export default Header;
