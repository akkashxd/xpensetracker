import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from './ExpensesModal.module.css';
import { v4 as uuidv4 } from 'uuid';

// Set the root element for accessibility
Modal.setAppElement('#root');

const categories = ["Food", "Travel", "Entertainment"];

function ExpensesModal({ isOpen, onClose, onAddExpense, expenseToEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    date: '',
    category: 'Food'
  });

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title || '',
        price: expenseToEdit.price || '',
        date: expenseToEdit.date || '',
        category: expenseToEdit.category || 'Food'
      });
    } else {
      setFormData({
        title: '',
        price: '',
        date: '',
        category: 'Food'
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

    if (!formData.title || !formData.price || !formData.date) {
      return;
    }

    const expense = {
      ...formData,
      price: Number(formData.price),
      id: expenseToEdit ? expenseToEdit.id : uuidv4(),
    };

    onAddExpense(expense);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={expenseToEdit ? "Edit Expense" : "Add Expense"}
      className={styles.expensesModal}
    >
      <form onSubmit={handleSubmit}>
        <h2 className={styles.heading}>
          {expenseToEdit ? "Edit Expense" : "Add Expense"}
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className={styles.titleInput}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className={styles.priceInput}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className={styles.categoryInput}
        >
          <option value="" disabled>Select Category</option>
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
          required
          className={styles.dateInput}
        />

        <button type="submit" className={styles.addExpenses}>
          {expenseToEdit ? "Update Expense" : "Add Expense"}
        </button>
        <button type="button" onClick={onClose} className={styles.ExpensesClose}>
          Close
        </button>
      </form>
    </Modal>
  );
}

export default ExpensesModal;
