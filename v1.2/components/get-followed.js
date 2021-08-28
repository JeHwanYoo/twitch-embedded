import { Modal } from '../lib/bootstrap.esm.js'

export default {
  template: `
    <div>
      <button id="twitch-get-followed-button" :class="['btn', 'w-100', 'fw-bold', darkFont, darkBorder, darkButton]" type="button" @click="getFollowed">
        팔로우 채널 불러오기
      </button>

      <div :class="['modal', 'fade', darkFont]" id="modal-stream" tabindex="-1">
        <div class="modal-dialog">
          <div :class="['modal-content', darkBackground]">
            <div class="modal-header">
              <h5 class="modal-title">생방송 중인 채널</h5>
            </div>
            <div class="modal-body">
              <ul id="live-list" :class="['list-group', 'w-100']"> 
                <template v-if="!isLoggedIn"> 
                  <a :class="['btn', 'btn-link', darkLink]" :href="loginURL"> 로그인이 필요합니다. </a>
                </template>
                <template v-else-if="!isLoaded"> 불러오는 중입니다... </template>
                <template v-else-if="!error">
                    <button v-for="streamer in followed" :key="streamer.user_login" :class="['list-group-item', 'list-group-item-action', darkBackground, darkFont, darkBorder]" @click="changeChannel(streamer.user_login)">
                      <img :src="parseThumbnail(streamer.thumbnail_url)" width="30" height="30" /> {{ streamer.user_name }} ({{ streamer.user_login }})
                    </button>
                </template>
                <template v-else>
                  <p> {{ errorMessage }} </p>
                </template>
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="modal.hide()">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  `,
  props: {
    darked: Boolean,
    clientId: String,
    authData: Object,
    getUser: Function,
  },
  computed: {
    isLoggedIn() {
      return 'access_token' in this.authData
    },
    loginURL() {
      return `https://id.twitch.tv/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${window.location.origin}&response_type=token&scope=user_read+user:read:follows`
    },
    accessToken() {
      return this.authData.access_token
    },
    darkFont() {
      return this.darked ? 'text-white' : 'text-dark'
    },
    darkButton() {
      return this.darked ? 'btn-black' : 'btn-warning'
    },
    darkBorder() {
      return this.darked ? 'border-white' : 'border-warning'
    },
    darkBackground() {
      return this.darked ? 'bg-dark' : ''
    },
    darkLink() {
      return this.darked ? 'text-white' : ''
    },
  },
  data() {
    return {
      isLoaded: false,
      followed: [],
      modal: null,
      error: false,
      errorMessage: '',
    }
  },
  methods: {
    async getFollowed() {
      this.modal.show()
      if (this.isLoggedIn) {
        this.isLoaded = false

        try {
          const user = await this.getUser()

          if (user === null) return

          const response = await fetch(
            `https://api.twitch.tv/helix/streams/followed?user_id=${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Client-Id': this.clientId,
              },
            },
          )

          const json = await response.json()
          this.isLoaded = true

          this.followed = json.data
        } catch (error) {
          this.isLoaded = true
          this.followed = []
          this.error = true
          this.errorMessage = '팔로우 목록을 불러오는데 실패했습니다.'
        }
      }
    },
    parseThumbnail(src) {
      return src.replace('{width}', '30').replace('{height}', '30')
    },
    changeChannel(streamerId) {
      this.modal.hide()
      this.$emit('changed', {
        streamerId,
      })
    },
  },
  mounted() {
    this.modal = new Modal(document.getElementById('modal-stream'), {
      keyboard: false,
    })
  },
}

document.addEventListener('DOMContentLoaded', () => {
  /**
   * @type { HTMLButtonElement }
   */
  const twitchGetFollowedButton = document.getElementById(
    'twitch-get-followed-button',
  )
  /**
   * @type { HTMLUListElement }
   */
  const liveList = document.getElementById('live-list')

  liveList.style.maxHeight = '400px'
  liveList.style.overflowY = 'auto'
})
