import { usePost } from "../../statics/js/utils.js"

const form = document.getElementById("register-form")

form.addEventListener('submit', async e => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const username = document.getElementById("username").value
    const messageSection = document.getElementById("form-message")
    const data = {email, password, username}
    const [res, code] = await usePost('/users/register', data)
    console.log(res);
    if(code == 422){
        messageSection.innerText = res[0].message
        messageSection.style.visibility = "visible"
        messageSection.style.background = "#7e4d4d"
    }
    else if(code == 500){
        messageSection.innerText = "User with that email | username already exists"
        messageSection.style.visibility = "visible"
        messageSection.style.background = "#7e4d4d"

    }
    else if(res.token){
        localStorage.setItem("token", res.token)
        messageSection.innerText = "login success"
        messageSection.style.visibility = "visible"
        messageSection.style.background = "#384d1a"
        setTimeout(()=>{
            window.location.replace("/")
        },1000)
    }
    
    setTimeout(()=>{
        messageSection.style.visibility = "hidden"
    },3000)
})