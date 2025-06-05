import quizBossLogo from '../../assets/img/quizboss-logo.jpg';

export const HomePrivate = () => {
    return (


        <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100  text-white text-center">

            {/* Imagen superior */}
            <img
                src={quizBossLogo} // Asegúrate de que esta imagen esté en /public/imgs/
                alt="Banner partida"
                className="img-fluid mb-5"
                style={{ maxHeight: "350px", objectFit: "contain" }}
            />

            {/* Botón de Iniciar Partida */}
            <button
                className="btn btn-warning btn-lg shadow px-5 py-3"
                style={{ fontSize: "1.8rem", borderRadius: "12px" }}
                onClick={false}
            >
                🎮 Iniciar Partida
            </button>
        </div>

    );
};