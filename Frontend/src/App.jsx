import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './Pages/Homepage/Homepage'
import NewPost from "./Pages/NewPost/NewPost";
import Post from "./Pages/Post/Post";
import PostEdit from "./Pages/PostEdit/PostEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/new" element={<NewPost />} />
        <Route path="/:id" element={<Post />} />
        <Route path="/:id/edit" element={<PostEdit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;