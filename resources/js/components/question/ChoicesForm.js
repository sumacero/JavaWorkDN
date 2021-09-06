import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ChoiceRadio from './ChoiceRadio';

function ChoicesForm(props) {
    return (
        <form>
            <div className="btn-group btn-group-toggle col-md-12" data-toggle="buttons">
                {props.choices.map((choice) =>
                    <ChoiceRadio choice={choice} key={choice.choice_id} setSelectedChoiceId={props.setSelectedChoiceId}/>
                )}
            </div>
        </form>
    );
}

export default ChoicesForm;