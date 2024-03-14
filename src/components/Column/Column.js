

import './Column.scss';
import Card from '../Card/Card';
import { mapOrder } from '../../utilities/sorts';
import Dropdown from 'react-bootstrap/Dropdown';
import ConfirmModal from '../Common/ConfirmModal';
import Form from 'react-bootstrap/Form';
import { useState, useEffect, useRef } from 'react';
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from '../../utilities/constant';
import { v4 as uuidv4 } from 'uuid';


const Column = (props) => {
    const { column, columns, setColumns, onUpdateColumn, onColumnDragStart, onColumnDrop } = props;
    const [isShowModalDelete, setShowModalDelete] = useState(false);
    const [isShowAddNewCard, setIsShowAddNewCard] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
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
    }, [isShowAddNewCard]);

    useEffect(() => {
        if (isEditingTitle && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditingTitle]);

    useEffect(() => {
      if(column && column.title) {
        setTitleColumn(column.title)
      }
    }, [column]);

    const togleModal = () => {
      setShowModalDelete(!isShowModalDelete);
    };
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
    };

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
    };
    const handleUpdateTitle = () => {
      setIsEditingTitle(false);
      onUpdateColumn({ ...column, title: titleColumn });
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if(isEditingTitle) {
          handleUpdateTitle();
        } else {
          handleAddNewCard();
        }
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
    const handleCardDragStart = (e, cardId, columnId) => {
      e.dataTransfer.setData('cardId', cardId);
      e.dataTransfer.setData('columnId', columnId);
    };

    const onCardDrop = (e, targetCardId) => {
      const draggedCardId = e.dataTransfer.getData('cardId');
      const sourceColumnId = e.dataTransfer.getData('columnId');     
      const updatedCards = [...cards];   
      const targetCardIndex = updatedCards.findIndex(card => card.id === targetCardId);      
      const draggedCardIndex = updatedCards.findIndex(card => card.id === draggedCardId);   
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
    
    // const onCardDropColumn = (e, targetCardId, targetColumnId) => {
    //   const draggedCardId = e.dataTransfer.getData('cardId');
    //   const sourceColumnId = e.dataTransfer.getData('columnId');
    //   const sourceColumnCards = [...columns.find(col => col.id === sourceColumnId).cards];
    //   const targetColumnCards = [...columns.find(col => col.id === targetColumnId).cards];
    //   const draggedCard = sourceColumnCards.find(card => card.id === draggedCardId);
    //   const updatedSourceColumnCards = sourceColumnCards.filter(card => card.id !== draggedCardId);
    //   const targetCardIndex = targetColumnCards.findIndex(card => card.id === targetCardId);
    //       targetColumnCards.splice(targetCardIndex, 0, draggedCard);
    //   const updatedColumns = columns.map(col => {
    //     if (col.id === sourceColumnId) {
    //       return { ...col, cardsOrder: updatedSourceColumnCards.map(card => card.id), cards: updatedSourceColumnCards };
    //     } else if (col.id === targetColumnId) {
    //       return { ...col, cardsOrder: targetColumnCards.map(card => card.id), cards: targetColumnCards };
    //     }
    //     return col;
    //   });
    //   setColumns(updatedColumns); 
    // };

    const onCardDropColumn = (e, targetCardId, targetColumnId) => {
      const draggedCardId = e.dataTransfer.getData('cardId');
      const sourceColumnId = e.dataTransfer.getData('columnId');
      const sourceColumnCards = [...columns.find(col => col.id === sourceColumnId).cards];
      let targetColumnCards = [...(columns.find(col => col.id === targetColumnId).cards || [])];
      const draggedCard = sourceColumnCards.find(card => card.id === draggedCardId);
      const updatedSourceColumnCards = sourceColumnCards.filter(card => card.id !== draggedCardId);
        if (!targetColumnCards) {
          targetColumnCards = [];
        }
      // Tìm vị trí của thẻ mục tiêu trong cột đích, nếu không tìm thấy, giả định là cuối cột
      const targetCardIndex = targetCardId ? targetColumnCards.findIndex(card => card.id === targetCardId) : targetColumnCards.length;
        targetColumnCards.splice(targetCardIndex, 0, draggedCard);

      const updatedColumns = columns.map(col => {
        if (col.id === sourceColumnId) {
          return { ...col, cardsOrder: updatedSourceColumnCards.map(card => card.id), cards: updatedSourceColumnCards };
        } else if (col.id === targetColumnId) {
          return { ...col, cardsOrder: targetColumnCards.map(card => card.id), cards: targetColumnCards };
        }
        return col;
      });
      setColumns(updatedColumns);
    };
    
    const handleCardDrop = (e, targetCardId, targetColumnId) => {
      const sourceColumnId = e.dataTransfer.getData('columnId');
        if(sourceColumnId === targetColumnId) {
          onCardDrop(e, targetCardId);
        } else {
          onCardDropColumn(e, targetCardId, targetColumnId);
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
    const handleDragOver = (e) => {
      e.preventDefault(); 
    };
  
    return (
        <>
            <div className="column"   
              draggable="true"
              onDragStart={handleColumnDragStart}
              onDrop={handleColumnDrop} 
              onDragOver={handleDragOver} 
              >
              <header className="column-drap-handle">                
                  {isEditingTitle ? ( 
                      <Form.Control
                        size = {"sm"}
                        type = "text"
                        value = {titleColumn}
                        onChange={(event) => setTitleColumn(event.target.value)}
                        onBlur={handleUpdateTitle}
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                      />
                    ) : (
                      <div className='column-title' onClick={() => setIsEditingTitle(true)}>
                        {column.title}
                      </div>
                    )}
                <div className='column-dropdown'>          
                  <Dropdown>
                    <Dropdown.Toggle variant="" id="dropdown-basic" size='sm'>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setIsShowAddNewCard(true)}>Add card</Dropdown.Item>
                      <Dropdown.Item onClick={() => setIsEditingTitle(true)}>Edit Title</Dropdown.Item>
                      <Dropdown.Item onClick={togleModal}>Remove column</Dropdown.Item>                     
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </header>
              <div className="card-list" onDragOver={() => console.log('drag overrr')} onDrop={() => console.log('drop')}>
                {cards.map(card => {       
                  return (
                      <Card
                        key={card.id} 
                        card={card}   
                        onDragStart={handleCardDragStart}
                        onDrop={handleCardDrop}
                        onDragOver={handleDragOver}
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
                          <button className='btn btn-primary'
                              onClick={() => handleAddNewCard()} >Add card                     
                          </button>
                          <i className='fa fa-times icon' onClick={() => setIsShowAddNewCard(false)}></i>
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

