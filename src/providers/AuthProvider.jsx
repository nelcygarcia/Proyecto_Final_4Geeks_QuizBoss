import React, { createContext, useContext, useState, useEffect } from "react";
import useGlobalReducer from "../front/hooks/useGlobalReducer";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { store, dispatch } = useGlobalReducer();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    useEffect(() => {

        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("user_id");
        setIsAuthenticated(!!token && !!user_id);
    }, []);

    useEffect(() => {
        //Aca tuve un problema deberia usarse el provider que proporciona react BrowserRouter pero no se si es por la version no funciona
        //por lo tanto uso  window.location que es nativo de JS pero se debe controlar más ya que tarda mas en detectar la url y por eso setInterval
        //es lo que uso 
        let lastPath = window.location.pathname;
        let isFirstLoad = true;

        const checkPathChange = () => {
            const currentPath = window.location.pathname;

            if (currentPath !== lastPath) {
                lastPath = currentPath;

                if (currentPath === "/login") {
                    if (!isFirstLoad) {
                        if (localStorage.getItem("token")) {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user_id");
                            dispatch({ type: "logout" });
                            setIsAuthenticated(false);
                            console.log("Sesión limpiada porque entraste a /login");
                        }
                    }
                } else {
                    const token = localStorage.getItem("token");
                    const user_id = localStorage.getItem("user_id");
                    const loggedIn = !!token && !!user_id;
                    setIsAuthenticated(loggedIn);
                }
            }

            if (isFirstLoad) isFirstLoad = false;
        };

        // Ejecutar chequeo cada 100ms para detectar cambios rápidos
        const intervalId = setInterval(checkPathChange, 100);

        // Ejecutar una vez al montar para validar estado actual
        checkPathChange();

        return () => clearInterval(intervalId);
    }, [dispatch]);


    const login = (token, user_id) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", user_id);
        dispatch({ type: "SET_AUTH", payload: { token, user_id } });
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        dispatch({ type: "logout" });
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);