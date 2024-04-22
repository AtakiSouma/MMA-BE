export interface IAddQuestionData {
  question: string
  courseId: string
  contentId: string
  userId: string
}

export interface IAnswerData {
  answer: string
  courseId: string
  userId: string
  contentId: string
  questionId: string
}
