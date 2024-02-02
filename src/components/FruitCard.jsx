import { BsFillCartPlusFill } from "react-icons/bs";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function FruitCard({ fruitName, fruitImage, fruitPrice }) {
  const [qtyAdded, setQtyAdded] = useState(1);
  const MySwal = withReactContent(Swal);

  const handleDropdownChange = (e) => {
    setQtyAdded(e.target.value); // Convert the value to an integer
  };

  async function handleAddToCart() {
    const cardDetails = {
      itemName: fruitName,
      itemPrice: fruitPrice,
      itemImage: fruitImage,
      //   setTotal: parseInt(setTotal),
    };

    try {
      console.log(cardDetails);
      //   await addToCart(cardId, qtyAdded, cardDetails);
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

  return (
    <>
      <div className="w-96 bg-slate-800 flex flex-col items-start border-white border-2">
        <figure className="flex flex-row w-full mx-4 my-3">
          <img src={fruitImage} alt={fruitName} style={{ width: '300px', height: '300px' }} />
        </figure>

        <hr className="w-full bg-black my-3" />
        <div className="flex flex-col pl-7 items-start w-full">
          <div className="flex flex-row justify-between items-center w-full mb-5 ">
            <p className="text-slate-50">{fruitName}</p>
            <p className="text-emerald-500">${parseFloat(fruitPrice).toFixed(2)}</p>
            <select
              className="select outline outline-2 outline-black select-xs bg-white rounded-md my-2 text-black"
              defaultValue="1"
              onChange={handleDropdownChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
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
      </div>
    </>
  );
}
