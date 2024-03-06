

import React from 'react';
import './BoardContent.scss';
import Column from '../Column/Column';
import { initData } from '../../actions/initData';
import { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { mapOrder } from '../../utilities/sorts';
import { v4 as uuidv4 } from 'uuid';

const BoardContent = () => {
    const [board, setBoard] = useState(initData)
    const [isShowAddList, setIsShowAddList] = useState(false);
    const [valueInput, setValueInput] = useState("");
    const [columns, setColumns] = useState([]);
    const inputRef = useRef(null);

    // useEffect(() => {
    //     saveDataToLocalStorage(board);
    // }, [board]);
    // useEffect(() => {
    //     const data = getDataFromLocalStorage();
    //     setBoard(data);
    // }, []);

    useEffect(() => {
        if(isShowAddList === true && inputRef && inputRef.current){
            inputRef.current.focus();
        }
    }, [isShowAddList])

    useEffect(() => {
        const boardInitData = initData.boards.find(item => item.id === 'board-1');
        if(boardInitData) {
            setBoard(boardInitData);
            //sort columns
            setColumns(mapOrder(boardInitData.columns, boardInitData.columnOrder, 'id'));
        }
    }, []);

    // if(_.isEmpty(board)) {
    //     return (
    //         <>
    //             <div className="not-found">Board not found</div>
    //         </>
    //     )
    // }
    const handleAddList = () => {
        if(!valueInput){
            if(inputRef && inputRef.current)
                inputRef.current.focus();
            return;
        }
        //update board column
        const _columns = _.cloneDeep(columns);
        _columns.push({
            id: uuidv4(),
            boardId: board.id,
            title: valueInput,
            cardsOrder: [],
            cards: []
        });
        //inputRef.current.focus();
        setColumns(_columns);
        setValueInput("");
        setIsShowAddList(false);
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleAddList();
        }
    }
    const onUpdateColumn = (newColumn) => {
        const columnIdUpdate = newColumn.id;
        let ncols = [...columns];
        let index = ncols.findIndex(item => item.id === columnIdUpdate);
        if(newColumn._destroy) {
            //remove column
            ncols.splice(index, 1);
        }else {
            //update title
            ncols[index] = newColumn;
        }
        setColumns(ncols);
    }

    // const saveDataToLocalStorage = (data) => {
    //   localStorage.setItem('boardData', JSON.stringify(data));
    // }
    // const getDataFromLocalStorage = () => {
    //   const data = localStorage.getItem('boardData');
    //   return data ? JSON.parse(data) : initData;
    // }
    const onColumnDragStart = (e, columnId) => {
        e.dataTransfer.setData('columnId', columnId);
    };
    const onColumnDrop = (e, targetColumnId) => {
        const sourceColumnId = e.dataTransfer.getData('columnId');
        const updatedColumns = [...columns];
        const sourceIndex = updatedColumns.findIndex(col => col.id === sourceColumnId);
        const targetIndex = updatedColumns.findIndex(col => col.id === targetColumnId);
        const [draggedColumn] = updatedColumns.splice(sourceIndex, 1);
        updatedColumns.splice(targetIndex, 0, draggedColumn);
        setColumns(updatedColumns);
        console.log('1=====>', updatedColumns)
        // Cập nhật lại trạng thái của bảng
        const updatedBoard = {
            ...board,
            columnOrder: updatedColumns.map(col => col.id),
            columns: updatedColumns 
        };
        setBoard(updatedBoard);
        console.log('2=====>', updatedBoard)
    };
    const onDragOver = (e) => {
        e.preventDefault();
        // e.stopPropagation();
    };
    return (
        <>
            <div className="board-columns" >
                {columns.map(column =>{
                    return (
                        <Column 
                            key={column.id}
                            column={column}
                            columns={columns}
                            setColumns={setColumns}
                            onColumnDragStart={onColumnDragStart}
                            onColumnDrop={onColumnDrop}
                            onUpdateColumn={onUpdateColumn}
                            onDragOver={onDragOver}
                            //saveDataToLocalStorage={saveDataToLocalStorage}
                        />  
                    )    
                })}
                {isShowAddList === true &&
                <div className='content-add-column'>
                    <input 
                        type="text" 
                        className='form-control'
                        ref={inputRef}
                        value={valueInput}
                        onChange={(event) => setValueInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className='group-btn'>
                        <button className='btn btn-primary' 
                            onClick={() => handleAddList()}>Add list
                        </button>
                        <i className='fa fa-times icon' onClick={() => setIsShowAddList(false)}></i>
                    </div>
                </div>
                }
                {isShowAddList === false &&
                    <div className='add-new-column' onClick= {()=> setIsShowAddList(true)}>
                        <i className='fa fa-plus icon'></i>Add another column
                    </div>
                }
          </div>
        </>
    )
}

export default BoardContent;