import MobileView from './mobile-view.js'
import FindStreamer from './find-streamer.js'
import GetFollowed from './get-followed.js'
import Buttons from './buttons.js'
import TwitchPlayer from './twitch-player.js'

export default {
  template: `
  <MobileView :darked="darked">
    <template v-slot:find-streamer>
      <FindStreamer 
        :darked="darked" 
        :streamerId="streamerId" 
        @change="changeChannel" 
      />
    </template>
    <template v-slot:get-followed>
      <GetFollowed
        :darked="darked" 
        :authData="authData"
        :clientId="clientId" 
        :getUser="getUser" 
        @changed="changeChannel"
      />
    </template>
    <template v-slot:buttons>
      <Buttons 
        :darked="darked" 
        :streamerId="streamerId" 
        :authData="authData"
        :clientId="clientId" 
        :getUser="getUser" 
        @change="changeDarkMode" 
        @select="changeVideo" 
      />
    </template>
    <template v-slot:twitch-player>
      <TwitchPlayer :darked="darked" :streamerId="streamerId" :videoId="videoId" :parent="parent" />
    </template>
  </MobileView>
  `,
  components: { MobileView, FindStreamer, GetFollowed, Buttons, TwitchPlayer },
  data() {
    return {
      darked: localStorage.getItem('darked') === 'true', // 다크모드
      authData: {}, // 인증 정보
      clientId: '9bplcpum7fvmne0rol9cubfl4yy8xw', // 클라이언트 ID
      parent: window.location.host.split(':')[0], // 현재 주소
      user: null,
      modal: null,
      streamerId: localStorage.getItem('channel') || 'lck_korea',
      videoId: '',
    }
  },
  methods: {
    async getUser() {
      if (this.user !== null) return this.user 
      else {
        const accessToken = this.authData.access_token
        try {
          const response = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Client-Id': this.clientId,
            }
          })

          const json = await response.json()

          return this.user = json.data[0]
        }
        catch (error) {
          return null
        }
      }
    },
    changeChannel(channelInfo) {
      this.videoId = ''
      this.streamerId = channelInfo.streamerId
      localStorage.setItem('channel', this.streamerId)
    },
    changeVideo(videoId) {
      this.streamerId = ''
      this.videoId = videoId
    },
    changeDarkMode(val) {
      this.darked = val
      localStorage.setItem('darked', this.darked)
      
      if (this.darked)
        document.querySelector('body').classList.add('bg-dark')
      else
        document.querySelector('body').classList.remove('bg-dark')
    }
  },
  mounted() {
    // access token을 파싱한다
    const anchors = window.location.href.split('#')[1]
    anchors?.split('&').forEach(v => {
      const [key, value] = v.split('=')
      this.$set(this.authData, key, value)
    })

    // 최근에 시청한 스트리머가 있으면 해당 id를 불러온다.
    this.changeChannel({ streamerId: this.streamerId })

    // 다크모드 초기화
    if (localStorage.getItem('darked') === null) {
      localStorage.setItem('darked', false)
    }

    if (this.darked)
      document.querySelector('body').classList.add('bg-dark')
    else
      document.querySelector('body').classList.remove('bg-dark')
  }
}