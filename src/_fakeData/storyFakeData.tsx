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
  username:
    "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.\n" +
    '\n',
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
