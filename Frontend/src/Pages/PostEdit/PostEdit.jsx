import './PostEdit.css'
import { getPost } from '../../ApiFunctions/getPost'
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import FormInput from '../../components/FormInput/FormInput';
import { updatePost } from '../../ApiFunctions/updatePost';

function PostEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [post, setPost] = useState({})
  const [values, setValues] = useState({
    title: '',
    author: '',
    content: ''
  });

  const location = useLocation()

  useEffect(() => {
    async function init() {
      const fetchedPost = await getPost(id);
      setPost(fetchedPost)
      setValues({ title: fetchedPost.title, author: fetchedPost.author, content: fetchedPost.content })
    }
    
    init()
  }, [location.search])

  const inputs = [
    {
      id: 1,
      name: "title",
      type: "text",
      placeholder: "Title",
      errorMessage:
        "Title should be 3-30 characters",
      label: "Title: ",
      pattern: ".{3,30}$",
      required: true,
    },
    {
      id: 2,
      name: "author",
      type: "text",
      placeholder: "Author",
      errorMessage:
        "Author should be 3-30 characters and shouldn't include any special character!",
      label: "Author: ",
      pattern: "^[A-Za-z0-9 ]{3,30}$",
      required: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const status = await updatePost({ post_uid: post.post_uid, title: values['title'], author: values['author'], content: values['content'] })
    if (status === 203) {
      navigate(`/${post.post_uid}`)
    } else {
      console.error('Error')
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="app">
      <form onSubmit={handleSubmit} className="formForm">
        <h1 className="formH1">Edit Post</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
            className='child'
          />
        ))}
        <div className="formTextArea">
          <label className="formLabel">Content: </label>
          <textarea name="content" rows='6' value={values['content']} onChange={onChange}></textarea>
        </div>
        <button className="formButton">Submit</button>
      </form>
    </div>
  )
}

export default PostEdit;