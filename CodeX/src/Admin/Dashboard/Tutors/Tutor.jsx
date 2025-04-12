import React, { useEffect, useState } from "react";
import { adminAxios } from "../../../../axiosConfig.js";
import { toast } from "react-toastify";
import Table from "../../Components/Table/Table.jsx";
import Layout from "../Layout/Layout.jsx";


const Tutors = () => {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminAxios.get("list_tutors/");
        setTutors(response.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error.response || error);
      }
    };

    fetchUsers();
  }, []);
  console.log(tutors);
  

  const toggle_status = async (e, userId) => {
    e.preventDefault();

    try {
      await adminAxios.post("tutor-status/", { id: userId });
      toast.success("Status Changed Successfully");

      setTutors((prevUsers) =>
        prevUsers.map((tutors) =>
          tutors.id === userId ? { ...tutors, status: !tutors.status } : tutors
        )
      );
    } catch (error) {
      toast.error("User not Found");
      console.error("Error:", error);
    }
  };


  const columns = ["ID", "First Name", "Last Name", "Email", "Leetcode ID", "Phone", "Status", "Actions"];

  return (
    <Layout>
      <Table datas={tutors} fucntions={toggle_status} columns={columns} name={"Tutors"} />
    </Layout>
  );
};

export default Tutors;
