const moment = require('jalali-moment')

const p2e = (s) => s.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))

exports.convertToEn = (time) => {
  const date = time.split(' ')
  date.pop()
  date.pop()
  const enTime = p2e(date.join(' '))
  return moment.from(enTime, 'fa', 'YYYY-M-D HH:mm:ss').format('YYYY-M-D HH:mm:ss')
}

// const newDateFa = moment(newDateEn, 'YYYY-M-D HH:mm:ss').locale('fa').format('YYYY/M/D HH:mm:ss')
