import React from 'react';

const DeleteModal = ({ isOpen, onClose, onDelete }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-md w-1/4">
                <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
                <p>Are you sure to delete all Strategies?</p>
                <div className="flex justify-end mt-4">
                    <button
                        className="px-4 py-2  text-black rounded-md   mr-2"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                    <button
                        className="px-4 py-2  text-gray-700 rounded-md "
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;