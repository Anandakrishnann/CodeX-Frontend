import React, { useState, useEffect } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link, useNavigate } from "react-router-dom";
import EditUserModal from "../../../Component/EditModal/EditUserModal";
import { useDispatch } from "react-redux";
import { setTutorId } from "../../../redux/slices/userSlice";
import { Search } from "lucide-react";

const Table = ({ datas, fucntions, columns, name }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleNavigate = (id) => {
    dispatch(setTutorId(id));
    navigate("/admin/tutor-view/");
  };

  const filteredUsers = datas.filter((item) => {
    if (searchQuery.trim() === "") return true;

    const lower = searchQuery.toLocaleLowerCase();
    const phoneString = item.phone ? item.phone.toString() : "";

    return (
      item.first_name.toLocaleLowerCase().includes(lower) ||
      item.last_name.toLocaleLowerCase().includes(lower) ||
      item.email.toLocaleLowerCase().includes(lower) ||
      phoneString.includes(lower)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedApps = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="grid">
      <div className="row-span-1 bg-black p-2 rounded-lg">
        <h2 className="text-5xl font-extrabold mb-6 bg-black w-full mt-0 text-white">
          {name}
        </h2>

        <div className="flex-1 max-w-md mb-4 mt-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-white p-2 pl-10 rounded-md text-black focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg ">
          <table className="min-w-full border-collapse border border-gray-300">
            {/* Dynamic Table Header */}
            <thead className="bg-gray-100">
              <tr className="text-black text-left border-b border-gray-300">
                {columns.map((col, index) => (
                  <th key={index} className="p-3 text-md font-extrabold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {paginatedApps.length > 0 ? (
                paginatedApps.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-gray-300 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-200 transition`}
                  >
                    <td className="p-4 text-md font-extrabold text-gray-800">
                      {user.id}
                    </td>
                    <td className="p-4 text-md font-extrabold text-gray-800">
                      {user.first_name}
                    </td>
                    <td className="p-4 text-md font-extrabold text-gray-800">
                      {user.last_name}
                    </td>
                    <td className="p-4 text-md font-extrabold text-gray-800">
                      {user.email}
                    </td>
                    {user.phone ? (
                      <td className="p-4 text-md font-extrabold text-gray-800">
                        {user.phone}
                      </td>
                    ) : (
                      <td className="p-4 text-md font-extrabold text-gray-800">
                        Google Verified
                      </td>
                    )}
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
                        <button
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-900 transition"
                          onClick={() => handleNavigate(user.id)}
                        >
                          <VisibilityIcon />
                        </button>
                      ) : (
                        <button className="hover:bg-gray-200"></button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-4 text-center text-gray-600"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg bg-white text-black disabled:opacity-40"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-bold ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg bg-white text-black disabled:opacity-40"
              >
                Next
              </button>
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
