import React,{useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSubscribedTrue } from '../../../redux/slices/userSlice';

const Success = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSubscribedTrue());
    }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-white text-black rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-6">
          <span className="text-5xl">✅</span>
        </div>
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful</h1>
        <p className="text-gray-700 mb-6">Thanks for subscribing! Your payment has been confirmed.</p>
        <h1
          
          className="inline-block bg-green-500 hover:bg-green-600 cursor-pointer text-white font-semibold py-2 px-6 rounded-lg transition duration-300" onClick={() => navigate("/tutor")}
        >
          Go to Dashboard
        </h1>
      </div>
    </div>
  );
};

export default Success;
