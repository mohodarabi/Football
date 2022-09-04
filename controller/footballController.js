const Match = require('../model/Match')

exports.getIndex = async (req, res) => {
  try {
    const matches = await Match.find({ $and: [{ startForecast: { $lt: Date.now() } }, { endForecast: { $gte: Date.now() } }, { isFinished: false }] })

    res.render('index', {
      pageTitle: 'صفحه ی اصلی',
      matches,
      path: '/',
    })
  } catch (err) {
    console.log(err)
    get500(req, res)
  }
}
