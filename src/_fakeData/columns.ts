import {Column} from '../types/Table'
import {BooleanCell} from '../cell/BooleanCell'

export const columns: Column<Faker.Card>[] = [
  {
    Header: 'Username',
    accessor: (el) => el.username,
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Email has digit',
    accessor: (el) => el.email.match(/[0-9]/),
    Cell: BooleanCell,
    Aggregated: () => '',
  },
  {
    Header: 'City',
    accessor: 'address.city',
  },
]
