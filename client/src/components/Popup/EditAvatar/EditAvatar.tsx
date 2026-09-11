import React, { useRef, useContext } from 'react';
import CurrentUserContext from '../../../contexts/CurrentUserContext';

export default function EditAvatar(): React.JSX.Element {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);
  

  const avatarRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (avatarRef.current) {
      handleUpdateAvatar({ avatar: avatarRef.current.value });
    }
  };

  return (
    <form className="popup__form" id="avatar-profile-form" name="avatar-profile-form" onSubmit={handleSubmit} noValidate>
      <input 
        className="popup__input popup__input_type_url" 
        name="avatar" 
        id="avatar" 
        placeholder="Enlace a la nueva imagen de perfil" 
        required 
        type="url" 
        ref={avatarRef} // 
      />
      <span id="avatar-error" className="popup__input-error"></span>
      
      <button className="button popup__button" type="submit">Guardar</button>
    </form>
  );
}