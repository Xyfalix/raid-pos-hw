import "../App/App.css"
import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { getUser } from "../../utilities/users-service.mjs";
import fruitImageData from "../../../fruitImageData.json"

export default function AppLanding() {
  const [user, setUser] = useState(getUser);
  const [fruitImages, setFruitImages] = useState(fruitImageData)

  const navigate = useNavigate();

  return (
    <>
      <main className="App">
        <NavBar user={user} setUser={setUser} />
        <div className="min-h-screen flex m-4">
          <div className="flex flex-col pb-96">
            <p className="mx-3 text-4xl font-bold text-center">Fruits</p>
          </div>
          <div className="w-screen m-4">
            <div className="grid grid-cols-2 gap-4">
              {fruitImages.data.map((fruitImage, index) => (
                <div key={index} className="relative aspect-w-16 aspect-h-9">
                  <img
                    src={fruitImage.fruit.image}
                    alt={`Landing Card Image ${index}`}
                    style={{ width: '300px', height: '300px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}