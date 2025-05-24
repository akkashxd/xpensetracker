import React,{useState,useEffect} from "react";
import Modal from "react-modal";
import styles from './ExpensesModal.module.css';
import { v4 as uuidv4 } from 'uuid';


const categories = ["Food", "Travel", "Entertainment"];

function ExpensesModal({ isOpen, onClose, onAddExpense, expenseToEdit  }) {
    
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        date: '',
        category: 'other'
      });

      useEffect(() => {
        // When editing an expense, populate the form
        if (expenseToEdit) {
          setFormData({
            title: expenseToEdit.title || '',
            price: expenseToEdit.price || '',
            date: expenseToEdit.date || '',
            category: expenseToEdit.category || 'other'
          });
        } else {
          // Reset form for new expenses
          setFormData({
            title: '',
            price: '',
            date: '',
            category: 'other'
          });
        }
      }, [expenseToEdit]);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };
      
      const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate data before submission
        if (!formData.title || !formData.price || !formData.date) {
          // Show validation error 
          return;
        }
        
        // Create expense object with proper data types
        const expense = {
          ...formData,
          price: Number(formData.price),
          id: expenseToEdit ? expenseToEdit.id : uuidv4(),
        };
        
        // Add or update expense
        onAddExpense(expense);
        onClose();
      };


    
    return(
        <Modal 
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={expenseToEdit ? "Edit Expense" : "Add Expense"}
            className={styles.expensesModal}
        >
        <form onSubmit={handleSubmit}>
            <h2 className={styles.heading}>{expenseToEdit ? "Edit Expense" : "Add Expense"}</h2>
            <input type="text" name="title" placeholder="Title" value={formData.title}  onChange={handleChange}
                required className={styles.titleInput}
            />
            <input 
                type="number" 
                name="price" 
                placeholder="Price"   
                value={formData.price}
                onChange={handleChange}
                className={styles.priceInput}
                required
                />
            <select name="category" placeholder="Category" value={formData.category || ""} onChange={handleChange} className={styles.categoryInput} required>
                <option value="" selected>Select Category</option>
                {categories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>
            <input 
                type="date"
                name="date" 
                placeholder="Date"  
                value={formData.date}
                onChange={handleChange}
                className={styles.dateInput}
                required 
                />
            <button type="submit" className={styles.addExpenses}>Add Expense</button>
            <button type="button" onClick={onClose} className={styles.ExpensesClose}>Close</button>
        </form>
        </Modal>
    )
}

export default ExpensesModal;