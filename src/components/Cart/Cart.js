import { useContext, useState, Fragment } from "react";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

const Cart = (props) => {
  const [isCheckOut, setIsCheckOut] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const orderHandler = () => {
    setIsCheckOut(true);
  };

  const removeOrderHandler = () => {
    setIsCheckOut(false);
  };

  const submitOrderHandler = async (userInfo) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://react-shopping-app-9b16c-default-rtdb.firebaseio.com/ORDERS.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({ user: userInfo, orderedItems: cartCtx.items }),
        }
      );
      setIsSubmitting(false);
      if (!response.ok) {
        throw new Error("Request Failed");
      }

      cartCtx.emptyItems();

      setIsOrdered(true);
    } catch (error) {
      console.log(error);
    }
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const modalAction = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckOut && (
        <Checkout
          onCancel={removeOrderHandler}
          onSubmitOrder={submitOrderHandler}
        />
      )}
      {isCheckOut || modalAction}
    </Fragment>
  );

  const isSubmittingModalContent = <p>Content is Submitting</p>;

  const orderedItems = (
    <Fragment className={classes.actions}>
      <p>Order Completed: you would be contacted soon...</p>
      {modalAction}
    </Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !isOrdered && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {isOrdered && !isSubmitting && orderedItems}
    </Modal>
  );
};

export default Cart;
