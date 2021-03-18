// Promise 并发限制
let urls = [
    {
        link: "image_1",
        limit: 300
    },
    {
        link: "image_2",
        limit: 1000
    },
    {
        link: "image_3",
        limit: 2000
    },
    {
        link: "image_4",
        limit: 500
    },
    {
        link: "image_5",
        limit: 600
    },
    {
        link: "image_6",
        limit: 800
    },
    {
        link: "image_7",
        limit: 900
    }
]

function loadImage(url) {
    let promise = new Promise((resolve, reject) => {
        console.log("---" + url.link + " start!")
        setTimeout(() => {
            console.log(url.link + " ok!!!")
            resolve()
        }, url.limit)
    })
    return promise
}

// 实现并发请求控制的函数limitLoad
function limitLoad(urls, handler, limit) {
    let sequence = urls.slice()  //copy一份
    // promise每一项变为了对应的Promise对象
    let promise = sequence.splice(0, limit).map((url, index) => {
        return handler(url).then(() => {
            return index
        })
    })
    // race, 竞速
    let p = Promise.race(promise)
    for(let i=0; i<sequence.length; i++) {
        // 每次循环都可做到链式调用
        p = p.then(res => {
            promise[res] = handler(sequence[i]).then(() => {
                return res
            })
            return Promise.race(promise)
        })
    }
}

limitLoad(urls, loadImage, 3)