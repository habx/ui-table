import { addDecorator, addParameters } from '@storybook/react'
import { themes } from '@storybook/theming'
import { palette } from '@habx/ui-core'

import { providerDecorator } from './providerDecorator'

addDecorator(providerDecorator)

const theme = {
  dark: {
    ...themes.dark,
    appContentBg: palette.neutralBlackWithIntensityFading[800],
    appBg: palette.neutralBlackWithIntensityFading[900],
  },
  light: {
    ...themes.normal,
    appContentBg: palette.neutralBlackWithIntensityFading[0],
    appBg: palette.neutralBlackWithIntensityFading[100],
  }
}


addParameters({
  backgrounds: {
    disable: true,
    grid: {
      disable: true
    }
  },
  options: {
    storySort: {
      order: [
        'Introduction',
        'Table',
        'Cells',
        'Import-Export'
      ],
    },
    sortStoriesByKind: true,
  },
  info: {},
  darkMode: theme,
})
