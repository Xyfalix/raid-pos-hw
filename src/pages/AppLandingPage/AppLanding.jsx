import "../App/App.css"
import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { getUser } from "../../utilities/users-service.mjs";

export default function AppLanding() {
    const [user, setUser] = useState(getUser);
  
    const navigate = useNavigate();
  
    return (
      <main className="App">
        <NavBar user={user} setUser={setUser} />
      </main>
    );
}