export function parseForm (raw) {
  const answers = raw.rowData.slice(1)
  return {
    questions:
      raw.rowData[0].values.map((col, i) => {
        const question = getQuestion(col)
        return Object.assign(question, {
          answers: answers.map(row =>
            row.values[i].userEnteredValue.stringValue)
        })
      })
  }
}

export function getQuestion ({ userEnteredValue: {stringValue} }) {
  const parts = /^([\d]*\.?[\d]*) (.*)$/.exec(stringValue)
  if (parts) {
    const [_, designator, title] = parts
    return { designator, title }
  }
  return { title: stringValue }
}
