'use strict'

const url = 'https://jsonplaceholder.typicode.com/photos'
const newData = []
const lazy = document.querySelector('.lazy')

const getPictures = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    newData.concat(...data)
}

newData.forEach(el => {
    const createCard = document.createElement('div')
    createCard.className = 'lazy__card';
    const crateImg = document.createElement('img')
    crateImg.className = "lazy__card__img"
})

