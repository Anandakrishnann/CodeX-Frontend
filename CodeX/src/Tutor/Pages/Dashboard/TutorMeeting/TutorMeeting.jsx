import React from "react";
import Layout from "../Layout/Layout";
import BackgroundAnimation from "../../../../Component/BackgroundAnimation"
import Meetings from "../../../../Component/Meetings/Meetings"

const TutorMeeting = () => {
  return (
    <Layout page="Meeting's">
      <BackgroundAnimation />
      <Meetings/>
    </Layout>
  );
};

export default TutorMeeting;
