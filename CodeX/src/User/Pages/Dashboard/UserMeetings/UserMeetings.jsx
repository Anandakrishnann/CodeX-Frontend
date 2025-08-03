import React from 'react'
import Layout from '../Layout/Layout'
import BackgroundAnimation from '../../../../Component/BackgroundAnimation'
import Meetings from "../../../../Component/Meetings/Meetings"

const UserMeetings = () => {
  return (
    <Layout page="Meeting's">
      <BackgroundAnimation />
      <Meetings/>
    </Layout>
  )
}

export default UserMeetings
