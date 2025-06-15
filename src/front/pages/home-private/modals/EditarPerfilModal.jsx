import { useState, useEffect } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

export const EditarPerfilModal = ({ show, onClose }) => {
    const { store, dispatch } = useGlobalReducer();
    const user = store.userData;

    const [avatarUrl, setAvatarUrl] = useState(store.avatar);

    const avatarImages = Array.from({ length: 6 }, (_, i) => `/avatars/${i + 1}.PNG`);

    // Actualiza el avatar seleccionado al abrir el modal
    useEffect(() => {
        if (store.avatar) {
            setAvatarUrl(store.avatar);
        }
    }, [store.avatar, show]);

    const handleGuardar = () => {
        dispatch({ type: "set_avatar", payload: avatarUrl });
        onClose();
        // (Opcional) Aquí podrías hacer un PATCH al backend para actualizarlo
    };

    if (!user) return null; // evita error si aún no se ha cargado userData

    return (
        <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title">Perfil del Jugador</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <div className="modal-body text-center">
                        {/* Avatar grande seleccionado */}
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

                        {/* Avatares disponibles */}
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

                        {/* Datos del usuario */}
                        <div className="text-start px-3 text-black">
                            <p><strong>👤 Usuario:</strong> {user.user_name}</p>
                            <p><strong>⭐ Experiencia:</strong> {user.experiencia} XP</p>
                            <p><strong>🏆 Ranking:</strong> {user.ranking_user}</p>
                            <p><strong>📧 Email:</strong> {user.email}</p>
                            <div className="d-flex align-items-center justify-content-between">
                                <p className="mb-0"><strong>🔒 Contraseña:</strong> ********</p>
                                <button className="btn btn-sm btn-outline-secondary ms-3">
                                    Cambiar contraseña
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
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
