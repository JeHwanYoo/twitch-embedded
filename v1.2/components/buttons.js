import { Modal } from '../lib/bootstrap.esm.js'

export default {
  template: `
    <div class="container p-0">
      <div class="row p-0">

        <div :class="['col', 'd-flex', 'align-items-center', 'small']">
          <a id="d-twip" :class="['btn', 'btn-link', darkLink]" target="_blank" :href="twipLink">트윕</a>

          <button :class="['btn', 'btn-link', darkLink]" @click="getFollowed"> 다시보기 </button>

          <button :class="['btn', 'btn-link', darkLink]" type="button" data-bs-toggle="modal" data-bs-target="#modal-notice">
            공지사항
          </button>

          <div class="form-check form-switch px-5 pt-1">
            <input class="form-check-input" type="checkbox" id="checkbox-dark" v-model="darkedModel" @change="changeDarkMode"/>
            <label :class="['form-check-label', darkFont]" for="checkbox-dark">
              다크 모드
            </label>
          </div>

        </div>

      </div>

      <!-- 공지사항 -->
      <div class="modal fade" id="modal-notice" tabindex="-1">
        <div class="modal-dialog">
          <div :class="['modal-content', darkBackground, darkFont]">
            <div class="modal-header">
              <h5 class="modal-title">공지사항</h5>
            </div>
            <div class="modal-body" id="notice">
              <iframe src="/notice.html" width="100%" id="frame"></iframe>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 공지사항 끝 -->

      <!-- 다시보기 -->
      <div class="modal fade" id="modal-video" tabindex="-1">
        <div class="modal-dialog">
          <div :class="['modal-content', darkBackground, darkFont]">
            <div class="modal-header">
              <h5 class="modal-title">다시보기 
                <small class="text-muted"> 
                  <template v-if="selectMode">
                    (영상 수: {{ videos.length }})
                  </template>
                  <template v-else>
                    (팔로잉 수: {{ followed.length }})
                  </template>
                </small> 
              </h5>
            </div>
            <div class="modal-body" id="video">
              <div class="mb-2" v-if="!selectMode && isLoaded">
                <input :class="['form-control', darkBorder]" placeholder="스트리머 검색" v-model="query" />
              </div>
              <div :class="['mb-2', 'd-flex', 'small', darkLink]" v-else-if="selectMode && isLoaded">
                <button :class="['btn', darkButton, darkFont, darkBorder]" @click="back">뒤로</button>
                <button :class="['btn', 'btn-link', darkLink]" @click="setVideoFilter('all')">전체</button>
                <button :class="['btn', 'btn-link', darkLink]" @click="setVideoFilter('archive')">지난방송</button>
                <button :class="['btn', 'btn-link', darkLink]" @click="setVideoFilter('highlight')">하이라이트</button>
                <button :class="['btn', 'btn-link', darkLink]" @click="setVideoFilter('upload')">업로드</button>
              </div>
              <ul id="follow-list" :class="['list-group', 'w-100']"> 
                <template v-if="!isLoggedIn"> 
                  <a :class="['btn', 'btn-link', darkLink]" :href="loginURL"> 로그인이 필요합니다. </a>
                </template>
                <template v-else-if="!isLoaded"> 불러오는 중입니다... </template>
                <template v-else-if="error">
                  <p> {{ errorMessage }} </p>
                </template>
                <template v-else-if="!selectMode">
                  <button v-for="streamer in filteredFollowed" :key="streamer.to_id" :class="['list-group-item', 'list-group-item-action', darkBackground, darkFont, darkBorder]" @click="selectStreamer(streamer.to_id)">
                    {{ streamer.to_name }}
                  </button>
                </template>
                <template v-else>
                  <button v-for="video in filteredVideos" :key="video.id" :class="['list-group-item', 'list-group-item-action', 'text-center', darkBackground, darkFont, darkBorder]" @click="selectVideo(video.id)">
                    <img :src="video.thumbnail_url | thumbnail" width="200" height="200" />
                    <h6>
                      {{ video.title }} <br />
                      <small class="text-muted"> {{ video.user_name }} [ {{ typeToKor(video.type) }} - {{ video.published_at | date }} ] </small>
                    </h6>
                  </button>
                </template>
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 다시보기 끝 -->

    </div>
  `,
  props: {
    darked: Boolean,
    streamerId: String,
    clientId: String,
    authData: Object,
    getUser: Function,
  },
  computed: {
    twipLink() {
      return `https://twip.kr/donate/${this.streamerId}`
    },
    darkLink() {
      return this.darked ? 'text-white' : ''
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
    isLoggedIn() {
      return 'access_token' in this.authData
    },
    loginURL() {
      return `https://id.twitch.tv/oauth2/authorize?client_id=${this.clientId}&redirect_uri=${window.location.origin}&response_type=token&scope=user_read+user:read:follows`
    },
    accessToken() {
      return this.authData.access_token
    },
    filteredFollowed() {
      return this.query === ''
        ? this.followed
        : this.followed.filter(v => v.to_name.includes(this.query))
    },
    filteredVideos() {
      if (this.videoFilter === 'all') return this.videos
      else return this.videos.filter(v => v.type === this.videoFilter)
    },
  },
  data() {
    return {
      darkedModel: false,
      videoModal: null,
      isLoaded: false,
      followed: [],
      videos: [],
      query: '',
      selectMode: false,
      videoFilter: 'all',
      error: false,
      errorMessage: '',
    }
  },
  watch: {
    darked(newVal) {
      this.darkedModel = newVal
    },
  },
  filters: {
    date(value) {
      return moment(value).format('LLL')
    },
    thumbnail(value) {
      const thumbnailSize = '30'
      return value
        ? value
            .replace('{width}', thumbnailSize)
            .replace('{height}', thumbnailSize)
        : `https://via.placeholder.com/${thumbnailSize}`
    },
  },
  methods: {
    changeDarkMode() {
      this.$emit('change', this.darkedModel)
    },
    selectVideo(videoId) {
      this.$emit('select', videoId)
      this.videoModal.hide()
    },
    back() {
      this.selectMode = false
    },
    typeToKor(type) {
      return {
        archive: '지난방송',
        upload: '업로드',
        highlight: '하이라이트',
      }[type]
    },
    setVideoFilter(filter) {
      this.videoFilter = filter
    },
    async selectStreamer(streamerId) {
      this.selectMode = true
      this.isLoaded = false
      this.videos = []

      try {
        const user = await this.getUser()

        if (user === null) {
          this.isLoaded = true
          this.videos = []
          return
        }

        let done = false
        const url = `https://api.twitch.tv/helix/videos?user_id=${streamerId}&first=100`
        let after = ''

        while (!done) {
          const response = await fetch(url + after, {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'Client-Id': this.clientId,
            },
          })

          const json = await response.json()

          if (json.pagination.cursor) {
            after = `&after=${json.pagination.cursor}`
          } else {
            done = true
          }

          this.videos = this.videos.concat(json.data)
        }

        this.isLoaded = true
      } catch (error) {
        this.isLoaded = true
        this.videos = []
        this.error = true
        this.errorMessage = '영상 목록을 불러오는데 실패했습니다.'
      }
    },
    async getFollowed() {
      this.videoModal.show()

      if (this.isLoggedIn) {
        this.isLoaded = false
        this.followed = []

        try {
          const user = await this.getUser()

          if (user === null) {
            this.isLoaded = true
            this.videos = []
            return
          }

          let done = false
          const url = `https://api.twitch.tv/helix/users/follows?from_id=${user.id}&first=100`
          let after = ''
          while (!done) {
            const response = await fetch(url + after, {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
                'Client-Id': this.clientId,
              },
            })

            const json = await response.json()

            if (json.pagination.cursor) {
              after = `&after=${json.pagination.cursor}`
            } else {
              done = true
            }

            this.followed = this.followed.concat(json.data)
          }

          this.isLoaded = true
        } catch (error) {
          this.isLoaded = true
          this.followed = []
          this.error = true
          this.errorMessage = '팔로우 목록을 불러오는데 실패했습니다.'
        }
      }
    },
  },
  mounted() {
    this.darkedModel = this.darked
    this.videoModal = new Modal(document.getElementById('modal-video'), {
      keyboard: false,
    })
  },
}

document.addEventListener('DOMContentLoaded', () => {
  /**
   * @type { HTMLDivElement[] }
   */
  const modalBody = document.querySelectorAll('.modal-body')
  /**
   * @type { HTMLIFrameElement }
   */
  const frame = notice.children[0]
  /**
   * @type { HTMLUListElement }
   */
  const followList = document.getElementById('follow-list')

  modalBody.forEach(v => (v.style.height = '450px'))
  followList.style.maxHeight = '360px'
  followList.style.overflowY = 'auto'
  frame.style.height = '400px'
})
