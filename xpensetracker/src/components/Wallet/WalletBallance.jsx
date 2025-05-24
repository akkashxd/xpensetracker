import React from "react";
import styles from "./Wallet.module.css";
import { MdCurrencyRupee } from "react-icons/md";

function WalletBalance({ balance, openModal }) {
  const formattedBalance = typeof balance === "number" ? balance : 0;

  return (
    <div className={styles.walletContainer}>
      <h2>
        Wallet Balance:{" "}
        <span className={styles.balance}>
          <MdCurrencyRupee />
          {formattedBalance}
        </span>
      </h2>
      <button type="button" onClick={openModal} className={styles.addButton}>
        + Add Income
      </button>
    </div>
  );
}

export default WalletBalance;
