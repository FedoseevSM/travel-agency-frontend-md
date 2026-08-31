import { useState } from 'react';
import { createPortal } from 'react-dom';

const ActivatedModal = ({ onClose }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the input value (e.g., validate, send to server, etc.)
    console.log('Activated Commercial License:', inputValue);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Activate Commercial License</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Enter your license key"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Ok
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ActivatedModal;