import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../../../Component/BackgroundAnimation';
import Footer from '../Footer/Footer';
import { Button } from '../../../Component/ui/button';
import Navbar from '../Navbar/Navbar';
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';


const TutorHome = () => {
  const navigate = useNavigate();
  const tutor = useSelector((state) => state.user.role)
  

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
              {tutor !== "tutor" ? (
                <>
                <div className="grid  gap-6">
                {/* Card 1 */}
                <div className="bg-black bg-opacity-50 border border-green-800 p-8 rounded-lg transform hover:scale-105 transition-all">
                  <h3 className="text-2xl font-bold mb-6 text-codex-green">Start my career</h3>
                  <Button 
                    className="border border-green-500 bg-black text-green-500 hover:bg-green-500 hover:text-white px-8 py-6 text-lg rounded-lg transition-all"
                    onClick={form}
                  >
                    Check eligibility
                  </Button>
                </div>
                {/* Card 2 */}
                {/* <div className="bg-black bg-opacity-50 border border-green-800 p-8 rounded-lg transform hover:scale-105 transition-all">
                  <h3 className="text-2xl font-bold mb-6 text-codex-green">Dashboard</h3>
                  <Button
                    className="border border-green-500 bg-black text-green-500 hover:bg-green-500 hover:text-white px-8 py-6 text-lg rounded-lg transition-all"
                    onClick={() => navigate("/tutor-dashboard")}
                  >
                    See my Tutor panel
                  </Button>
                </div> */}
              </div>
                </>
              ):(
                <div className="grid">
                <div className="bg-black bg-opacity-50 border border-green-800 p-8 rounded-lg transform hover:scale-105 transition-all">
                  <h3 className="text-2xl font-bold mb-6 text-codex-green">Dashboard</h3>
                  <Button
                    className="border border-green-500 bg-black text-green-500 hover:bg-green-500 hover:text-white px-8 py-6 text-lg rounded-lg transition-all"
                    onClick={() => navigate("/tutor-dashboard")}
                  >
                    See my Tutor panel
                  </Button>
                </div>
              </div>
              )}
              
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
