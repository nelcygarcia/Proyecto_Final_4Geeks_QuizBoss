import React from "react";
import { Button } from "react-bootstrap";
import avatar from "../assets/img/rigo-baby.jpg";
import fondoLogo from "../assets/img/fondodefinitvo.png";
import { CustomNavbar } from "../components/CustomNavbar";
import "./HomePrivate.css";

export const HomePrivate = () => {
    return (
        <>
            {/*<CustomNavbar playerName="Rigo" />*/}
            <div
                className="home-private-container text-light"
                style={{ backgroundImage: `url(${fondoLogo})` }}
            >
                <div className="profile-header d-flex align-items-center gap-3 mb-4">
                    <img src={avatar} alt="avatar" className="avatar" />
                    <h4 className="player-name">Nombre del jugador</h4>
                </div>

                <div className="badges d-flex gap-3 mb-4">
                    <span className="badge badge-custom brain">🧠</span>
                    <span className="badge badge-custom diamond">💠</span>
                    <span className="badge badge-custom puzzle">🧩</span>
                </div>

                <div className="text-center mb-5">
                    <Button className="play-button" size="lg">
                        🎮 ¡JUGAR TRIVIA!
                    </Button>
                </div>

                <div className="actions d-flex justify-content-center gap-3 flex-wrap">
                    <Button variant="info">Editar Perfil</Button>
                    <Button variant="secondary">Cambiar Avatar</Button>
                    <Button variant="danger">Cerrar sesión</Button>
                </div>
            </div>
        </>
    );
};
