export const ResetPass = () => {


    return (
        <div>
            <h1>Confirmar token </h1>
            <p>Por favor, ingresa el token que te enviamos por correo electrónico para restablecer tu contraseña.</p>
            <form>
                <div className="mb-4">
                    <label htmlFor="token">Token</label>
                    <input
                        type="text" id="token" name="token" required
                    />
                </div>
                <button
                    type="submit"
                >
                    Confirmar Token
                </button>
            </form>
            <p>
                Si no recibiste el token, revisa tu bandeja de entrada o carpeta de spam.
            </p>
            <p>
                Si tienes problemas, <a href="/forgot-password" className="text-blue-600 hover:underline">intenta nuevamente</a>.
            </p>
        </div>
    );
};