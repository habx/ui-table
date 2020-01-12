import { Column as BaseColumn } from 'react-table'

export enum Presets {
  boolean = 'boolean',
}

interface Column extends BaseColumn<any> {
  preset?: Presets
}

export default interface TableProps {
  data: any[]
  columns: Array<Column>
}
