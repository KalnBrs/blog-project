import { Link } from 'react-router-dom';
import './BlogPost.css'

const maxLen = 100;


function  BlogPost({ post }) {
  let title = post.title
  let author = post.author
  let content = post.content

  if (content.length > maxLen) {
    content = content.slice(0, maxLen) + '...'
  }
  return (
    <div className='postOutline'>
      <p className='postTitle'>{title}</p>
      <p className='postAuthor'>By: {author}</p>
      <p className='postContent'>{content}</p>
      <Link to={`/${post.post_uid}`}> <button className='postButton'>Read More</button> </Link>
    </div>
  )
}

export default BlogPost;