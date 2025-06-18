import { useState, useEffect } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

export const EditarPerfilModal = ({ show, onClose }) => {
    const { store, dispatch } = useGlobalReducer();
    const user = store.userData;

    const [avatarUrl, setAvatarUrl] = useState(store.avatar);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    const avatarImages = Array.from({ length: 6 }, (_, i) => `/avatars/${i + 1}.PNG`);

    useEffect(() => {
        if (store.avatar) setAvatarUrl(store.avatar);
    }, [store.avatar]);

    // Reset al cerrar el modal
    useEffect(() => {
        if (!show) {
            setIsChangingPassword(false);
            setNewPassword("");
        }
    }, [show]);

    const handleGuardar = async () => {
        const payload = {
            avatar: avatarUrl,
        };

        if (isChangingPassword && newPassword.trim()) {
            payload.password = newPassword;
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

            console.log("resp", resp)

            if (!resp.ok) throw new Error("Error al guardar los cambios");

            const data = await resp.json();

            dispatch({ type: "set_avatar", payload: data.avatar });
            dispatch({ type: "set_user_data", payload: data });

            setIsChangingPassword(false);
            setNewPassword("");
            onClose();
        } catch (err) {
            console.log(err);
        }
    };

    if (!user) return null;

    return (
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
                            <p><strong>👤 Usuario:</strong> {user.user_name}</p>
                            <p><strong>⭐ Experiencia:</strong> {user.experiencia} XP</p>
                            <p><strong>🏆 Ranking:</strong> {user.ranking_user}</p>
                            <p><strong>📧 Email:</strong> {user.email}</p>

                            <div className="mb-2">
                                <label className="form-label"><strong>🔒 Contraseña:</strong></label>
                                {isChangingPassword ? (
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
                                ) : (
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>********</span>
                                        <button
                                            className="btn btn-sm btn-outline-secondary ms-3"
                                            onClick={() => setIsChangingPassword(true)}
                                        >
                                            Cambiar contraseña
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                        <button type="button" className="btn btn-primary" onClick={handleGuardar}>
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
