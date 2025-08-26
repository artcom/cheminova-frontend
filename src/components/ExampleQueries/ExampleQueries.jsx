import useFetchPosts from "@hooks/useFetchPosts"
import useUploadPost from "@hooks/useUploadPost"
import { useState } from "react"

export default function ExampleQueries() {
  const { data: posts, isLoading, error, refetch } = useFetchPosts()
  const { mutate: uploadPost, isPending: isUploading } = useUploadPost()

  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    const newPost = {
      title,
      body,
      userId: 1,
    }

    uploadPost(newPost, {
      onSuccess: () => {
        setTitle("")
        setBody("")
      },
    })
  }

  return (
    <div>
      <div>
        <h2>Add New Post</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="body">Content:</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Submit Post"}
          </button>
        </form>
      </div>

      <div>
        <h2>Posts</h2>
        {isLoading ? (
          <p>Loading posts...</p>
        ) : error ? (
          <div>
            <p>Error loading posts: {error.message}</p>
            <button onClick={() => refetch()}>Try Again</button>
          </div>
        ) : (
          <ul>
            {posts?.map((post) => (
              <li key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
