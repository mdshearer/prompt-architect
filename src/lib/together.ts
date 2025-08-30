import Together from 'together-ai'

const together = new Together({
  apiKey: process.env.TOGETHER_AI_API_KEY!,
})

export { together }