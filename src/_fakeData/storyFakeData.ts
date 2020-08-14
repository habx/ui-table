import faker from 'faker'
import { range } from 'lodash'

import { IMEXColumn } from '../index'
import { Column } from '../types/Table'

export const FAKE_DATA = range(50).map(() => ({
  ...faker.helpers.createCard(),
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
    Header: 'Username',
    accessor: 'username',
    meta: {
      csv: {
        identifier: true,
        type: 'string',
      },
    },
  },
  {
    Header: 'Name',
    accessor: 'name',
    meta: {
      csv: {
        type: 'string',
      },
    },
  },
  {
    Header: 'Email',
    accessor: 'email',
    meta: {
      csv: {
        type: 'string',
      },
    },
  },
  {
    Header: 'City',
    accessor: 'address.city',
    meta: {
      csv: {
        type: 'string',
      },
    },
  },
]
