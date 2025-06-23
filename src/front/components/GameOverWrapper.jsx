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

  const tokenId = store.auth?.token;
  const user_id = store.auth?.user_id;
  const userData = store.userData;

  console.log("user desde store:", user_id);
  console.log("token desde store:", tokenId);
  console.log("userData desde store:", userData);

  if (!userData || typeof userData.experiencia !== "number") return null;

  return (
    <GameOverScreen
      score={score}
      totalQuestions={totalQuestions}
      userXP={userData.experiencia}
      onXpUpdate={async (newXP, newRank) => {
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/usuarios/${user_id}`, {
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
