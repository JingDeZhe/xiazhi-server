import Router from 'koa-router'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env['DASHSCOPE_API_KEY'],
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

export const router = new Router()

router.post('/qwen', async (ctx) => {
  const { messages } = ctx.request.body
  const chatCompletion = await openai.chat.completions.create({
    messages,
    model: 'qwen-turbo',
  })

  ctx.body = chatCompletion
})
