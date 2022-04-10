export interface BlockState {
  x: number
  y: number
  height: number
  width: number
  fill: string
  stroke: string
  strokeWidth: number
}

export interface configKonva {
  width: number
  height: number
}

export interface State {
  row: number
  column: number
}

export interface configWall {
  configKonva: configKonva
  configRects: BlockState[][]
}
