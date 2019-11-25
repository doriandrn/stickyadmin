require('../assets/styles/index.styl')
import StickyJs from './core/Sticky'

const modules = {
  hamburger: {},
  header: {}
}


document.addEventListener('DOMContentLoaded', () => {
  const sticky = new StickyJs({ modules })
  const { body } = document
  body.classList.remove('is_loading')
})
