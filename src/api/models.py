from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    user_name: Mapped[str] = mapped_column(String(50), nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    ranking_user: Mapped[int] = mapped_column(String, nullable=False)
    avatar: Mapped[str] = mapped_column(String(255), nullable=False)
    experiencia: Mapped[int] = mapped_column(Integer, nullable=False)
    reset_token: Mapped[str] = mapped_column(String(200), nullable=True)
    reset_token_expiration: Mapped[int] = mapped_column(Integer, nullable=True)


    partidas: Mapped[list["Partida"]] = relationship("Partida", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "user_name": self.user_name,
            "ranking_user": self.ranking_user,
            "avatar": self.avatar,
            "experiencia": self.experiencia
        }
class Categoria(db.Model):
    __tablename__ = "categoria"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)

    preguntas: Mapped[list["Preguntas"]] = relationship("Preguntas", back_populates="categoria")

class Preguntas(db.Model):
    __tablename__ = "preguntas"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    categoria_id: Mapped[int] = mapped_column(ForeignKey("categoria.id"), nullable=False)
    dificultad: Mapped[str] = mapped_column(String(50), nullable=False)

    categoria: Mapped["Categoria"] = relationship("Categoria", back_populates="preguntas")
    respuestas: Mapped[list["RespuestasUser"]] = relationship("RespuestasUser", back_populates="pregunta")
    partidas: Mapped[list["Partida"]] = relationship("Partida", back_populates="pregunta")

class RespuestasUser(db.Model):
    __tablename__ = "respuestas_user"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    pregunta_id: Mapped[int] = mapped_column(ForeignKey("preguntas.id"), nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)

    pregunta: Mapped["Preguntas"] = relationship("Preguntas", back_populates="respuestas")
    partida: Mapped["Partida"] = relationship("Partida", back_populates="respuesta", uselist=False)

class Partida(db.Model):
    __tablename__ = "partida"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    pregunta_id: Mapped[int] = mapped_column(ForeignKey("preguntas.id"), nullable=False)
    respuestas_user: Mapped[int] = mapped_column(ForeignKey("respuestas_user.id"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="partidas")
    pregunta: Mapped["Preguntas"] = relationship("Preguntas", back_populates="partidas")
    respuesta: Mapped["RespuestasUser"] = relationship("RespuestasUser", back_populates="partida")