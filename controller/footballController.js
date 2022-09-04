const Match = require('../model/Match')

exports.getIndex = async (req, res) => {
  try {
    const matches = await Match.find({ $and: [{ startForecast: { $lt: Date.now() } }, { endForecast: { $gte: Date.now() } }, { isFinished: false }] }).sort()

    const match = matches[0]

    res.render('index', {
      pageTitle: 'صفحه ی اصلی',
      matches,
      match,
      path: '/',
    })
  } catch (err) {
    console.log(err)
    get500(req, res)
  }
}
