import Together from 'together-ai'

// Validate API key exists at module initialization
const apiKey = process.env.TOGETHER_AI_API_KEY
if (!apiKey) {
  throw new Error(
    'TOGETHER_AI_API_KEY environment variable is required. ' +
    'Please add it to your .env.local file.'
  )
}

const together = new Together({
  apiKey,
})

export { together }