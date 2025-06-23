import React, { useContext } from "react";
import GameOverScreen from "./GameOverScreen";
import useGlobalReducer from "../hooks/useGlobalReducer";

const GameOverWrapper = ({
  score,
  totalQuestions,
  onRematch,
  onNewGame,
  onGoHome,
  token,
}) => {
  const { store } = useGlobalReducer();

  const userData = store.userData;
  const tokenId = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");

  if (!userData || typeof userData.experiencia !== "number") return null;

  return (
    <GameOverScreen
      score={score}
      totalQuestions={totalQuestions}
      userXP={userData.experiencia}
      onXpUpdate={async (newXP, newRank) => {
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${user_id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              experiencia: newXP,
              ranking_user: newRank,
            }),
          });


          if (!res.ok) {
            console.error("Error al actualizar XP");
          }
        } catch (error) {
          console.error("Error en la petición:", error);
        }
      }}
      onRematch={onRematch}
      onNewGame={onNewGame}
      onGoHome={onGoHome}
    />
  );
};

export default GameOverWrapper;
