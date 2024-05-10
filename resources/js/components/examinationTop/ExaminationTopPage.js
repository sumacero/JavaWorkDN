import React, { useEffect, useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import ExaminationLogTable from './ExaminationLogTable.js';
import Pagination from './Pagination.js';

function ExaminationTopPage() {
    const [ examinationLog, setExaminationLog] = useState([]);
    const [ paginationData, setPaginationData] = useState([]);
    const getExaminationLog = async (page) => {
        let res1;
        const asyncFunc = async () => {
            res1 = await axios.get('get-examination-log', {
                params:{
                    "page":page
                }
            });
        };
        asyncFunc()
        .then(() => {
            let paginationData = {
                "total": res1.data.dbData.total,
                "per_page": res1.data.dbData.per_page,
                "current_page": res1.data.dbData.current_page,
                "last_page": res1.data.dbData.last_page,
                "next_page_url": res1.data.dbData.next_page_url,
                "prev_page_url": res1.data.dbData.prev_page_url,
                "from": res1.data.dbData.from,
                "to": res1.data.dbData.to,
            };
            setExaminationLog(res1.data.dbData.data);
            setPaginationData(paginationData);
        })
    }
    useEffect(() => {
        getExaminationLog(1);
    },[]);
    const clickStartButton = () => {
        let url = "examination";
        location = url;
    }
    return (
        <div className="container">
            <div className="row py-3">
                <div className="col">
                    <button
                        type="button"
                        className="btn btn-primary btn-block"
                        onClick={clickStartButton}
                    >
                        模擬試験を開始
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            模擬試験履歴
                        </div>
                        <div className="card-body">
                            <div className="card-text">
                                {examinationLog.length > 0 ?
                                    <span>
                                        <Pagination
                                            setPaginationData={setPaginationData}
                                            paginationData={paginationData}
                                            getExaminationLog={getExaminationLog}
                                        />
                                        <ExaminationLogTable
                                            examinationLog = {examinationLog}
                                        />
                                    </span>
                                :
                                    <div>受験履歴がありません</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

if (document.getElementById('examination-top-page')) {
    ReactDOM.render(<ExaminationTopPage />,document.getElementById('examination-top-page'));
}
