import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import FilterMenuArea from './FilterMenuArea';
import Pagination from './Pagination';
import QuestionList from './QuestionList';
import { CSSTransition } from 'react-transition-group';

function SearchPage(){
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
    const [ loginUser, setLoginUser] = useState();
    const [ openFilterWindow, setOpenFilterWindow] = useState(false);
    const [ workbooks, setWorkbooks] = useState([]);
    const [ categories, setCategories] = useState([]);
    const [ checkedCategoryIds, setCheckedCategoryIds] = useState([]);
    const [ paginationData, setPaginationData] = useState([]);
    const [ questions, setQuestions] = useState([]);
    const [ activeQuestionId, setActiveQuestionId] = useState(-1);
    const [ isLoading, setIsLoading] = useState(false);
    const [ targetQuestionCount, setTargetQuestionCount] = useState(0);
    useEffect(() => {
        getLoginUser();
        getCategories();
        getQuestions();
    },[]);
    const getLoginUser = async () => {
            const result = await axios.get('get-login-user');
            const data = result.data;
            setLoginUser(JSON.parse(JSON.stringify(data.loginUser)));
    };
    const getCategories = async () => {
            const result = await axios.get('get-categories-with-question-count');
            const data = result.data.dbData;
            setWorkbooks(JSON.parse(JSON.stringify(data.workbooks)));
            setCategories(JSON.parse(JSON.stringify(data.categories)));
    };
    const getQuestions = async () => {
        setIsLoading(true);
        const response = await axios.get('get-questions', {
            params:{
                "page":1
            }
        });
        let data = response.data;
        let questions = data.dbData.data;
        let paginationData = {
            "total": data.dbData.total,
            "per_page": data.dbData.per_page,
            "current_page": data.dbData.current_page,
            "last_page": data.dbData.last_page,
            "next_page_url": data.dbData.next_page_url,
            "prev_page_url": data.dbData.prev_page_url,
            "from": data.dbData.from,
            "to": data.dbData.to,
        };
        setQuestions(questions);
        setPaginationData(JSON.parse(JSON.stringify(paginationData)));
        setIsLoading(false);
    }
    const filterQuestions = async (page) => {
        setIsLoading(true);
        const response = await axios.get('filter-questions', {
            params:{
                "page":page,
                "category_ids":JSON.stringify(checkedCategoryIds),
            }
        });
        let dbData = response.data.dbData;
        let questions = dbData.data;
        let paginationData = {
            "total": dbData.total,
            "per_page": dbData.per_page,
            "current_page": dbData.current_page,
            "last_page": dbData.last_page,
            "next_page_url": dbData.next_page_url,
            "prev_page_url": dbData.prev_page_url,
            "from": dbData.from,
            "to": dbData.to,
        };
        setQuestions(questions);
        setPaginationData(JSON.parse(JSON.stringify(paginationData)));
        setIsLoading(false);
    }
    return(
        <div>
            <div className="container">
                <FilterMenuArea
                    setOpenFilterWindow={setOpenFilterWindow}
                    workbooks={workbooks} 
                    categories={categories} 
                    checkedCategoryIds={checkedCategoryIds}
                    setCheckedCategoryIds={setCheckedCategoryIds}
                    filterQuestions={filterQuestions}
                />
                <Pagination
                    setPaginationData={setPaginationData}
                    paginationData={paginationData}
                    filterQuestions={filterQuestions}
                />
                <QuestionList
                    loginUser={loginUser}
                    questions={questions}
                    setActiveQuestionId={setActiveQuestionId}
                />
            </div>
            {isLoading && 
                <span style={overlay}>
                    <div>loading...</div>
                    <div className="spinner-border">
                    </div>
                </span>
            }
        </div>
    )
}

if (document.getElementById('search-page')) {
    ReactDOM.render(<SearchPage />, document.getElementById('search-page'));
}