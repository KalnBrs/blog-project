import './Post.css'
import { useEffect, useState } from 'react';
import { useParams, useLocation, Link} from 'react-router-dom';
import { getPost } from './ApiFunctions/getPost';

function Post() {
  const [post, setPost] = useState()
  const { id } = useParams()

  const location = useLocation()

  useEffect(() => {
    async function init() {
      setPost(await getPost(id))
    }
    
    init()
  }, [location.search])


  if (!post) {
    return '404, Could not find blog post'
  }
  return (
    <>
      <h1>{post.title}</h1>
      <p>By: {post.author}</p>
      <p>{post.content}</p>
      <Link to='/'><button>Home</button></Link>
    </>
  )
}

export default Post;