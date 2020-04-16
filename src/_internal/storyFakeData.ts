import faker from 'faker'
import { range } from 'lodash'

import { Column } from '../types/Table'

export const FAKE_DATA = range(50).map(() => ({
  ...faker.helpers.createCard(),
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
