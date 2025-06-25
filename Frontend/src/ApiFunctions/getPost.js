export async function getPost(id) {
  const result = await fetch(`http://localhost:8080/API/posts/${id}`)
  .then((res) => {
    if (!res.ok) console.log('Server Error');
    return res.json();
  }).then((data) => {
    return data;
  }).catch((err) => {
    console.log(`failed fetch:`, err)
  })

  return result
}