export default {
  template: `
    <div id="find-streamer">
      <img id="favicon" :class="['border', 'border-2', darkBorder]"/>
      <input id="twitch-id-field" :class="['form-control', darkBorder]" v-model="streamerIdModel" />
      <button id="twitch-find-button" :class="['btn', 'fw-bold', ...darkFont, darkBorder ]" type="button" @click="changeChannel" >
        시청하기
      </button>
    </div>
  `,
  props: ['darked', 'streamerId'],
  computed: {
    darkFont() {
      return this.darked ? ['text-white', 'btn-black'] : ['text-dark', 'btn-warning']
    },
    darkBorder() {
      return this.darked ? 'border-white' : 'border-warning'
    }
  },
  data() {
    return {
      streamerIdModel: ''
    }
  },
  watch: {
    streamerId(newVal) {
      this.streamerIdModel = newVal
    }
  },
  methods: {
    changeChannel() {
      this.$emit('change', {
        streamerId: this.streamerIdModel
      })
    },
  },
  mounted() {
    this.streamerIdModel = this.streamerId
  }
}

document.addEventListener('DOMContentLoaded', () => {
  /**
   * @type { HTMLDivElement }
   */
  const findStreamer = document.getElementById('find-streamer')
  /**
   * @type { HTMLImageElement }
   */
  const favicon = document.getElementById('favicon')
  /**
   * @type { HTMLInputElement }
   */
  const twitchIdField = document.getElementById('twitch-id-field')
  /**
   * @type { HTMLButtonElement }
   */
  const twitchFindButton = document.getElementById('twitch-find-button')

  findStreamer.classList.add('input-group', 'my-2')

  favicon.style.width = '39px'
  favicon.style.height = '39px'
  favicon.src = 'favicon.png'

  twitchIdField.placeholder = '시청할 트위치 ID 입력'

})