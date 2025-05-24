import React from "react";
import Modal from "react-modal";
import styles from "./BalanceModal.module.css";

function BallanceModal({isOpen,onClose,amountToAdd,setAmountToAdd, handleAddBalance }) {
    return(
        <Modal 
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Add Balance"
            className={styles.WalletModal}
        >
            <h2 className={styles.heading}>Add Balance</h2>
            <div className={styles.balanceForm}>
            <input 
                type="number" 
                placeholder="Income Amount" 
                value={amountToAdd} 
                onChange={(e) => {
                    // Ensure we're setting a number or empty string
                    const value = e.target.value;
                    setAmountToAdd(value === '' ? '' : Number(value));
                }} 
                className={styles.input}
            />
            <button type="submit" onClick={() => handleAddBalance(amountToAdd)} className={styles.addBalance}>Add Balance</button>
            <button type="button" onClick={onClose} className={styles.Close}>Close</button>
            </div>
        </Modal>
    )
}

export default BallanceModal;