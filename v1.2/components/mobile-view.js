export default {
  template: `
    <div :class="['mobile-view', 'container-fluid', 'm-0', 'border', 'border-2', 'rounded-3', bgDark]">
      <div class="row">
        <div class="col">
          <slot name="find-streamer"></slot>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <slot name="get-followed"></slot>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <slot name="buttons"></slot>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <slot name="twitch-player"></slot>
        </div>
      </div>
    </div>
  `,
  props: ['darked'],
  computed: {
    bgDark() {
      return this.darked ? 'bg-dark' : ''
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  /**
   * @type { HTMLDivElement }
   */
  const mobileView = document.getElementsByClassName('mobile-view')[0]

  mobileView.style.width = '425px'
  mobileView.style.height = '891px'
})