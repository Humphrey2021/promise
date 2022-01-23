const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }
    status = PENDING
    value = undefined
    reason = undefined
    successCallback = []
    failCallback = []
    resolve = value => {
        if (this.status !== PENDING) return
        this.status = FULFILLED
        this.value = value
        while (this.successCallback.length) this.successCallback.shift()()
    }
    reject = reason => {
        if (this.status !== PENDING) return
        this.status = REJECTED
        this.reason = reason
        while (this.failCallback.length) this.failCallback.shift()()
    }
    then(successCallback, failCallback) {
        const promise = new MyPromise((resolve, reject) => {
            successCallback = successCallback ? successCallback : v => v
            failCallback = failCallback ? failCallback : v => reject(v)
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        const v = successCallback(this.value)
                        resolvePromise(promise, v, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        const v = failCallback(this.reason)
                        resolvePromise(promise, v, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else {
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            const v = successCallback(this.value)
                            resolvePromise(promise, v, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            const v = failCallback(this.reason)
                            resolvePromise(promise, v, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }
        })
        return promise
    }
    catch(failCallback) {
        return this.then(undefined, failCallback)
    }
    finally (callback) {
        return this.then(r => {
            return MyPromise.resolve(callback()).then(() => r)
        }, e => {
            return MyPromise.resolve(callback()).catch(() => e)
        })
    }
    static all (array) {
        return new MyPromise((resolve, reject) => {
            if (!array instanceof Array) return this.reject(TypeError('not an array type'))
            const result = []
            let idx = 0
            function addData (key, value) {
                result[key] = value
                idx ++
                if (array.length === idx) resolve(result)
            }
            array.forEach((item, index) => {
                if (item instanceof MyPromise) {
                    this.then(r => addData(index, r), e => reject(e))
                } else {
                    addData(index, item)
                }
            })
        })
    }
    static resolve(v) {
        if (v instanceof MyPromise) return v
        return new MyPromise(resolve => resolve(v))
    }
}
function resolvePromise(p, v, resolve, reject) {
    if (p === v) return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    if (v instanceof p) return v.then(resolve, reject)
    resolve(v)
}

module.exports = MyPromise
