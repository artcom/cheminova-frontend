import { fetchPosts } from "@api/fetchData"
import { useQuery } from "@tanstack/react-query"

export default function useFetchPosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
