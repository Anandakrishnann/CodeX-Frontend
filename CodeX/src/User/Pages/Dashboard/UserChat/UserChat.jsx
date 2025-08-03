import React, { useEffect, useState } from "react";
import Chat from "../../../../Component/Chat/Chat";
import Layout from "../Layout/Layout";
import { useSelector } from "react-redux";
import { chatAxios } from "../../../../../axiosConfig";
import BackgroundAnimation from "../../../../Component/BackgroundAnimation";

const UserChat = () => {
  const user = useSelector((state) => state.user.user);
  const tutor = useSelector((state) => state.user.tutorId);
  const [roomId, setRoomId] = useState(null);
  const [roomCheckComplete, setRoomCheckComplete] = useState(false);

  useEffect(() => {
    const getRoomId = async () => {
      if (user?.id && tutor) {
        try {
          const response = await chatAxios.post("get-or-create-room/", {
            user2_id: tutor,
          });
          setRoomId(response.data.room_id);
        } catch (error) {
          if (error.response?.status === 403) {
            console.warn("User is not allowed to chat with this tutor.");
            setRoomId(null); 
          } else {
            console.error("Error getting room ID:", error);
          }
        } finally {
          setRoomCheckComplete(true);
        }
      } else {
        setRoomCheckComplete(true);
      }
    };

    getRoomId();
  }, [user?.id, tutor]);

  return (
    <Layout page="Chat's">
      <BackgroundAnimation />
      {roomCheckComplete ? (
        <Chat roomId={roomId} currentUserId={user?.id} />
      ) : (
        <p>Loading chat...</p>
      )}
    </Layout>
  );
};

export default UserChat;
