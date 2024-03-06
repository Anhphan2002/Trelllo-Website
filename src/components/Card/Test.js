
import { useState } from 'react';
import React from 'react';
import './Card.scss';

const Card = (props) => {
    const { card, onCardDragStart, onCardDrop, onDragOver, columnId, onUpdateCardTitle } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(card.title);
    
    const handleCardDragStart = (e) => {
        onCardDragStart(e, card.id, columnId);
    };
    const handleCardDrop = (e) => {
        onCardDrop(e, card.id, columnId);
    };

    const handleTitleChange = (e) => {
        setNewTitle(e.target.value);
    };

    const handleEditTitle = () => {
        setIsEditing(true);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onUpdateCardTitle(card.id, newTitle);
            setIsEditing(false);
        }
    };
    const handleFocusOut = () => {
        onUpdateCardTitle(card.id, newTitle);
        setIsEditing(false);
    };
    return (
        <>
            <li 
                className="card-item"
                draggable="true"
                onDragStart={handleCardDragStart}
                onDrop={handleCardDrop}
                onDragOver={onDragOver} 
            >
                {isEditing ?(
                    <input
                        type='text'
                        value={newTitle}
                        onChange={handleTitleChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleFocusOut} 
                        autoFocus
                    />
                    ) : (
                        <div className="card-title-container">
                            <span className="card-title">{card.title}</span>
                                <button onClick={handleEditTitle}>
                                    <i class="fa fa-pencil" aria-hidden="true"></i>
                                </button>
                        </div>
                    )}
            </li>
        </>
    )
}
export default Card;
