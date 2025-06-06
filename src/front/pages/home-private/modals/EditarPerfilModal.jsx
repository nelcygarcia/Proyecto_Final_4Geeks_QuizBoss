import { useState } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

export const EditarPerfilModal = ({ show, onClose }) => {
    const dummyData = {
        nombre: "Nelcy",
        experiencia: 2400,
        ranking_user: "Oro III",
        email: "nelcy@email.com"
    };

    const { dispatch } = useGlobalReducer(); // ← Aquí obtienes el dispatch global
    const [avatarUrl, setAvatarUrl] = useState("/avatars/1.PNG");

    const avatarImages = Array.from({ length: 6 }, (_, i) =>
        `/avatars/${i + 1}.PNG`
    );

    const handleGuardar = () => {
        dispatch({ type: "set_avatar", payload: avatarUrl });
        onClose();
    };

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

                        <div className="mb-4">
                            <div className="d-flex flex-wrap justify-content-center gap-2">
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
                        </div>

                        <hr />

                        <div className="text-start px-3 text-black">
                            <p><strong>👤 Nombre de usuario:</strong> {dummyData.nombre}</p>
                            <p><strong>⭐ Experiencia:</strong> {dummyData.experiencia} XP</p>
                            <p><strong>🏆 Ranking:</strong> {dummyData.ranking_user}</p>
                            <p><strong>📧 Email:</strong> {dummyData.email}</p>
                            <div className="d-flex align-items-center justify-content-between">
                                <p className="mb-0">
                                    <strong>🔒 Contraseña:</strong> ********
                                </p>
                                <button className="btn btn-sm btn-outline-secondary ms-3">
                                    Cambiar contraseña
                                </button>
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
