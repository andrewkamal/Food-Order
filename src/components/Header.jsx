import { useContext } from "react";
import Logo from "../assets/logo.jpg";
import Button from "./UI/Button";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";

export default function Header() {
  const cartCtx = useContext(CartContext);
  const userCtx = useContext(UserProgressContext);
  const cartItems = cartCtx.items.reduce(
    (totalNumberOfItems, item) => totalNumberOfItems + item.quantity,
    0
  );

  function handleShowCart() {
    userCtx.showCart();
  }

  return (
    <header id="main-header">
      <div id="title">
        <img src={Logo}></img>
        <h1>Food Order</h1>
      </div>
      <nav>
        <Button textOnly onClick={handleShowCart}>
          Cart ({cartItems})
        </Button>
      </nav>
    </header>
  );
}
