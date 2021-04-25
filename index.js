"use strict"
import 'regenerator-runtime/runtime'

let url = 'https://jsonplaceholder.typicode.com/photos?_start=0&_limit=100&_acc=50'


const body = document.querySelector('body')
const lazy = document.querySelector('.lazy')
const lazyCounter = document.querySelector('.lazy__counter')
const lazyAcc = lazyCounter.querySelector('.lazy__counter__acc')
const lazyBtnLoad = lazyCounter.querySelector('.lazy__counter__load')

function createLoader() {
    return `
         <div class="lds">
         <div class="lds-spinner">
          <div></div><div></div>
          <div></div><div></div>
          <div></div><div></div>
          <div></div><div></div>
          <div></div><div></div>
          <div></div><div></div>
          </div>
          </div>
`
}

function addedLoader() {
    body.insertAdjacentHTML('beforeend', `${createLoader()}`)
}

function removeLoader() {
    const lds = document.querySelector('.lds')
    lds.remove()
}

function createCard(el) {
    const htmlCard = `<div class="lazy__card">
                <img loading="lazy"  class="lazy__card__img" src="http://dummyimage.com/80" data-src="${el.thumbnailUrl}" alt="${el.title}">
                <div class="lazy__card__name">
                    <p class="lazy__name__title">${el.title.slice(0, 10).padEnd(30, '.')}</p>
                </div>
            </div>`
    lazy.insertAdjacentHTML("beforeend", htmlCard)
}

async function getPictures() {
    try {
        const response = await fetch(url)
        return await response.json()
    } catch (e) {
        console.error('Ошибка', e)
    }
}

function callGetPictures() {
    getPictures().then(el => {
        el.forEach(el => {
            createCard(el)
        })
        lazyAcc.textContent = `${el.length}`
    })
}

function createIntersectionObserver() {
    const options = {
        root: null,
        threshold: 0,
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target
                img.src = img.dataset.src
                observer.unobserve(img)
            }
        })
    }, options)
    const images = Array.from(document.querySelectorAll('img'))
    images.forEach((image) => {
        imageObserver.observe(image)
    })
}

function loadLimit() {
    const regLimit = /(_limit=)(\d+)/gi
    let count = Number(url.match(/(\d+)$/gi))
    let countTwo = Number(url.match(/_limit=(\d+)/gi)
        .flatMap(el=> el.split(''))
        .filter(el => !isNaN(Number(el))).join(''))
    url = url.replace(regLimit, `$1${count + countTwo}`)
    return url
}

callGetPictures()

if (document.readyState === 'loading') {
    addedLoader()
}

setTimeout(removeLoader, 2000)

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(createIntersectionObserver, 1000)
})

lazyBtnLoad.addEventListener('click', () => {
    loadLimit()
    addedLoader()
    callGetPictures()
    setTimeout(removeLoader, 2000)
    setTimeout(createIntersectionObserver, 1000)
})





