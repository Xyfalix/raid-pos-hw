import "../App/App.css"
import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { getUser } from "../../utilities/users-service.mjs";
import fruitImageData from "../../../fruitImageData.json"
import FruitCard from "../../components/FruitCard";
import CheckOutCard from "../../components/CheckOutCard";

export default function AppLanding() {
  const [user, setUser] = useState(getUser);
  const [fruits, setFruits] = useState(fruitImageData);

  const navigate = useNavigate();

  return (
    <>
      <main className="App">
        <NavBar user={user} setUser={setUser} />
        <section className="min-h-screen flex m-4">
          <div className="left-half flex flex-col w-2/3">
            <p className="mx-3 mb-5 text-4xl font-bold text-slate-50 text-center">Fruits</p>
            <div className="grid grid-cols-2 gap-1">
              {fruits.data.map((fruit, index) => (
                <FruitCard
                    key={index}
                    fruitImage={fruit.fruit.image}
                    fruitName={fruit.fruit.name}
                    fruitPrice={fruit.fruit.price}
                />
              ))}
            </div>
          </div>
          <div className="right-half flex flex-col w-1/3">
            <p className="mx-3 mb-5 text-4xl font-bold text-slate-50 text-center">Check Out</p>
            <div className="flex flex-col">
              {fruits.data.map((fruit, index) => (
                <CheckOutCard
                    key={index}
                    fruitImage={fruit.fruit.image}
                    fruitName={fruit.fruit.name}
                    fruitPrice={fruit.fruit.price}
                />
              ))}
            </div>

          </div>
        </section>
        
      </main>
    </>
  );
}