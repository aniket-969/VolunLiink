import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
        <p>Are you sure you want to delete this post permanently?</p>
        <div className="mt-4">
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 mr-2">Yes, Delete</button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
