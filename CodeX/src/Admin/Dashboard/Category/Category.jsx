import React, {useEffect, useState} from 'react'
import Layout from '../Layout/Layout'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from 'react-toastify';
import { adminAxios } from '../../../../axiosConfig';
import ModeEditIcon from '@mui/icons-material/ModeEdit';


const Category = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModal] = useState(false);
    const [category, setCategory] = useState([])
    const [formData, setFormData] = useState({
        name:"",
        description:""
    })    
    const [editFormData, setEditFormData] = useState({
        name:"",
        description:""
    })
    const [selectedData, setSelectedData] = useState(null)
    console.log((selectedData));
    

    console.log(category);
    

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]:value
        }))
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditFormData((prev) => ({
            ...prev,
            [name]:value
        }))
    }

    const handleEditModal = (category_id) => {
        setSelectedData(category_id);
      
        const selectedCategory = category.find(cat => cat.id === category_id);
      
        if (selectedCategory) {
          setEditFormData({
            name: selectedCategory.name,
            description: selectedCategory.description
          });
        } else {
          console.error("Category not found for editing");
        }
      
        setIsEditModal(true);
      };
      

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await adminAxios.get("list_category/");
                setCategory(response.data);
            } catch (e) {
                toast.error("Error While Fetching Data");
            }
        };
    
        fetchCategories();
    }, []);
    

    const validateForm = (formData) => {
        const errors = {};
    
        if (!formData.name.trim()) {
        errors.name = "Name is required";
        toast.error("Name is required");
        }
    
        if (!formData.description.trim()) {
        errors.description = "Description is required";
        toast.error("Description is required");
        }
    
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        try {
          if (validateForm(formData)) {
            const response = await adminAxios.post("create_category/", formData);
            toast.success("Category Created Successfully");
            console.log(response.data);
      
            setCategory((prev) => [...prev, response.data]);
            setIsModalOpen(false);
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.detail ||
            error.response?.data?.errors?.name?.[0] ||
            "Error while creating category";
      
          toast.error(errorMessage);
          console.error("Error creating category:", error);
        }
    };
      

    
    const toggle_status = async (e, category_id) => {
        e.preventDefault();
        try {
          const response = await adminAxios.post("category_status/", { id: category_id });
          toast.success("Status Updated Successfully");
      
          setCategory((prevUsers) =>
            prevUsers.map((cat) =>
              cat.id === category_id ? { ...cat, is_active: !cat.is_active } : cat
            )
          );
        } catch (error) {
          const errorMessage =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "An unexpected error occurred";
      
          toast.error(`Error: ${errorMessage}`);
          console.error("Backend Error:", error);
        }
    };
    
    
    const handleEditSubmit = async () => {
        try {
          if (validateForm(editFormData)) {
            const data = {
              name: editFormData.name || category.name,
              description: editFormData.description || category.description,
            };
      
            const response = await adminAxios.put(`edit_category/${selectedData}/`, data);
      
            toast.success("Category Edited Successfully");
      
            setCategory(response.data);
            setSelectedData(null);
            setIsEditModal(false);
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.detail ||
            error.response?.data?.errors?.name?.[0] ||
            "An unexpected error occurred";
      
          toast.error(`Error: ${errorMessage}`);
          console.error("Backend Error:", error);
        }
    };
      

    
    const columns = ["ID", "Name", "Description", "Status", "Action"]

  return (
    <Layout>
<div className="grid gap-2">
  <div className="row-span-1 bg-black p-4 rounded-lg">
    <div className='flex'>
        <h2 className="text-4xl font-extrabold mb-6 text-white">Categories </h2>
        <button className="text-xl text-black bg-white p-1 rounded-md font-extrabold m-3 border border-white hover:text-white hover:bg-black hover:border-white hover:border-2" style={{width:"100px", marginLeft:"910px"}} onClick={() => setIsModalOpen(true)}>Create</button>
    </div>
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
          {category.length > 0 ? (
            category.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-gray-300 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-200 transition`}
              >
                <td className="p-4 text-md font-extrabold text-gray-800">
                  {item.id}
                </td>
                <td className="p-4 text-md font-semibold text-gray-800">
                  {item.name}
                </td>
                <td className="p-4 text-md text-gray-700">{item.description}</td>
                <td className="p-4">
                  {item.is_active ? (
                    <span className="px-3 py-1 pb-2 text-white bg-green-500 rounded-full">
                    <TaskAltIcon />
                  </span>
                ) : (
                  <span className="px-3 py-1 pb-2 text-white bg-red-500 rounded-full">
                    <CancelIcon />
                  </span>
                  )}
                </td>
                <td className="p-4 flex">
                  <button
                    className="p-2 mr-3 text-white rounded-lg  bg-blue-500 hover:bg-white hover:text-blue-500"
                    onClick={() => handleEditModal(item.id)}
                  >
                    <ModeEditIcon />
                  </button>
                  {item.is_active === true ? (
                        <button
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-white hover:text-red-500"
                          onClick={(e) => toggle_status(e, item.id)}
                        >
                          <DeleteForeverIcon />
                        </button>
                      ) : (
                        <button
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-white hover:text-green-500"
                          onClick={(e) => toggle_status(e, item.id)}
                        >
                          <RestoreFromTrashIcon />
                        </button>
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
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

            {isModalOpen && (
  <div className="fixed inset-0 font-serif bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative" style={{ height: "360px" }}>
      <button
        className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
        onClick={() => setIsModalOpen(false)}
      >
        ×
      </button>
      <h2 className="text-2xl text-black font-semibold mb-4 relative z-10 ">Create Plan</h2>

      <div className="mb-3">
        <label className="block text-gray-600">Name</label>
        <input name="name" type="text" className="w-full p-2 mt-1 text-black border border-gray-300 rounded-lg bg-gray-100" onChange={handleChange}/>
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="block text-gray-600">Description</label>
        <textarea name="description" className="w-full p-2 mt-1 text-black border border-gray-300 rounded-lg bg-gray-100" rows="3" onChange={handleChange}/>
      </div>

      {/* Buttons */}
      <button
        className="absolute end right text-xl font-bold text-white hover:bg-red-600 bg-red-800 m-3 p-1 mt-4 rounded-md"
        onClick={() => setIsModalOpen(false)}
      >
        Cancel
      </button>
      <button
        className="absolute end-2 right-2 text-xl font-bold text-white hover:bg-green-600 m-4 p-1 rounded-md bg-green-800"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  </div>
)}




            {isEditModalOpen && (
  <div className="fixed inset-0 font-serif bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative" style={{ height: "360px" }}>
      <button
        className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
        onClick={() => setIsEditModal(false)}
      >
        ×
      </button>
      <h2 className="text-2xl text-black font-semibold mb-4 relative z-10 ">Create Plan</h2>

      <div className="mb-3">
        <label className="block text-gray-600">Name</label>
        <input name="name" type="text" value={editFormData.name} className="w-full p-2 mt-1 text-black border border-gray-300 rounded-lg bg-gray-100" onChange={handleEditChange}/>
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="block text-gray-600">Description</label>
        <textarea name="description" value={editFormData.description} className="w-full p-2 mt-1 text-black border border-gray-300 rounded-lg bg-gray-100" rows="3" onChange={handleEditChange}/>
      </div>

      {/* Buttons */}
      <button
        className="absolute end right text-xl font-bold text-white hover:bg-red-600 bg-red-800 m-3 p-1 mt-4 rounded-md"
        onClick={() => setIsEditModal(false)}
      >
        Cancel
      </button>
      <button
        className="absolute end-2 right-2 text-xl font-bold text-white hover:bg-green-600 m-4 p-1 rounded-md bg-green-800"
        onClick={handleEditSubmit}
      >
        Submit
      </button>
    </div>
  </div>
)}

    </Layout>
  )
}

export default Category
