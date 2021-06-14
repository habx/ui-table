module.exports = {
  stories: ['../src/**/*.stories.(tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    'storybook-dark-mode',
    '@storybook/addon-essentials',
  ],
  typescript: {
    reactDocgen: 'none', // TODO: enabled this when https://github.com/storybookjs/storybook/issues/15067 is resolved
  }
}
