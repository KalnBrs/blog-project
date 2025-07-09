import { useState, useEffect } from 'react'
import { Link, useLocation } from "react-router-dom";
import { getPosts } from '../../ApiFunctions/getPosts.js'

import './Homepage.css'

import BlogPost from '../../components/blogPost/blogPost.jsx';


function Homepage() {
  const [posts, setPosts] = useState(null);

  const location = useLocation()

  useEffect(() => {
    async function init() {
      const obj = await getPosts()
      setPosts(obj)
    }
    
    init()
  }, [location.search])

  return (
    <>
      <div className='header'>
        <h1>My Blog</h1>
        <Link to='/new'><button className='mt-0'>+ New Post</button> </Link>
      </div>
      <div className='postContainer'>
        {posts ? posts.slice(0).reverse().map((post) => {
          return <BlogPost key={post.post_uid} post={post} />
        }) || posts.map((post) => {
          return <BlogPost key={post.post_uid} post={post} />
        }) : 'Loading...'}
      </div>
    </>
  )
}

export default Homepage;
