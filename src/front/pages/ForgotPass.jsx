export const ForgotPass = () => {
    return (
        <div >
                <h1>Recuperar Contraseña</h1>
                <form>
                    <div>
                        <label htmlFor="email"> Correo Electrónico </label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <button type="submit"> Enviar Instrucciones </button>
                </form>
        </div>
    );
}