from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)
# Allow CORS requests to this API
CORS(api)
# :small_blue_diamond: Ruta de prueba básica
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200
# :small_blue_diamond: Obtener todos los usuarios
@api.route('/usuarios', methods=['GET'])
def get_usuarios():
    usuarios = User.query.all()
    return jsonify([user.serialize() for user in usuarios]), 200
# :small_blue_diamond: Crear un nuevo usuario
@api.route('/usuarios', methods=['POST'])
def create_usuario():
    data = request.get_json()
    required_fields = ["email", "user_name", "password", "ranking_user", "avatar", "experiencia"]
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Faltan campos obligatorios"}), 400
    nuevo_usuario = User(
        email=data["email"],
        user_name=data["user_name"],
        password=data["password"],  # :warning: Recuerda hashearla en producción
        ranking_user=data["ranking_user"],
        avatar=data["avatar"],
        experiencia=data["experiencia"]
    )
    db.session.add(nuevo_usuario)
    db.session.commit()
    return jsonify(nuevo_usuario.serialize()), 201









