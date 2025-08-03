import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Review = () => {

    const [posts, setPosts] = useState([])

    useEffect(() => {
        try{
            const response = axios.get("https://jsonplaceholder.typicode.com/posts")
            setPosts(response.data)
            console.log("posts", posts);
            
        }catch(error){
            console.log(error || "Error while fecthing posts");
            
        }
    })

  return (
    <div>
      <div className='bg-black text-white text-xl'>
        
      </div>
    </div>
  )
}

export default Review
