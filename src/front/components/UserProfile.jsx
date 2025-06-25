import React from 'react';
import './UserProfile.css'; 

const UserProfile = ({ userName, userAvatarUrl, score }) => {
    return (
        <div className="user-profile-box"> 
            <div className="user-profile-content">
                {userAvatarUrl && ( // Solo renderiza si el avatarr existe
                    <img 
                        src={userAvatarUrl} 
                        alt={`${userName}'s avatar`} 
                        className="user-avatar" 
                    />
                )}
                <div className="user-info-text">
                    <span className="user-name">{userName}</span> 
                    <span className="user-score">Puntuación: {score}</span> 
                </div>
            </div>
        </div>
    );
};

export default UserProfile;