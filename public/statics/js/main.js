import { UpdateProfile, UserProfile, PeopleToFollow, Posts, Comment, ViewComments, Post } from "./components.js"
import { toastMessage, useDelete, useGet, usePost } from "./utils.js"

const token = localStorage.getItem("token")
if (!token) {
    window.location.replace("/auth/login")
}
const [res, code] = await useGet("/users/verify")
if (code != 200)
    window.location.replace("/auth/login")

export let currentUser = res.data[0]
console.log(currentUser);
// main section
const mainSection = document.getElementsByClassName("main_body")[0]

// logged in user
document.getElementById("currentUser").textContent = currentUser.username
document.getElementById("currentUser").addEventListener('click', () => {
    mainSection.innerHTML = UserProfile(currentUser)
    document.getElementById("profile-update").addEventListener('click', () => {
        mainSection.innerHTML = UpdateProfile(currentUser)
    })
})
// user profile
setTimeout(() => {
    let usersList = document.getElementsByClassName("post-username")
    for (let i = 0; i < usersList.length; i++) {
        usersList[i].addEventListener("click", async () => {
            let user_id = usersList[i].id
            let [res, code] = await useGet(`/users/${user_id}`)
            let user = res.data[0]
            if (code == 200) {
                mainSection.innerHTML = UserProfile(user)

            }
            console.log();
        })
    }
}, 1000)



// logout user
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token")
    window.location.replace("/auth/login")
})

// people to follow section
document.getElementsByClassName("person-follow-list")[0].innerHTML = await PeopleToFollow()

// post logic
// post btn 
const postbtn = document.getElementById("post-btn")
const postModalSection = document.getElementById("create-post-modal-section")
const postModal = document.getElementById("post-modal")
const postBtnSubmit = document.getElementById("post-btn-submit")
let postMessage = document.getElementById("post-message")
postbtn.addEventListener("click", () => {
    postModalSection.style.display = "flex"
})

document.getElementById("post-modal-cancel").addEventListener('click', () => {
    postModalSection.style.display = "none"

})

let postImage = ""
document.getElementById("post-img").addEventListener("change", (e) => {
    postBtnSubmit.disabled = true
    console.log(e.target.files[0]);
    let formData = new FormData()
    formData.append('file', e.target.files[0])
    formData.append('upload_preset', 'linkup')
    fetch("https://api.cloudinary.com/v1_1/dbeq8dpkz/image/upload", { method: "POST", body: formData }).then(res => res.json()).then(data => {
        postImage = data.url
        console.log(data);
        postBtnSubmit.disabled = false
    })
})

postModal.addEventListener("submit", async e => {
    e.preventDefault()
    let post_message = postMessage.value
    let data = { post_message, post_image: postImage }
    console.log(data);
    const [res, code] = await usePost("/posts/create", data)
    console.log(res);
    console.log(code);
    if (code == 201)
        postModalSection.style.display = "none"
    toastMessage("You created a post successfully")

})

// posts section
document.getElementById("main_body").innerHTML = await Posts()
// explore
document.getElementById("explore").addEventListener('click', async () => {
    document.getElementById("main_body").innerHTML = await Posts(explore)

})
// toggle menu
document.getElementById("toggle-menu").addEventListener('click', () => {
    document.getElementsByClassName("aside-left")[0].style.translate = "0"
    document.getElementById("close-toggle").style.display = "block"
})
// close toggle
document.getElementById("close-toggle").addEventListener("click", () => {
    document.getElementsByClassName("aside-left")[0].style.translate = "-600px"
    document.getElementById("close-toggle").style.display = "none"


})

// comments
setTimeout(() => {
    let commentBtnList = document.getElementsByClassName("comment-section")
    let likeBtnList = document.getElementsByClassName("like-section")
    let commentsList = document.getElementsByClassName("comments-count-section")
    let commentSection
    // comment
    for (let i = 0; i < commentBtnList.length; i++) {
        let commentBtn = commentBtnList[i]
        commentBtn.addEventListener("click", async () => {
            let post_id = commentBtn.parentNode.parentNode.id
            let post = document.getElementById(post_id)
            let commentSection = post.getElementsByClassName("post-create-comment-section")[0]
            commentSection.innerHTML = await Comment()
            const commentForm = commentSection.getElementsByTagName("form")[0]
            const commentBtnSubmit = commentSection.getElementsByTagName("button")[0]

            // upload image 
            let inputImage = commentSection.getElementsByTagName("input")[0]
            let commentImage = ""
            inputImage.addEventListener("change", async e => {
                commentBtnSubmit.disabled = true
                let formData = new FormData()
                formData.append('file', e.target.files[0])
                formData.append('upload_preset', 'linkup')
                fetch("https://api.cloudinary.com/v1_1/dbeq8dpkz/image/upload", { method: "POST", body: formData }).then(res => res.json()).then(data => {
                    commentImage = data.url
                    console.log(data);
                    commentBtnSubmit.disabled = false
                })
            })

            // submit comment
            commentForm.addEventListener('submit', async (e) => {
                e.preventDefault()
                let commentMessage = commentSection.querySelector('#comment-message').value
                let data = { image: commentImage, message: commentMessage, post_id, level: 0, parent_comment: "", }
                const [res, code] = await usePost('/posts/comment', data)
                console.log(res);
                console.log(code);
                if (code == 201) {
                    commentSection.parentElement.querySelector("#total-comments").textContent++
                    commentSection.innerHTML = await ViewComments(post_id)
                    toastMessage("comment sent")
                }
                else {
                    console.log(res);
                }
            })
        })
    }
    // comments view 
    for (let i = 0; i < commentsList.length; i++) {
        let commentBtn = commentsList[i]
        commentBtn.addEventListener("click", async () => {
            let post_id = commentBtn.parentNode.parentNode.id
            let post = document.getElementById(post_id)
            commentSection = post.getElementsByClassName("post-view-comments-section")[0]
            if (commentSection.innerHTML) {
                commentSection.innerHTML = ""
            } else {
                commentSection.innerHTML = await ViewComments(post_id)
            }
            // like comment
            let commentLikeBtnList = commentSection.getElementsByClassName("comment-like")
            if (commentLikeBtnList.length > 0) {
                for (let i = 0; i < commentLikeBtnList.length; i++) {
                    let commentlikeBtn = commentLikeBtnList[i]
                    commentlikeBtn.addEventListener("click", async () => {
                        let commentId = commentlikeBtn.parentElement.parentElement.parentElement.id
                        if (!commentlikeBtn.classList.contains("liked")) {
                            const [res, code] = await usePost("/posts/likecomment", { comment_id: commentId })
                            console.log(res);
                            if (code == 201) {
                                commentlikeBtn.classList.add("liked")
                                commentlikeBtn.parentElement.parentElement.querySelector("#comment-like-total").textContent++
                            }

                        }
                    })
                }
            }
            // sub comment
            let commentReplyBtnList = document.getElementsByClassName("comment-reply")
            for (let i = 0; i < commentReplyBtnList.length; i++) {
                let commentReply = commentReplyBtnList[i]
                commentReply.addEventListener("click", async () => {
                    let commentId = commentReply.parentElement.parentElement.parentElement.id
                    let creatteCommentSection = commentReply.parentElement.parentElement.parentElement.querySelector("#comment-create-comment-section")
                    creatteCommentSection.innerHTML = await Comment()
                    // upload image
                    let commentImage = ""
                    let inputImage = creatteCommentSection.querySelector("#post-img")
                    let commentBtnSubmit = creatteCommentSection.querySelector('button')
                    inputImage.addEventListener("change", async e => {
                        commentBtnSubmit.disabled = true
                        let formData = new FormData()
                        formData.append('file', e.target.files[0])
                        formData.append('upload_preset', 'linkup')
                        fetch("https://api.cloudinary.com/v1_1/dbeq8dpkz/image/upload", { method: "POST", body: formData }).then(res => res.json()).then(data => {
                            commentImage = data.url
                            console.log(data);
                            commentBtnSubmit.disabled = false
                        })
                    })
                    // submit comment
                    let form = creatteCommentSection.querySelector("#comment-form")
                    form.addEventListener("submit", async (e) => {
                        e.preventDefault()
                        let commentMessage = creatteCommentSection.querySelector("#comment-message").value
                        let data = { image: commentImage, message: commentMessage, post_id, level: 1, parent_comment: commentId, }
                        const [res, code] = await usePost('/posts/comment', data)
                        console.log(res);
                        console.log(code);
                        if (code == 201) {
                            commentSection.parentElement.querySelector("#total-comments").textContent++
                            commentSection.innerHTML = await ViewComments(post_id)
                        }
                        else {
                            console.log(res);
                        }
                    })

                })
            }



        })
    }

    // like post
    for (let i = 0; i < likeBtnList.length; i++) {
        let likeBtn = likeBtnList[i]
        likeBtn.addEventListener("click", async () => {
            let postId = likeBtn.parentElement.parentElement.id
            if (!likeBtn.classList.contains("liked")) {
                const [res, code] = await usePost("/posts/likepost", { post_id: postId })
                if (code == 201) {
                    likeBtn.classList.add("liked")
                    likeBtn.parentElement.parentElement.querySelector("#total-likes").textContent++

                }
                else {
                    console.log(res);
                }
            }
        })
    }
    // comment action
    let commentActionBtnList = document.getElementsByClassName("post-action-btn")
    for (let i = 0; i < commentActionBtnList.length; i++) {
        let actionBtn = commentActionBtnList[i]
        actionBtn.addEventListener("click", () => {
            let actionList = actionBtn.parentElement.querySelector(".action-list")
            actionList.style.display = "block"
            let editBtn = actionList.querySelector(".edit")
            let deleteBtn = actionList.querySelector(".delete")
            let post_id = actionBtn.parentElement.parentElement.parentElement.id

            // edit
            editBtn.addEventListener("click", async (e) => {

            })

            // delete
            deleteBtn.addEventListener("click", async (e) => {
                const [res, code] = await useDelete("/posts/" + post_id)
                console.log(res);
                // mainSection = await Posts()
                document.getElementById("main_body").innerHTML = await Posts()

                if (code == 202) {
                }
            })

            setTimeout(() => {
                actionList.style.display = "none"
            }, 20000)

        })

    }

}, 1000)

// searching
setTimeout(() => {
    let search = document.getElementById("search")
    const searchResultsSection = document.getElementById("search-results")
    search.addEventListener("change", async (e) => {
        if (!search.value) return;
        const [res, code] = await usePost('/search', { text: search.value })
        console.log(res);
        let resultHtml = ''
        if (res.data) {
            res.data.forEach(item => {
                let is_post = ""
                if (item.is_post) {
                    is_post = "post"
                }
                else {
                    is_post = "user"
                }
                resultHtml += `
            <p id="${item.id}" class="search-result ${is_post}">${item.message.substr(0, 40)}</p>
            `
            })
            searchResultsSection.innerHTML = resultHtml
            // results

            setTimeout(() => {
                const searchResults = document.querySelectorAll(".search-result")

                if (searchResults.length > 0) {
                    searchResults.forEach(item => {
                        item.addEventListener("click", async () => {
                            let itemId = item.id
                            const [res, code] = await useGet('/posts/' + itemId)
                            console.log(res.data[0]);
                            document.getElementById("main_body").innerHTML = await Post([res.data[0]])
                        })
                    })
                }
            }, 1000)


        }
        else {
            searchResultsSection.innerHTML = '<p>0 results found</p>'
        }
    })
    // clear search
    document.getElementsByClassName("main_cancel")[0].addEventListener("click",()=>{
        console.log("clicked");
        document.getElementById("search-results").innerHTML = ""
    })

}, 1000)


// 

setTimeout(() => {
    const searchResultSection = document.getElementById("search-results")
    const searchResults = searchResultSection.querySelectorAll("search-result post")
    if (searchResults.length > 0) {
        console.log(searchResults);
        searchResults.addEventListener("click", (e) => {
            console.log(e);
        })
    }
}, 1000)