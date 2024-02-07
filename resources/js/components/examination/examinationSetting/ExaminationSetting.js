import React, { useEffect, useState } from 'react';
import SetTimeEditor from './SetTimeEditor';
import SetQuestionCountEditor from './SetQuestionCountEditor';
import SetPassingScoreEditor from './SetPassingScoreEditor';
import CategoryCheckbox from './CategoryCheckbox';
import TitleEditor from './TitleEditor';
import MemoEditor from './MemoEditor';
import axios from 'axios';

function ExaminationSetting(props) {
    const csrf_token = document.head.querySelector('meta[name="csrf-token"]').content;
    const defaultValues = {
        "title": "",
        "memo": "",
        "set_question_count": "80",
        "set_passing_score": "51",
        "set_time": "180",
        "category_ids": [26]
    };
    const [formValues, setFormValues] = useState(defaultValues);
    const [workbooks, setWorkbooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const clickStartButton = () => {
        props.startExamination(formValues);
    }
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('get-categories-with-question-count');
            const data = result.data.dbData;
            setWorkbooks(JSON.parse(JSON.stringify(data.workbooks)));
            setCategories(JSON.parse(JSON.stringify(data.categories)));
        };
        fetchData();
    }, []);
    return (
        <div>
            <div className="row">
                <div className="col h3">
                    試験出題設定
                </div>
            </div>
            <p>選択されたカテゴリから均等にランダムで出題されます。</p>
            <form name="myform">
                <TitleEditor
                    errors = {props.laravelVaridateErrors}
                    setFormValues = {setFormValues}
                    formValues = {formValues}
                />
                <div className="row py-3">
                    <div className="col">
                        <SetTimeEditor
                            errors = {props.laravelVaridateErrors}
                            setFormValues = {setFormValues}
                            formValues = {formValues}
                        />
                    </div>
                    <div className="col">
                        <SetQuestionCountEditor
                            errors = {props.laravelVaridateErrors}
                            setFormValues = {setFormValues}
                            formValues = {formValues}
                        />
                    </div>
                    <div className="col">
                        <SetPassingScoreEditor
                            errors = {props.laravelVaridateErrors}
                            setFormValues = {setFormValues}
                            formValues = {formValues}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        カテゴリ
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <CategoryCheckbox
                            errors = {props.laravelVaridateErrors}
                            setFormValues = {setFormValues}
                            formValues = {formValues}
                            workbooks={workbooks}
                            categories={categories}
                        />
                    </div>
                </div>
                <MemoEditor
                    errors = {props.laravelVaridateErrors}
                    setFormValues = {setFormValues}
                    formValues = {formValues}
                />
                <div className="row py-3">
                    <div className="col bg-warning text-dark text-center">
                        注意事項：試験中に画面のリロードやブラウザバック等の操作を行わないでください。試験が中止され再開不能となります。
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button
                            type="button"
                            className="btn btn-primary btn-block mb-3"
                            onClick={clickStartButton}
                        >
                            模擬試験を開始
                        </button>
                    </div>
                </div>
                <input type="hidden" name="_token" value={csrf_token} />
            </form>
        </div>
    );
}

export default ExaminationSetting;
