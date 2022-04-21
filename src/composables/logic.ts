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

  cursorStyle = ref('default')

  initPoint = {
    x: 0,
    y: 0,
  }

  constructor(
    public width: number,
    public height: number,
    public rectLen: number,
  ) {
    this.init()
    this.reset()
  }

  init() {
    if (localStorage.getItem('init-point'))
      this.initPoint = JSON.parse(localStorage.getItem('init-point')!)
    this.move = this.getMove(this.initPoint.x, this.initPoint.y)
    if (localStorage.getItem('color'))
      this.color.value = JSON.parse(localStorage.getItem('color')!)
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
      startX: -Math.ceil(this.initPoint.x / this.rectLen),
      startY: -Math.ceil(this.initPoint.y / this.rectLen),
      endX: Math.ceil(width / rectLen),
      endY: Math.ceil(height / rectLen),
    }
    const self = this
    this.config.value = {
      configKonva: {
        width,
        height,
        draggable: true,
        y: self.initPoint.y,
        x: self.initPoint.x,
        dragBoundFunc(pos) {
          self.cursorStyle.value = 'move'
          const newY = pos.y > 0 ? 0 : pos.y
          const newX = pos.x > 0 ? 0 : pos.x
          const move = self.getMove(newX, newY)
          self.dragRect(move)
          self.setStorage({
            x: newX,
            y: newY,
          })
          return {
            x: newX,
            y: newY,
          }
        },
      },
      configRects: Array.from({ length: this.state.value.endY }, (_, y) =>
        Array.from({ length: this.state.value.endX },
          (_, x) => ({
            x: (this.state.value.startX + x) * rectLen,
            y: (this.state.value.startY + y) * rectLen,
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

  getMove(newX: number, newY: number) {
    return {
      x: -Math.ceil(newX / this.rectLen),
      y: -Math.ceil(newY / this.rectLen),
    }
  }

  async getRects(state: Rect) {
    const res = await getConfigRects(state)

    res.forEach((block) => {
      if (this.config.value.configRects?.[block.y - state.startY]?.[block.x - state.startX])
        this.config.value.configRects[block.y - state.startY][block.x - state.startX].fill = block.fill
    })
  }

  pickblock(block: BlockState) {
    // console.log(block)
    // console.log(this.config.value.configRects)

    if (block.fill === this.color.value)
      return
    block.fill = this.color.value
    // eslint-disable-next-line no-constant-condition
    if (this.color.value === '#FFF' || '#FFFFFF')
      this.deleteBlock(block)
    ws.send(JSON.stringify(
      {
        x: block.x / this.rectLen,
        y: block.y / this.rectLen,
        fill: block.fill,
      },
    ))
  }

  deleteBlock(block: BlockState) {
    block.fill = '#FFF'
    deleteConfigRect({
      x: block.x / this.rectLen,
      y: block.y / this.rectLen,
    })
  }

  pickColor(color: string) {
    localStorage.setItem('color', JSON.stringify(color))
    this.color.value = color
  }

  dragRect = useThrottleFn(async(move: Point) => {
    const newrow = move.x - this.move.x
    const newcol = move.y - this.move.y
    this.move = move

    if (newcol < 0)
      this.unshiftRectListCol(newcol)

    if (newcol > 0)
      this.pushRectListCol(newcol)

    if (newrow > 0)
      this.pushRectListRow(newrow)

    if (newrow < 0)
      this.unshiftRectListRow(newrow)

    const state = this.getRectsState(this.config.value.configRects)

    await this.getRects(state)
  }, 500)

  async unshiftRectListCol(newcol: number) {
    const configRectsLast = this.config.value.configRects[0][0]
    const newColList = Array.from({ length: -newcol }, (_, y) =>
      Array.from({ length: this.config.value.configRects[0].length },
        (_, x) => ({
          x: this.config.value.configRects[this.config.value.configRects.length - 1][x].x,
          y: configRectsLast.y + (newcol + y) * this.rectLen,
          width: this.rectLen,
          height: this.rectLen,
          fill: '#FFF',
          stroke: '#9B9B9B82',
          strokeWidth: 1,
        }),
      ),
    )
    this.config.value.configRects.unshift(...newColList)
    this.config.value.configRects.splice(newcol)
  }

  async pushRectListCol(newcol: number) {
    const configRectsLast = this.config.value.configRects[this.config.value.configRects.length - 1][0]
    const newColList = Array.from({ length: newcol }, (_, y) =>
      Array.from({ length: this.config.value.configRects[0].length },
        (_, x) => ({
          x: this.config.value.configRects[this.config.value.configRects.length - 1][x].x,
          y: configRectsLast.y + (y + 1) * this.rectLen,
          width: this.rectLen,
          height: this.rectLen,
          fill: '#FFF',
          stroke: '#9B9B9B82',
          strokeWidth: 1,
        }),
      ),
    )

    this.config.value.configRects.push(...newColList)
    this.config.value.configRects.splice(0, newcol)
  }

  pushRectListRow(newrow: number) {
    for (let i = 0; i < this.config.value.configRects.length; i++) {
      const row = this.config.value.configRects[i]
      row.splice(0, newrow)
      const rowLen = row.length
      const newRowList = Array.from({ length: newrow }, (_, x) => ({
        x: row[rowLen - 1].x + this.rectLen * (x + 1),
        y: row[rowLen - 1].y,
        width: this.rectLen,
        height: this.rectLen,
        fill: '#FFF',
        stroke: '#9B9B9B82',
        strokeWidth: 1,
      }))

      row.push(...newRowList)
    }
  }

  unshiftRectListRow(newrow: number) {
    for (let i = 0; i < this.config.value.configRects.length; i++) {
      const row = this.config.value.configRects[i]
      row.splice(newrow)
      const newRowList = Array.from({ length: -newrow }, (_, x) => ({
        x: row[0].x + (this.rectLen * (newrow + x)),
        y: row[0].y,
        width: this.rectLen,
        height: this.rectLen,
        fill: '#FFF',
        stroke: '#9B9B9B82',
        strokeWidth: 1,
      }))

      row.unshift(...newRowList)
    }
  }

  getRectsState(rectList: BlockState[][]) {
    const startX = rectList[0][0].x / this.rectLen
    const startY = rectList[0][0].y / this.rectLen
    const endX = (rectList as BlockState[][])[rectList.length - 1][(rectList as BlockState[][])[rectList.length - 1].length - 1].x / this.rectLen
    const endY = (rectList as BlockState[][])[rectList.length - 1][(rectList as BlockState[][])[rectList.length - 1].length - 1].y / this.rectLen
    return {
      startX,
      startY,
      endX,
      endY,
    }
  }

  setStorage = useDebounceFn((point: Point) => {
    localStorage.setItem('init-point', JSON.stringify(point))
  }, 2000)
}
