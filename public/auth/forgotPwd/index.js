import { authMessageToast, usePost } from "../../statics/js/utils.js"


const formMail = document.getElementById("form-email")
const formCode = document.getElementById("form-code")
const formPwd = document.getElementById("form-password")
let emailField = ''
formMail.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = formMail.querySelector("#email")
    const [res, statusCode] = await usePost("/users/forgotpwd", { email: email.value })
    console.log(res);
    if (statusCode == 200) {
        authMessageToast("code sent to email")
        emailField = email.value
        formMail.style.display = "none"
        formCode.style.display = "flex"
        formCode.querySelector("#email").value = emailField
        formCode.querySelector("#email").disable = true
        formPwd.querySelector("#email").value = emailField
        formPwd.querySelector("#email").disable = true


    }
    else {
        authMessageToast(res.message, false)
    }
})


formCode.addEventListener('submit', async (e) => {
    e.preventDefault()
    const code = formCode.querySelector("#code")
    const data = { email: emailField, code: code.value }
    console.log(data);
    const [res, statusCode2] = await usePost("/users/verifycode",data )
    console.log(res);
    if (statusCode2 == 200) {
        authMessageToast("code verified")
        formCode.style.display = "none"
        formPwd.style.display = "flex"

    }
    else {
        authMessageToast(res.message, false)

    }


})

formPwd.addEventListener("submit", async (e) => {
    e.preventDefault()
    const password = document.getElementById("password")
    const passwordConfirm = document.getElementById("password-confirm")
    if (password.value != passwordConfirm.value) {
        authMessageToast("Passwords do not match", false)
    }
    else {
        const [res, statusCode3] = await usePost('/users/changepwd', { email: emailField, password: password.value })
        if (statusCode3 == 200) {
            authMessageToast("Password changed Successfully")
            setTimeout(() => {
                window.location.replace('/auth/login')
            }, 1000)

        }
        else {
            authMessageToast(res.message, false)
        }
    }

})