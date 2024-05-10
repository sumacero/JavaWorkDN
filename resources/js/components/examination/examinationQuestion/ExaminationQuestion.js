import React, { useEffect, useState } from 'react';
import Question from './Question';
import ChoicesForm from './ChoicesForm';
import SelectedState from './SelectedState';

function ExaminationQuestion(props){
    const [ selectedChoiceIds, setSelectedChoiceIds] = useState([]);
    const [ correctChoiceCount, setCorrectChoiceCount] = useState(-1);
    const [ examinationQuestion, setExaminationQuestion] = useState("");
    const [ selectedChoiceSymbols, setSelectedChoiceSymbols] = useState([]);
    const [ isMarked, setIsMarked] = useState(false);
    useEffect(()=>{
        props.setIsLoading(true);
        let les1;
        let tempBool;
        const asyncFunc = async (data) => {
            les1 = await axios.post('get-examination-question', {
                "examination_question_id":data
            });
        };
        asyncFunc(props.examinationQuestionId).then(() => {
            // asyncFunc実行後に処理される
            const data = les1.data.examinationQuestion;
            setExaminationQuestion(JSON.parse(JSON.stringify(data)));
            setSelectedChoiceIds(
                data.examination_answer_logs
                    .map((examination_answer_log)=>examination_answer_log.choice_id)
            );
            setSelectedChoiceSymbols(
                data.examination_answer_logs
                    .map((examination_answer_log)=>examination_answer_log.choice.choice_symbol)
                    .sort()
            );
            setCorrectChoiceCount(
                data.question.choices
                    .filter((choice)=>choice.is_correct === 1).length
            );
            tempBool = data.is_marked == 1
            setIsMarked(tempBool);
        }).finally(()=>{
            props.setIsLoading(false);
            document.getElementsByName("marking")[0].checked = tempBool;
        });
    },[props.examinationQuestionId]);

    const clickAnswerButton = () => {
        props.setIsLoading(true);
        let data = {
            "examination_question_id":props.examinationQuestionId,
            "selected_choice_ids":selectedChoiceIds,
            "is_marked":isMarked
        };
        const asyncFunc = async (data) => {
            await axios.post('answer-examination-question', data);
        };
        asyncFunc(data).then(() => {
            // asyncFunc実行後に処理される
            props.answeredQuestion(data);
        })
        .catch((error)=>{
            if(error.response.status == 422){
                console.log("問題回答バリデーションでエラーが発生！！");
                const errorObj = error.response.data.errors;
                console.log(errorObj);
            }else{
                console.log("サーバーエラーが発生");
            }
        }).finally(()=>{
            props.setIsLoading(false);
        })
    }

    const clickSkipAnswerButton = () => {
        props.setIsLoading(true);
        let data = {
            "examination_question_id":props.examinationQuestionId,
            "is_marked":isMarked
        };
        const asyncFunc = async (data) => {
            await axios.post('skip-answer-examination-question', data);
        };
        asyncFunc(data)
        .then(() => {
            // asyncFunc実行後に処理される
            props.skipQuestion(data);
        })
        .catch((error)=>{
            if(error.response.status == 422){
                console.log("回答スキップバリデーションでエラーが発生！！");
                const errorObj = error.response.data.errors;
                console.log(errorObj);
            }else{
                console.log("サーバーエラーが発生");
            }
        }).finally(()=>{
            props.setIsLoading(false);
        })
    }

    const changeMarking = ()=>{
        const elements = document.getElementsByName("marking");
        setIsMarked(elements[0].checked);
    }
    const onClickMarking = ()=>{
        const elements = document.getElementsByName("marking");
        elements[0].checked = !elements[0].checked
        setIsMarked(elements[0].checked);
    }
    const markStyle = (isMarked) => (
        {
            backgroundColor:isMarked ? "paleturquoise" : "lightcyan"
        }
    );
    return (
        <div className="container">
            {(examinationQuestion !== "" && !props.isLoading) &&
            <span>
                <div className="row justify-content-end">
                    <div className="col-2">
                        {props.makeQuestionLeftString(props.examinationQuestionIndex)}
                    </div>
                    <div className="col-3">
                        残り時間：{props.timeLeftString}
                    </div>
                </div>
                <div className="row h1 bg-dark text-white">
                    問題{props.examinationQuestionIndex + 1}
                </div>
                <div className="row border bg-sucsees py-1 mb-1" style={markStyle(isMarked)}>
                    <div className="col-11 text-right" onClick={onClickMarking}>
                        マーキング(問題一覧画面でマークされます)
                    </div>
                    <div className="col">
                        <input
                            type="checkbox"
                            id="marking"
                            name="marking"
                            onChange={changeMarking}
                        />
                    </div>
                </div>
                <Question question={examinationQuestion.question}/>
                <ChoicesForm
                    choices={examinationQuestion.question.choices}
                    setSelectedChoiceIds={setSelectedChoiceIds}
                    selectedChoiceIds={selectedChoiceIds}
                />
                <p>※{correctChoiceCount}つ選択してください</p>
                <SelectedState
                    selectedChoiceSymbols={selectedChoiceSymbols}
                />
                <button
                    type="button"
                    className="btn btn-primary btn-block mb-3"
                    onClick={clickAnswerButton}
                    disabled={selectedChoiceIds.length !== correctChoiceCount}
                >
                    回答
                </button>
                <button
                    type="button"
                    className="btn btn-warning btn-block mb-3"
                    onClick={clickSkipAnswerButton}
                >
                    保留(後で回答)
                </button>
            </span>
            }
        </div>
    );
}

export default ExaminationQuestion;