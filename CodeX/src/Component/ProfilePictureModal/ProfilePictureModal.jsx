import React from "react";

const ProfilePictureModal = ({
  isOpen,
  onClose,
  picture,
  onImageChange,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 font-serif bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Profile Picture</h2>
        <img
          src={picture || ""}
          alt="Profile Preview"
          className="w-64 h-74 rounded-lg rounded-full"
          style={{ marginLeft: "60px" }}
        />
        <div className="flex">
          <input
            type="file"
            accept="image/*"
            className="block text-gray-600 mt-7 w-full object-cover"
            onChange={onImageChange}
          />
          <button
            className="bg-green-600 text-white rounded-md mt-5"
            style={{ width: "100px", height: "40px" }}
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
