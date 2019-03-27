#!/usr/bin/env node
'use strict'

const { resolve } = require('path')
const { readFileSync, writeFileSync } = require('fs')
const inquirer = require('inquirer')

const userHome = require('user-home')

require('yargs')
  .command('* <choices> <answer>', 'run the quiz described in choices.txt', (yargs) => {
    yargs
      .positional('choices', {
        describe: 'where should we read the quiz file from?',
        default: resolve(userHome, './.quiz/choices.txt')
      })
      .positional('answer', {
        describe: 'where should the answer.txt be output?',
        default: resolve(userHome, './.quiz/answer.txt')
      })
  }, async argv => {
    try {
      const choicesText = readFileSync(argv.choices, 'utf8').trim()
      const choices = choicesText.split('\n')

      if (choices.length < 2) {
        console.error(`${argv.choices} must contain a question and at least one choice`)
        process.exit(1)
      }

      const answer = await runQuiz(choicesText.split('\n'))
      writeFileSync(argv.answer, answer.selection)
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.error(`could not find ${argv.choices}`)
      } else {
        throw err
      }
    }
  })
  .parse()

async function runQuiz (choices) {
  const question = choices.shift()
  const prompt = inquirer.createPromptModule()
  return prompt({
    name: 'selection',
    message: question,
    choices: choices,
    type: 'list'
  })
}
