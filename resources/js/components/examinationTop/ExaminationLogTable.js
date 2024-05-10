import React, { useEffect, useState} from 'react';

function ExaminationLogTable(props) {
    const clickDetailButton = (examinationId)=> {
        let url = "examination-result/" + examinationId;
        location = url;
    }
    return (
        <div className="container">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>試験タイトル</th>
                        <th>試験開始日時</th>
                        <th>ステータス</th>
                        <th>合否</th>
                        <th>試験時間(分)</th>
                        <th>出題数</th>
                        <th>正解率(%)</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {props.examinationLog?.map((examination) =>
                        <tr key={examination.examination_id}>
                            <td>{examination.title}</td>
                            <td>{examination.started_at}</td>
                            <td>{examination.examination_status.status_name}</td>
                            <td>{examination.is_passing ? "合格":"不合格"}</td>
                            <td>{examination.set_time}</td>
                            <td>{examination.set_question_count}</td>
                            <td>{examination.correct_answer_rate}</td>
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-block"
                                    onClick={()=>clickDetailButton(examination.examination_id)}
                                >
                                    詳細
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ExaminationLogTable;
