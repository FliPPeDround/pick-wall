import type { Ref } from 'vue'
import ws from './websocket'
import type { BlockState, Point, Rect, configWall } from '~/types'
import { getConfigRects } from '~/api/getConfigRects'
import { deleteConfigRect } from '~/api/deleteConfigRect'

export class PickWallInit {
  config = ref() as Ref<configWall>
  state = ref() as Ref<Rect>
  color = ref('#000')
  move = {
    x: 0,
    y: 0,
  }

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
      startX: 0,
      startY: 0,
      endX: Math.ceil(width / rectLen),
      endY: Math.ceil(height / rectLen),
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    this.config.value = {
      configKonva: {
        width,
        height,
        draggable: true,
        dragBoundFunc(pos) {
          const newY = pos.y > 0 ? 0 : pos.y
          const newX = pos.x > 0 ? 0 : pos.x
          const move = {
            x: -Math.ceil(newX / self.rectLen) || 1,
            y: -Math.ceil(newY / self.rectLen) || 1,
          }
          self.throttleFn(move)
          return {
            x: this.absolutePosition().x,
            y: newY,
          }
        },
      },
      configRects: Array.from({ length: (this.state.value.endY - this.state.value.startY) }, (_, y) =>
        Array.from({ length: (this.state.value.endX - this.state.value.startX) },
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
    await this.getRects(this.state.value)
  }

  async getRects(state: Rect) {
    const res = await getConfigRects(state)

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
      this.deleteBlock(block)
    ws.send(JSON.stringify(
      {
        x: block.x / 30,
        y: block.y / 30,
        fill: block.fill,
      },
    ))
  }

  deleteBlock(block: BlockState) {
    block.fill = '#FFF'
    deleteConfigRect({
      x: block.x / 30,
      y: block.y / 30,
    })
  }

  pickColor(color: string) {
    this.color.value = color
  }

  throttleFn = useThrottleFn(async(move: Point) => {
    const newcol = move.y - this.move.y
    this.move = move
    // const newcol = move.y + this.state.value.endY - this.state.value.startY - this.config.value.configRects.length
    // console.log(newcol)

    if (newcol <= 0)
      return
    const newRectsY = Array.from({ length: newcol }, (_, y) =>
      Array.from({ length: move.x + this.state.value.endX },
        (_, x) => ({
          x: x * this.rectLen,
          y: (y + this.config.value.configRects.length) * this.rectLen,
          width: this.rectLen,
          height: this.rectLen,
          fill: '#FFF',
          stroke: '#9B9B9B82',
          strokeWidth: 1,
        }),
      ),
    )

    for (const i in newRectsY)
      this.config.value.configRects.push(newRectsY[i])
      //
    // this.config.value.configRects.splice(0, newcol - 5 < 0 ? 0 : newcol - 5)
    await this.getRects({
      startX: newRectsY[0][0].x / 30,
      startY: newRectsY[0][0].y / 30,
      endX: newRectsY[newRectsY.length - 1][newRectsY[newRectsY.length - 1].length - 1].x / 30,
      endY: newRectsY[newRectsY.length - 1][newRectsY[newRectsY.length - 1].length - 1].y / 30,
    })
  }, 500)
}
