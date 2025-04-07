import React,{useState, useEffect, useDebugValue} from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Navbar from '../Navbar/Navbar'
import { useSelector } from 'react-redux';
import { userAxios } from '../../../../../axiosConfig';
import BackgroundAnimation from '../../../../Component/BackgroundAnimation';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { toast } from 'sonner';

const UserProfile = () => {
  const [activeItem, setActiveItem] = useState("Profile");
  const [userData, setUserData] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const [selectedUser, setSelectedUser] = useState(null)
  const [errors, setErrors] = useState({})
  const [edited, setEdit] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone:"",
    leetcode_id:""
  })
  console.log(selectedUser);
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setEdit((prev) => ({
      ...prev,
      [name]: value
    }))
  } 

  const handleOpenModal = () => {
    setSelectedUser(userData.email)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
    setIsModalOpen(false)
  }

  const validate = (data) => {
      let tempErrors = {}

      if (!data.first_name.trim()) {
        tempErrors.first_name = 'First name is required'
        toast.error('First name is required')
      } else if (!/^[a-zA-Z]+$/.test(data.first_name)) {
        tempErrors.first_name = 'First name can only contain letters'
        toast.error('First name can only contain letters')
      }
  
      if (!data.last_name.trim()) {
        tempErrors.last_name = 'Last name is required'
        toast.error('Last name is required')
      } else if (!/^[a-zA-Z]+$/.test(data.last_name)) {
        tempErrors.last_name = 'Last name can only contain letters'
        toast.error('Last name can only contain letters')
      }

      if (!data.leetcode_id.trim()) {
        tempErrors.leetcode_id = 'Last name is required'
        toast.error('Last name is required')
      } else if (!/^[a-zA-Z]+$/.test(data.leetcode_id)) {
        tempErrors.leetcode_id = 'Last name can only contain letters'
        toast.error('Last name can only contain letters')
      }
  
      if (!data.phone.trim()) {
        tempErrors.phone = 'Phone number is required'
        toast.error('Phone number is required')
      } else if (!/^\d{10}$/.test(data.phone)) {
        tempErrors.phone = 'Phone number is invalid'
        toast.error('Phone number is invalid')
      }
  
      setErrors(tempErrors)
      return Object.keys(tempErrors).length === 0
    }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      first_name:edited.first_name || userData.first_name,
      last_name:edited.last_name || userData.last_name,
      email:edited.email || userData.email,
      phone:edited.phone || userData.phone,
      leetcode_id:edited.leetcode_id || userData.leetcode_id
    }
    if(validate(data)){
    
      try{
        const response = await userAxios.put(`edit_user/${selectedUser}/`, data)
        setUserData(response.data)
        toast.success("Profile Edited Successfully")
        setIsModalOpen(false)
      }catch(error){
        if (error.response) {
            Object.entries(error.response.data).forEach(([key, value]) => {
              toast.error(`${key}: ${value}`)
            })
          } else if (error.request) {
            toast.error('No response from server.')
          } else {
            toast.error('Request setup failed.')
        }
      }
    }
  }
  

  useEffect(() => {
    const fetchUserUser = async () => {
      try {
        const response = await userAxios.get(`user_profile/${user.email}/`);
        setUserData(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserUser();
    }
  }, []);
  

  return (
    <div className="flex h-screen">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <BackgroundAnimation />
        <div className="flex flex-col font-serif md:flex-row items-start justify-center min-h-screen bg-black text-black p-6 relative z-10">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full md:w-2/3">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold font-serif">Profile</h1>
              
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2" onClick={handleOpenModal}>
                <EditNoteIcon />
                <span className="font-semibold">Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {userData ? (
                <>
                    <>
                      <div><label className="block text-gray-600">First Name</label><input type="text" value={userData.first_name || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      <div><label className="block text-gray-600">Last Name</label><input type="text" value={userData.last_name || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      <div><label className="block text-gray-600">Email address</label><input type="email" value={userData.email || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      <div><label className="block text-gray-600">Phone</label><input type="text" value={userData.phone || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      <div><label className="block text-gray-600">Leetcode Id</label><input type="text" value={userData.leetcode_id || ""} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100" readOnly /></div>
                      
                    </>
                  
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8 w-full md:w-1/3 mt-6 md:mt-0 md:ml-6 text-center">
            {userData ? (
              <>
                <img src={userData.profile_picture || "https://i.pinimg.com/736x/de/0a/47/de0a470a4617bb6272ad32dea7c497ce.jpg"} alt="Profile" className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-lg -mt-16" />
                <h2 className="mt-4 text-2xl font-bold">{userData.first_name} {userData.last_name}</h2>
                <p className="text-gray-600 font-semibold">{userData.email}</p>
                <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto space-x-2" >
                  <EditNoteIcon />
                  <span className="font-semibold">Edit Profile</span>
                </button>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
          <div className="fixed inset-0 font-serif bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative" style={{height:"420px"}}>
              <button
                className="absolute top-2 right-2 text-xl font-bold text-gray-600 hover:text-black"
                onClick={handleCloseModal}
              >
                ×
              </button>
              <h2 className="text-2xl font-semibold mb-4 relative z-10">Edit Profile</h2>
              <div><label className="block text-gray-600">First Name</label><input name='first_name' type="text" value={edited.first_name || userData.first_name} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100 relative z-10" onChange={handleChange} /></div>
              <div><label className="block text-gray-600">Last Name</label><input name='last_name' type="text" value={edited.last_name || userData.last_name} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100 relative z-10" onChange={handleChange} /></div>
              <div><label className="block text-gray-600">Phone</label><input name='phone' type="text" value={edited.phone || userData.phone} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100 relative z-10" onChange={handleChange} /></div>
              <div><label className="block text-gray-600">Leetcode Id</label><input name='leetcode_id' type="text" value={edited.leetcode_id || userData.leetcode_id} className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-100 relative z-10" onChange={handleChange} /></div>
              <button
                className="absolute end right text-xl font-bold text-white hover:text-black m-3 p-1 mt-4 rounded-md"
                style={{backgroundColor:"red"}}
                onClick={handleCloseModal}
              >
                Cancel

              </button>       
              <button
                className="absolute end-2 right-2 text-xl font-bold text-white hover:text-black m-4 p-1 rounded-md"
                style={{backgroundColor:"green"}}
                onClick={handleSubmit}
              >
                Submit

              </button>       
            </div>
          </div>
        )}

    </div>
  )
}

export default UserProfile
