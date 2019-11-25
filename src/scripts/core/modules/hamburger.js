export default {
  init () {
    const heading = document.querySelector('.wrap > h1:first-child') ||
      document.querySelector('.wrap > h2:first-child')

    if (!heading) return

    const hamburger = document.createElement('a')
    hamburger.addEventListener('click', () => {
      document.body.classList.toggle('wp-responsive-open')
    })
    hamburger.classList.add('hamburger')
    hamburger.id = 'wp-menu-toggle'
    hamburger.innerHTML = `
      <div id="toggle-ripple"></div>
      <div id="toggle-menu-wrap">
        <svg viewBox="0 0 150 150" x="0px" y="0px" width="30">
          <path id="sticky-toggle" d="M41,78h71c0,0,29.7-8,16-36c-1.6-3.3-19.3-30-52-30c-36,0-64,29-64,65c0,29,26,59,61.6,59c41.4,0,62.6-29,62.6-59c0-37.7-19.2-49.1-26.3-54" stroke-linejoin="round" stroke-linecap="round">
          </path>
        </svg>
        <div id="st-line-top"></div>
        <div id="st-line-bot"></div>
      </div>`
    heading.prepend(hamburger)
  }
}
