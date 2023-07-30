module.exports = {
  name: 'Access Integration Data Example',
  acronym: 'INT',
  description: 'Example code for accessing integration data from the block component file.',
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  styles: ['./styles/style.less'],
  entityTypes: ['IPv4'],
  defaultColor: "light-gray",
  block: {
    component: {
      file: './components/block.js'
    },
    template: {
      file: './templates/block.hbs'
    }
  },
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: ''
  },
  onDemandOnly: true
};
