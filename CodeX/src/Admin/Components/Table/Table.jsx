import React, { useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from "react-router-dom";
import EditUserModal from "../../../Component/EditModal/EditUserModal";

const Table = ({ datas, fucntions, columns, name }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdate = (updatedUser) => {
    // Updating the local table state with the new user data
    setSelectedUser(updatedUser);
  };

  return (
    <div className="grid">
      <div className="row-span-1 bg-black p-2 rounded-lg">
        <h2 className="text-4xl font-extrabold mb-6 bg-black w-full mt-0" >{name}</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg ">
          <table className="min-w-full border-collapse border border-gray-300">
            {/* Dynamic Table Header */}
            <thead className="bg-gray-100">
              <tr className="text-gray-700 text-left border-b border-gray-300">
                {columns.map((col, index) => (
                  <th key={index} className="p-3 text-md font-extrabold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {datas.length > 0 ? (
                datas.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-gray-300 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-200 transition`}
                  >
                    <td className="p-4 text-md font-extrabold text-gray-800">{user.id}</td>
                    <td className="p-4 text-md font-extrabold text-gray-800">{user.first_name}</td>
                    <td className="p-4 text-md font-extrabold text-gray-800">{user.last_name}</td>
                    <td className="p-4 text-md font-extrabold text-gray-800">{user.email}</td>
                    <td className="p-4 text-md font-extrabold text-gray-800">{user.leetcode_id}</td>
                    <td className="p-4 text-md font-extrabold text-gray-800">{user.phone}</td>
                    <td className="p-4">
                      {user.status === false ? (
                        <span className="px-3 py-1 pb-2 text-white bg-green-500 rounded-full">
                          <TaskAltIcon />
                        </span>
                      ) : (
                        <span className="px-3 py-1 pb-2 text-white bg-red-500 rounded-full">
                          <CancelIcon />
                        </span>
                      )}
                    </td>
                    <td className="p-4 flex space-x-3">
                      
                      {user.status === false ? (
                        <button
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          onClick={(e) => fucntions(e, user.id)}
                        >
                          <DeleteForeverIcon />
                        </button>
                      ) : (
                        <button
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-900 transition"
                          onClick={(e) => fucntions(e, user.id)}
                        >
                          <RestoreFromTrashIcon />
                        </button>
                      )}
                      {user.role === "tutor" ? (
                        <Link to={`/admin/tutor-view/${user.email}`}>
                          <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-900 transition">
                            <VisibilityIcon />
                          </button>
                        </Link>
                      ) : (
                        <button className="hover:bg-gray-200"></button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-4 text-center text-gray-600">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={handleModalClose}
          onUpdate={handleUserUpdate}
        />
      )}
    </div>
  );
};

export default Table;
