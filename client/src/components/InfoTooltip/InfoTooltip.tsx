interface InfoTooltipProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
}

function InfoTooltip({ isOpen, onClose, isSuccess }: InfoTooltipProps) {
  return (
    <div className={`popup ${isOpen ? 'popup_is-opened' : ''}`}>
      {/* 1. Recycled .popup__content to grab your white background, border-radius, and max-width */}
      <div className="popup__content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* 2. Recycled .popup__close to use your existing background image and positioning */}
        <button 
          type="button" 
          className="popup__close" 
          onClick={onClose}
          aria-label="Cerrar modal"
        ></button>
        
        {/* 3. Bound the SVGs strictly to 120px so global rules can't stretch them */}
        {isSuccess ? (
          <svg style={{ width: '120px', height: '120px', flexShrink: 0 }} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="58" stroke="#000000" strokeWidth="4"/>
            <path d="M35 60L55 80L85 40" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg style={{ width: '120px', height: '120px', flexShrink: 0 }} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="58" stroke="#FF0000" strokeWidth="4"/>
            <path d="M40 40L80 80M80 40L40 80" stroke="#FF0000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        
        {/* 4. Recycled .popup__title but forced it to center explicitly */}
        <h2 className="popup__title" style={{ marginTop: '32px', textAlign: 'center' }}>
          {isSuccess 
            ? "¡Correcto! Ya estás registrado." 
            : "Uy, algo salió mal. Por favor, inténtalo de nuevo."}
        </h2>
      </div>
    </div>
  );
}

export default InfoTooltip;