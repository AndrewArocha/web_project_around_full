import React, { useState, useContext } from 'react';
import CurrentUserContext from '../../../contexts/CurrentUserContext';

export default function EditProfile(): React.JSX.Element {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);
  
  // Initialize state with the user's data (or empty strings as a fallback)
  const [name, setName] = useState(currentUser?.name || '');
  const [description, setDescription] = useState(currentUser?.about || '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdateUser({ name, about: description });
  };

  return (
    <form className="popup__form" id="edit-profile-form" name="edit-profile-form" onSubmit={handleSubmit} noValidate>
      <input 
        className="popup__input popup__input_type_name" 
        name="name" 
        placeholder="Nombre" 
        type="text" 
        required 
        minLength={2} 
        maxLength={40} 
        value={name} // <-- Tied to state!
        onChange={(e) => setName(e.target.value)} // <-- Updates state on every keystroke!
      />
      <span id="name-error" className="popup__input-error"></span>
      
      <input 
        className="popup__input popup__input_type_description" 
        name="description" 
        placeholder="Acerca de mí" 
        type="text" 
        required 
        minLength={2} 
        maxLength={200} 
        value={description} // <-- Tied to state!
        onChange={(e) => setDescription(e.target.value)} 
      />
      <span id="description-error" className="popup__input-error"></span>
      
      <button className="button popup__button" type="submit">Guardar</button>
    </form>
  );
}