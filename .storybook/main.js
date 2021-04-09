module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    'storybook-dark-mode',
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false,
      },
    },
  ]
}
