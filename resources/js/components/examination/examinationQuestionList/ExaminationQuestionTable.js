import React, { useEffect, useState} from 'react';

function ExaminationQuestionTable(props) {
    const recordStyle = (isAnswerd) => (
        {
            backgroundColor:isAnswerd ? "paleturquoise" : "mistyrose"
        }
    );
    return (
        <table className="table table-bordered text-center align-middle">
            <thead>
                <tr>
                    <th>出題番号</th>
                    <th>回答済み/未回答</th>
                    <th>マーキング</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {props.examinationQuestions?.map((examinationQuestion, index) =>
                <tr
                    key={index}
                    style={recordStyle(examinationQuestion.is_answered)}
                >
                    <td>{index+1}</td>
                    <td>{examinationQuestion.is_answered ? "回答済み" : "未回答"}</td>
                    <td>
                        {examinationQuestion.is_marked ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-flag-fill" viewBox="0 0 16 16">
                            <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
                            </svg>
                            :
                            <span></span>
                        }
                    </td>
                    <td>
                        <button
                            type="button"
                            className="btn btn-primary btn-block"
                            onClick={()=>props.openQuestion(examinationQuestion.examination_question_id)}
                        >
                            回答画面へ進む
                        </button>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
}

export default ExaminationQuestionTable;
