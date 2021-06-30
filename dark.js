window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#container')
  const twitchIDForm = document.querySelector('#twitch-id')
  const twitchChatForm = document.querySelector('#twitch-chat-embed')
  const twitchButton = document.querySelector('#show-twitch')
  const lTwitchButton = document.querySelector('#live-twtich')
  const liveList = document.querySelector('#list-live')
  const dTwip = document.querySelector('#d-twip')
  const dToonation = document.querySelector('#d-toonation')
  const checkboxDark = document.querySelector('#checkbox-dark')
  const body = document.querySelector('body')

  checkboxDark.checked = JSON.parse(window.localStorage.getItem('darked'))

  switching(undefined, checkboxDark.checked)

  function switching(evt, init) {
    const checked = init || checkboxDark.checked
    const darkButton = ['btn-dark', 'text-white']
    const darkBorder = ['border-white']
    const darkBackground = ['bg-dark', 'text-white']

    window.localStorage.setItem('darked', checked)

    if (checked) {
      twitchButton.classList.add(...darkButton, ...darkBorder)
      lTwitchButton.classList.add(...darkButton, ...darkBorder)
      twitchIDForm.classList.add(...darkBorder)
      container.classList.add(...darkBackground)
      body.classList.add(...darkBackground)
      twitchIDForm.classList.add(...darkBackground)
      if (evt) {
        twitchChatForm.src = twitchChatForm.src + '&darkpopout'
      }
    } else {
      console.log('foo')
      twitchButton.classList.remove(...darkButton, ...darkBorder)
      lTwitchButton.classList.remove(...darkButton, ...darkBorder)
      twitchIDForm.classList.remove(...darkBorder)
      container.classList.remove(...darkBackground)
      body.classList.remove(...darkBackground)
      twitchIDForm.classList.remove(...darkBackground)
      twitchChatForm.src = twitchChatForm.src.replace('&darkpopout', '')
    }
  }

  checkboxDark.onclick = switching
})
