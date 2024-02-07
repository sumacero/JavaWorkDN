import React, { useEffect, useState } from 'react';

function SetQuestionCountEditor(props) {
    const onChanged =(e)=>{
        const setValue = e.target.value;
        props.setFormValues(state => ({
            ...state,
            "set_question_count":setValue
        }));
    }
    return (
        <label>出題数：
            <input
                type="number"
                step="1"
                min="1"
                className={`${props.errors.set_question_count ? 'invalid' : 'valid'}`}
                onChange={onChanged}
                value={props.formValues.set_question_count}
            >
            </input>
            問
        {props.errors.set_question_count && <span className="text-danger">{props.errors.set_question_count}</span>}
        </label>
    );
}

export default SetQuestionCountEditor;