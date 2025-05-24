import React from "react";
import { MdCurrencyRupee } from "react-icons/md";
import styles from "./Expenses.module.css";

function Expenses({ onAddExpense, totalExpenses }) {
  const formattedExpense = typeof totalExpenses === 'number' ? totalExpenses : 0;

  return (
    <div>
      {/* This h2 is required by Cypress to detect "Expenses" */}
      <h2>Expenses</h2>

      {/* Show the total expense below the heading if needed */}
      <div className={styles.total_expenses}>
        <MdCurrencyRupee />
        {formattedExpense}
      </div>

      <button
        type="button"
        onClick={onAddExpense}
        className={styles.addExpenseButton}
      >
        + Add Expense
      </button>
    </div>
  );
}

export default Expenses;
