import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/header/Header";
import Balance from "./components/Wallet/WalletBallance";
import Expenses from "./components/Expenses/Expenses";
import ExpensesModal from "./components/ExpensesModal/ExpensesModal";
import BallanceModal from "./components/BallanceModal/BallanceModal";
import PieChart from "./components/PieChart/PieChart";
import BarGraph from "./components/BarGraph/BarGraph";
import TransactionList from "./components/TransactionsList/TransactionsList";
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from 'notistack';

import './App.css';

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const loadFromLocalStorage = (key, defaultValue) => {
    const item = localStorage.getItem(key);
    try {
      const parsed = JSON.parse(item);
      return parsed !== null && parsed !== undefined ? parsed : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [expenses, setExpenses] = useState(() => loadFromLocalStorage('expenses', []));
  const [walletBalance, setWalletBalance] = useState(() => {
    const storedBalance = localStorage.getItem("walletBalance");
    const savedExpenses = loadFromLocalStorage("expenses", []);
    const totalExpenses = savedExpenses.reduce((total, expense) => total + Number(expense.price), 0);
    return storedBalance ? parseFloat(storedBalance) : 5000 - totalExpenses;
  });

  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  useEffect(() => {
    localStorage.setItem("walletBalance", walletBalance);
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const totalAmount = Array.isArray(expenses)
    ? expenses.reduce((total, expense) => total + Number(expense.price), 0)
    : 0;

  const handleAddBalance = (amount) => {
    const numericAmount = Number(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      setWalletBalance(prev => prev + numericAmount);
      enqueueSnackbar("Balance added successfully!", { variant: "success" });
    } else {
      enqueueSnackbar("Enter a valid amount!", { variant: "error" });
    }
    setAmountToAdd('');
    setBalanceModalOpen(false);
  };

  const handleAddExpense = (expense) => {
    const numericPrice = Number(expense.price);
    if (walletBalance < numericPrice) {
      enqueueSnackbar("Insufficient balance!", { variant: "warning" });
      return;
    }

    setExpenses(prev => [...prev, { ...expense, id: uuidv4() }]);
    setWalletBalance(prev => prev - numericPrice);
    enqueueSnackbar("Expense added!", { variant: "success" });
    setExpenseModalOpen(false);
  };

  const handleEditExpense = (updatedExpense) => {
    const prevExpense = expenses.find(e => e.id === updatedExpense.id);
    const priceDifference = Number(updatedExpense.price) - Number(prevExpense.price);

    if (walletBalance < priceDifference) {
      enqueueSnackbar("Insufficient balance to update!", { variant: "warning" });
      return;
    }

    setExpenses(prevExpenses =>
      prevExpenses.map(expense =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    setWalletBalance(prev => prev - priceDifference);
    setExpenseToEdit(null);
    setExpenseModalOpen(false);
    enqueueSnackbar("Expense updated!", { variant: "success" });
  };

  const handleEditClick = (expense) => {
    setExpenseToEdit(expense);
    setExpenseModalOpen(true);
  };

  const handleCloseModal = () => {
    setExpenseToEdit(null);
    setExpenseModalOpen(false);
  };

  const handleDeleteExpense = (expenseId) => {
    const deletedExpense = expenses.find(expense => expense.id === expenseId);
    if (deletedExpense) {
      setWalletBalance(prev => prev + Number(deletedExpense.price));
    }
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    enqueueSnackbar("Expense deleted!", { variant: "info" });
  };

  return (
    <div className="App">
      <Header />
      <div className='App-top'>
        <div className="Wallet_Balance">
          <Balance
            balance={walletBalance}
            openModal={() => setBalanceModalOpen(true)}
          />
          {balanceModalOpen && (
            <BallanceModal
              isOpen={balanceModalOpen}
              onClose={() => setBalanceModalOpen(false)}
              amountToAdd={amountToAdd}
              setAmountToAdd={setAmountToAdd}
              handleAddBalance={handleAddBalance}
            />
          )}
        </div>

        <div className="Expenses">
          <Expenses
            onAddExpense={() => setExpenseModalOpen(true)}
            totalExpenses={totalAmount}
          />
          {expenseModalOpen && (
            <ExpensesModal
              isOpen={expenseModalOpen}
              onClose={handleCloseModal}
              onAddExpense={expenseToEdit ? handleEditExpense : handleAddExpense}
              expenseToEdit={expenseToEdit}
            />
          )}
        </div>

        <PieChart expenses={expenses} />
      </div>

      <div className="App-bottom">
        <TransactionList
          expenses={expenses}
          handleDelete={handleDeleteExpense}
          handleEditClick={handleEditClick}
        />
        <BarGraph data={expenses} />
      </div>
    </div>
  );
}

export default App;
