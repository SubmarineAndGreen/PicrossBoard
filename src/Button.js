import React from "react";

const Button = ({ text, onClick, classes}) => {

    return (
        <div className={`button ${classes}`} onClick={onClick}>
            {text}
        </div>
    )
}

export { Button as default };