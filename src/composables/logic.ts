import type { Ref } from 'vue'
import ws from './websocket'
import type { BlockState, State, configWall } from '~/types'
import { getConfigRects } from '~/api/getConfigRects'
import { deleteConfigRect } from '~/api/deleteConfigRect'
export class PickWallInit {
  config = ref() as Ref<configWall>
  state = ref() as Ref<State>
  color = ref('#000')

  constructor(
    public width: number,
    public height: number,
    public rectLen: number,
  ) {
    this.reset()
  }

  async reset(
    width = this.width,
    height = this.height,
    rectLen = this.rectLen,
  ) {
    this.width = width
    this.height = height
    this.rectLen = rectLen

    this.state.value = {
      x: Math.ceil(width / rectLen),
      y: Math.ceil(height / rectLen),
    }
    this.config.value = {
      configKonva: {
        width,
        height,
      },
      configRects: Array.from({ length: this.state.value.y }, (_, y) =>
        Array.from({ length: this.state.value.x },
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
    const res = await getConfigRects(this.state.value)

    // for (let index = 0; index < res.length; index++) {
    //   this.config.value.configRects?.[res?.[index]?.y]?.[res?.[index]?.x]?.fill = res?.[index].fill
    //   await nextTick()
    //   console.log(res[index])
    // }
    res.forEach((block) => {
      if (this.config.value.configRects?.[block.y]?.[block.x])
        this.config.value.configRects[block.y][block.x].fill = block.fill
    })
  }

  pickblock(block: BlockState) {
    if (block.fill === this.color.value)
      return
    block.fill = this.color.value
    // eslint-disable-next-line no-constant-condition
    if (this.color.value === '#FFF' || '#FFFFFF')
      deleteConfigRect(1)
    ws.send(JSON.stringify(
      {
        x: block.x / 30,
        y: block.y / 30,
        fill: block.fill,
      },
    ))
  }

  pickColor(color: string) {
    this.color.value = color
  }

  draggable(movePoint: { x: number; y: number }) {
    const OffsetX = Math.floor(movePoint.x / this.rectLen)
    const OffsetY = Math.floor(movePoint.y / this.rectLen)
    // this.config.value.configRects
    console.log(OffsetX, OffsetY)
  }
}
