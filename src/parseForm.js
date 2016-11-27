export function parseForm (raw, options) {
  const rawAnswers = raw.rowData.slice(1)
  const headers = raw.rowData[0].values.map((header, col) => getQuestion(header, col))
  const answers = headers.map((h, col) => getAnswers(rawAnswers, col))
  const questions = headers.map(({designator, title}, col) => {
    const out = { designator, title, answers: answers[col] }
    return out
  })
  if (options) {
    if (options.trackByDesignators) {
      const trackingAnswers = headers
        .filter(({designator}) => options.trackByDesignators.includes(designator))
        .map(header => getTrackingAnswers(header, rawAnswers))
      return {
        questions: questions.map(question => attachTrackingAnswers(question, trackingAnswers))
      }
    }
  }
  return { questions }
}

export function getQuestion ({ userEnteredValue: {stringValue} }, col) {
  const parts = /^([\d]*\.?[\d]*) (.*)$/.exec(stringValue)
  if (parts) {
    const [_, designator, title] = parts
    return { designator, title, col }
  }
  return { title: stringValue, col }
}

export function getAnswers (rawAnswers, col) {
  return rawAnswers.map(row =>
    row.values[col].userEnteredValue.stringValue)
}

export function getTrackingAnswers ({title, col}, rawAnswers) {
  return rawAnswers.map(row => {
    const answer = {}
    answer[title] = row.values[col].userEnteredValue.stringValue
    return answer
  })
}

export function attachTrackingAnswers ({designator, title, answers}, trackingAnswers) {
  const answersWithTracking = answers.map((answer, col) => {
    const out = { answer }
    trackingAnswers.forEach(a => Object.assign(out, a[col]))
    return out
  })
  return {
    designator,
    title,
    answers: answersWithTracking
  }
}
