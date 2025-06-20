import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { EditarPerfilModal } from "../pages/home-private/modals/EditarPerfilModal";

export const CustomNavbar = () => {
	const { store } = useGlobalReducer();
	const { logout } = useAuth();
	const navigate = useNavigate();

	const avatarUrl = store.avatar;
	const user = store.userData;
	const [showModal, setShowModal] = useState(false);

	if (!user) return null;

	const handleProfileClick = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleLogout = () => {
		logout();
		navigate("/login");  // O "/" dependiendo de a dónde quieras mandar al logout
	};

	return (
		<>
			<nav className="navbar navbar-dark bg-dark fixed-top w-100 shadow">
				<div className="container-fluid d-flex justify-content-between align-items-center py-2 px-4">
					<div className="d-flex align-items-center gap-3" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
						<img src={avatarUrl} alt="Avatar" className="rounded-circle" width="40" height="40" />
						<div className="text-white">
							<strong>{user.user_name}</strong>
							<div className="small">
								Ranking {user.ranking_user} <i className="fas fa-brain text-warning ms-1"></i>
							</div>
						</div>
					</div>
					<button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
						<i className="fas fa-sign-out-alt me-1"></i> Salir
					</button>
				</div>
			</nav>

			<EditarPerfilModal show={showModal} onClose={handleCloseModal} />
		</>
	);
};
