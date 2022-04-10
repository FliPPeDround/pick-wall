import type { Ref } from 'vue'
import type { BlockState, State, configWall } from '~/types'

export class PickWallInit {
  config = ref() as Ref<configWall>
  state = ref() as Ref<State>
  color = ref({
    hex8: '#000',
  })

  constructor(
    public width: number,
    public height: number,
    public rectLen: number,
  ) {
    this.reset()
  }

  reset(
    width = this.width,
    height = this.height,
    rectLen = this.rectLen,
  ) {
    this.width = width
    this.height = height
    this.rectLen = rectLen

    this.state.value = {
      row: Math.floor(width / rectLen),
      column: Math.floor(height / rectLen),
    }
    this.config.value = {
      configKonva: {
        width,
        height,
      },
      configRects: Array.from({ length: this.state.value.column }, (_, y) =>
        Array.from({ length: this.state.value.row },
          (_, x) => ({
            x: x * rectLen,
            y: y * rectLen,
            width: rectLen,
            height: rectLen,
            fill: '#FFF',
            stroke: '#9B9B9B82',
            strokeWidth: 1,
          }),
        ),
      ),
    }
  }

  pickblock(block: BlockState) {
    if (block.fill === this.color.value.hex8)
      return
    block.fill = this.color.value.hex8

    // ws.send(JSON.stringify(
    //   {
    //     x: block.x / 30,
    //     y: block.y / 30,
    //     fill: block.fill,
    //   },
    // ))
  }
}
