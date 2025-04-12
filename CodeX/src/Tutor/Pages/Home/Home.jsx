import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../../Component/BackgroundAnimation';
import Footer from '../Footer/Footer';
import { Button } from '../../../Component/ui/button';
import Navbar from '../Navbar/Navbar';
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { loginUser } from '../../../redux/slices/userSlice';
import { userAxios } from '../../../../axiosConfig';


const TutorHome = () => {
  const navigate = useNavigate();
  const tutor = useSelector((state) => state.user.user)
  const subscribed = useSelector((state) => state.user.subscribed)
  console.log(tutor);
  console.log(subscribed);
  const dispatch = useDispatch();  

  useEffect(() => {
    if (!tutor?.id) return;
  
    const fetchTutor = async () => {
      try {
        const response = await userAxios.get(`tutor_home/${tutor.id}/`);
        if (response.status === 200) {
          dispatch(loginUser(response.data.user));
        }
      } catch (error) {
        console.error("❌ Error fetching tutor:", error.response || error.message || error);
        toast.error("Something Went Wrong.");
      }
    };
  
    fetchTutor();
  }, []); // ✅ only watch tutor.id, not entire tutor object
  
  
  
  
  const form = () => {
    navigate('/tutor/form');
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-codex-darkBg text-white relative">
        <AnimatedBackground />
        
        <main className="container mx-auto px-6 py-12 text-white " style={{marginTop: "100px"}}>
        <motion.div className="text-center" initial="hidden" animate="visible" variants={fadeIn}>
          <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-8xl font-bold mb-4 relative z-10">
            Empower Your  
            <div className="text-green-500 relative z-10">Teaching Journey</div>
          </h1>
        
            
            <p className="text-lg md:text-lg max-w-2xl mx-auto mb-4 text-white relative z-10">
            Welcome to Tutor Portal—your space to grow! Start your career, build your platform, master our Creator Academy, and connect with creators in the Creator Center.
            </p>
            
            <div className=" w-full max-w-3xl">
              <h2 className="text-2xl font-bold mb-6">I'm ready to...</h2>
              {tutor.role !== "tutor" && subscribed === false ? (
                // Case 1: Not a tutor but subscribed
                <div className="grid gap-6">
                  <div className="bg-black bg-opacity-50 border border-green-800 p-8 rounded-lg transform hover:scale-105 transition-all">
                    <h3 className="text-2xl font-bold mb-6 text-green-500">Start my career</h3>
                    <Button 
                      className="border border-green-500 bg-black text-green-500 hover:bg-green-500 hover:text-white px-8 py-6 text-lg rounded-lg transition-all"
                      onClick={form}
                    >
                      Check eligibility
                    </Button>
                  </div>
                </div>
              ) : tutor.role === "tutor" && subscribed === false  ? (
                // Case 2: Is a tutor but not subscribed (Show subscription card)
                <div className="grid">
                  <div className="bg-black bg-opacity-50 border border-green-800 p-4 rounded-lg transform hover:scale-105 transition-all">
                    <h3 className="text-2xl font-bold mb-6 text-green-500">Activate Your Tutor Access</h3>
                    <p className="text-white mb-4">
                      To access your tutor dashboard and start teaching, please subscribe to our tutor plan.
                    </p>
                    <Button
                      className="border border-green-500 bg-black text-green-500 hover:bg-green-500 hover:text-white px-8 py-6 text-lg rounded-lg transition-all"
                      onClick={() => navigate("/tutor/subscription")}
                    >
                      Go to Subscription Page
                    </Button>
                  </div>
                </div>
              ) : tutor.role === "tutor" && subscribed === true  ? (
                // Case 3: Is a tutor and subscribed
                <div className="grid">
                  <div className="bg-black bg-opacity-50 border border-green-800 p-8 rounded-lg transform hover:scale-105 transition-all">
                    <h3 className="text-2xl font-bold mb-6 text-green-500">Tutor Dashboard</h3>
                    <Button
                      className="border border-green-500 bg-black text-green-500 hover:bg-green-500 hover:text-white px-8 py-6 text-lg rounded-lg transition-all"
                      onClick={() => navigate("/tutor-dashboard")}
                    >
                      Go to Tutor Panel
                    </Button>
                  </div>
                </div>
              ) : null}           
            </div>
          </div>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default TutorHome;
