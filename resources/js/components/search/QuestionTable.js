import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';


function QuestionTable(props) {
    return (
        <div>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>question_id</th>
                        <th>state_name</th>
                        <th>subcategory_name</th>
                        <th>category_name</th>
                        <th>question_text</th>
                    </tr>
                </thead>
                <tbody>
                    {props.questions.map((question) => <tr key={question.question_id}>
                                                    <td><a href={"/question/" + question.question_id}>{question.question_id}</a></td>
                                                    <td>{question.status.status_name}</td>
                                                    <td>{question.subcategory.subcategory_name}</td>
                                                    <td>{question.subcategory.category.category_name}</td>
                                                    <td>{question.question_text}</td>
                                                </tr>)}
                </tbody>
            </table>
        </div>
    );
}

export default QuestionTable;