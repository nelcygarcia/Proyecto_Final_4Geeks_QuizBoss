import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { CustomNavbar } from "../components/CustomNavbar";
import { Footer } from "../components/Footer";

export const Layout = () => {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <ScrollToTop>
            {!isHome && <CustomNavbar playerName="Rigo" />}
            <main className="container-fluid px-0">
                <Outlet />
            </main>
            <Footer />
        </ScrollToTop>
    );
};
