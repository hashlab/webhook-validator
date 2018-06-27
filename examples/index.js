const Morgan = require('morgan')
const Express = require('express')
const webHookValidator = require('../lib/validator')

const App = Express()

if (!process.env.WEBHOOK_SECRET) {
  throw new Error('Environment variable WEBHOOK_SECRET is required!')
}

function webHookMiddleware(req, res, next) {
  try {
    webHookValidator(
      req.body,
      req.get('webhook-signature'),
      process.env.WEBHOOK_SECRET
    )
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)

    return res.status(400).json({ error: 'Invalid webhook signature!' })
  }

  return next()
}

App.use(Express.json())
App.use(Morgan('dev'))

App.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' })
})

App.post('/webhooks', webHookMiddleware, (req, res) => {
  res.status(200).json({
    message: 'WebHook Signature validated successfully.',
    payload: req.body
  })
})

App.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Example app listening on port 3000!')
})
