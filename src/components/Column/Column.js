import "./Column.scss";
import Card from "../Card/Card";
import { mapOrder } from "../../utilities/sorts";
import Dropdown from "react-bootstrap/Dropdown";
import ConfirmModal from "../Common/ConfirmModal";
import Form from "react-bootstrap/Form";
import { useState, useEffect, useRef } from "react";
import {
  MODAL_ACTION_CLOSE,
  MODAL_ACTION_CONFIRM,
} from "../../utilities/constant";
import { v4 as uuidv4 } from "uuid";

const Column = (props) => {
  const {
    column,
    columns,
    setColumns,
    onUpdateColumn,
    onColumnDragStart,
    onColumnDrop,
  } = props;
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
    if (isShowAddNewCard === true && textAreaRef && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isShowAddNewCard]);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (column && column.title) {
      setTitleColumn(column.title);
    }
  }, [column]);

  const togleModal = () => {
    setShowModalDelete(!isShowModalDelete);
  };
  const onModalAction = (type) => {
    if (type === MODAL_ACTION_CLOSE) {
      //do nothing
    }
    if (type === MODAL_ACTION_CONFIRM) {
      //remove
      const newColumn = {
        ...column,
        _destroy: true,
      };
      onUpdateColumn(newColumn);
    }
    togleModal();
  };

  const handleAddNewCard = () => {
    if (!valueTextArea) {
      textAreaRef.current.focus();
      return;
    }

    const newCard = {
      id: uuidv4(),
      boardId: column.boardId,
      columnId: column.id,
      title: valueTextArea,
      image: null,
    };

    let newColumn = { ...column };
    newColumn.cards = [...newColumn.cards, newCard];
    newColumn.cardsOrder = newColumn.cards.map((card) => card.id);

    onUpdateColumn(newColumn);
    setvalueTextArea("");
    setIsShowAddNewCard(false);
  };
  const handleUpdateTitle = () => {
    setIsEditingTitle(false);
    onUpdateColumn({ ...column, title: titleColumn });
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isEditingTitle) {
        handleUpdateTitle();
      } else {
        handleAddNewCard();
      }
    }
  };
  const handleColumnDragStart = (e) => {
    onColumnDragStart(e, column.id);
  };
  const handleCardDragStart = (e, cardId, columnId) => {
    e.dataTransfer.setData("cardId", cardId);
    e.dataTransfer.setData("columnId", columnId);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetCardId, targetColumnId) => {
    const draggedCardId = e.dataTransfer.getData("cardId");
    const sourceColumnId = e.dataTransfer.getData("columnId");
    const mouseY = e.clientY;
    const targetCardRect = e.target.getBoundingClientRect();
    const targetCardCenterY = targetCardRect.top + targetCardRect.height / 2;

    if (!draggedCardId) {
      onColumnDrop(e, column.id);
    } else if (sourceColumnId === targetColumnId) {
      const updatedCards = [...cards];
      const draggedCardIndex = updatedCards.findIndex(
        (card) => card.id === draggedCardId
      );
      const targetCardIndex = updatedCards.findIndex(
        (card) => card.id === targetCardId
      );
      // if (targetCardIndex === -1) return;
      const draggedCard = updatedCards[draggedCardIndex];

      // if( mouseY < targetCardCenterY && draggedCardIndex < targetCardIndex ) {
      //   return
      // }

      const insertIndex =
        mouseY < targetCardCenterY ? targetCardIndex : targetCardIndex ;
        // mouseY < targetCardCenterY ? targetCardIndex 
        // : draggedCardIndex < targetCardIndex 
        //  ?targetCardIndex:targetCardIndex + 1 ;

        updatedCards.splice(draggedCardIndex, 1);
        updatedCards.splice(insertIndex, 0, draggedCard);
      const updatedColumns = columns.map((col) => {
        if (col.id === sourceColumnId) {
          return {
            ...col,
            cardsOrder: updatedCards.map((card) => card.id),
            cards: updatedCards,
          };
        }
        return col;
      });
      setColumns(updatedColumns);
    } else {
      const sourceColumnCards = [
        ...columns.find((col) => col.id === sourceColumnId).cards,
      ];
      const targetColumn = columns.find((col) => col.id === targetColumnId);
      // console.log(columns)
      const targetColumnCards = [...targetColumn.cards];
      // console.log("check", targetColumnCards);
      const draggedCard = sourceColumnCards.find(
        (card) => card.id === draggedCardId
      );
      const targetCardIndex = targetColumnCards.findIndex(
        (card) => card.id === targetCardId
      );
      if (targetColumnCards.length === 0) {
        // console.log("66666666")
        targetColumnCards.push(draggedCard);
      } else {
        const insertIndex =
          mouseY < targetCardCenterY ? targetCardIndex : targetCardIndex + 1;
          targetColumnCards.splice(insertIndex, 0, draggedCard);
        // console.log("check here", targetColumnCards);
      }
      const updatedSourceColumnCards = sourceColumnCards.filter(
        (card) => card.id !== draggedCardId
      );
      const updatedColumns = columns.map((col) => {
        if (col.id === sourceColumnId) {
          // console.log("1111",{
          //   ...col,
          //   cardsOrder: updatedSourceColumnCards.map((card) => card.id),
          //   cards: updatedSourceColumnCards,
          // } )
          return {
            ...col,
            cardsOrder: updatedSourceColumnCards.map((card) => card.id),
            cards: updatedSourceColumnCards,
          };
        } else if (col.id === targetColumnId) {
          // console.log(targetColumnCards);
          return {
            ...col,
            cardsOrder: targetColumnCards.map((card) => card.id),
            cards: [...targetColumnCards],
          };
        }
        return col;
      });
      // console.log("updatedColumns", updatedColumns)
      setColumns(updatedColumns);
    }
  };

  const handleColumnDrop = (e) => {
    e.preventDefault();
    // console.log('23245435')
    handleDrop(e, null, column.id);

  };
  const handleCardDropColumn = (e, targetCardId, targetColumnId) => {
    // console.log('334434556')
    e.stopPropagation();
    handleDrop(e, targetCardId, targetColumnId);
  };
  const handleUpdateCardTitle = (cardId, newTitle) => {
    const updatedColumns = columns.map((column) => {
      const updatedCards = column.cards.map((card) => {
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
      <div
        className="column"
        draggable="true"
        onDragStart={handleColumnDragStart}
        onDrop={handleColumnDrop}
        onDragOver={handleDragOver}
      >
        <header className="column-drap-handle">
          {isEditingTitle ? (
            <Form.Control
              size={"sm"}
              type="text"
              value={titleColumn}
              onChange={(event) => setTitleColumn(event.target.value)}
              onBlur={handleUpdateTitle}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
          ) : (
            <div
              className="column-title"
              onClick={() => setIsEditingTitle(true)}
            >
              {column.title}
            </div>
          )}
          <div className="column-dropdown">
            <Dropdown>
              <Dropdown.Toggle
                variant=""
                id="dropdown-basic"
                size="sm"
              ></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setIsShowAddNewCard(true)}>
                  Add card
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setIsEditingTitle(true)}>
                  Edit Title
                </Dropdown.Item>
                <Dropdown.Item onClick={togleModal}>
                  Remove column
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>
        <div
          className="card-list"
          onDragOver={() => console.log("drag overrr")}
        >
          {cards.map((card) => {
            return (
              <Card
                key={card.id}
                card={card}
                columnId={column.id}
                onDragStart={handleCardDragStart}
                onDrop={handleCardDropColumn}
                onDragOver={handleDragOver}
                onUpdateCardTitle={handleUpdateCardTitle}
              />
            );
          })}
          {isShowAddNewCard === true && (
            <div className="add-new-card">
              <textarea
                rows="2"
                className="form-control"
                placeholder="Enter a title for this card..."
                ref={textAreaRef}
                value={valueTextArea}
                onChange={(event) => setvalueTextArea(event.target.value)}
                onKeyDown={handleKeyDown}
              ></textarea>
              <div className="group-btn">
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddNewCard()}
                >
                  Add card
                </button>
                <i
                  className="fa fa-times icon"
                  onClick={() => setIsShowAddNewCard(false)}
                ></i>
              </div>
            </div>
          )}
        </div>
        {isShowAddNewCard === false && (
          <footer>
            <div
              className="footer-action"
              onClick={() => setIsShowAddNewCard(true)}
            >
              <i className="fa fa-plus icon"></i>Add card
            </div>
          </footer>
        )}
      </div>
      <ConfirmModal
        show={isShowModalDelete}
        title={"remove a column"}
        content={`are you sure to remove this column: <b>${column.title}</b> `}
        onAction={onModalAction}
      />
    </>
  );
};

export default Column;
