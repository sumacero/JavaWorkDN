import React, { useEffect, useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import ExaminationSetting from './examinationSetting/ExaminationSetting.js';
import ExaminationQuestionList from './examinationQuestionList/ExaminationQuestionList.js';
import ExaminationQuestion from './examinationQuestion/ExaminationQuestion.js';
import FinishedExamination from './finishedExamination/FinishedExamination.js';
import DoneExaminationModal from './modal/DoneExaminationModal.js';
import TimeUpExaminationModal from './modal/TimeUpExaminationModal.js';

function ExaminationPage() {
    const overlay = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        flexFlow: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "100000",
    };
    // 試験の状態(setting, continuousQuestion, openQuestion, questionList, result)
    const [ examinationState, setExaminationState] = useState("setting");
    const [ examination, setExamination] = useState("");
    const [ activeExaminationQuestionId, setActiveExaminationQuestionId] = useState(-1);
    const [ activeExaminationQuestionIdsIndex, setActiveExaminationQuestionIdsIndex] = useState(0);
    const [ openDoneExaminationModal, setOpenDoneExaminationModal] = useState(false);
    const [ allAnswered, setAllAnswered] = useState(false);
    const [ questionStatusList, setQuestionStatusList] = useState("");
    const [ openTimeUpExaminationModal, setOpenTimeUpExaminationModal] = useState(false);
    const [ timeLeft, setTimeLeft] = useState(0);
    const defaultErrors = {
        "title": "",
        "memo": "",
        "set_question_count": "",
        "set_passing_score": "",
        "set_time": "",
        "category_ids": ""
    };
    const [ laravelVaridateErrors, setLaravelVaridateErrors] = useState(defaultErrors);
    const [ popupFlag, setPopupFlag] = useState(false);
    const [ popupMsg, setPopupMsg] = useState("");
    const refExaminationState = useRef(examinationState);
    const refTimeLeft = useRef(timeLeft);
    const [ isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        refExaminationState.current  = examinationState;
    }, [examinationState]);
    useEffect(() => {
        refTimeLeft.current  = timeLeft;
    }, [timeLeft]);

    const startExamination = (data) => {
        setIsLoading(true);
        let res1;
        let res2;
        const asyncFunc = async (data) => {
            // res1とres2は順番に実行される
            res1 = await axios.post('start-examination', data);
            let examinationId = res1.data.examinationId;
            res2 = await axios.post('get-examination-data', {
                examination_id:examinationId
            });
        };
        asyncFunc(data).
        then(()=>{
            setLaravelVaridateErrors(defaultErrors);
            // asyncFunc実行後に処理される
            const tmp = JSON.parse(JSON.stringify(res2.data.examination));
            setExamination(tmp);
            const examinationQuestions = tmp.examination_questions;
            setActiveExaminationQuestionIdsIndex(0);
            setActiveExaminationQuestionId(
                examinationQuestions[0].examination_question_id
            );
            setQuestionStatusList(
                examinationQuestions.map(e=>{
                    return({
                        "examination_question_id":e.examination_question_id,
                        "is_answered":false,
                        "is_marked":false
                    })
                })
            );
            setIsLoading(false);
            setExaminationState("continuousQuestion");
            let second = tmp.set_time * 60;
            setTimeLeft(second);
            timerStart();
        }).
        catch((error)=>{
            setIsLoading(false);
            if(error.response.status == 422){
                console.log("試験開始バリデーションでエラーが発生！！");
                const errorObj = error.response.data.errors;
                console.log(errorObj);
                setLaravelVaridateErrors(errorObj);
                setPopupMsg("サーバーバリデーションエラー");
                setPopupFlag(!popupFlag);
            }else{
                alert("サーバーエラーが発生");
            }
        })
    }

    const timerStart = () => {
        const timerId = setInterval(() => {
            setTimeLeft(refTimeLeft.current - 1);
            if(refTimeLeft.current <= 0){ 
                clearInterval(timerId);
                setOpenTimeUpExaminationModal(true);
            }
            if(refExaminationState.current == "finished"){
                clearInterval(timerId);
            }
        }, 1000);
    }

    const answeredQuestion = (data) => {
        setQuestionStatusList((prevState)=>{
            return prevState.map(
                e=>{
                    if(e.examination_question_id === data.examination_question_id){
                        e.is_answered = true;
                        e.is_marked = data.is_marked;
                    }
                    return e;
                }
        )});
        if((examination.examination_questions.length > activeExaminationQuestionIdsIndex + 1) && (examinationState == "continuousQuestion")){
            moveQuestion();
        }else{
            setExaminationState("questionList");
        }
    }
    const skipQuestion = (data) => {
        setQuestionStatusList((prevState)=>{
            return prevState.map(
                e=>{
                    if(e.examination_question_id === data.examination_question_id){
                        e.is_answered = false;
                        e.is_marked = data.is_marked;
                    }
                    return e;
                }
        )});
        if((examination.examination_questions.length > activeExaminationQuestionIdsIndex + 1) && (examinationState == "continuousQuestion")){
            moveQuestion();
        }else{
            setExaminationState("questionList");
        }
    }
    const moveQuestion = () => {
        setActiveExaminationQuestionIdsIndex(activeExaminationQuestionIdsIndex+1);
        setActiveExaminationQuestionId(examination.examination_questions[activeExaminationQuestionIdsIndex+1].examination_question_id);
    }
    const openQuestion = (data) => {
        setIsLoading(true);
        let res1;
        const asyncFunc = async (data) => {
            res1 = await axios.post('get-examination-question', {
                examination_question_id:data
            });
        };
        asyncFunc(data).finally(() => {
            // asyncFunc実行後に処理される
            const index = examination.examination_questions.findIndex(
                (element) => element.examination_question_id === data
            );
            setActiveExaminationQuestionIdsIndex(index);
            setActiveExaminationQuestionId(data);
            setExaminationState("openQuestion");
            setIsLoading(false);
        });
    }
    
    const finishExamination = () => {
        setIsLoading(true);
        let res;
        const asyncFunc = async (data) => {
            res = await axios.post('finish-examination', {
                examination_id:data
            });
        };
        asyncFunc(examination.examination_id).finally(() => {
            // asyncFunc実行後に処理される
            setExaminationState("finished");
        })
        setIsLoading(false);
    };
    const moveResultPage = () => {
        //試験結果画面へ移動する
        location.href = "examination-result/" + examination.examination_id;
    }
    const secToDayTime = (seconds) => {
        const day = Math.floor(seconds / 86400);
        const hour = Math.floor(seconds % 86400 / 3600);
        const min = Math.floor(seconds % 3600 / 60);
        const sec = seconds % 60;
        let time = '';
        // day が 0 の場合は「日」は出力しない（hour や min も同様）
        if(day !== 0) {
            time = `${day}日${hour}時間${min}分${sec}秒`;
        }else if(hour !==0 ) {
            time = `${hour}時間${min}分${sec}秒`;
        }else if(min !==0) {
            time = `${min}分${sec}秒`;
        }else {
            time = `${sec}秒`;
        }
        return time;
    }
    const makeQuestionLeftString = (questionIndex) => {
        const total = examination.examination_questions.length;
        const string = "全" + total + "問中の" + (questionIndex + 1) + "問目";
        return string;
    }
    return (
        <div className="container">
            {examinationState == "setting" &&
                <ExaminationSetting
                    setExaminationState={setExaminationState}
                    startExamination={startExamination}
                    laravelVaridateErrors={laravelVaridateErrors}
                />
            }
            {examinationState == "continuousQuestion" &&
                <ExaminationQuestion
                    examinationState={examinationState}
                    examinationQuestionId={activeExaminationQuestionId}
                    examinationQuestionIndex={activeExaminationQuestionIdsIndex}
                    answeredQuestion={answeredQuestion}
                    skipQuestion={skipQuestion}
                    timeLeftString={secToDayTime(timeLeft)}
                    makeQuestionLeftString={makeQuestionLeftString}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                />
            }
            {examinationState == "questionList" &&
                <ExaminationQuestionList
                    setExaminationState={setExaminationState}
                    questionStatusList={questionStatusList}
                    openQuestion={openQuestion}
                    setOpenDoneExaminationModal={setOpenDoneExaminationModal}
                    setAllAnswered={setAllAnswered}
                    setOpenTimeUpExaminationModal={setOpenTimeUpExaminationModal}
                    timeLeftString={secToDayTime(timeLeft)}
                />
            }
            {examinationState == "openQuestion" &&
                <ExaminationQuestion
                    examinationState={examinationState}
                    examinationQuestionId={activeExaminationQuestionId}
                    examinationQuestionIndex={activeExaminationQuestionIdsIndex}
                    answeredQuestion={answeredQuestion}
                    skipQuestion={skipQuestion}
                    timeLeftString={secToDayTime(timeLeft)}
                    makeQuestionLeftString={makeQuestionLeftString}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                />
            }
            {examinationState == "finished" &&
                <FinishedExamination
                    moveResultPage={moveResultPage}
                />
            }
            {openDoneExaminationModal &&
                <DoneExaminationModal
                    setOpenDoneExaminationModal={setOpenDoneExaminationModal}
                    finishExamination={finishExamination}
                    allAnswered={allAnswered}
                />
            }
            {openTimeUpExaminationModal &&
                <TimeUpExaminationModal
                    setOpenTimeUpExaminationModal={setOpenTimeUpExaminationModal}
                    finishExamination={finishExamination}
                    allAnswered={allAnswered}
                />
            }
            <CSSTransition in={popupFlag} classNames="popup" timeout={2000}>
                <div>{popupMsg}</div>
            </CSSTransition>
            {isLoading && 
                <span style={overlay}>
                    <div>loading...</div>
                    <div className="spinner-border">
                    </div>
                </span>
            }
        </div>
    );
}

if (document.getElementById('examination-page')) {
    ReactDOM.render(<ExaminationPage />,document.getElementById('examination-page'));
}
