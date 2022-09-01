exports.getIndex = async (req, res) => {
  try {
    res.render('index', {
      pageTitle: 'صفحه ی اصلی',
      path: '/',
    })
  } catch (err) {
    console.log(err)
    get500(req, res)
  }
}
