const superb = require('superb')

module.exports = {
  prompts() {
    return [
      {
        name: 'name',
        message: 'What is the name of the new project',
        default: this.outFolder,
        filter: val => val.toLowerCase()
      },
      {
        name: 'description',
        message: 'How would you descripe the new project',
        default: `my ${superb()} project`
      },
      {
        name: 'username',
        message: 'What is your GitHub username',
        default: this.gitUser.username || this.gitUser.name,
        filter: val => val.toLowerCase(),
        store: true
      },
      {
        name: 'email',
        message: 'What is your email?',
        default: this.gitUser.email,
        store: true
      },
      {
        name: 'website',
        message: 'The URL of your website',
        default({ username }) {
          return `github.com/${username}`
        },
        store: true
      },
      {
        name: 'test',
        message: 'Which test framework do you use?',
        type: 'list',
        default: 'ava',
        store: true,
        choices: ['ava', 'jest', 'disable']
      },
      {
        name: 'compile',
        message: 'Do you need to compile ES2015 code',
        type: 'confirm',
        default: false
      }
    ]
  },
  actions() {
    return [
      {
        type: 'add',
        files: '**',
        filters: {
          'jest.config.js': 'test === "jest"'
        }
      },
      {
        type: 'move',
        patterns: {
          gitignore: '.gitignore',
          '_eslintrc.js': '.eslintrc.js',
          '_package.json': 'package.json'
        }
      },
      {
        type: 'modify',
        files: 'package.json',
        handler: () => require('./lib/update-pkg')(this.answers)
      }
    ]
  },
  async completed() {
    this.gitInit()
    await this.npmInstall()
    this.showProjectTips()
  }
}
