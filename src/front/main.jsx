import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreProvider } from './hooks/useGlobalReducer';
import { BackendURL } from './components/BackendURL';
import { AuthProvider } from '../providers/AuthProvider';
import { ThemeProvider } from './hooks/ThemeContext';
import  MusicPlayer  from './components/MusicPlayer';


const Main = () => {
    if (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL === "") {
        return (
            <React.StrictMode>
                <BackendURL />
            </React.StrictMode>
        );
    }

    return (
        <React.StrictMode>
            <ThemeProvider>
                <MusicPlayer src="/avatars/Sonidos/Tomorrow'sLight.mp3" />
                <StoreProvider>
                    <AuthProvider>
                        <RouterProvider router={router} />
                    </AuthProvider>
                </StoreProvider>
            </ThemeProvider>
        </React.StrictMode>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);