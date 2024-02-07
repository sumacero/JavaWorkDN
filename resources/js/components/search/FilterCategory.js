import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function FilterCategory(props) {
    const targetCategories = (workbook_id) => {
        return props.categories.filter(category => category.workbook_id == workbook_id);
    }
    const workbookCheck = (event) =>{
        const workbook_id = event.target.value;
        if(event.target.checked){
            let newCategories = targetCategories(workbook_id)
            //現在のチェック項目と新規追記項目を統合
            let tmpArray = [...props.checkedCategoryIds.concat(newCategories.map((obj) => obj.category_id))]
            //項目の重複を配列から削除し、ソート
            tmpArray = Array.from(new Set(tmpArray)).sort((a,b)=>a - b);
            props.setCheckedCategoryIds(tmpArray);
        }else{
            let checkedOffCategories = props.categories.filter((category)=>category.workbook_id == workbook_id)
            let checkedOffCategoryIds = checkedOffCategories.map((obj)=>obj.category_id)
            props.setCheckedCategoryIds([...props.checkedCategoryIds.filter((item) => !checkedOffCategoryIds.includes(item))]);
        }
    }
    const toggleChecked = (target) => {
        if (props.checkedCategoryIds.includes(target)) {
            //チェック済みの場合は項目を削除
            props.setCheckedCategoryIds(
                [...props.checkedCategoryIds.filter((item) => item !== target)]
            );
        } else {
            //未チェックの場合は項目を追加しソート
            props.setCheckedCategoryIds(
                [...props.checkedCategoryIds.concat([target]).sort((a,b)=>a - b)]
            );
        }
    };

    const defaultCheckedFlag = (workbook_id) => {
        // デフォルトのチェック状態を管理する
        let defaultCheckedCount = targetCategories(workbook_id).filter(item => props.checkedCategoryIds.includes(item.category_id)).length;
        return defaultCheckedCount>0;
    }

    return (
        <form>
            <div className="row">
            {props.workbooks.map(item =>
                <div className="col" key={item.workbook_id}>
                    <input 
                        id={"workbook" + item.workbook_id}
                        type="checkbox"
                        name={"workbooks"}
                        value={item.workbook_id}
                        defaultChecked={
                            defaultCheckedFlag(item.workbook_id)
                        }
                        onClick={workbookCheck}
                    />
                    <label className="h5" htmlFor={"workbook" + item.workbook_id}>{item.workbook_name}</label>
                    {targetCategories(item.workbook_id).map(item =>
                        <div className="col" key={item.category_id}>
                            <input 
                                id={"category" + item.category_id}
                                type="checkbox"
                                name={"categories[" + item.category_id +"]"}
                                checked={props.checkedCategoryIds.includes(item.category_id)}
                                onChange={() => toggleChecked(item.category_id)}
                            />
                            <label htmlFor={"category" + item.category_id}>
                                {item.category_name}_({item.question_count})
                            </label>
                        </div>
                    )}
                </div>
            )}
            </div>
        </form>
    );
}

export default FilterCategory;