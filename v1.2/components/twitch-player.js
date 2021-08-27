export default { 
  template: `
    <div class="container p-0">
      <div class="row p-0">
        <div class="col px-2 py-2">
          <div id="twitch-embed"></div>
          <template v-if="streamMode">
            <iframe ref="twitchChatEmbedded" height="500" width="405" :src="src"> </iframe>
          </template>
          <template v-else>
            <p>현재 다시 보기 시청 중입니다.</p>
          </template>
        </div>
      </div>
    </div>
  `,
  props: {
    darked: Boolean,
    streamerId: String,
    parent: String,
    videoId: String,
  },
  computed: {
    src() {
      if (this.darked)
        return `https://www.twitch.tv/embed/${this.streamerId}/chat?parent=${this.parent}&darkpopout`
      else
        return `https://www.twitch.tv/embed/${this.streamerId}/chat?parent=${this.parent}`
    }
  },
  data() {
    return {
      player: null,
      streamMode: true,
    }
  },
  watch: {
    streamerId(newVal) {
      if (newVal === '') return
      this.streamMode = true
      this.player.setChannel(this.streamerId)
    },
    videoId(newVal) {
      if (newVal === '') return
      this.streamMode = false
      this.player.setVideo(this.videoId)
    },
  },
  mounted() {
    this.player = new Twitch.Player('twitch-embed', {
      width: 405,
      height: 240,
      channel: this.streamerId,
      parent: [this.parent],
    })
  }
}

