const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[1000] transition-colors duration-300" 
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg p-6 mx-4 animate-in fade-in zoom-in-95 duration-200 transition-colors duration-300" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 transition-colors duration-300">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white m-0 transition-colors duration-300">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>
                {/* The inputs from Inventory.jsx and Warehouses.jsx will render here */}
                {children}
            </div>
        </div>
    );
};

export default Modal;