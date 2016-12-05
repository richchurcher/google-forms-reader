import {compose, merge} from 'ramda'

export const getHeader = (header, col) => getQuestion(header, col)

export const splitHeaders = (options, raw) => {
  const headers = raw.rowData[0].values.map(getHeader)
  return merge({ options, headers }, raw)
}

export const groupByDesignators = form => form
export const trackByDesignators = form => form
export const getQuestions = form => form
export const getRawAnswers = form => form
export const getRealAnswers = form => form

export const parseFormR = compose(
  groupByDesignators,
  trackByDesignators,
  getQuestions,
  getRealAnswers,
  getRawAnswers,
  splitHeaders
)

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
    if (options.groupByDesignator) {
      const groupBy = headers.find(({designator}) => options.groupByDesignator === designator)
      if (groupBy) {
        const out = {}
        out[groupBy.title] = getAnswersGroupedBy(groupBy, headers, rawAnswers)
        return out
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

export function getAnswersGroupedBy (groupBy, headers, rawAnswers) {
  return rawAnswers.map(row => {
    const answer = {}
    const title = row.values[groupBy.col].userEnteredValue.stringValue
    const questions = headers.map(({designator, title}, col) => {
      return {
        designator,
        title,
        answer: row.values[col].userEnteredValue.stringValue
      }
    })
    answer[title] = { questions }
    return answer
  })
}
