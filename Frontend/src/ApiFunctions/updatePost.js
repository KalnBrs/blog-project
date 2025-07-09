export async function updatePost(updatedPost) {
  try {
    const result = await fetch(`http://localhost:8080/API/posts/${updatedPost.post_uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(updatedPost)
    })
    return result.status
  } catch (err) {
    console.error(`Error updating post: ${err}`)
    return null
  }
}