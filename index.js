window.addEventListener('DOMContentLoaded', () => {
  const anchors = window.location.href.split('#')[1]
  const twitchIDForm = document.querySelector('#twitch-id')
  const twitchChatForm = document.querySelector('#twitch-chat-embed')
  const twitchButton = document.querySelector('#show-twitch')
  const lTwitchButton = document.querySelector('#live-twtich')
  const liveList = document.querySelector('#list-live')
  const parent = window.location.host.split(':')[0]
  const clinetID = '9bplcpum7fvmne0rol9cubfl4yy8xw'
  const dTwip = document.querySelector('#d-twip')
  const dToonation = document.querySelector('#d-toonation')
  const checkboxDark = document.querySelector('#checkbox-dark')

  var modal = new bootstrap.Modal(document.getElementById('modal-stream'), {
    keyboard: false,
  })

  /** Initialize Form */
  twitchIDForm.value = localStorage.getItem('channel') || 'lck_korea'
  dTwip.href = `https://twip.kr/donate/${twitchIDForm.value}`
  dToonation.href = `https://toon.at/donate/${twitchIDForm.value}`

  /** Initailize Twitch Player */
  const player = new Twitch.Player('twitch-embed', {
    width: 405,
    height: 240,
    channel: twitchIDForm.value,
    parent: [parent],
  })
  if (checkboxDark.checked)
    twitchChatForm.src = `https://www.twitch.tv/embed/${twitchIDForm.value}/chat?parent=${parent}&darkpopout`
  else
    twitchChatForm.src = `https://www.twitch.tv/embed/${twitchIDForm.value}/chat?parent=${parent}`
  dTwip.href = `https://twip.kr/donate/${twitchIDForm.value}`

  /** Change Channel */
  twitchButton.onclick = () => {
    player.setChannel(twitchIDForm.value)
    if (checkboxDark.checked)
      twitchChatForm.src = `https://www.twitch.tv/embed/${twitchIDForm.value}/chat?parent=${parent}&darkpopout`
    else
      twitchChatForm.src = `https://www.twitch.tv/embed/${twitchIDForm.value}/chat?parent=${parent}`
    localStorage.setItem('channel', twitchIDForm.value)
    dTwip.href = `https://twip.kr/donate/${twitchIDForm.value}`
    dToonation.href = `https://toon.at/donate/${twitchIDForm.value}`
  }

  /** Find Live Stream */
  lTwitchButton.onclick = async () => {
    const modalContent = document.querySelector('.modal-content')
    if (checkboxDark.checked) {
      modalContent.classList.add('bg-dark')
    } else {
      modalContent.classList.remove('bg-dark')
    }

    if (!anchors) {
      const a = document.createElement('a')
      const linkText = document.createTextNode('로그인이 필요합니다.')
      a.appendChild(linkText)
      a.href = `https://id.twitch.tv/oauth2/authorize?client_id=${clinetID}&redirect_uri=${window.location.origin}&response_type=token&scope=user_read+user:read:follows`
      a.classList.add('link-success')
      liveList.textContent = ''
      liveList.appendChild(a)
      return
    }
    try {
      const authData = {}
      anchors.split('&').forEach(v => {
        const [key, value] = v.split('=')
        authData[key] = value
      })
      if (!authData['access_token']) {
        const a = document.createElement('a')
        const linkText = document.createTextNode('로그인이 필요합니다.')
        a.appendChild(linkText)
        a.href = `https://id.twitch.tv/oauth2/authorize?client_id=${clinetID}&redirect_uri=${window.location.origin}&response_type=token&scope=user:read:follows`
        a.classList.add('link-success')
        liveList.textContent = ''
        liveList.appendChild(a)
      } else {
        const resUser = await axios({
          url: `https://api.twitch.tv/kraken/user`,
          headers: {
            Accept: 'application/vnd.twitchtv.v5+json',
            'Client-ID': clinetID,
            Authorization: `OAuth ${authData['access_token']}`,
          },
        })
        const user = resUser.data
        const resFollowed = await axios({
          url: `https://api.twitch.tv/helix/streams/followed?user_id=${user._id}`,
          headers: {
            Accept: 'application/vnd.twitchtv.v5+json',
            'Client-ID': clinetID,
            Authorization: `Bearer ${authData['access_token']}`,
          },
        })
        const followed = resFollowed.data.data
        const ul = document.createElement('ul')
        ul.style = 'max-height: 400px; overflow-y: auto;'
        ul.classList.add('list-group')
        followed.forEach(v => {
          const button = document.createElement('button')
          const textNode = document.createTextNode(`${v.user_name}`)
          button.appendChild(textNode)
          button.classList.add('list-group-item')
          button.classList.add('list-group-item-action')
          button.onclick = () => {
            twitchIDForm.value = v.user_login
            player.setChannel(v.user_login)
            if (checkboxDark.checked)
              twitchChatForm.src = `https://www.twitch.tv/embed/${twitchIDForm.value}/chat?parent=${parent}&darkpopout`
            else
              twitchChatForm.src = `https://www.twitch.tv/embed/${twitchIDForm.value}/chat?parent=${parent}`
            localStorage.setItem('channel', v.user_login)
            dTwip.href = `https://twip.kr/donate/${v.user_login}`
            dToonation.href = `https://toon.at/donate/${v.user_login}`
            modal.hide()
          }
          ul.appendChild(button)
          if (checkboxDark.checked) {
            button.classList.add('bg-dark')
            button.classList.add('text-white')
            button.classList.add('border-white')
          } else {
            button.classList.remove('bg-dark')
            button.classList.remove('text-white')
            button.classList.remove('border-white')
          }
        })

        liveList.textContent = ''
        liveList.appendChild(ul)
      }
    } catch (error) {
      console.log(error)
      liveList.innerText = '에러가 발생했습니다.'
    }
  }
})
