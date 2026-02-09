const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>{title}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            color: 'var(--text-secondary)',
                            fontSize: '1.5rem',
                            padding: '0 0.5rem'
                        }}
                    >
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
