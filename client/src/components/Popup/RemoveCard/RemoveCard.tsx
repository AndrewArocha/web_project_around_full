import React from 'react';

type RemoveCardProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function RemoveCard({ onSubmit }: RemoveCardProps): React.JSX.Element {
  return (
    <form id="remove-card-form" className="popup__form" onSubmit={onSubmit} noValidate>
      <button className="button popup__button" type="submit">Sí</button>
    </form>
  );
}