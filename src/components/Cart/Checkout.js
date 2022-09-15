import { useRef, useState } from "react";

import classes from "./Checkout.module.css";

const isEmpty = (value) => value.trim() === "";
const isNotFiveChars = (value) => value.length !== 5;

const Checkout = (props) => {
  const [formInputValid, setFromInputValid] = useState({
    name: true,
    street: true,
    city: true,
    postalCode: true,
  });

  //Refs
  const nameInputRef = useRef();
  const streetInputRef = useRef();
  const postalCodeInputRef = useRef();
  const cityInputRef = useRef();

  const confirmHandler = (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredStreet = streetInputRef.current.value;
    const enteredPostalCode = postalCodeInputRef.current.value;
    const cityName = cityInputRef.current.value;

    //Validate Input
    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredStreetIsValid = !isEmpty(enteredStreet);
    const enteredPostalCodeIsValid =
      !isEmpty(enteredPostalCode) && !isNotFiveChars(enteredPostalCode);
    const enteredCityIsValid = !isEmpty(cityName);

    //Set states to various validities
    setFromInputValid({
      name: enteredNameIsValid,
      street: enteredStreetIsValid,
      postalCode: enteredPostalCodeIsValid,
      city: enteredCityIsValid,
    });

    //Validate Form
    const formIsValid =
      enteredCityIsValid &&
      enteredNameIsValid &&
      enteredPostalCodeIsValid &&
      enteredStreetIsValid;

    //Submitting form
    if (!formIsValid) {
      return;
    }

    //Submit Card Data
    props.onSubmitOrder({
      enteredName,
      enteredStreet,
      cityName,
      enteredPostalCode,
    });
  };

  return (
    <form className={classes.form} onSubmit={confirmHandler}>
      <div
        className={`${classes.control} ${
          formInputValid.name ? "" : classes.invalid
        }`}
      >
        <label htmlFor="name">Your Name</label>
        <input type="text" id="name" ref={nameInputRef} />
        {!formInputValid.name && (
          <p className={classes["text-invalid"]}>Please entered a Valid Name</p>
        )}
      </div>
      <div
        className={`${classes.control} ${
          formInputValid.street ? "" : classes.invalid
        }`}
      >
        <label htmlFor="street">Street</label>
        <input type="text" id="street" ref={streetInputRef} />
        {!formInputValid.street && (
          <p className={classes["text-invalid"]}>
            Please entered a Valid Street
          </p>
        )}
      </div>
      <div
        className={`${classes.control} ${
          formInputValid.postalCode ? "" : classes.invalid
        }`}
      >
        <label htmlFor="postal">Postal Code</label>
        <input type="text" id="postal" ref={postalCodeInputRef} />
        {!formInputValid.postalCode && (
          <p className={classes["text-invalid"]}>
            Please entered Valid Postal ZIP (5 Characters Long)
          </p>
        )}
      </div>
      <div
        className={`${classes.control} ${
          formInputValid.city ? "" : classes.invalid
        }`}
      >
        <label htmlFor="city">City</label>
        <input type="text" id="city" ref={cityInputRef} />
        {!formInputValid.city && (
          <p className={classes["text-invalid"]}>Please entered a Valid City</p>
        )}
      </div>
      <div className={classes.actions}>
        <button type="button" onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;
