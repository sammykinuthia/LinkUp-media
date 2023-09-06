const token = localStorage.getItem("token")

export const usePost = async (url, data = {}) => {
    const res = await fetch(url, { method: "post", headers: { "Content-Type": "application/json", token }, body: JSON.stringify(data) })
    const result = await res.json()
    return [result, res.status]
}

export const useGet = async (url) => {
    const res = await fetch(url, { headers: { "Content-Type": "application/json", token }})
    const result = await res.json()
    return [result, res.status]

}

export const usePut = async (url, data = {}) => {
    const res = await fetch(url, { method: "put", headers: { "Content-Type": "application/json", token }, body: JSON.stringify(data) })
    return [res, res.status]
}