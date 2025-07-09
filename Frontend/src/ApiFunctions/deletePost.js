export async function deletePost(id) {
  const result = await fetch(`http://localhost:8080/API/posts/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({ post_uid: id })
  })
  return result.status
}