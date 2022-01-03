import faker from 'faker'
import { range } from 'lodash'
import * as React from 'react'

import { Icon } from '@habx/ui-core'

import { ImageCell } from '../cell/ImageCell'
import { BooleanCell, BooleanFilter, IMEXColumn, RangeFilter } from '../index'
import { Column } from '../types/Table'

const GROUPS = ['A', 'B', 'C']

export const FAKE_DATA = range(45).map(() => ({
  ...faker.helpers.createCard(),
  image: faker.helpers.randomize([
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/02e27c05f756816d97983027afe8310a.jpg',
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/326355d6d0a0f4018c7b2bc6b35d7e00.jpg',
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/c0dc8559767798d6cba8ee18a913ad0a.jpg',
  ]),
  done: faker.helpers.randomize([true, false, null, undefined]),
  price: Math.round(Math.random() * 10000),
  id: Math.random(),
  group: GROUPS[Math.floor(Math.random() * Math.floor(3))],
}))

export const BASIC_COLUMNS = [
  {
    Header: 'Username lorem',
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

export const RICH_COLUMNS = [
  {
    Header: 'Customer',
    accessor: (el) => el.name,
    HeaderIcon: <Icon icon="person" />,
  },
  {
    Header: 'Invoice amount',
    accessor: 'price',
    Cell: ({ value }: { value: string }) => `$${value}`,
    Filter: RangeFilter,
    filter: 'between',
  },
  {
    Header: 'Image',
    accessor: 'image',
    Cell: ImageCell,
    Filter: () => null,
  },
  {
    Header: 'Done',
    accessor: 'done',
    Cell: BooleanCell,
    Filter: BooleanFilter,
    filter: 'equals',
  },
] as Column<typeof FAKE_DATA[0]>[]

export const IMEX_COLUMNS: IMEXColumn<Faker.Card & { id: number }>[] = [
  {
    Header: 'Username',
    accessor: 'username',
    imex: {
      path: 'username',
      identifier: true,
    },
  },
  {
    Header: 'Name',
    accessor: 'name',
    imex: {
      path: 'name',
      header: 'Name',
      note: 'This is a comment',
    },
  },
  {
    Header: 'Email',
    accessor: 'email',
    imex: {
      path: 'email',
      header: 'Email',
    },
  },
  {
    Header: 'City',
    accessor: (row) => row.address.city,
    imex: {
      path: 'address.city',
    },
  },
]
