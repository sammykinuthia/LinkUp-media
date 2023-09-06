import { UpdateProfile, UserProfile, PeopleToFollow, Posts, Comment, ViewComments } from "./components.js"
import { useGet, usePost } from "./utils.js"

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

})

// posts section
document.getElementById("main_body").innerHTML = await Posts()
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
    let commentsList = document.getElementsByClassName("comments-count-section")
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
            commentForm.addEventListener('submit',async(e)=>{
                e.preventDefault()
                let commentMessage = commentSection.getElementById('comment-message').value
                let data = {image:commentImage, message:commentMessage, post_id,level:0,parent_comment:"",}
                const [res, code] = await usePost('/posts/comment', data)
                console.log(res);
                console.log(code); 
                if(code == 201){
                    commentSection = ""
                }
                else{
                    console.log(res);
                }
            })            
        })
    }
    // comments view //incomplete
    for (let i = 0; i < commentsList.length; i++) {
        let commentBtn = commentsList[i]
        commentBtn.addEventListener("click", async() => {
            let post_id = commentBtn.parentNode.parentNode.id
            let post = document.getElementById(post_id)
            let commentSection = post.getElementsByClassName("post-view-comments-section")[0]
            commentSection.innerHTML = await ViewComments(post_id)

        })
    }
}, 1000)