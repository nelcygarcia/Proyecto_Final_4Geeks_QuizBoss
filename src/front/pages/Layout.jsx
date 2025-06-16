import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { CustomNavbar } from "../components/CustomNavbar";

export const Layout = () => {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <ScrollToTop>

            <main className="container-fluid px-0">
                <Outlet />
            </main>
        </ScrollToTop>
    );
};
