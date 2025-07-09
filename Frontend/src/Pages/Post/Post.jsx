import './Post.css'
import { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate} from 'react-router-dom';
import { getPost } from '/src/ApiFunctions/getPost.js';
import { deletePost } from '../../ApiFunctions/deletePost';


function Post() {
  const [post, setPost] = useState()
  const { id } = useParams()

  const location = useLocation()
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      setPost(await getPost(id))
    }
    
    init()
  }, [location.search])

  async function deleteClick() {
    const status = await deletePost(id)
    if (status == 204) {
      navigate('/')
    } else {
      console.error('Error')
    }
  }

  if (!post) {
    return '404, Could not find blog post'
  }
  return (
    <>
      <h1>{post.title}</h1>
      <p>By: {post.author}</p>
      <p>{post.content}</p>
      <Link to={`/${id}/edit`}><button>Edit</button></Link>
      <button onClick={deleteClick}>Delete</button>
      <div>
        <Link to='/'><button>Home</button></Link>
      </div>
    </>
  )
}

export default Post;