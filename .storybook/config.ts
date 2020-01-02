import centered from '@storybook/addon-centered'
import { withKnobs } from '@storybook/addon-knobs'
import { configure, addDecorator, addParameters } from '@storybook/react'
import { create } from '@storybook/theming'

import providerDecorator from './providerDecorator'

addDecorator(centered)
addDecorator(withKnobs)
addDecorator(providerDecorator)

addParameters({
  options: {
    sortStoriesByKind: true,
    theme: create({
      base: 'light',
      brandTitle: 'Habx',
    }),
  },
  info: {},
})

const req = process.env.NODE_ENV === 'test' ?
  require('./requireContext')('../src', true, /\.stories\.(tsx)$/) :
  require.context('../src/', true, /\.stories\.(tsx)$/)

function loadStories() {
  req.keys().forEach((filename: string) => req(filename))
}

configure(loadStories, module)
