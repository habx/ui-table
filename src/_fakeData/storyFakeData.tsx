import faker from 'faker'
import { range } from 'lodash'
import * as React from 'react'

import { Icon } from '@habx/ui-core'

import { BooleanCell, BooleanFilter, IMEXColumn, RangeFilter } from '../index'
import { Column } from '../types/Table'

const GROUPS = ['A', 'B', 'C']

export const FAKE_DATA = range(45).map(() => ({
  ...faker.helpers.createCard(),
  image: faker.helpers.randomize([
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/Frame_838.png',
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/Frame_838_1.png',
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/Frame_838_2.png',
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/Frame_838_3.png',
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/Frame_838_4.png',
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/Frame_838_5.png',
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/Frame_838_6.png',
    '//res.cloudinary.com/habx/image/upload/tech/ui-table/images/Frame_838_7.png',
  ]),
  done: faker.helpers.randomize([true, false]),
  price: Math.round(Math.random() * 10000),
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
    Cell: ({ value }: { value: string }) => <img src={value} alt={value} />,
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
