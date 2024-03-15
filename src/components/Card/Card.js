import React from "react";
import { useState } from "react";
import DetailModal from "../Common/DetailModal";
import "./Card.scss";

const Card = (props) => {
  const { card, onDragStart, onDrop, onDragOver, columnId, onUpdateCardTitle } =
    props;
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newTitle, setNewTitle] = useState(card.title);

  const handleCardDragStart = (e) => {
    console.log("handleCardDragStart =>>>");
    onDragStart(e, card.id, columnId);
  };
  const handleCardDrop = (e) => {
    console.log("handleCardDrop =>>>");
    onDrop(e, card.id, columnId);
    setIsDragging(false);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleEditTitle = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onUpdateCardTitle(card.id, newTitle);
      setIsEditing(false);
    }
  };
  const handleFocusOut = () => {
    onUpdateCardTitle(card.id, newTitle);
    setIsEditing(false);
  };
  const handleDragOver = (e) => {
    onDragOver(e);
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  const handleCardItemClick = () => {
    setShowDetailModal(true);
  };
  const handleCloseModal = () => {
    setShowDetailModal(false);
  };

  return (
    <>
      <li
        className={`card-item ${isDragging ? "dragging" : ""}`}
        draggable="true"
        onDragStart={handleCardDragStart}
        onDrop={handleCardDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
      >
        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleFocusOut}
            autoFocus
          />
        ) : (
          <div className="card-title-container">
            <span className="card-title" onClick={handleCardItemClick}>
              {card.title}
            </span>

            <button onClick={handleEditTitle}>
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            </button>
          </div>
        )}
      </li>
      <DetailModal
        show={showDetailModal}
        title={card.title}
        onClose={handleCloseModal}
      />
    </>
  );
};
export default Card;
