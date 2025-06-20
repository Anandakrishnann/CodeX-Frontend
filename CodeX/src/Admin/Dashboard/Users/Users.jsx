import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar.jsx";
import { adminAxios } from "../../../../axiosConfig.js";
import { toast } from "react-toastify";
import Table from "../../Components/Table/Table.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Layout from "../Layout/Layout";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminAxios.get("list_users/");
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error.response || error);
      }
    };

    fetchUsers();
  }, []);

  const toggle_status = async (e, userId) => {
    e.preventDefault();

    try {
      await adminAxios.post("status/", { id: userId });
      toast.success("Status Changed Successfully");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: !user.status } : user
        )
      );
    } catch (error) {
      toast.error("User not Found");
      console.error("Error:", error);
    }
  };

  const columns = [
    "ID",
    "First Name",
    "Last Name",
    "Email",
    "Leetcode ID",
    "Phone",
    "Status",
    "Actions",
  ];

  return (
    <Layout>
      <Table
        datas={users}
        fucntions={toggle_status}
        columns={columns}
        name={"Users"}
      />
    </Layout>
  );
};

export default Users;
