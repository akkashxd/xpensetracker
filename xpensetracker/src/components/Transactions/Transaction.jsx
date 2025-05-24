import React from "react";
import { PiPizza } from "react-icons/pi";
import { TiDeleteOutline } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";
import { GoGift } from "react-icons/go";
import { PiCar } from "react-icons/pi";
import { MdCurrencyRupee } from "react-icons/md";
import styles from './Transaction.module.css'

function Transactions({data , deleteExpense , editExpense}){

     const category = data.category.toLowerCase(); 

    const handleImg = () => {
        if(category === "food"){
            return <PiPizza/>;
        }
        else if(category === "travel"){
            return <PiCar/>;
        }
        else{
            return <GoGift/>;
        }
    }

    return(
        <div className={styles.transaction}>
            <div className={styles.transactionName}>
                <div className={styles.categoryIcon}>{handleImg()}</div>
                <div className={styles.transactionDetail}>
                    <p className={styles.title}>{data.title}</p>
                    <p className={styles.date}>{data.date}</p>
                </div>
            </div>
            
            <div className={styles.options}>
                <div>
                    <p className={styles.price}><MdCurrencyRupee/>{data.price}</p>
                </div>
                <div className={styles.deleteIcon} onClick={() => deleteExpense(data.id)} >
                <TiDeleteOutline />
                </div>
                <div className={styles.editIcon} onClick={() => editExpense(data)}>
                <CiEdit  />
                </div>
            </div>
        </div>
    )
}

export default Transactions;