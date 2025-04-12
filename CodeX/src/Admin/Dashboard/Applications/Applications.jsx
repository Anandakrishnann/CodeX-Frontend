import React, { useEffect, useState, version } from "react";
import { adminAxios } from "../../../../axiosConfig.js";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate } from "react-router-dom"; 
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Layout from "../Layout/Layout";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await adminAxios.get("list_applicaions/");
        console.log(response);

        setApplications(response.data || []); // Directly setting response.data
      } catch (error) {
        console.error("Error fetching applications:", error.response || error);
      }
    };

    fetchApplications();
  }, []);

  const columns = ["ID", "Name", "Email", "Phone", "Status", "Actions"];

  return (
    <Layout>
      <div className="gridgap-2">
          <div className="row-span-1 bg-black p-4 rounded-lg">
            <h2 className="text-4xl font-extrabold mb-6">Applications</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
              <table className="min-w-full border-collapse border border-gray-300">
                {/* Table Header */}
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
                  {applications.length > 0 ? (
                    applications.map((application, index) => (
                      <tr
                        key={application.id}
                        className={`border-b border-gray-300 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-200 transition`}
                      >
                        <td className="p-4 text-md font-extrabold text-gray-800">
                          {application.id}
                        </td>
                        <td className="p-4 text-md font-extrabold text-gray-800">
                          {application.full_name}
                        </td>
                        <td className="p-4 text-md font-extrabold text-gray-800">
                          {application.email}
                        </td>
                        <td className="p-4 text-md font-extrabold text-gray-800">
                          {application.phone}
                        </td>
                        <td className="p-4">
                          {application.status === "pending" ? (
                            
                            <span className="px-3 py-1 pb-2 text-white bg-yellow-500 rounded-full">
                              <AccessTimeIcon />
                            </span>
                          ) : application.status === "verified" ? (
                            <span className="px-3 py-1 pb-2 text-white bg-green-500 rounded-full">
                              <TaskAltIcon />
                            </span>
                          ) : application.status === "rejected" ? (
                            <span className="px-3 py-1 pb-2 text-white bg-red-500 rounded-full">
                              <CancelIcon />
                            </span>
                          ):null}
                        </td>
                        <td className="p-4 flex space-x-3">
                          {/* <button
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                          >
                            <EditIcon />
                          </button> */}
                          {/* {user.status === false ? (
                        <button
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          onClick={(e) => toggleStatus(e, user.id)}
                        >
                          <DeleteForeverIcon />
                        </button>
                      ) : (
                        <button
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-900 transition"
                          onClick={(e) => toggleStatus(e, user.id)}
                        >
                          <RestoreFromTrashIcon />
                        </button>
                      )} */}
                      <Link to={`/admin/application-view/${application.id}`}>
                        <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-900 transition">
                          <VisibilityIcon />
                        </button>
                      </Link>
                      
                        </td>
                    
                      </tr>
                      
                    ))
                    
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="p-4 text-center text-gray-600"
                      >
                        No applications found
                      </td>
                    </tr>
                  )}
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </Layout>
  );
};

export default Applications;
