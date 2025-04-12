import React, {useEffect, useState} from 'react'
import Layout from '../Layout/Layout'
import { User, Tag, Calendar } from 'lucide-react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useSelector } from 'react-redux';
import { adminAxios, tutorAxios } from '../../../../../axiosConfig';
import { toast } from 'react-toastify';
import { LuSearch } from 'react-icons/lu';

const Course = () => {
    const [courses, setCourses] = useState([{
        name: "ReactJS Advanced",
        title: "Build Dynamic Web Apps",
        tutor: "Jane Smith",
        category: "Web Development",
        price: "299.00",
        description: "Deep dive into React and state management.",
        created_at: "2025-04-01",
    }])
    const [formData, setFormData] = useState([{
        name: "",
        title: "",
        requirements: "",
        benefits: "",
        price: "",
        description: "",
    }])
    const [editFormData, setEditFormData] = useState([{
        name: "",
        title: "",
        requirements: "",
        benefits: "",
        price: "",
        description: "",
    }])
    const tutor = useSelector((state) => state.user.user)
    const [categories, setCategories] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModal] = useState(false);
    const [selectedData, setSelectedData] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState(null)
    console.log(categories);
    console.log(selectedData);
    console.log(selectedCategory);
    
    

    useEffect(() => {
      const fetchCategories = async () => {
        try{
          const response = await adminAxios.get("list_category/")
          setCategories(response.data)
        }catch(error){
          toast.error("Error While Fetching Category");
        }
      }

      fetchCategories()
    }, [])


    useEffect(() => {
      const fetchCourses = async () => {
        try{
          const response = await tutorAxios.get("list_course/")
          setCourses(response.data)
        }catch(error){
          toast.error("Error While Fetching Data");
        }
      }

      fetchCourses()
    }, [])


    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => 
      ({...prev,
        [name]:value}))
    }

    const handleEditChange = (e) => {
      const { name, value } = e.target
      setEditFormData((prev) => 
      ({...prev,
        [name]:value}))
    }

    const handleModal = () => {
      setIsModalOpen(true)
    }

    const handleEditModal = (course_id) => {
      setSelectedData(course_id)

      const selectedCourse = courses.find(cour => cour.id === course_id)

      if (selectedCourse){
        setEditFormData({
          name: selectedCourse.name,
          title: selectedCourse.title,
          requirements: selectedCourse.requirements,
          benefits: selectedCourse.benefits,
          price: selectedCourse.price,
          description: selectedCourse.description,
        })
      } else {
        console.error("Category not found for editing");
      }
      setIsEditModal(true)
    }


    const validateForm = (formData) => {
      const errors = {};
          
      if (!formData.name.trim()) {
        errors.name = "Name is required";
        toast.error("Name is required");
      }

      if (!formData.title.trim()) {
        errors.name = "Title is required";
        toast.error("Title is required");
      }

      if (!formData.requirements.trim()) {
        errors.description = "requirements is required";
        toast.error("requirements is required");
      }

      if (!formData.benefits.trim()) {
        errors.description = "benefits is required";
        toast.error("benefits is required");
      }

      if (!formData.price) {
        errors.price = "Price is required";
        toast.error("Price is required");
      } else if (isNaN(formData.price)) {
        errors.price = "Price must be a number";
        toast.error("Price must be a number");
      } else if (Number(formData.price) <= 0) {
        errors.price = "Price must be greater than 0";
        toast.error("Price must be greater than 0");
      }

      if (!formData.description.trim()) {
        errors.description = "Description is required";
        toast.error("Description is required");
      }

      return Object.keys(errors).length === 0;

    }


    const handleSubmit = async () => {
      try{
        if(validateForm(formData)){
          const data = {
            name: formData.name,
            title: formData.title,
            price: formData.price,
            description: formData.description
          }
          const response = await tutorAxios.post("create_course/", data)
          toast.success("Course Created Successfully")
          setCourses((prev) => [...prev, response.data])
          setSelectedData(null)
        }
      }catch(error){
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.errors?.name?.[0] ||
          "Error while creating category";
  
        toast.error(errorMessage);
        console.error("Error creating category:", error);
      }
    }

    const handleEditSubmit = () => {
      console.log("Edit Submit");
      
    }

  return (
    <Layout page="Courses">
        <div className="p-8 min-h-screen relative z-10  text-white">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="flex mb-12">
      <div className="flex">
        <h2 className="text-5xl font-extrabold text-white">
          Course Dashboard
        <button className="text-xl text-black bg-white p-1 rounded-md font-extrabold m-3 border border-white hover:text-white hover:bg-black hover:border-white hover:border-2" style={{width:"100px", marginLeft:"910px"}} onClick={handleModal}>Create</button>
        </h2>
        <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-50 blur-md"></div>
      </div>
    </div>

    {/* Course Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses && courses.map((course, index) => (
        <div
          key={index}
          className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 flex flex-col h-full transform hover:-translate-y-1 hover:scale-[1.02]"
        >
          {/* Top Gradient Strip */}
          <div className="h-2 bg-gradient-to-r from-cyan-500 to-purple-600 w-full transition-all duration-300 group-hover:h-3"></div>

          <div className="p-6 flex flex-col justify-between h-full">
            {/* Header Info */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors duration-300">
                  {course.name}
                </h3>
                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {course.category}
                </span>
              </div>

              {/* Title */}
              <p className="text-gray-800 font-semibold mb-3 text-lg">{course.title}</p>

              {/* Tutor, Category, Date */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center text-gray-700">
                  <User size={16} className="mr-2 text-cyan-500" />
                  <span className="font-medium text-gray-900">Tutor:</span>
                  <span className="ml-2 text-gray-700">{course.tutor}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Tag size={16} className="mr-2 text-cyan-500" />
                  <span className="font-medium text-gray-900">Category:</span>
                  <span className="ml-2 text-gray-700">{course.category}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2 text-cyan-500" />
                  <span className="text-xs font-medium">{course.requirements}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2 text-cyan-500" />
                  <span className="text-xs font-medium">{course.benefits}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2 text-cyan-500" />
                  <span className="text-xs font-medium">{course.description}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2 text-cyan-500" />
                  <span className="text-xs font-medium">{course.created_at}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-6 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                {course.description}
              </p>
            </div>

            {/* Price and Action Buttons */}
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-bold text-lg">₹ {course.price}</span>

              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-white bg-blue-500 rounded-lg hover:bg-white hover:text-blue-500 hover:border hover:border-blue-500 transition"
                  onClick={() => handleEditModal(course.id)}
                >
                  <ModeEditIcon fontSize="small" />
                </button>

                {course.is_active ? (
                  <button
                    className="p-2 text-white bg-red-500 rounded-lg hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition"
                    onClick={(e) => toggle_status(e, course.id)}
                  >
                    <DeleteForeverIcon fontSize="small" />
                  </button>
                ) : (
                  <button
                    className="p-2 text-white bg-green-500 rounded-lg hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition"
                    onClick={(e) => toggle_status(e, course.id)}
                  >
                    <RestoreFromTrashIcon fontSize="small" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  {isModalOpen && (
  <div className="fixed inset-0 font-serif bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl relative h-screen ">
      <button
        className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
        onClick={() => setIsModalOpen(false)}
      >
        ×
      </button>
      <h2 className="text-2xl text-black font-semibold mb-4 relative z-10 ">Create Course</h2>

      <div className="mb-3">
        <label className="flex block text-gray-600">Name</label>
        <input name="name" type="text" className="w-full p-2 mt-1 text-black border border-gray-300 rounded-lg bg-gray-100" onChange={handleChange}/>
        <label className="block text-gray-600">Title</label>
        <input name="title" type="text" className="w-full p-2 mt-1 text-black border border-gray-300 rounded-lg bg-gray-100" onChange={handleChange}/>
        <label className="block text-gray-600">requirements</label>
        <input name="requirements" type="text" className="w-full p-2 mt-1 text-black border border-gray-300 rounded-lg bg-gray-100" onChange={handleChange}/>
        <label className="block text-gray-600">benefits</label>
        <input name="benefits" type="text" className="w-full p-2 mt-1 text-black border border-gray-300 rounded-lg bg-gray-100" onChange={handleChange}/>
      </div>

      <div className="flex gap-4">
          {categories && categories.map((cat, index) => (
            <label
              key={cat.id}
              className={`rounded-lg p-2 cursor-pointer ${
                selectedCategory && selectedCategory.category === cat.id
                  ? "bg-black text-white"
                  : "text-black hover:bg-black hover:text-white"
              }`}
            >
              <input
                type="radio"
                name="category"
                value={cat.name}
                className="mr-1"
                onChange={() => setSelectedCategory(cat.id)}
                checked={selectedCategory && selectedCategory === cat.id}
              />
              {cat.name}
            </label>
          ))}
      </div>

      <div className="mb-3">
        <label className="block text-gray-600">Price</label>
        <input name="price" type="number" className="w-full p-2 mt-1 text-black border border-gray-300 rounded-lg bg-gray-100" onChange={handleChange}/>
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




            {/* {isEditModalOpen && (
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

      <div className="mb-3">
        <label className="block text-gray-600">Description</label>
        <textarea name="description" value={editFormData.description} className="w-full p-2 mt-1 text-black border border-gray-300 rounded-lg bg-gray-100" rows="3" onChange={handleEditChange}/>
      </div>

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
)} */}
</div>

    </Layout>
  )
}

export default Course
