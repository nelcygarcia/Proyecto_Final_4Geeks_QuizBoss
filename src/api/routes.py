from datetime import timedelta
import os
from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, decode_token, jwt_required
from flask_mail import Message
from sqlalchemy import select
from api.models import db, User
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from api.extensions import mail


api = Blueprint('api', __name__)

CORS(api)


@api.route('/signup', methods=['POST'])
def create_usuario():
    data = request.get_json()
    required_fields = ["email", "user_name", "password",
                       "ranking_user", "avatar", "experiencia"]

    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    nuevo_usuario = User(
        email=data["email"],
        user_name=data["user_name"],
        ranking_user=0,
        password=generate_password_hash(data["password"]),
        # Predefinir una o obligar al usuario a seleccionar una ?
        avatar=data["avatar"],
        experiencia=0
    )
    db.session.add(nuevo_usuario)
    db.session.commit()
    return jsonify(nuevo_usuario.serialize()), 201


@api.route('/usuarios', methods=['GET'])
def get_usuarios():
    usuarios = User.query.all()

    if not usuarios:
        return jsonify({"msg": "No hay usuarios registrados"}), 404

    return jsonify([user.serialize() for user in usuarios]), 200


@api.route('/token', methods=['POST'])
def login_user():
    body = request.get_json(silent=True)

    if body is None:
        return {"message": "Debes enviarme el body"}, 400

    if 'user_name' not in body or 'password' not in body:
        return {"message": "Datos incompletos"}, 404

    user = db.session.execute(select(User).where(
        User.user_name == body['user_name'])).scalar_one_or_none()

    if user is None or not check_password_hash(user.password, body['password']):
        return {"message": "Credenciales incorrectas"}, 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user_id": user.id})


@api.route('/usuarios/<int:user_id>', methods=['GET'])
def get_usuario(user_id):
    usuario = User.query.get(user_id)
    if not usuario:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    return jsonify(usuario.serialize()), 200


@api.route('/usuarios/<int:user_id>', methods=['PUT'])
def update_usuario(user_id):
    usuario = User.query.get(user_id)
    if not usuario:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    data = request.get_json()
    # if 'email' in data:
    #     usuario.email = data['email']
    if 'user_name' in data:
        usuario.user_name = data['user_name']
    if 'password' in data:
        usuario.password = generate_password_hash(data['password'])
    # if 'ranking_user' in data:
    #     usuario.ranking_user = data['ranking_user']
    if 'avatar' in data:
        usuario.avatar = data['avatar']
    # if 'experiencia' in data:
    #     usuario.experiencia = data['experiencia']

    db.session.commit()
    return jsonify(usuario.serialize()), 200


@api.route('/usuarios/<int:user_id>', methods=['DELETE'])
def delete_usuario(user_id):
    usuario = User.query.get(user_id)
    if not usuario:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    db.session.delete(usuario)
    db.session.commit()
    return jsonify({"msg": "Usuario eliminado"}), 200


@api.route('/private', methods=['GET'])
@jwt_required
def private_route():
    return jsonify({"msg": "Esta es una ruta privada"}), 200


@api.route('/recover_password', methods=['POST'])
def recover_password():
    data = request.get_json()
    if not data or 'email' not in data:
        return jsonify({"msg": "Email es requerido"}), 400

    user= db.session.execute(select(User).where(
        User.email == data['email'])).scalar_one_or_none()
    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    reset_token = create_access_token(
        identity=user.id,
        expires_delta=timedelta(minutes=15),
        additional_claims={"pw_reset": True}
    )

    
    # backend_url = os.environ.get("VITE_BACKEND_URL", "http://localhost:3000")
    reset_link = f"https://automatic-fortnight-7v5pq5jqqvx9hw97-3000.app.github.dev/reset?token={reset_token}"

    if not isinstance(user.email, str) or not user.email.strip():
     return jsonify({"msg": "Email inválido del usuario"}), 400

    print("DEBUG user.email:", user.email, "type:", type(user.email))
    
    msg = Message(
        subject="Recuperación de password",
        recipients=[user.email]
    )
    msg.body = "Hola,\n\nPara recuperar tu password, haz clic en el siguiente enlace:\n\n{}\n\nEste enlace exp. en 15 minutos.".format(
        reset_link)
    msg.html = f"""
    <html>
        <body>
            <p>Hola,</p>
            <p>Para recuperar tu password, haz clic en el siguiente enlace:</p>
            <p><a href="{reset_link}">Recuperar password</a></p>
            <p>Este enlace exp. en 15 minutos.</p>
        </body>
    </html>
    """
    msg.charset = "utf-8"

    mail.send(msg)

    return jsonify({"msg": "Correo de recuperación enviado"}), 200


@api.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()

    if not data or 'token' not in data or 'new_password' not in data:
        return jsonify({"msg": "Token y nueva contraseña son requeridos"}), 400

    try:
        # Verificar token
        decoded = decode_token(data['token'])

        # (Opcional) Comprobar que el token tenga el claim de reset
        if not decoded.get('pw_reset', False):
            return jsonify({"msg": "Token inválido para este propósito"}), 400

        user_id = decoded['sub']  # ID del usuario (identity en el token)

        user = db.session.execute(select(User).where(
            User.id == user_id)).scalar_one_or_none()

        if user is None:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        hashed_pw = generate_password_hash(data['new_password'])

        user.password = hashed_pw
        db.session.commit()

        return jsonify({"msg": "Contraseña actualizada con éxito"}), 200

    except Exception as e:
        print("ERROR BACKEND:", e)
        return jsonify({"msg": "Token inválido o expirado"}), 400
