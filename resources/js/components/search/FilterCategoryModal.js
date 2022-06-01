import React, { useCallback, useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import FilterCategory from './FilterCategory';


function FilterCategoryModal(props){
    const modalContent = {
        background: "white",
        padding: "10px",
        borderRadius: "3px",
        width: "90%",
        height: "90%",
    };
    const overlay = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "100000",
    };
    useEffect(() => {
        document.addEventListener('click', closeModal)
        event.stopPropagation()
        return ()=>{
            document.removeEventListener('click',closeModal)
        }
    },[]);
    const modalRef = useRef()
    //const [beforeCheckedSubcategoryIds, setBeforeCheckedSubcategoryIds] = useState([]);
    const closeModal = useCallback((event)=>{
        if(!modalRef.current.contains(event.target)) clickCancelButton();
    },[]);
    const clickCancelButton = ()=>{
        props.setCheckedSubcategoryIds(props.beforeCheckedSubcategoryIds);
        props.setOpenCategoryFilter(false);
        document.removeEventListener('click',closeModal);
    }
    const clickEnterButton = ()=>{
        props.setBeforeCheckedSubcategoryIds(props.checkedSubcategoryIds);
        let text = "";
        props.checkedSubcategoryIds.map((subcategoryId) =>
            text = text + props.subcategories.find(subcategory => subcategory.subcategory_id == subcategoryId).subcategory_name + " "
        );
        if(text == ""){
            text = "条件なし";
        }
        props.setTargetCategoryText(text);
        props.setOpenCategoryFilter(false);
        document.removeEventListener('click',closeModal);
    }
    useEffect
    return(
        <div>
            <span id="overlay" style={overlay}>
                <span id="modalContent" style={modalContent} className="overflow-auto" ref={modalRef}>
                    <p>カテゴリを選択してください</p>
                    <FilterCategory
                        categories={props.categories} 
                        subcategories={props.subcategories} 
                        checkedSubcategoryIds={props.checkedSubcategoryIds}
                        setCheckedSubcategoryIds={props.setCheckedSubcategoryIds}
                    />
                    <button className="btn btn-primary btn-block" onClick={clickEnterButton}>決定</button>
                    <button className="btn btn-primary btn-block" onClick={clickCancelButton}>キャンセル</button>
                </span>
            </span>
        </div>
    )
}

export default FilterCategoryModal;