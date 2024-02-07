import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import FilterCategoryModal from './FilterCategoryModal';


function FilterMenuArea(props){
    const [openCategoryFilter, setOpenCategoryFilter] = useState(false);
    const [targetCategoryText, setTargetCategoryText] = useState("条件なし");
    const [beforeCheckedCategoryIds, setBeforeCheckedCategoryIds] = useState([]); 

    const clickFilterButton = ()=>{
        props.filterQuestions(1);
    }
    return(
        <div>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th colSpan="2">検索条件</th>
                    </tr>
                    <tr>
                        <td className="col-2">
                            <div className="d-flex align-items-center justify-content-between">
                                <span>カテゴリ</span>
                                <button className="btn btn-primary" onClick={()=>setOpenCategoryFilter(true)}>選択</button>
                            </div>
                        </td>
                        <td>
                            {targetCategoryText}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <button onClick={clickFilterButton} className="btn btn-primary btn-block">
                                検索
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            {openCategoryFilter &&
                <FilterCategoryModal
                    setOpenCategoryFilter={setOpenCategoryFilter}
                    setTargetCategoryText={setTargetCategoryText}
                    workbooks={props.workbooks} 
                    categories={props.categories} 
                    checkedCategoryIds={props.checkedCategoryIds}
                    setCheckedCategoryIds={props.setCheckedCategoryIds}
                    beforeCheckedCategoryIds={beforeCheckedCategoryIds}
                    setBeforeCheckedCategoryIds={setBeforeCheckedCategoryIds}
                />
            }
        </div>
    )
}

export default FilterMenuArea;