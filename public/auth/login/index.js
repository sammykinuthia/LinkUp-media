import { usePost } from "../../statics/js/utils.js"

const form = document.getElementById("login-form")

form.addEventListener('submit', async e => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const messageSection = document.getElementById("form-message")
    const data = {email, password}
    const [res, code] = await usePost('/users/login', data)
    if(code == 422){
        messageSection.innerText = res[0].message
        messageSection.style.visibility = "visible"
        messageSection.style.background = "#7e4d4d"
    }
    else if(code == 403){
        messageSection.innerText = res.message
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