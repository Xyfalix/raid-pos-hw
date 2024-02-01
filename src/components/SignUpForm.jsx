import { useState} from "react";
import { signUp } from "../utilities/users-service";
import { useNavigate } from "react-router-dom";

export default function SignUpForm({ setUser }) {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirm: '',
    error: ''
  });

  const navigate = useNavigate();

  const handleChange = (evt) => {
    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value,
      error: ''
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const token = await signUp(formData);
      console.log(`token is ${token}`);
      localStorage.setItem('token', token);
      setUser({ name: formData.name, email: formData.email });
      navigate("/")
    } catch (error) {
      setFormData({
        ...formData,
        error: error.message
      });
    }
  };

  const disable = formData.password !== formData.confirm;

  return (
    <div>
      <div className="form-container bg-slate-700 mx-auto max-w-md p-5 rounded border">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="text-m my-2 text-info font-serif">Name</label>
            <input
              className="input rounded border focus:outline-none focus:ring focus:border-blue-500"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="text-m my-2 text-info font-serif">Password</label>
            <input
              className="input rounded border focus:outline-none focus:ring focus:border-blue-500"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="text-m my-2 text-info font-serif">Confirm</label>
            <input
              className="input rounded border focus:outline-none focus:ring focus:border-blue-500"
              type="password"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn bg-indigo-700 mt-3"
              disabled={disable}
            >
              SIGN UP
            </button>
          </div>
        </form>
      </div>
      <p className="error-message">&nbsp;{formData.error}</p>
    </div>
  );
}