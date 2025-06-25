export async function makeNewPost(newPost) {
  try {
    const result = await fetch('http://localhost:8080/API/posts', {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(newPost)
    })

    return result.status
  } catch (err) {
    console.error(`Error making post: ${err}`)
    return null
  }
}