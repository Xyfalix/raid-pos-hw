import { logout } from "../utilities/users-service.mjs";
import { useNavigate, Link} from "react-router-dom";

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = (event) => {
    event.preventDefault();
    logout();
    setUser(null);
  };

  const isAdmin = user && user.role === "admin";

  return (
    <nav className="bg-indigo-700 text-primary-content py-2">
      {user ? ( // user is signed in
        <div className="flex justify-between">
          <div className="flex flex-row items-center">
            <p className="text-lg mx-4">NUTC FarPrice</p>
          </div>
          <div className="flex flex-row items-center">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost rounded-btn">
                Hi, {user.name}
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-[1] p-2 shadow bg-indigo-700 rounded-box w-32 mt-2 items-start"
              >
                {isAdmin && ( // Render viewItems link if user is an admin
                  <li>
                    <Link to="/viewItems">View Transactions</Link>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // user === null
        <div className="flex justify-between">
          <div className="flex flex-row items-center">
            <a className="btn btn-ghost normal-case text-2xl">NUTC FarPrice</a>
          </div>
          <div className="flex flex-row items-center">
            <a
              className="btn btn-ghost normal-case text-lg"
              onClick={handleLogin}
            >
              👤 Log In
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
