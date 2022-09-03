const Yup = require('yup')

exports.matchValidationSchema = Yup.object().shape({
  firstTeam: Yup.string().required('عنوان تیم الزامی می باشد'),
  secondTeam: Yup.string().required('عنوان تیم الزامی می باشد'),
  startForecast: Yup.date().required('زمان شروع الزامی می باشد'),
  endForecast: Yup.date().required('زمان پایان الزامی می باشد'),
})
