import "../App/App.css";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { getUser, getCart, checkout } from "../../utilities/users-service.mjs";
import fruitData from "../../../fruitData.json";
import FruitCard from "../../components/FruitCard";
import CheckOutCard from "../../components/CheckOutCard";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const fruits = fruitData;

export default function AppLanding() {
  const [user, setUser] = useState(getUser);
  const [cartData, setCartData] = useState(null);
  const MySwal = withReactContent(Swal);

  // run getCart to display current items in shoppingCart and update
  const fetchCart = async () => {
    try {
      const cart = await getCart();
      setCartData(cart);
    } catch (error) {
      console.error("Error fetching cart data: ", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // rerun getCart when qty is changed for any card item in cart
  const handleQuantityUpdate = async () => {
    await fetchCart();
  };

  const showModal = () => {
    const modal = document.getElementById("checkout-modal");
    modal.showModal();
  };

  const hideModal = () => {
    const modal = document.getElementById("checkout-modal");
    modal.close();
  };

  const handleCheckout = async () => {
    showModal();
  };

  const confirmCheckout = async () => {
    try {
      await checkout();
      await fetchCart();
      hideModal();
      MySwal.fire({
        title: <p>Order successfully checked out!</p>,
        icon: "success",
      });
    } catch (error) {
      console.error("Error occurred when trying to check out: ", error);
      MySwal.fire({
        title: <p>Failed to checkout order</p>,
        icon: "error",
      });
    }
  };

  return (
    <>
      <main className="App">
        <NavBar user={user} setUser={setUser} />
        <section className="min-h-screen flex m-4">
          <div className="left-half flex flex-col w-2/3">
            <p className="mx-3 mb-5 text-4xl font-bold text-slate-50 text-center">
              Fruits
            </p>
            <div className="grid grid-cols-2 gap-1">
              {fruits.data.map((fruit, index) => (
                <FruitCard
                  key={index}
                  fruitImage={fruit.fruit.image}
                  fruitName={fruit.fruit.name}
                  fruitPrice={fruit.fruit.price}
                  handleQuantityUpdate={handleQuantityUpdate}
                />
              ))}
            </div>
          </div>
          <div className="right-half flex flex-col w-1/3 items-center">
            <p className="mx-3 mb-5 text-4xl font-bold text-slate-50 text-center">
              Check Out
            </p>
            <div className="flex flex-col items-center">
              {cartData?.cartWithExtPrice?.length > 0 ? (
                cartData.cartWithExtPrice.map((fruit, index) => (
                  <CheckOutCard
                    key={index}
                    qty={fruit.qty}
                    extPrice={fruit.extPrice}
                    fruitImage={fruit.fruit.fruitImage}
                    fruitName={fruit.fruit.fruitName}
                    fruitPrice={fruit.fruit.fruitPrice}
                    handleQuantityUpdate={handleQuantityUpdate}
                  />
                ))
              ) : (
                // Cart is empty
                <div className="text-center mr-32">
                  <p>Your cart is empty 😔</p>
                </div>
              )}
              {/* Render the summary container only if the cart is not empty */}
              {cartData?.cartWithExtPrice?.length > 0 && (
                <div className="card mt-5 border-white border-2 w-80">
                  <div className="card bg-slate-800 flex flex-col items-center">
                    <p className="mx-10 mt-2 text-white text-3xl">
                      Total:{" "}
                      {typeof cartData?.orderTotal === "number"
                        ? `$${cartData.orderTotal.toFixed(2)}`
                        : ""}
                    </p>
                    <button
                      className="btn w-72 bg-indigo-700 text-white mt-5 mb-5 px-4"
                      onClick={handleCheckout}
                    >
                      CheckOut
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <dialog id="checkout-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Checkout</h3>
          <p className="py-4">Are you sure you want to checkout your cart?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn bg-indigo-700 " onClick={confirmCheckout}>
                Checkout
              </button>
              <button className="btn ml-5" onClick={hideModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
