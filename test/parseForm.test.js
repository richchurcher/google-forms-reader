import test from 'ava'
import {getQuestion, getTrackingAnswers, parseForm} from '../src/parseForm'

test.beforeEach(t => {
  t.context.raw = {
    rowData: [
      {
        values: [
          { userEnteredValue: { stringValue: '1.0 Who flung dung?' } },
          { userEnteredValue: { stringValue: '1.2 GitHub' } },
          { userEnteredValue: { stringValue: '5.2 Was dung flung at all?' } }
        ]
      },
      {
        values: [
          { userEnteredValue: { stringValue: 'I did' } },
          { userEnteredValue: { stringValue: 'richchurcher' } },
          { userEnteredValue: { stringValue: 'Yes' } }
        ]
      },
      {
        values: [
          { userEnteredValue: { stringValue: 'They did' } },
          { userEnteredValue: { stringValue: 'someone' } },
          { userEnteredValue: { stringValue: 'Yes' } }
        ]
      }
    ]
  }
})

test('getQuestion sets designator and title correctly', t => {
  const raw = { userEnteredValue: { stringValue: '1111.911 Who flung dung?' } }
  const expected = {
    designator: '1111.911',
    title: 'Who flung dung?',
    col: 0
  }
  const actual = getQuestion(raw, 0)
  t.deepEqual(expected, actual)
})

test('getQuestion does not set designator if malformed', t => {
  const raw = { userEnteredValue: { stringValue: '1Afb3,9 Who flung dung?' } }
  const expected = { title: '1Afb3,9 Who flung dung?', col: 0 }
  const actual = getQuestion(raw, 0)
  t.deepEqual(expected, actual)
})

test('getQuestion does not set designator if missing', t => {
  const raw = { userEnteredValue: { stringValue: 'Who flung dung?' } }
  const expected = { title: 'Who flung dung?', col: 0 }
  const actual = getQuestion(raw, 0)
  t.deepEqual(expected, actual)
})

test('parseForm aggregates answers by column', t => {
  const expected = {
    questions: [
      {
        designator: '1.0',
        title: 'Who flung dung?',
        answers: ['I did', 'They did']
      },
      {
        designator: '1.2',
        title: 'GitHub',
        answers: ['richchurcher', 'someone']
      },
      {
        designator: '5.2',
        title: 'Was dung flung at all?',
        answers: ['Yes', 'Yes']
      }
    ]
  }
  const actual = parseForm(t.context.raw)
  t.deepEqual(expected, actual)
})

test('parseForm tracks by designators', t => {
  const expected = {
    questions: [
      {
        designator: '1.0',
        title: 'Who flung dung?',
        answers: [
          { 'GitHub': 'richchurcher', answer: 'I did' },
          { 'GitHub': 'someone', answer: 'They did' }
        ]
      },
      {
        designator: '1.2',
        title: 'GitHub',
        answers: [
          { 'GitHub': 'richchurcher', answer: 'richchurcher' },
          { 'GitHub': 'someone', answer: 'someone' }
        ]
      },
      {
        designator: '5.2',
        title: 'Was dung flung at all?',
        answers: [
          { 'GitHub': 'richchurcher', answer: 'Yes' },
          { 'GitHub': 'someone', answer: 'Yes' }
        ]
      }
    ]
  }
  const actual = parseForm(t.context.raw, {
    trackByDesignators: ['1.2']
  })
  t.deepEqual(expected, actual)
})

test('getTrackingAnswers returns question:answer couplets', t => {
  const trackByQuestion = { title: 'GitHub', col: 1 }
  const answers = [
    {
      values: [
        { userEnteredValue: { stringValue: 'I did' } },
        { userEnteredValue: { stringValue: 'richchurcher' } },
        { userEnteredValue: { stringValue: 'Yes' } }
      ]
    },
    {
      values: [
        { userEnteredValue: { stringValue: 'They did' } },
        { userEnteredValue: { stringValue: 'someone' } },
        { userEnteredValue: { stringValue: 'Yes' } }
      ]
    }
  ]
  const expected = [
    { 'GitHub': 'richchurcher' },
    { 'GitHub': 'someone' }
  ]
  const actual = getTrackingAnswers(trackByQuestion, answers)
  t.deepEqual(expected, actual)
})
