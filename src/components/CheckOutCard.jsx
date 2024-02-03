import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRef } from "react";
import { setItemQty, deleteItemFromCart } from "../utilities/users-service";

export default function CheckOutCard({
  fruitName,
  fruitPrice,
  qty,
  handleQuantityUpdate,
  extPrice
}) {
  async function handleChange(e) {
    const newQty = e.target.value;

    try {
      await setItemQty(fruitName, newQty);
      handleQuantityUpdate();
    } catch (error) {
      console.error("Error changing fruit qty: ", error);
    }
  }

  return (
    <>
      <div className="card bg-slate-800 flex flex-row items-center border-2 border-white my-1">
        <div className="flex flex-row w-full justify-between">
          <div className="image-desc container flex flex-row">
            <div className="desc-container flex flex text-white mx-5 justify-center items-center">
              <p>{fruitName}</p>
              <p className="ml-8 mr-5 text-white">${fruitPrice.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex flex-row justify-end items-center">
            <select
              className="select outline outline-1 select-sm bg-white rounded-md my-2 mr-2 text-black"
              defaultValue={qty}
              onChange={handleChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <p className="ml-8 mr-5 text-white">Subtotal: ${extPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
