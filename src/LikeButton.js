import React, { useState } from "react";
import heartSvg from './images/like-heart.svg';
import filledHeartSvg from './images/like-heart-filled.svg';

const LikeButton = ({alreadyLiked, initalLikes}) => {
    const [isLiked, setLiked] = useState(alreadyLiked ?? false);
    const [likes, setLikes] = useState(initalLikes ?? 0);

    const handleClick = () => {
        setLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
    }

    return (
        <div className="like-button-container" onClick={handleClick}>
            <img src={isLiked ? filledHeartSvg : heartSvg} alt="like button" className="like-button-image"/>
            <span className="like-counter">{likes}</span>
        </div>
    )
}

export {LikeButton as default};