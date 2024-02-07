import React, { useEffect, useState } from 'react';

function SetPassingScoreEditor(props) {
    const onChanged =(e)=>{
        const setValue = e.target.value;
        props.setFormValues(state => ({
            ...state,
            "set_passing_score":setValue
        }));
    }
    return (
        <label>合格正解数：
            <input
                type="number"
                step="1"
                min="1"
                className={`${props.errors.set_passing_score ? 'invalid' : 'valid'}`}
                onChange={onChanged}
                value={props.formValues.set_passing_score}
            >
            </input>
            問
        {props.errors.set_passing_score && <span className="text-danger">{props.errors.set_passing_score}</span>}
        </label>
    );
}

export default SetPassingScoreEditor;