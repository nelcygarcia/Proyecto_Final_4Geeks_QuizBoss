import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import SalaDeJuego from "./pages/SalaDeJuego";
import { Registro } from "./pages/Registro";

export const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
        <Route path= "/" element={<Home />} />
        <Route path="/single/:theId" element={ <Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />

        {/* NUEVA RUTA: Sala de Juego */}
        <Route path="/sala" element={<SalaDeJuego />} />

         {/* NUEVA RUTA: Registro */}
        <Route path="/registro" element={<Registro />} />
      </Route>
    )
);