import { useQuery } from "@tanstack/react-query"
import { fetchPosts } from "@api/fetchData"

export default function useFetchPosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
