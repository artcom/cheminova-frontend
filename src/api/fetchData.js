export const fetchPosts = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts")
  return response.json()
}
