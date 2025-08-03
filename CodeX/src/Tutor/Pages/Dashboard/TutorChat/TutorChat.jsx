import React, { useEffect, useState } from "react";
import Chat from "../../../../Component/Chat/Chat";
import Layout from "../Layout/Layout";
import { useSelector } from "react-redux";
import { chatAxios } from "../../../../../axiosConfig";
import BackgroundAnimation from "../../../../Component/BackgroundAnimation";

const TutorChat = () => {
  const user = useSelector((state) => state.user.user);
  const role = useSelector((state) => state.user.role)
  const tutor = useSelector((state) => state.user.tutorId)
  console.log(tutor)
  const [roomId, setRoomId] = useState(null);

  return (
    <Layout page="Chat's">
      <BackgroundAnimation/>
        <Chat roomId={roomId} currentUserId={user?.id} />
    </Layout>
  );
};

export default TutorChat;
