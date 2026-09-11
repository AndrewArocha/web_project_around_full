import React, { useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import type { PopupConfig, CardData } from '../../types/types';

// Component Imports
import Popup from '../Popup/Popup';
import EditProfile from '../Popup/EditProfile/EditProfile';
import NewCard from '../Popup/NewCard/NewCard';
import EditAvatar from '../Popup/EditAvatar/EditAvatar';
import Card from '../Card/Card';
import RemoveCard from '../Popup/RemoveCard/RemoveCard';

// Define the props coming down from App.tsx
type MainProps = {
  cards: CardData[];
  handleOpenPopup: (popup: PopupConfig) => void;
  handleClosePopup: () => void;
  popup: PopupConfig | null;
  onCardLike: (card: CardData) => void;
  onCardDelete: (card: CardData) => void;
};

export default function Main(props: MainProps): React.JSX.Element {
  const { cards, handleOpenPopup, handleClosePopup, popup, onCardLike, onCardDelete } = props;

  // Consume the global user data
  const { currentUser } = useContext(CurrentUserContext);

  // Configuration objects for the forms
  const editProfilePopup: PopupConfig = {
    title: 'Editar perfil',
    children: <EditProfile />,
  };

  const newCardPopup: PopupConfig = {
    title: 'Nuevo lugar',
    children: <NewCard />,
  };

  const editAvatarPopup: PopupConfig = {
    title: 'Cambiar foto de perfil',
    children: <EditAvatar />,
  };

  const handleDeleteClick = (card: CardData) => {
    const removeCardPopupConfig: PopupConfig = {
      title: '¿Estás seguro/a?',
      children: (
        <RemoveCard
          onSubmit={(e) => {
            e.preventDefault();
            // Just fire the delete function. App.tsx will take it from here!
            if (onCardDelete) onCardDelete(card);
          }}
        />
      )
    };
    handleOpenPopup(removeCardPopupConfig);
  };

  return (
    <main className="content">
      <section className="profile page__section">
        <div className="profile__avatar-container" onClick={() => handleOpenPopup(editAvatarPopup)}>
          <img className={`profile__image ${!currentUser ? 'loading-skeleton' : ''}`} src={currentUser?.avatar} alt={currentUser?.name || "Avatar"} />
          <div className="profile__avatar-overlay">
            <button aria-label="Editar foto de perfil" className="profile__image-edit-button" type="button"></button>
          </div>
        </div>

        <div className="profile__info">
          <h1 className={`profile__title ${!currentUser ? 'loading-skeleton' : ''}`}>
            {currentUser?.name}
          </h1>
          <button
            aria-label="Editar perfil"
            className="profile__edit-button"
            type="button"
            onClick={() => handleOpenPopup(editProfilePopup)}
          ></button>
          <p className={`profile__description ${!currentUser ? 'loading-skeleton' : ''}`}>
            {currentUser?.about}
          </p>
        </div>

        <button
          aria-label="Agregar tarjeta"
          className="profile__add-button"
          type="button"
          onClick={() => handleOpenPopup(newCardPopup)}
        ></button>
      </section>

      <section className="cards page__section">
        <ul className="cards__list">
          {cards?.map((card) => (
            <Card key={card._id} card={card} onCardClick={handleOpenPopup} onCardLike={onCardLike} onCardDelete={handleDeleteClick} />
          ))}
        </ul>
      </section>

      {popup && (
        <Popup
          onClose={handleClosePopup}
          title={popup.title}
          isOpen={popup !== null}
        >
          {popup.children}
        </Popup>
      )}
    </main>
  );
}