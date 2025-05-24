import React, { useState, useEffect } from "react";
import Header from "./components/header/Header";
import Balance from "./components/Wallet/WalletBallance";
import Expenses from "./components/Expenses/Expenses";
import ExpensesModal from "./components/ExpensesModal/ExpensesModal";
import BallanceModal from "./components/BallanceModal/BallanceModal";
import PieChart from "./components/PieChart/PieChart";
import BarGraph from "./components/BarGraph/BarGraph";
import TransactionList from "./components/TransactionsList/TransactionsList";
import { v4 as uuidv4 } from "uuid";
import { useSnackbar } from "notistack";

import "./App.css";

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const [expenses, setExpenses] = useState([]);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const [walletBalance, setWalletBalance] = useState(() => {
    const storedBalance = localStorage.getItem("walletBalance");
    const savedExpenses = localStorage.getItem("expenses");

    let totalExpenses = 0;

    if (savedExpenses) {
      try {
        const parsedExpenses = JSON.parse(savedExpenses);
        if (Array.isArray(parsedExpenses)) {
          totalExpenses = parsedExpenses.reduce((total, expense) => total + Number(expense.price), 0);
        } else {
          console.warn("Expenses in localStorage is not an array.");
        }
      } catch (error) {
        console.error("Error parsing saved expenses:", error);
      }
    }

    return storedBalance ? parseFloat(storedBalance) : 5000 - totalExpenses;
  });

  useEffect(() => {
    localStorage.setItem("walletBalance", walletBalance);
  }, [walletBalance]);

  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      try {
        const parsedExpenses = JSON.parse(savedExpenses);
        if (Array.isArray(parsedExpenses)) {
          setExpenses(parsedExpenses);
        } else {
          console.warn("Saved expenses is not an array, initializing empty array");
          setExpenses([]);
        }
      } catch (error) {
        console.error("Error parsing saved expenses:", error);
        setExpenses([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.removeItem("walletBalance");
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const totalAmount = Array.isArray(expenses)
    ? expenses.reduce((total, expense) => total + Number(expense.price), 0)
    : 0;

  const handleAddBalance = (amount) => {
    const numericAmount = Number(amount);
    if (!isNaN(numericAmount)) {
      setWalletBalance((prev) => Number(prev) + numericAmount);
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

    setExpenses([...expenses, { ...expense, id: uuidv4() }]);
    setWalletBalance((prevBalance) => prevBalance - numericPrice);
    setExpenseModalOpen(false);
  };

  const handleEditExpense = (updatedExpense) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    setExpenseToEdit(null);
    setExpenseModalOpen(false);
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
    setExpenses((prevExpenses) => {
      const updatedExpenses = prevExpenses.filter((expense) => expense.id !== expenseId);
      const deletedExpense = prevExpenses.find((expense) => expense.id === expenseId);
      const updatedBalance = walletBalance + Number(deletedExpense?.price || 0);
      setWalletBalance(updatedBalance);
      return updatedExpenses;
    });
  };

  return (
    <div className="App">
      <Header />
      <div className="App-top">
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
