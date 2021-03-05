import {range} from 'lodash'
import faker from 'faker'

const GROUPS = ['A', 'B', 'C']

export const data: Faker.Card[] = range(50).map(() => ({
  ...faker.helpers.createCard(),
  group: GROUPS[Math.floor(Math.random() * Math.floor(3))],
}))
