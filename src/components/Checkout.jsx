import Modal from "./UI/Modal";
import { useContext } from "react";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import { currencyFormatter } from "../util/Formatter";
import Input from "./UI/Input";
import Button from "./UI/Button";
import useHttp from "../hooks/useHTTP";
import Error from "./Error";

const requestConfig = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userCtx = useContext(UserProgressContext);

  const { data, isLoading, error, sendRequest, clearData } = useHttp(
    "http://localhost:3000/orders",
    requestConfig
  );

  const cartTotal = cartCtx.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function handleClose() {
    userCtx.hideCheckout();
  }

  function handleFinish() {
    userCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());
    console.log(customerData);
    console.log(cartCtx.items);

    sendRequest(
      JSON.stringify({
        order: { items: cartCtx.items, customer: customerData },
      })
    );
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isLoading) {
    actions = <span>Sending order data...</span>;
  }

  if (data && !error) {
    return (
      <Modal open={userCtx.progress === "checkout"} onClose={handleFinish}>
        <h2>Order Submitted</h2>
        <p>Your order has been submitted successfully!</p>
        <p>We will get back to you by email with your order details.</p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Close</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      className="checkout"
      open={userCtx.progress === "checkout"}
      onClose={userCtx.progress === "checkout" ? handleClose : null}
    >
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total amount: {currencyFormatter.format(cartTotal)}</p>
        <Input label="Full Name" id="name" type="text"></Input>
        <Input label="E-Mail Address" id="email" type="email"></Input>
        <Input label="Address" id="street" type="text"></Input>
        <div className="control-row">
          <Input label="Postal Code" id="postal-code" type="text"></Input>
          <Input label="City" id="city" type="text"></Input>
        </div>

        {error && <Error title="Failed to submit order" message={error} />}

        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
