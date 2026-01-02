import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar.jsx";
import { adminAxios } from "../../../../axiosConfig.js";
import { toast } from "react-toastify";
import Table from "../../Components/Table/Table.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Layout from "../Layout/Layout";
import { useSelector } from "react-redux";
import Loading from "@/User/Components/Loading/Loading";
import Swal from "sweetalert2";

const Users = () => {
  const tutor = useSelector((state) => state.user.role);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await adminAxios.get("list-users/");
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [tutor]);

  const toggle_status = async (e, userId) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Change Status?",
      text: "Are you sure you want to change the status of this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    "ID",
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Status",
    "Actions",
  ];

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
          <Table
            datas={users}
            fucntions={toggle_status}
            columns={columns}
            name={"User's"}
          />
      )}
    </Layout>
  );
};

export default Users;
