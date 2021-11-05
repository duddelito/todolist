import React from "react";

import './Button.css';

const Button = (props: any) => {
    const { value, onClick} = props;
    return(
        <button onClick={onClick}>{value}</button>
    );
}

export default Button;
