import { useGet, usePost } from "./utils.js"

export let posts = async ()=>{
    let [res, code] = await useGet('/posts')
    console.log(res);
    return res.data
}
export let comments = async (post_id)=>{
    let [res, code] = await useGet(`/posts/comments/${post_id}`)
    console.log(res);
    return res.data
}