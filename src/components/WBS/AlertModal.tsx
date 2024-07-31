  import React, { useState } from 'react';

const AlertModal = ({ isOpened, message, onClose}: any) => {
   if (!isOpened) return null;

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="fixed inset-x-0 flex items-center justify-center z-50">
            <div className="bg-gray-300 p-4 rounded-lg shadow-md w-1/4">
          <p>{message}</p>
          <button
            className="mt-4 bg-gray-100 text-black-500 px-4 py-2 rounded hover:bg-gray-500"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    );
}

export default AlertModal;