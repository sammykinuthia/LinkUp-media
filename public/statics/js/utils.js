const token = localStorage.getItem("token")

export const usePost = async (url, data = {}) => {
    const res = await fetch(url, { method: "post", headers: { "Content-Type": "application/json", token }, body: JSON.stringify(data) })
    const result = await res.json()
    return [result, res.status]
}

export const useGet = async (url) => {
    const res = await fetch(url, { headers: { "Content-Type": "application/json", token } })
    const result = await res.json()
    return [result, res.status]

}

export const usePut = async (url, data = {}) => {
    const res = await fetch(url, { method: "put", headers: { "Content-Type": "application/json", token }, body: JSON.stringify(data) })
    return [res, res.status]
}
export const useDelete = async (url) => {
    const res = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json", token }})
    return [res, res.status]
}



export function toastMessage(message) {
    const toastSection = document.querySelector(".toast-section")
    const toastMsg = document.querySelector(".toast-body")
    toastMsg.textContent = message
    toastSection.style.visibility = "visible"

    setTimeout(() => {
        toastSection.style.visibility = "hidden"
    }, 1000)
}

export function authMessageToast(message, isSuccess=true) {
    const messageSection = document.getElementById("form-message")
    messageSection.innerText = message
    messageSection.style.visibility = "visible"
    if (isSuccess) {
        messageSection.style.background = "#384d1a"
    }
    else {
        messageSection.style.background = "#7e4d4d"
    }
    setTimeout(()=>{
        messageSection.style.visibility = "hidden"
    },2000)
}