import { useState } from "react";
import { EditarPerfilModal } from "../pages/home-private/modals/EditarPerfilModal";
import useGlobalReducer from "../hooks/useGlobalReducer";
//import { Navbar, Container, Nav, Button } from "react-bootstrap";

export const CustomNavbar = ({ playerName = "Jugador" }) => {

	const { store } = useGlobalReducer();

	const avatarUrl = store.avatar;
	const userName = "Nelcy";
	const userLevel = 5;

	const [showModal, setShowModal] = useState(false);

	const handleProfileClick = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	return (
		<>
			<nav className="navbar navbar-dark bg-dark fixed-top w-100 shadow">
				<div className="container-fluid d-flex justify-content-between align-items-center py-2 px-4">


					<div className="d-flex align-items-center gap-3" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
						<img
							src={avatarUrl}
							alt="Avatar"
							className="rounded-circle"
							width="40"
							height="40"
						/>
						<div className="text-white">
							<strong>{playerName}</strong>
							<div className="small">
								Nivel {userLevel} <i className="fas fa-brain text-warning ms-1"></i>
							</div>
						</div>
					</div>

					<button className="btn btn-outline-light btn-sm">
						<i className="fas fa-sign-out-alt me-1"></i> Salir
					</button>
				</div>
			</nav>
			<EditarPerfilModal show={showModal} onClose={handleCloseModal} />
		</>
	);
};
