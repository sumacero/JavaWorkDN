import React, { useEffect, useState } from 'react';

function SetTimeEditor(props) {
    const onChanged =(e)=>{
        const setValue = e.target.value;
        props.setFormValues(state => ({
            ...state,
            "set_time":setValue
        }));
    }
    return (
        <label>試験時間：
            <input
                type="number"
                step="1"
                min="1"
                className={`${props.errors.set_time ? 'invalid' : 'valid'}`}
                onChange={onChanged}
                value={props.formValues.set_time}
            >
            </input>
            分
        {props.errors.set_time && <span className="text-danger">{props.errors.set_time}</span>}
        </label>
    );
}

export default SetTimeEditor;