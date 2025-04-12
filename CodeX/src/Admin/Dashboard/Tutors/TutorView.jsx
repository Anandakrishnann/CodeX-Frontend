import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import { adminAxios } from '../../../../axiosConfig'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { toast } from 'react-toastify';
import Loading from '../../Components/Loading/Loading';
import Layout from '../Layout/Layout';


const TutorView = () => {
    const { userId } = useParams();
    console.log(userId);
    
    const [userData, setUserData] = useState(null);
    console.log(userData);



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await adminAxios.get(`tutor_view/${userId}/`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (!userData) {
    return <Loading />
  }
  
  return (
    <Layout>
          <div className="mx-auto px-4 py-8 font-serif" style={{width: "1100px"}}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Left Section - User Information */}
                            <div className="md:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6 flex justify-between items-center border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-black font-serif">Application</h2>
                                <button style={{backgroundColor: userData.status === "pending" ? "#ffd700" : userData.status === "verified" ? "green" : userData.status === "rejected"? "red" : "black"}} className=" text-white font-extrabold text-xl px-4 py-2 rounded-md flex items-center gap-2">
                                    {userData.status === "pending" ? (
                                    <span className="h-4 w-4 mr-3 mb-4 ">
                                    <AccessTimeIcon />
                                    </span>
                                ) : userData.status === "verified" ? (
                                    <span className="h-4 w-4 mr-3 mb-2">
                                    <TaskAltIcon />
                                    </span>
                                ) : userData.status === "rejected" ? (
                                    <span className="h-4 w-4 mr-3 mb-2">
                                    <CancelIcon />
                                    </span>
                                ):null}
                                <span>{userData.status}</span>
                                </button>
                            </div>

                            <div className="p-6 ">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">INFORMATIONS</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-extrabold">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                    <input
                                    type="text"
                                    defaultValue={userData.username}
                                    readOnly="True"
                                    className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                                    <input
                                    type="email"
                                    readOnly="True"
                                    defaultValue={userData.email}
                                    className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                                    />
                                </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                    <input
                                    type="text"
                                    readOnly="True"
                                    defaultValue={userData.date_of_birth}
                                    className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                                    <input
                                    type="text"
                                    readOnly="True"
                                    defaultValue={userData.education}
                                    className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
                                    <input
                                    type="text"
                                    readOnly="True"
                                    defaultValue={userData.expertise}
                                    className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                                    <input
                                    type="text"
                                    readOnly="True"
                                    defaultValue={userData.occupation}
                                    className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                                    <input
                                    type="text"
                                    readOnly="True"
                                       defaultValue={userData.experience}
                                    className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                                    />
                                </div>
                                
                                
                                </div>
                                <div className='border mb-3'>
                                    <label className="block text-4xl font-extrabold text-gray-700 m-3">About</label>
                                    <h3 className='w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700'>{userData.about}</h3>
                                </div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">CONTACT INFORMATION</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input
                                    type="text"
                                    readOnly="True"
                                    defaultValue={userData.phone}
                                    className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700"
                                    />
                                </div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6 mt-3">Presentation</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Verification Document
                                    </label>

                                    { userData.verification_file ? <div>
                                        <a 
                                        href={userData.verification_file} 
                                        download
                                        
                                        className="text-black text-2xl underline font-extrabold"
                                    >
                                       View PDF <PictureAsPdfIcon style={{width:"60px", height:"50px"}}/>
                                    </a>
                                        
                                    </div> : 
                                        <p className="text-red-500">Invalid document format</p>
                                    }

                                </div>

                                <div >
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Presentation Video</label>
                                    <video style={{height:"500px", width: "650px"}} src={userData.presentation_video} className='w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700'  controls loop muted></video>
                                </div>
                            </div>
                            </div>
                            {/* Right Section - Profile */}
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{maxHeight: "600px"}} >
                            <div className="relative " style={{marginBottom: "120px"}} >
                                <div className="h-32 bg-black " ></div>
                                <div className="absolute top-16 inset-x-0 flex justify-center">
                                <div className="ring-4 ring-white rounded-full" >
                                    <img 
                                    src={userData.profile_picture}
                                    alt="Profile"
                                    style={{height:"200px" , width: "200px" }}
                                    className="rounded-full bg-gray-200   object-cover"
                                    />
                                </div>
                                </div>
                            </div>

                            <div className="pt-16 pb-6 px-6 text-center" >
                                

                                {/* <div className="flex justify-between mb-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-800">22</p>
                                    <p className="text-sm text-gray-500">Friends</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-800">10</p>
                                    <p className="text-sm text-gray-500">Photos</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-800">89</p>
                                    <p className="text-sm text-gray-500">Comments</p>
                                </div>
                                </div> */}

                                <h2 className="text-2xl font-extrabold text-gray-800 ">
                                {userData.username} <span className="font-normal text-black font-extrabold text-3xl"> {userData.age}</span>
                                </h2>
                                <p className="text-gray-500 mb-2">{userData.occupation}</p>
                                <p className="text-gray-700 font-medium mb-1">Expertise In - {userData.expertise}</p>
                                <p className="text-gray-500">{userData.education}</p>
                            </div>
                            <div className="flex justify-center space-x-2 mb-6">
                                
                                {userData.status === "pending" ? (
                                    <>
                                        <button style={{ backgroundColor: "red" }} className="text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={() => rejectApplication(userId)}>
                                        <CloseIcon className="h-4 w-4" />
                                        <span>Reject{userData.id}</span>
                                        </button>
                                        <button style={{ backgroundColor: "green" }} className="text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={() => acceptApplication(userId)}>
                                        <DoneOutlineIcon className="h-4 w-4" />
                                        <span>Accept</span>
                                        </button>
                                    </>
                                ) : userData.status === "verified" ? (
                                    <button style={{ backgroundColor: "green" }} className="text-white px-4 py-2 rounded-md flex items-center gap-2" >
                                    <DoneOutlineIcon className="h-4 w-4" />
                                    <span>Verified</span>
                                    </button>
                                ): userData.status === "rejected"?(
                                    <button style={{ backgroundColor: "green" }} className="text-white px-4 py-2 rounded-md flex items-center gap-2" >
                                    <CloseIcon className="h-4 w-4" />
                                    <span>Rejected</span>
                                    </button>
                                ):null}
                                </div>
                            </div>
                        </div>
            </div>
    </Layout>
  )
}



export default TutorView


