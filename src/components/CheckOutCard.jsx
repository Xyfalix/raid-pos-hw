import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRef } from "react";
import { setItemQty, deleteItemFromCart } from "../utilities/users-service";
import { RxCrossCircled } from "react-icons/rx";

export default function CheckOutCard({
  fruitName,
  fruitPrice,
  qty,
  handleQuantityUpdate,
  extPrice,
}) {
  const MySwal = withReactContent(Swal);
  const deleteModalRef = useRef(null);

  const showModal = () => {
    deleteModalRef.current.showModal();
  };

  const hideModal = () => {
    deleteModalRef.current.close();
  };

  async function handleChange(e) {
    const newQty = e.target.value;

    try {
      await setItemQty(fruitName, newQty);
      handleQuantityUpdate();
    } catch (error) {
      console.error("Error changing fruit qty: ", error);
    }
  }

  async function handleDelete() {
    // Show the modal with "delete" and "cancel" buttons
    showModal();
  }

  async function confirmDelete() {
    try {
      await deleteItemFromCart(fruitName);
      handleQuantityUpdate();
      hideModal();
      MySwal.fire({
        title: <p>Item successfully deleted from cart!</p>,
        icon: "success",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      MySwal.fire({
        title: <p>Failed to delete item from cart</p>,
        icon: "error",
      });
    }
  }

  return (
    <>
      <div className="card bg-slate-800 flex flex-row items-center my-1">
        <p className="text-white w-20 text-center">{fruitName}</p>
        <p className="mx-2 text-white w-20 text-center">
          ${fruitPrice.toFixed(2)}
        </p>
        <select
          className="select outline outline-1 select-sm bg-white rounded-md my-2 text-black "
          defaultValue={qty}
          onChange={handleChange}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <p className="mx-2 text-white w-40 text-center">
          Subtotal: ${extPrice.toFixed(2)}
        </p>
        <button
          className="btn card btn-sm bg-slate-800 text-red-500 text-2xl border-none"
          onClick={handleDelete}
        >
          <RxCrossCircled />
        </button>
      </div>
      <dialog id="delete-modal" className="modal" ref={deleteModalRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Item</h3>
          <p className="py-4">Are you sure you want to delete this item?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={confirmDelete}>
                Delete
              </button>
              <button className="btn bg-red-500 ml-5" onClick={hideModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
