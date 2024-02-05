import { Route, Routes } from "react-router-dom"
import './App.css';
import AppLanding from "..//AppLandingPage/AppLanding";
import AccessDenied from '../AccessDeniedPage/AccessDenied';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { getUser } from '../../utilities/users-service.mjs';
import AuthPage from "../AuthPage/AuthPage";
import { useState } from 'react';


export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <>
      <Routes>
        <Route path="/login" element={<AuthPage setUser={setUser} />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <AppLanding />
              </ProtectedRoute>
            }
          />
      </Routes>
    </>
  );
}
