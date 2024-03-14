

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
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [valueTextArea, setvalueTextArea] = useState("");
    const [titleColumn, setTitleColumn] = useState("");
    const textAreaRef = useRef(null);
    const inputRef = useRef(null);
    const [cards, setCards] = useState(column.cards || []);
 
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
        setIsDraggingOver(false)
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

    // const handleCardDrop = (e, targetCardId) => {
    //   const draggedCardId = e.dataTransfer.getData('cardId');
    //   const sourceColumnId = e.dataTransfer.getData('columnId');
    //   const updatedCards = [...cards];
    //   const targetCardIndex = updatedCards.findIndex(card => card.id === targetCardId);
    //   const draggedCardIndex = updatedCards.findIndex(card => card.id === draggedCardId);
    //   if (draggedCardIndex > -1) {
    //     const draggedCard = updatedCards[draggedCardIndex];
    //     updatedCards.splice(draggedCardIndex, 1);
    //     if (draggedCardIndex < targetCardIndex) {
    //       updatedCards.splice(targetCardIndex - 1, 0, draggedCard);
    //     } else {
    //       updatedCards.splice(targetCardIndex + 1, 0, draggedCard);
    //     }
    //   }
    //   setCards(updatedCards);
    //   const updatedColumns = columns.map(col => {
    //     if (col.id === sourceColumnId) {
    //       return { ...col, cardsOrder: updatedCards.map(card => card.id), cards: updatedCards };
    //     }
    //     return col;
    //   });
      
    //   setColumns(updatedColumns);
    // };
    
    const handleCardDropColumn = (e, targetCardId, targetColumnId) => {
      const draggedCardId = e.dataTransfer.getData('cardId');
      console.log('3123541', draggedCardId)
      const sourceColumnId = e.dataTransfer.getData('columnId');
      console.log('5432776', sourceColumnId)
      const sourceColumnCards = [...columns.find(col => col.id === sourceColumnId).cards];
      console.log('======>', sourceColumnCards)
      const targetColumnCards = [...columns.find(col => col.id === targetColumnId).cards];
      console.log('------>', targetColumnCards)
      const draggedCard = sourceColumnCards.find(card => card.id === draggedCardId);
      const updatedSourceColumnCards = sourceColumnCards.filter(card => card.id !== draggedCardId);
      const targetCardIndex = targetColumnCards.findIndex(card => card.id === targetCardId);
        if (targetCardIndex === -1) {
          // Nếu thẻ mục tiêu không tồn tại trong cột đích, thêm thẻ được kéo vào cuối cột đích.
          
          targetColumnCards.push(draggedCard);
        } else {
          targetColumnCards.splice(targetCardIndex, 0, draggedCard);
        }

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
    // const onCardDropColumn = (e, targetCardId, targetColumnId) => {
    //   const draggedCardId = e.dataTransfer.getData('cardId');
    //   const sourceColumnId = e.dataTransfer.getData('columnId');
    //   const sourceColumn = columns.find(col => col.id === sourceColumnId);
    //   const targetColumn = columns.find(col => col.id === targetColumnId);
      
    //   // Kiểm tra và tạo danh sách thẻ mới nếu cột đích chưa có danh sách
    //   if (!targetColumn.cards) {
    //     targetColumn.cards = [];
    //   }
    
    //   const draggedCard = sourceColumn.cards.find(card => card.id === draggedCardId);
    //   const updatedSourceColumnCards = sourceColumn.cards.filter(card => card.id !== draggedCardId);
    
    //   // Thêm thẻ được kéo vào danh sách thẻ của cột đích
    //   targetColumn.cards.push(draggedCard);
    
    //   // Cập nhật cột nguồn và cột đích trong danh sách cột
    //   const updatedColumns = columns.map(col => {
    //     if (col.id === sourceColumnId) {
    //       return { ...col, cardsOrder: updatedSourceColumnCards.map(card => card.id), cards: updatedSourceColumnCards };
    //     } else if (col.id === targetColumnId) {
    //       return { ...col, cardsOrder: targetColumn.cards.map(card => card.id), cards: targetColumn.cards };
    //     }
    //     return col;
    //   });
    
    //   setColumns(updatedColumns);
    // };
    
    const onCardDrop = (e, targetCardId, targetColumnId) => {
      console.log('check in here')
      const sourceColumnId = e.dataTransfer.getData('columnId');
      if(sourceColumnId === targetColumnId) {
        console.log('1111')
        handleCardDrop(e, targetCardId);
      } else {
        console.log('22222')

        handleCardDropColumn(e, targetCardId, targetColumnId);
      }
      setIsDraggingOver(false)
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
      e.preventDefault(); // Ngăn chặn hành động mặc định của trình duyệt
      // e.stopPropagation(); // Ngăn chặn sự kiện lây lan đến các phần tử cha
      setIsDraggingOver(true); 
    };
    
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);
    };
  
    return (
        <>
            <div className="column"            
              style={{ borderTop: isDraggingOver ? '3px solid rgb(61, 110, 159)' : 'none' }}
              // {`column ${isDraggingOver ? 'drag-over' : ''}`} 
              draggable="true"
              onDragStart={handleColumnDragStart}
              onDrop={handleColumnDrop} 
              onDragOver={handleDragOver} 
              onDragLeave={handleDragLeave} >
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
              <div className="card-list" onDragOver={() => console.log('drag overrr')}>
                {cards.map(card => {       
                  return (
                      <Card
                        key={card.id} 
                        card={card}   
                        onCardDragStart={onCardDragStart}
                        onCardDrop={onCardDrop}
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

