import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import SalaDeJuego from "./pages/davidPages/SalaDeJuego";
import { HomePrivate } from "./pages/home-private/HomePrivate";
import { Registro } from "./pages/Registro";
import { Login } from "./pages/Login";
import ForgotPass from "./pages/ForgotPass";
import ResetPass from "./pages/ResetPass";
import { ProtectedRoute } from "../utils/ProtectedRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      <Route
        path="/homeprivate"
        element={
          <ProtectedRoute>
            <HomePrivate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sala"
        element={
          <ProtectedRoute>
            <SalaDeJuego />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registro />} />
      <Route path="/recover" element={<ForgotPass />} />
      <Route path="/reset" element={<ResetPass />} />
    </Route>
  )
);