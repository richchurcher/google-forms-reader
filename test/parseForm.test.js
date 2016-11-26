import test from 'ava'
import parseForm from '../src/parseForm'

test('parseForm aggregates answers by column', t => {
  const raw = {
    rowData: [
      {
        values: [
          { userEnteredValue: { stringValue: '1.0 Who flung dung?' } },
          { userEnteredValue: { stringValue: '1.2 GitHub name' } },
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
  const expected = {
    questions: [
      {
        designator: '1.0',
        title: 'Who flung dung?',
        answers: ['I did', 'They did']
      },
      {
        designator: '1.2',
        title: 'GitHub name',
        answers: ['richchurcher', 'someone']
      },
      {
        designator: '5.2',
        title: 'Was dung flung at all?',
        answers: ['Yes', 'Yes']
      }
    ]
  }
  const actual = parseForm(raw)
  t.deepEqual(expected, actual)
})
