import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import SalaDeJuego from "./pages/davidPages/SalaDeJuego";
import { HomePrivate } from "./pages/home-private/HomePrivate";
import {Registro } from "./pages/Registro";

export const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      <Route path="/" element={<Home />} />
      <Route path="/sala" element={<SalaDeJuego />} />
      <Route path="/homeprivate" element={<HomePrivate />} />
      <Route path="/login" element={<h1>Login Page</h1>} />
      <Route path="/register" element={<Registro />} />
      <Route path="/recover-password" element={<h1>Recover Password Page</h1>} />
      
    </Route>
  )
);