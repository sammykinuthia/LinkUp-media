import { useGet, usePost } from "./utils.js"

export let posts = async (explore = false) => {
    let res, code
    if (explore) {
        [res, code] = await useGet('/posts/explore')
    }
    else {
        [res, code] = await useGet('/posts')
    }
    return res.data
}
export let comments = async (post_id) => {
    let [res, code] = await useGet(`/posts/comments/${post_id}`)
    return res.data
}