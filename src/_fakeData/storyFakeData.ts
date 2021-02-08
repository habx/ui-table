import faker from 'faker'
import { range } from 'lodash'

import { IMEXColumn } from '../index'
import { Column } from '../types/Table'

export const FAKE_DATA = range(50).map(() => ({
  ...faker.helpers.createCard(),
  number: Math.random(),
  id: Math.random(),
}))

export const BASIC_COLUMNS: Column<Faker.Card>[] = [
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
]

export const IMEX_COLUMNS: IMEXColumn<Faker.Card & { id: number }>[] = [
  {
    Header: 'Number',
    accessor: 'number',
    meta: {
      imex: {
        type: 'number' as const,
      },
    },
  },
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
]
