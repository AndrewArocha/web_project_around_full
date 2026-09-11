import React, { useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext'; 
import type { CardData, PopupConfig } from '../../types/types';
import ImagePopup from '../Popup/ImagePopup/ImagePopup';

type CardProps = {
  card: CardData;
  onCardClick: (popup: PopupConfig) => void;
  onCardLike?: (card: CardData) => void;
  onCardDelete?: (card: CardData) => void;
};

export default function Card(props: CardProps): React.JSX.Element {
  const { card, onCardClick, onCardLike, onCardDelete } = props;
  
  const { currentUser } = useContext(CurrentUserContext);

  const isOwn = card.owner === currentUser?._id;

  const cardDeleteButtonClassName = (
    `card__delete-button ${isOwn ? 'card__delete-button_visible' : 'card__delete-button_hidden'}`
  );

  const displayName = card.name || 'Sin título';
  const displayLink = card.link || 'https://via.placeholder.com/150';

  const likeButtonClassName = `card__like-button ${
    card.isLiked ? 'card__like-button_is-active' : ''
  }`;

  const handleImageClick = () => {
    onCardClick({
      children: <ImagePopup card={card} />
    });
  };

  return (
    <li className="card">
      <img 
        className="card__image" 
        src={displayLink} 
        alt={displayName} 
        onClick={handleImageClick}
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Imagen+Roto';
        }} 
      />
      
      <button 
        aria-label="Eliminar tarjeta" 
        className={cardDeleteButtonClassName} 
        type="button" 
        onClick={(e) => {
          e.stopPropagation();
          if (onCardDelete) onCardDelete(card);
        }}
      />
      
      <div className="card__description">
        <h2 className="card__title">{displayName}</h2>
        <button 
          aria-label="Botón Me gusta" 
          type="button" 
          className={likeButtonClassName} 
          onClick={() => onCardLike && onCardLike(card)}
        />
      </div>
    </li>
  );
}