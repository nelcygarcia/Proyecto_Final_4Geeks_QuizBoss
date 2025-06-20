import React, { useContext } from "react";
import GameOverScreen from "./GameOverScreen";
import { Context } from "../store/appContext"; // o desde donde tengas el contexto

const GameOverWrapper = ({
  score,
  totalQuestions,
  onRematch,
  onNewGame,
  onGoHome,
  token,
}) => {
  const { store } = useContext(Context);
  const user = store.user;

  if (!user || typeof user.experiencia !== "number") return null; // o un loader

  return (
    <GameOverScreen
      score={score}
      totalQuestions={totalQuestions}
      userXP={user.experiencia}
      onXpUpdate={async (newXP, newRank) => {
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/usuarios/${user.id}`, {
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
          console.log(newXP, newRank);

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
