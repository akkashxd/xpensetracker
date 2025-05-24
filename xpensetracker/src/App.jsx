import React,{useState,useEffect} from "react";
import Header from "./components/header/Header";
import Balance from "./components/Wallet/WalletBallance";
import Expenses from "./components/Expenses/Expenses";
import ExpensesModal from "./components/ExpensesModal/ExpensesModal";
import BallanceModal from "./components/BallanceModal/BallanceModal";
import PieChart  from "./components/PieChart/PieChart";
import BarGraph from "./components/BarGraph/BarGraph"
import TransactionList from "./components/TransactionsList/TransactionsList";
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from 'notistack';


import './App.css';

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const [walletBalance, setWalletBalance] = useState(() => {
    const storedBalance = localStorage.getItem("walletBalance");
    const savedExpenses = localStorage.getItem('expenses');

    const totalExpenses = savedExpenses
      ? JSON.parse(savedExpenses).reduce((total, expense) => total + Number(expense.price), 0)
      : 0;
    return storedBalance ? parseFloat(storedBalance) : 5000 - totalExpenses;
  });
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
 
  const [expenses, setExpenses] = useState([]);
  const [amountToAdd, setAmountToAdd] = useState('');

  const [expenseToEdit, setExpenseToEdit] = useState(null);

  
  useEffect(() => {
    localStorage.setItem("walletBalance", walletBalance);
  }, [walletBalance]);

  useEffect(() => {
  window.onbeforeunload = () => {
    localStorage.removeItem("walletBalance");
  };

  return () => {
    window.onbeforeunload = null; // Clean up
  };
}, []);

  useEffect(() => {
    // Load from localStorage if available
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      try {
        const parsedExpenses = JSON.parse(savedExpenses);
        // Validate that it's actually an array before setting state
        if (Array.isArray(parsedExpenses)) {
          setExpenses(parsedExpenses);
          
        } else {
          console.error('Saved expenses is not an array, initializing empty array');
          setExpenses([]);
        }
      } catch (error) {
        console.error('Error parsing saved expenses:', error);
        setExpenses([]);
      }
    }
  }, []);



  const totalAmount = Array.isArray(expenses) 
    ? expenses.reduce((total, expense) => total + Number(expense.price), 0) 
    : 0;

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
  }, [expenses]);



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
      enqueueSnackbar("Insufficient balance!",{variant: "warning"});
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
    setExpenseToEdit(null); // Clear the edit state
    setExpenseModalOpen(false); // Close the modal after editing
  };

  const handleEditClick = (expense) => {
    setExpenseToEdit(expense); // Set the expense to edit
    setExpenseModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setExpenseToEdit(null); // Reset the edit state
    setExpenseModalOpen(false); // Close the modal
  };


 const handleDeleteExpense = (expenseId) => {
  setExpenses((prevExpenses) => {
    const updatedExpenses = prevExpenses.filter((expense) => expense.id !== expenseId);

    // Recalculate wallet balance after removing the expense
    const totalExpenses = updatedExpenses.reduce((total, expense) => total + Number(expense.price), 0);
    setWalletBalance(walletBalance - totalExpenses);

    return updatedExpenses;
  });
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
      <PieChart expenses={expenses}/>
      </div>
      <div className="App-bottom">
        <TransactionList expenses={expenses} handleDelete={handleDeleteExpense} handleEditClick={handleEditClick} />
        <BarGraph data={expenses}/>
      </div>
    </div>
    
    
  )


}


export default App;