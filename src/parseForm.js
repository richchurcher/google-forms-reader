export default function parseForm (raw) {
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

export function getQuestion (columnHeader) {
  const parts = /([\d]*\.?[\d]*) (.*)/.exec(columnHeader.userEnteredValue.stringValue)
  if (parts) {
    const [_, designator, title] = parts
    return { designator, title }
  }
  return { title: columnHeader }
}
