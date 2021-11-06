import React from "react";

const Input = (props: any) => {
    const { value, onChange } = props;
    return (
        <input type={props.type} name={props.name} value={value} onChange={onChange} placeholder={props.placeholder} />
    );
}

export default Input;
