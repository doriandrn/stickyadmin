export default {
  init () {
    const { body } = document
    document.addEventListener('scroll', e => {
      body.classList.toggle('header-small', window.scrollY >= 44)
    })
  }
}
