
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
    const onColumnDragStart = (e, columnId) => {
        e.dataTransfer.setData('columnId', columnId);
    };
    const onColumnDrop = (e, targetColumnId) => {
        // console.log('99999999')
        const sourceColumnId = e.dataTransfer.getData('columnId');
        const updatedColumns = [...columns];
        const sourceIndex = updatedColumns.findIndex(col => col.id === sourceColumnId);
        const targetIndex = updatedColumns.findIndex(col => col.id === targetColumnId);
        const [draggedColumn] = updatedColumns.splice(sourceIndex, 1);
        updatedColumns.splice(targetIndex, 0, draggedColumn);
        setColumns(updatedColumns);
        // Cập nhật lại trạng thái của bảng
        const updatedBoard = {
            ...board,
            columnOrder: updatedColumns.map(col => col.id),
            columns: updatedColumns 
        };
        setBoard(updatedBoard);
    };
    const onDragOver = (e) => {
        e.preventDefault();
        // e.stopPropagation(); // Ngăn chặn sự kiện lây lan đến các phần tử cha
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
                        />  
                    )    
                })}
                {isShowAddList === true &&
                <div className='content-add-column'>
                    <input 
                        type="text" 
                        className='form-control'
                        placeholder='Enter a title for this column...'
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