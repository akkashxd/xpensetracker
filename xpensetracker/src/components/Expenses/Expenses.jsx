import React from "react";
import { MdCurrencyRupee } from "react-icons/md";
import styles from "./Expenses.module.css";

function Expenses({ onAddExpense, totalExpenses }) {

  const formattedWxpense = typeof  totalExpenses === 'number' ? totalExpenses : 0;
   return ( <div>
      <h2>Expenses: <span className={styles.total_expenses}><MdCurrencyRupee/>{formattedWxpense}</span></h2>
      <button
        type="button"
        onClick={onAddExpense}
        className={styles.addExpenseButton}
      >
        + Add Expense
      </button>
      </div>)
}

export default Expenses;
