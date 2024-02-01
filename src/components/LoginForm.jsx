import { getUser, login } from "../utilities/users-service.mjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ setUser }) {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    error: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value, error: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, password } = formData;

    try {
      const token = await login(name, password);
      localStorage.setItem("token", token);
      setUser(getUser());
      navigate("/")
    } catch (error) {
      setFormData({ ...formData, error: error.message });
    }
  };

  return (
    <div>
      <div className="form-container bg-slate-700 mx-auto max-w-md p-5 rounded border">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="text-m my-2 text-info font-serif">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input rounded border focus:outline-none focus:ring focus:border-blue-200"
              required
            />
          </div>
          <div className="form-control">
            <label className="text-m my-2 text-info font-serif">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input rounded border focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-end"> 
            <button type="submit" className="btn bg-indigo-700 mt-3">
              Login
            </button>
          </div>
        </form>
      </div>
      <p className="error-message">&nbsp;{formData.error}</p>
    </div>
  );
}