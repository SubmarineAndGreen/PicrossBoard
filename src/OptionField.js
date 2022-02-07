import React, { useState } from "react";

const OptionField = ({onChange}) => {
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        setValue(e.target.value);
        onChange(e.target.value);
    }

    return (
        <div>
            Size:
            <select className="input-field" value={value} onChange={handleChange}>
                <option value="sm">5x5</option>
                <option value="md">10x10</option>
                <option value="l">15x15</option>
                <option value="xl">20x20</option>
            </select>
        </div>
    )
}

export {OptionField as default};