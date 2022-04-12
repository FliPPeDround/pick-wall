export interface BlockState {
  x: number
  y: number
  height: number
  width: number
  fill: string
  stroke: string
  strokeWidth: number
}

export interface RequestBlock {
  x: number
  y: number
  id: number
  fill: string
}

export interface configKonva {
  width: number
  height: number
  draggable: boolean
}

export interface State {
  x: number
  y: number
}

export interface configWall {
  configKonva: configKonva
  configRects: BlockState[][]
}
