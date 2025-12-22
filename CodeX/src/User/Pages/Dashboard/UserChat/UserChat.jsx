import React from "react";
import Chat from "../../../../Component/Chat/Chat";
import Layout from "../Layout/Layout";
import { useSelector } from "react-redux";
import Loading from "@/User/Components/Loading/Loading";

const UserChat = () => {
  const user = useSelector((state) => state.user.user);
  const tutorId = useSelector((state) => state.user.tutorId);

  if (!user || !tutorId) {
    return (
      <Layout page="Chat's">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout page="Chat's">
      <Chat currentUserId={user.id} tutorId={tutorId} />
    </Layout>
  );
};

export default UserChat;
