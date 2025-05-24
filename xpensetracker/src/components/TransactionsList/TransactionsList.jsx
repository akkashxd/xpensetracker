import React from "react";
import Transaction from "../Transactions/Transaction";
import styles from "./TransactionList.module.css";

function TransactionList({ expenses, handleDelete, handleEditClick }) {
  return (
    <div>
      <h2>Recent Transactions</h2>
      <div className={styles.transactionList}>
        {expenses.length > 0 ? (
          expenses.map((transaction) => (
            <React.Fragment key={transaction.id}>
              <Transaction
                data={transaction}
                deleteExpense={handleDelete}
                editExpense={handleEditClick}
              />
              <hr className={styles.hr} />
            </React.Fragment>
          ))
        ) : (
          <p>No transactions!</p>
        )}
      </div>
    </div>
  );
}

export default TransactionList;
