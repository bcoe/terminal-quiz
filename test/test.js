/* global describe, it */

const { spawnSync } = require('child_process')

require('chai').should()

describe('terminal-quiz', () => {
  it('it exits with an appropriate message if empty file is provided', () => {
    const result = spawnSync(process.execPath, ['./index.js', './test/fixtures/choices-empty.txt', 'answer.txt'])
    result.status.should.equal(1)
    result.stderr.toString().should.contain('must contain a question and at least one choice')
  })
})
