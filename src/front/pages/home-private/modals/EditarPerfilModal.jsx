import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

export const EditarPerfilModal = ({ show, onClose }) => {
    const { store, dispatch } = useGlobalReducer();
    const user = store.userData;
    const navigate = useNavigate();

    const [avatarUrl, setAvatarUrl] = useState(store.avatar);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedUserName, setEditedUserName] = useState(user?.user_name || "");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const avatarImages = Array.from({ length: 6 }, (_, i) => `/avatars/${i + 1}.PNG`);

    useEffect(() => {
        if (store.avatar) setAvatarUrl(store.avatar);
    }, [store.avatar]);

    useEffect(() => {
        if (!show) {
            setIsChangingPassword(false);
            setNewPassword("");
            setIsEditingName(false);
            setEditedUserName(user?.user_name || "");
            setShowDeleteConfirm(false);
        }
    }, [show, user?.user_name]);

    const handleGuardar = async () => {
        const payload = {
            avatar: avatarUrl,
        };

        if (isEditingName && editedUserName.trim() && editedUserName !== user.user_name) {
            payload.user_name = editedUserName.trim();
        }

        const asciiRegex = /^[\x20-\x7E]*$/;


        if (isChangingPassword) {
            if (newPassword.length < 6 || !asciiRegex.test(newPassword)) {
                const toastElement = document.getElementById("passwordToast");
                const toastBody = toastElement.querySelector(".toast-body");

                if (newPassword.length < 6) {
                    toastBody.textContent = "La contraseña debe tener al menos 6 caracteres.";
                } else {
                    toastBody.textContent = "La contraseña contiene caracteres no válidos.";
                }

                const toast = new bootstrap.Toast(toastElement);
                toast.show();
                return;
            } else {
                payload.password = newPassword;
            }
        }

        const user_id = store.auth.user_id || localStorage.getItem("user_id");

        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${user_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${store.auth.token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!resp.ok) throw new Error("Error al guardar los cambios");

            const data = await resp.json();

            dispatch({ type: "set_avatar", payload: data.avatar });
            dispatch({ type: "set_user_data", payload: data });

            let message = "Cambios guardados correctamente.";
            if (payload.user_name && payload.user_name !== user.user_name) {
                message = `¡Nombre de usuario actualizado a "${payload.user_name}"!`;
            }


            setIsChangingPassword(false);
            setNewPassword("");
            setIsEditingName(false);
            setEditedUserName(data.user_name);
            onClose();
        } catch (err) {
            console.log(err);
        }
    };

    const handleEliminarCuenta = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDeleteAccount = async () => {
        const user_id = store.auth.user_id || localStorage.getItem("user_id");

        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${user_id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${store.auth.token}`,
                },
            });

            if (!resp.ok) throw new Error("No se pudo eliminar la cuenta");

            dispatch({ type: "logout" });


            navigate("/");
        } catch (err) {
            console.error("Error eliminando cuenta:", err);
            alert("Hubo un problema al eliminar la cuenta.");
        }
    };

    if (!user) return null;

    return (
        <>
            <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow">
                        <div className="modal-header bg-dark text-white">
                            <h5 className="modal-title">Perfil del Jugador</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>

                        <div className="modal-body text-center">
                            <div className="mb-3">
                                <img
                                    src={avatarUrl}
                                    alt="avatar"
                                    className="rounded-circle border border-3 border-warning"
                                    width="120"
                                    height="120"
                                />
                                <p className="mt-2 text-muted">Haz clic en un avatar para cambiarlo</p>
                            </div>

                            <div className="mb-4 d-flex flex-wrap justify-content-center gap-2">
                                {avatarImages.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Avatar ${index + 1}`}
                                        className="rounded-circle"
                                        width="60"
                                        height="60"
                                        style={{
                                            cursor: "pointer",
                                            border: url === avatarUrl ? "3px solid #ffc107" : "1px solid #ccc",
                                            padding: "2px"
                                        }}
                                        onClick={() => setAvatarUrl(url)}
                                    />
                                ))}
                            </div>

                            <hr />

                            <div className="text-start px-3 text-black">
                                <div className="mb-2">
                                    <label className="form-label"><strong>👤 Usuario:</strong></label>
                                    {isEditingName ? (
                                        <div className="d-flex">
                                            <input
                                                type="text"
                                                className="form-control me-2"
                                                value={editedUserName}
                                                onChange={(e) => setEditedUserName(e.target.value)}
                                                placeholder="Nuevo nombre de usuario"
                                            />
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => {
                                                    setIsEditingName(false);
                                                    setEditedUserName(user.user_name);
                                                }}
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span>{user.user_name}</span>
                                            <button
                                                className="btn btn-sm btn-outline-secondary ms-3"
                                                onClick={() => setIsEditingName(true)}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <p><strong>⭐ Experiencia:</strong> {user.experiencia} XP</p>
                                <p><strong>🏆 Ranking:</strong> {user.ranking_user}</p>
                                <p><strong>📧 Email:</strong> {user.email}</p>

                                <div className="mb-2">
                                    <label className="form-label"><strong>🔒 Contraseña:</strong></label>
                                    {isChangingPassword ? (
                                        <div className="d-flex flex-column">
                                            <div className="d-flex">
                                                <input
                                                    type="password"
                                                    className="form-control me-2"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Nueva contraseña"
                                                />
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() => {
                                                        setIsChangingPassword(false);
                                                        setNewPassword("");
                                                    }}
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span>********</span>
                                            <button
                                                className="btn btn-sm btn-outline-secondary ms-3"
                                                onClick={() => setIsChangingPassword(true)}
                                            >
                                                Cambiar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer d-flex justify-content-between">
                            <button type="button" className="btn btn-danger" onClick={handleEliminarCuenta}>
                                Eliminar cuenta
                            </button>
                            <div>
                                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                                    Cerrar
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleGuardar}>
                                    Guardar cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast de error de contraseña */}
            <div
                className="toast align-items-center text-white bg-danger border-0 position-fixed bottom-0 end-0 m-3"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                id="passwordToast"
            >
                <div className="d-flex">
                    <div className="toast-body">
                        La contraseña contiene caracteres no válidos.
                    </div>
                    <button
                        type="button"
                        className="btn-close btn-close-white me-2 m-auto"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                    ></button>
                </div>
            </div>

            {/* Modal de confirmación para eliminar cuenta */}
            <div className={`modal fade ${showDeleteConfirm ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
                <div
                    className="modal-dialog modal-dialog-centered"
                    style={{ maxWidth: "350px", margin: "auto" }}
                >
                    <div className="modal-content shadow border border-danger">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title">Confirmar eliminación</h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={() => setShowDeleteConfirm(false)}
                            ></button>
                        </div>
                        <div className="modal-body" style={{ color: "black" }}>
                            <p>
                                ¿Estás seguro de que deseas eliminar la cuenta de <strong>{user.user_name}</strong>?
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-danger" onClick={confirmDeleteAccount}>Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
