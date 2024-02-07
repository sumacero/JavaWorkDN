import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function CategoryCheckbox(props) {
    const workbookCheck = (event) =>{
        const checkedWorkbookId = event.target.value;
        const targetCategories = props.categories.filter(category => category.workbook_id == checkedWorkbookId);
        const targetCategoryIds = targetCategories.map(category => String(category.category_id));
        const elements = document.getElementsByName("category");
        const isChecked = event.target.checked;
        const checkedValues = [];
        elements.forEach(
            e=>{
                // チェック状態を切り替え
                if(targetCategoryIds.includes(e.value) && 
                    props.categories.find((category)=>category.category_id == e.value).question_count>0)
                    e.checked = isChecked;
                // formパラメータを更新
                if(e.checked) checkedValues.push(e.value);
            }
        );
        props.setFormValues(state => ({
            ...state,
            "category_ids":checkedValues
        }));
    }
    const categoryCheck = ()=>{
        const elements = document.getElementsByName("category");
        const checkedValues = [];
        elements.forEach(
            e=>{
                if(e.checked) checkedValues.push(e.value);
            }
        );
        props.setFormValues(state => ({
            ...state,
            "category_ids":checkedValues
        }));
    }
    return (
        <div className={`${props.errors.category_ids ? 'row invalid' : 'row'}`}>
        {props.workbooks.map(item =>
            <div className="col" key={item.workbook_id}>
                <input
                    id={"workbook" + item.workbook_id}
                    type="checkbox"
                    name={"workbook"}
                    value={item.workbook_id}
                    onClick={workbookCheck}
                />
                <label className="h5" htmlFor={"workbook"+item.workbook_id}>
                    {item.workbook_name}_({item.question_count})
                </label>
                {props.categories.filter(category => category.workbook_id == item.workbook_id).map(item =>
                    <div className="col" key={item.category_id}>
                        <input 
                            id={"category" + item.category_id}
                            name="category"
                            value={item.category_id}
                            type="checkbox"
                            onChange={categoryCheck}
                            defaultChecked={props.formValues.category_ids.includes(item.category_id)}
                            disabled={item.question_count===0}
                        />
                        <label htmlFor={"category" + item.category_id}>
                            {item.category_name}_({item.question_count})
                        </label>
                    </div>
                )}
            </div>
        )}
        {props.errors.category_ids && <span className="text-danger">{props.errors.category_ids}</span>}
        </div>
    );
}

export default CategoryCheckbox;