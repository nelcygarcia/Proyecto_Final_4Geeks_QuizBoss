import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { CustomNavbar } from "../components/CustomNavbar";
import { Footer } from "../components/Footer";

export const Layout = () => {
    return (
        <ScrollToTop>
            <CustomNavbar playerName="Rigo" />
            <Outlet />
            <Footer />
        </ScrollToTop>
    );
};

