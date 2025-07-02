import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import ThemeToggle from "../components/ThemeToggle";

export const Layout = () => {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <ScrollToTop>
            <ThemeToggle />
            <main className="container-fluid px-0">
                <Outlet />
            </main>
        </ScrollToTop>
    );
};
