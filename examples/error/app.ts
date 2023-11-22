import axios, { AxiosError } from '../../src/index'
axios({
    method: 'get',
    url: '/error/get1'
}).then((res) => {
    console.log(res)
}).catch((e) => {
    console.log(e)
})

axios({
    method: 'get',
    url: '/error/get'
}).then((res) => {
    console.log(res)
}).catch((e) => {
    console.log(e)
})

setTimeout(() => {
    axios({
        method: 'get',
        url: '/error/get'
    }).then((res) => {
        console.log(res)
    }).catch((e) => {
        console.log(e)
    })
}, 5000)

axios({
    method: 'get',
    url: '/error/timeout',
    timeout: 2000
}).then((res) => {
    console.log(res)
}).catch((e: AxiosError) => {
    console.log(e.message)
    console.log(e.code)
})


interface User {
    name: string
    age: number
}
interface ResponseData<T = any> {
    code: number
    result: T
    message: string
}
function getUser<T>() {
    return axios<ResponseData<T>>('/extend/user')
        .then(res => res.data)
        .catch(err => console.error(err))
}


async function test() {
    const user = await getUser<User>()
    if (user) {
        console.log(user.result.name)
    }
}

test()