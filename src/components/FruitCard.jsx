import { BsFillCartPlusFill } from "react-icons/bs";
import { addToCart } from "../utilities/users-service";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function FruitCard({
  fruitName,
  fruitImage,
  fruitPrice,
  availableStock,
  handleQuantityUpdate,
  cartData,
}) {
  const [qtyAdded, setQtyAdded] = useState(1);
  const MySwal = withReactContent(Swal);

  const handleDropdownChange = (e) => {
    setQtyAdded(e.target.value); // Convert the value to an integer
  };

  async function handleAddToCart() {
    try {
      await addToCart(fruitName, qtyAdded);
      // update the cart details with fruit and qty added
      handleQuantityUpdate();
      MySwal.fire({
        title: <p>Item added to cart!</p>,
        icon: "success",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      MySwal.fire({
        title: <p>Failed to add item to cart</p>,
        icon: "error",
      });
    }
  }

  const maxQuantity =
    availableStock -
    (cartData?.cartWithExtPrice?.find(
      (item) => item.fruit.fruitName === fruitName
    )?.qty || 0);

  return (
    <>
      <div className="w-96 bg-slate-800 flex flex-col items-start border-white border-2">
        <figure className="flex flex-row w-full ml-9 mt-3">
          <img
            src={fruitImage}
            alt={fruitName}
            style={{ width: "300px", height: "300px" }}
          />
        </figure>

        <hr className="w-full bg-black my-3" />

        <div className="flex flex-row justify-between items-center w-full mb-5 ">
          <div className="flex flex-col ml-5 items-center">
            <p className="text-slate-50">{fruitName}</p>
            <p className="text-slate-50">Qty left: {maxQuantity}</p>
          </div>
          <p className="text-emerald-500">
            ${parseFloat(fruitPrice).toFixed(2)}
          </p>
          <select
            className="select outline outline-2 outline-black select-xs bg-white rounded-md my-2 text-black"
            defaultValue="1"
            onChange={handleDropdownChange}
          >
            {Array.from({ length: maxQuantity }, (_, index) => index + 1).map(
              (option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              )
            )}
          </select>
          <button
            onClick={handleAddToCart}
            className="btn btn-sm bg-slate-400 mr-7 text-white"
            disabled={fruitPrice === "Out of Stock"}
          >
            <BsFillCartPlusFill />
          </button>
        </div>
      </div>
    </>
  );
}
