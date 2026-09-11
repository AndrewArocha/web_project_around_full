import React, { useState, useContext } from 'react';
import CurrentUserContext from '../../../contexts/CurrentUserContext';

export default function NewCard(): React.JSX.Element {
  const { handleAddPlaceSubmit } = useContext(CurrentUserContext);
  
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAddPlaceSubmit({ name, link });
  };

  return (
    <form className="popup__form" id="new-card-form" name="new-card-form" onSubmit={handleSubmit} noValidate>
      <input 
        className="popup__input popup__input_type_card-name" 
        name="place-name" 
        placeholder="Título" 
        required 
        type="text" 
        minLength={2} 
        maxLength={30} 
        value={name} 
        onChange={(e) => setName(e.target.value)}
      />
      <span id="place-name-error" className="popup__input-error"></span>
      
      <input 
        className="popup__input popup__input_type_url" 
        name="link" 
        placeholder="Enlace a la imagen" 
        required 
        type="url" 
        value={link} 
        onChange={(e) => setLink(e.target.value)}
      />
      <span id="link-error" className="popup__input-error"></span>
      
      <button className="button popup__button" type="submit">Crear</button>
    </form>
  );
}