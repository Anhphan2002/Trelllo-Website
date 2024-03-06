
import './Column.scss';
import Card from '../Card/Card';
import { mapOrder } from '../../utilities/sorts';
import Dropdown from 'react-bootstrap/Dropdown';
import ConfirmModal from '../Common/ConfirmModal';
import Form from 'react-bootstrap/Form';
import { useState, useEffect, useRef } from 'react';
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from '../../utilities/constant';
import { v4 as uuidv4 } from 'uuid';
//import { update } from 'lodash';
//import { set } from 'lodash';

const Column = (props) => {
    const { column, columns, setColumns, onUpdateColumn, onColumnDragStart, onColumnDrop, onDragOver} = props;
    const [isShowModalDelete, setShowModalDelete] = useState(false);
    const [isShowAddNewCard, setIsShowAddNewCard] = useState(false);
    const [isFirstClick, setIsFirstClick] = useState(true);
    const [valueTextArea, setvalueTextArea] = useState("");
    const [titleColumn, setTitleColumn] = useState("");
    const textAreaRef = useRef(null);
    const inputRef = useRef(null);
    const [cards, setCards] = useState(column.cards);
 
    useEffect(() => {
      if (column && column.cards) {
        const orderedCards = mapOrder(column.cards, column.cardsOrder);
        setCards(orderedCards);
      }
    }, [column]);
    useEffect(() => {
      if(isShowAddNewCard === true && textAreaRef && textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }, [isShowAddNewCard])

    useEffect(() => {
      if(column && column.title) {
        setTitleColumn(column.title)
      }
    }, [column]);

    const togleModal = () => {
      setShowModalDelete(!isShowModalDelete);
    }
    const onModalAction = (type) => {
      if(type === MODAL_ACTION_CLOSE){
        //do nothing
      }
      if(type === MODAL_ACTION_CONFIRM){
        //remove
        const newColumn = {
          ...column,
          _destroy: true
        }
        onUpdateColumn(newColumn)
      }
      togleModal();
    }
    const selectAllText = (event) =>{
      setIsFirstClick(false);

      if(isFirstClick) {
        event.target.select();
      }else {
        inputRef.current.setSelecttionRange(titleColumn.length, titleColumn.length);
      }
      //event.target.focus();
    }

    const handleClickOutside = () => {
      //do something
      setIsFirstClick(true);
      const newColumn = {
        ...column,
        title: titleColumn,
        _destroy: false
      }
      onUpdateColumn(newColumn)
    }

    const handleAddNewCard = () => {
      if(!valueTextArea) {
        textAreaRef.current.focus();
        return;
      }

      const newCard = {
        id: uuidv4(),
        boardId: column.boardId,
        columnId: column.id,
        title: valueTextArea,
        image: null
      }

      let newColumn = {...column};
      newColumn.cards = [...newColumn.cards, newCard];
      newColumn.cardsOrder = newColumn.cards.map(card => card.id);

      onUpdateColumn(newColumn);
      setvalueTextArea("");
      setIsShowAddNewCard(false);
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAddNewCard();
      }
    }
    const handleColumnDragStart = (e) => {
      onColumnDragStart(e, column.id);
    };

    const handleColumnDrop = (e) => {
      if(!e.dataTransfer.getData('cardId')) {
        onColumnDrop(e, column.id);
      }
    };
    const onCardDragStart = (e, cardId, columnId) => {
      e.dataTransfer.setData('cardId', cardId);
      e.dataTransfer.setData('columnId', columnId);
    };

    const handleCardDrop = (e, targetCardId) => {
      const draggedCardId = e.dataTransfer.getData('cardId');
      const sourceColumnId = e.dataTransfer.getData('columnId');      // Lấy ID của cột nguồn từ dữ liệu được chuyển từ sự kiện kéo thả
      const updatedCards = [...cards];      // Tạo bản sao của danh sách thẻ trong cùng một cột
      const targetCardIndex = updatedCards.findIndex(card => card.id === targetCardId);      // Tính toán chỉ số của thẻ mục tiêu trong danh sách
      const draggedCardIndex = updatedCards.findIndex(card => card.id === draggedCardId);      // Chèn thẻ vào vị trí tính toán được
      if (draggedCardIndex > -1) {
          const draggedCard = updatedCards[draggedCardIndex];
          updatedCards.splice(draggedCardIndex, 1);
          updatedCards.splice(targetCardIndex, 0, draggedCard);
      }
      setCards(updatedCards);
      const updatedColumns = columns.map(col => {
        if (col.id === sourceColumnId) {
            return { ...col, cardsOrder: updatedCards.map(card => card.id), cards: updatedCards };
        }
        return col;
      });
      setColumns(updatedColumns);
    }; 

    const handleCardDropColumn = (e, targetCardId, targetColumnId) => {
      const draggedCardId = e.dataTransfer.getData('cardId');
      const sourceColumnId = e.dataTransfer.getData('columnId');      // Lấy ID của cột nguồn từ dữ liệu được chuyển từ sự kiện kéo thả
      const sourceColumn = columns.find(col => col.id === sourceColumnId);
      const sourceColumnCards = [...sourceColumn.cards];      // Tạo bản sao của danh sách thẻ trong cột nguồn
      console.log('check sourceID', sourceColumnCards)
      const targetColumn = columns.find(col => col.id === targetColumnId);
      const targetColumnCards = [...targetColumn.cards];      // Tạo bản sao của danh sách thẻ trong cột đích

      const draggedCard = sourceColumnCards.find(card => card.id === draggedCardId);      // Lấy thẻ được kéo từ danh sách thẻ của cột nguồn
      const updatedSourceColumnCards = sourceColumnCards.filter(card => card.id !== draggedCardId);      // Xóa thẻ được kéo từ danh sách thẻ của cột nguồn
      const targetCardIndex = targetColumnCards.findIndex(card => card.id === targetCardId);      // Tìm vị trí của thẻ mục tiêu trong danh sách thẻ của cột đích
            targetColumnCards.splice(targetCardIndex, 0, draggedCard);      // Chèn thẻ được kéo vào vị trí của thẻ mục tiêu trong danh sách thẻ của cột đích
      // Tạo bản sao của danh sách cột và cập nhật trạng thái của cột nguồn và cột đích
      const updatedColumns = columns.map(col => {
        console.log('check col =>>>', col)
        if(col.id === sourceColumnId) {
          return {...col, cardsOrder:  updatedSourceColumnCards.map(card => card.id), cards: updatedSourceColumnCards};
        } else if(col.id === targetColumnId) {
          return{...col, cardsOrder:  targetColumnCards.map(card => card.id), cards: targetColumnCards};
        }
        return col;
      })
      console.log('check2===>',updatedColumns)
      setColumns(updatedColumns);
    };

    const onCardDrop = (e, targetCardId, targetColumnId) => {
      const sourceColumnId = e.dataTransfer.getData('columnId');
      if(sourceColumnId === targetColumnId) {
        handleCardDrop(e, targetCardId);
      } else {
        handleCardDropColumn(e, targetCardId, targetColumnId);
      }
    };
    const handleUpdateCardTitle = (cardId, newTitle) => {
      const updatedColumns = columns.map(column => {
          const updatedCards = column.cards.map(card => {
              if (card.id === cardId) {
                  return { ...card, title: newTitle };
              }
              return card;
          });
          return { ...column, cards: updatedCards };
      });
      setColumns(updatedColumns);
    };
    return (
        <>
            <div className="column" 
              draggable="true"
              onDragStart={handleColumnDragStart}
              onDrop={handleColumnDrop} 
              onDragOver={onDragOver} >
              <header className="column-drap-handle">
                <div className='column-title'>
                    {column.title}
                    <Form 
                      size = {"sm"}
                      type = "text"
                      value = {titleColumn}
                      className="customize-input-column"
                      onClick={selectAllText}
                      onChange={(event) => setTitleColumn(event.target.value)}
                      spellCheck="false"
                      onBlur={handleClickOutside}
                      onMouseDown={(e) => e.preventDefault()}
                      ref={inputRef}
                    />
                </div>

                <div className='column-dropdown'>          
                  <Dropdown>
                    <Dropdown.Toggle variant="" id="dropdown-basic" size='sm'>

                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={handleAddNewCard}>Add card</Dropdown.Item>
                      <Dropdown.Item onClick={togleModal}>Remove this column</Dropdown.Item>
                      <Dropdown.Item href="#">Something else</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </header>
              <div className="card-list" >
                {cards.map(card => {       
                  return (
                      <Card 
                        key={card.id} 
                        card={card}   
                        onCardDragStart={onCardDragStart}
                        onCardDrop={onCardDrop}
                        onDragOver={onDragOver}
                        columnId={column.id}
                        onUpdateCardTitle={handleUpdateCardTitle}

                       />
                )})}
                  {isShowAddNewCard === true &&
                    <div className='add-new-card'>
                        <textarea
                          rows="2"
                          className='form-control'
                          placeholder='Enter a title for this card...'
                          ref={textAreaRef}
                          value={valueTextArea}
                          onChange={(event) => setvalueTextArea(event.target.value)}
                          onKeyDown={handleKeyDown}
                        >
                        </textarea>
                        <div className='group-btn'>
                          <button
                              className='btn btn-primary'
                              onClick={() => handleAddNewCard()}
                          >Add card                     
                          </button>
                          <i className='fa fa-times icon' 
                            onClick={() => setIsShowAddNewCard(false)}
                          >
                          </i>
                        </div>
                    </div>
                  }
                </div>  
              {isShowAddNewCard === false &&
                <footer>
                  <div className='footer-action'
                    onClick = {() => setIsShowAddNewCard(true)}>
                    <i className='fa fa-plus icon'></i>Add card
                  </div>
                </footer>
              }
            </div>
            <ConfirmModal
              show={isShowModalDelete}
              title={"remove a column"}
              content={`are you sure to remove this column: <b>${column.title}</b> `}
              onAction={onModalAction}
            />
        </>
    )
}

export default Column;

