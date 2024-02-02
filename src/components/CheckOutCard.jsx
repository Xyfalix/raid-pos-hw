import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRef } from "react";

export default function CheckOutCard({fruitName, fruitPrice}) {

  return (
    <>
      <div className="card card-side bg-slate-800 shadow-xl flex flex-row justify-between items-center min-w-max max-w-lg border-2 border-white mx-2 my-1">
        <div className="flex flex-row w-full justify-between">
          <div className="image-desc container flex flex-row">
            <div className="desc-container flex flex-col text-white mx-5 justify-center">
              <p>fruit name here</p>
            </div>
          </div>
            <div className="flex flex-row justify-end items-center">
              <select
                className="select outline outline-1 select-sm bg-white rounded-md mb-2 mr-2 text-black"
                defaultValue={1}
                // onChange={handleChange}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <p className="ml-8 mr-5 text-white">cumulative price here</p>
            </div>
          </div>
        </div>
    </>
  );
}
