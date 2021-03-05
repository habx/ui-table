import faker from 'faker'
import { range } from 'lodash'

import { IMEXColumn } from '../index'
import { Column } from '../types/Table'

const GROUPS = ['A', 'B', 'C']

export const FAKE_DATA = range(50).map(() => ({
  ...faker.helpers.createCard(),
  id: Math.random(),
  group: GROUPS[Math.floor(Math.random() * Math.floor(3))],
}))

export const BASIC_COLUMNS = [
  {
    Header: 'Username',
    accessor: (el) => el.name,
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'City',
    accessor: (el) => el.address.city,
  },
] as Column<Faker.Card>[]

export const IMEX_COLUMNS = [
  {
    Header: 'Username',
    accessor: 'username',
    meta: {
      imex: {
        identifier: true,
        type: 'string' as const,
      },
    },
  },
  {
    Header: 'Name',
    accessor: 'name',
    meta: {
      imex: {
        type: 'string' as const,
      },
    },
  },
  {
    Header: 'Email',
    accessor: 'email',
    meta: {
      imex: {
        type: 'string' as const,
      },
    },
  },
  {
    Header: 'City',
    accessor: 'address.city',
    meta: {
      imex: {
        type: 'string' as const,
      },
    },
  },
] as IMEXColumn<Faker.Card & { id: number }>[]
