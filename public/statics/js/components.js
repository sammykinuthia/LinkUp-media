import { comments, posts } from "./data.js"
import { currentUser } from "./main.js"
import { toastMessage, useGet, usePost, usePut } from "./utils.js"

export function UserProfile(user) {
    const { image, name, username, email, phone, followers, following, posts } = user
    return (`
        <div class="user-profile">
            <div class="profile-img">
                <img src="${image}" alt="profile image">
            </div>
            <div class="following-section">
                <p><span class="user-data">${followers || 0}<span> followers</p>
                <p><span class="user-data">${following || 0}<span> following</p>
                <p><span class="user-data">${posts || 0}<span> Posts</p>
                </div>
                <br/>
            <div class="users-details">
                <p>Name: <span class="user-data">${name || null}</span></p>
                <p>Username: <span class="user-data"> ${username}</span></p>
                <p>Email: <span class="user-data"> ${email}</span></p>
                <p>Phone: <span class="user-data"> ${phone || null}</span></p>
                <button id="profile-update">update</button>
            </div>
        </div>
    `)
}

export function UpdateProfile(user) {
    let { image, name, username, email, phone } = user

    setTimeout(() => {
        document.getElementById("image").addEventListener("change", (e) => {
            console.log(e.target.files[0]);
            let formData = new FormData()
            formData.append('file', e.target.files[0])
            formData.append('upload_preset', 'linkup')
            fetch("https://api.cloudinary.com/v1_1/dbeq8dpkz/image/upload", { method: "POST", body: formData }).then(res => res.json()).then(data => {
                image = data.url
                console.log(data);

            })
        })

        document.getElementById("profile-form").addEventListener("submit", async e => {
            e.preventDefault()
            let name = document.getElementById('name').value
            let email = document.getElementById('email').value
            let username = document.getElementById('username').value
            let phone = document.getElementById('phone').value
            let data = { name, email, username, phone, image }
            console.log(data);
            const [res, code] = await usePut('/users/update', data)
            const messageSection = document.getElementById("form-message")
            if (code == 204) {
                messageSection.textContent = "Update Successifully"
                messageSection.style.visibility = "visible"
                messageSection.style.background = "#384d1a"
                messageSection.style.margin = "0 auto"
            }
            console.log(res);
            setTimeout(() => {
                messageSection.style.visibility = "hidden"
                toastMessage("update success")
            }, 3000)
        })

    }, 1000)
    return (`
        <div class="user-profile">
            <div class="profile-img">
                <img src="${image || ""}" alt="profile image">
            </div>
            <div class="users-details">
                <p id="form-message"></p>
                <form id="profile-form">
                    <label>Full Name
                        <input type="text" name="name" id="name" placeholder="John Doe" value="${name || ""}">
                    </label>
                    <label>Username
                        <input type="text" name="username" id="username" placeholder="john" value="${username || ""}">
                    </label>
                    <label>Email
                        <input type="email" name="email" id="email" placeholder="johndow@gmail.com" value="${email || ""}">
                    </label>
                    <label>Phone no.
                        <input type="text" name="phone" id="phone" placeholder="0720360220" value="${phone || ""}">
                    </label>
                    <label>Profile Image
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m14-7l-5-5l-5 5m5-5v12"/></svg>
                        <input type="file" name="image" id="image"  value="${image || ""}">
                    </label>
                    <div class="profile-action-section">
                        <button type="submit">update</button>
                    </div>
                </form>
            </div>
        </div>
    `)
}



export async function PeopleToFollow() {
    const usersNotFollowing = await useGet("/users/notfollowing")
    const usersFollowing = await useGet("/users/following")
    //    console.log(usersFollowing);
    let users = usersNotFollowing[0].data
    let usersList = ""

    setTimeout(() => {
        let followbtnList = document.getElementsByClassName("person-follow-btn")
        if (followbtnList) {
            for (let i = 0; i < followbtnList.length; i++) {
                followbtnList[i].addEventListener("click", async (e) => {
                    console.log(followbtnList[i].parentNode.id);
                    let follow_id = followbtnList[i].parentNode.id
                    const [resp, code] = await usePost("/users/follow", { follow_id })
                    if (code == 201) {
                        followbtnList[i].textContent = "Following"
                    }
                    console.log(resp);
                })
            }
        }
        else {

        }
    }, 1000)

    if (users) {
        users.forEach(user => {
            usersList += `
            <div class="person-follow" id="${user.id}">
                <div class="person-profile">
                    <svg class="nav-icon icon-person" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8zm0 16s8 0 8-2c0-2.4-3.9-5-8-5s-8 2.6-8 5c0 2 8 2 8 2z" />
                    </svg>
                </div>
                <h4 class="person-name">${user.full_name || user.username}</h4>
                <button class="person-follow-btn">Follow</button>
            </div>
    
            `
        }
        )
    }
    else {
        usersList = "<p>No users to follow</p>"
    }
    return (usersList)
}

export async function Posts(explore = false) {

    let postList = []
    if (explore) {
        postList = await posts(explore)
    }
    else {
        postList = await posts()
    }
    let postHtml = ""
    postList.forEach(post => {
        let postImage = `<div class="post-img-section">
                            <img src="${post.image}"
                            alt="" class="post-img">
                        </div>`
                        console.log(post);
        postHtml += `
                    <div class="post" }">
                        <div class="person-image">
                            <svg class="nav-icon icon-person" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8zm0 16s8 0 8-2c0-2.4-3.9-5-8-5s-8 2.6-8 5c0 2 8 2 8 2z" />
                            </svg>
                        </div>
                        <div class="post-main" id="${post.id}">
                            <h4 class="post-username" id="${post.user_id}">${post.full_name || post.username}</h4>
                            <p class="post-message">${post.message || ""}</p>
                            ${post.image && postImage}
                            <div class="post-comment-like-section">
                                <div class="likes-count-section">
                                    <svg class="post-action-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.987 10.987 0 0 0 15 8Z"/></svg>
                                    <p id="total-likes">${post.likes || 0}</p>
                                </div>
                                <div class="comments-count-section">
                                    <p ><span id="total-comments">${post.comments || 0}</span>  Comments</p>
                                </div>
                            </div>
                            <div class="post-actions">
                                <div class='like-section ${post.liked == 1 ? "liked" : ""}'>
                                    <svg class="post-action-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M23 10a2 2 0 0 0-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2M1 21h4V9H1v12Z"/></svg>
                                    Like
                                </div>
                                <div class='comment-section'>
                                    <svg class="post-action-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 13.25 12H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 13.543V12H2.75A1.75 1.75 0 0 1 1 10.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h4.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>
                                    Comment
                                </div>
                            </div>
                            <div id="post-create-comment-section" class="post-create-comment-section">

                            </div>
                            <div id="post-view-comments-section" class="post-view-comments-section">
                            </div>
                        </div>
                    </div>
                     `
    })
    console.log(postList);
    return (postHtml)
}

export async function Comment() {
    return (`
            <div class="comment">
                    <div class="person-image">
                        <svg class="nav-icon icon-person" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8zm0 16s8 0 8-2c0-2.4-3.9-5-8-5s-8 2.6-8 5c0 2 8 2 8 2z" />
                        </svg>
                    </div>
                    
                    <form id="comment-form">
                        <textarea name="comment" id="comment-message" placeholder="Say something"></textarea>
                    <div class="comment-actions">
                        <label>
                            <input type="file" name="post-img" id="post-img">
                            <svg id="post-upload" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Zm1-4h12l-3.75-5l-3 4L9 13l-3 4Z"/></svg>
                        </label>
                        <button type='submit'>
                            <svg id="comment-send" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.912 12H4L2.023 4.135A.662.662 0 0 1 2 3.995c-.022-.721.772-1.221 1.46-.891L22 12L3.46 20.896c-.68.327-1.464-.159-1.46-.867a.66.66 0 0 1 .033-.186L3.5 15"/></svg>
                        </button>
                    </div>
                </form>
                </div>
    `)
}

export async function ViewComments(post_id) {
    let commentsList = await comments(post_id)
    let commentHtml = ""
    let mainCommentsList = commentsList.filter(i => !i.parent_comment)
    let subComments = commentsList.filter(i => i.parent_comment)
    console.log(mainCommentsList);
    if (mainCommentsList.length) {
        for (let i = 0; i < mainCommentsList.length; i++) {
            let comment = mainCommentsList[i]
            let commetImage = `<div class="post-img-section">
                                    <img src="${comment.image}"
                                    alt="" class="post-img">
                                </div>`

            commentHtml += `
                <div class="post">
                    <div class="person-image">
                        <svg class="nav-icon icon-person" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8zm0 16s8 0 8-2c0-2.4-3.9-5-8-5s-8 2.6-8 5c0 2 8 2 8 2z" />
                        </svg>
                    </div>
                    <div class="post-main" id="${comment.id}">
                        <h4 class="comment-username" id="${comment.user_id}">${comment.full_name || comment.username}</h4>
                        <p class="comment-message">${comment.message || ""}</p>
                        ${comment.image && commetImage}
                        <div class="view-comment-actions">
                            <div>
                                <p class='comment-like'>Like</p>
                                <p class='comment-reply'>Reply</p>
                            </div>
                            <div>
                            <span id="comment-like-total">0</span>likes
                            </div>
                            
                        </div>
                        <div id="comment-create-comment-section" class="comment-create-comment-section">

                        </div>
                        <div id="comment-view-comments-section" class="comment-view-comments-section">
                        </div>
                    </div>
                </div>
                `
            // subcomment
            let sub = subComments.filter(i => i.parent_comment == comment.id)
            if (sub) {
                sub.forEach(subComment => {
                    commentHtml += `
                        <div class="post level-1">
                        <div class="person-image">
                            <svg class="nav-icon icon-person" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24">
                                <path fill="currentColor"
                                    d="M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8zm0 16s8 0 8-2c0-2.4-3.9-5-8-5s-8 2.6-8 5c0 2 8 2 8 2z" />
                            </svg>
                        </div>
                        <div class="post-main" id="${subComment.id}">
                            <h4 class="comment-username" id="${subComment.user_id}">${subComment.full_name || subComment.username}</h4>
                            <p class="comment-message">${subComment.message || ""}</p>
                            ${subComment.image && commetImage}
                            <div class="view-comment-actions">
                                <div>
                                    <p class='comment-like'>Like</p>
                                </div>
                                <div>
                                <span id="comment-like-total">0</span>likes
                                </div>
                                
                            </div>
                            <div id="comment-create-comment-section" class="comment-create-comment-section">
    
                            </div>
                            <div id="comment-view-comments-section" class="comment-view-comments-section">
                            </div>
                        </div>
                    </div>
                        `
                })
            }
        }
    }

    return (commentHtml)

}