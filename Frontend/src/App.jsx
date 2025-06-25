import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './Homepage'
import NewPost from "./NewPost";
import Post from "./Post"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/new" element={<NewPost />} />
        <Route path="/:id" element={<Post />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;