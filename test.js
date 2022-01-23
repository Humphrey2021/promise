const MyPromise = require('./MyPromise')

const p = new MyPromise((resolve, reject) => {
    // resolve(1)
    // reject('error')
    setTimeout(() => {
        resolve(1)
        // reject('error')
    }, 2000)
})

p.finally(() => {
    console.log('finally')
}).then(r => console.log(r))

MyPromise.resolve(200).then(r => console.log(r))

const arr = [1, 2, 3, 4, p, 5]

MyPromise.all(arr).then(r => {
    console.log(r)
}).catch(e => console.log(e))

p.then().then().then(v => console.log(v)).catch(e => console.log(e))

p.then().then().then(r => {
    console.log(r)
    return 100
}).then(r => console.log(r))

const p1 = new MyPromise(resolve => resolve(100))
const p2 = p.then(r => {
    console.log(r)
    // return '666'
    // return p2
    return p1
})
p2.then(r => console.log(r), e => console.log(e))

p.then(r => console.log(r), e => console.log(e))
p.then(r => console.log(r), e => console.log(e))
p.then(r => console.log(r), e => console.log(e))