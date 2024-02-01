import { useState } from "react";
import LoginForm from "../../components/LoginForm"
import SignUpForm from "../../components/SignUpForm";

export default function AuthPage({ setUser }) {
  const [activeForm, setActiveForm] = useState("login");

  const handleSwitchForm = () => {
    setActiveForm(activeForm === "login" ? "signup" : "login");
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {activeForm === "login" ? (
          <>
            <LoginForm setUser={setUser} />
            <p className="mt-2">
              Don&apos;t have an account?{" "}
              <span
                onClick={handleSwitchForm}
                className="text-blue-500 cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </>
        ) : (
          <>
            <SignUpForm setUser={setUser} />
            <p className="mt-2">
              Already have an account?{" "}
              <span
                onClick={handleSwitchForm}
                className="text-blue-500 cursor-pointer"
              >
                Log In
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}