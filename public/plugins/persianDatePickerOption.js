$('.normal-example').persianDatepicker({
  inline: false,
  format: '',
  viewMode: 'day',
  initialValue: true,
  minDate: null,
  maxDate: null,
  autoClose: true,
  position: 'auto',
  altFormat: '',
  altField: '#altfieldExample',
  onlyTimePicker: false,
  onlySelectOnDate: true,
  calendarType: 'persian',
  inputDelay: 800,
  observer: true,
  calendar: {
    persian: {
      locale: 'fa',
      showHint: false,
      leapYearMode: 'algorithmic',
    },
    gregorian: {
      locale: 'en',
      showHint: false,
    },
  },
  navigator: {
    enabled: true,
    scroll: {
      enabled: false,
    },
    text: {
      btnNextText: '<',
      btnPrevText: '>',
    },
  },
  toolbox: {
    enabled: true,
    calendarSwitch: {
      enabled: true,
      format: 'MMMM',
    },
    todayButton: {
      enabled: true,
      text: {
        fa: 'امروز',
        en: 'Today',
      },
    },
    submitButton: {
      enabled: true,
      text: {
        fa: 'تایید',
        en: 'Submit',
      },
    },
    text: {
      btnToday: 'امروز',
    },
  },
  timePicker: {
    enabled: true,
    step: 1,
    hour: {
      enabled: true,
      step: null,
    },
    minute: {
      enabled: true,
      step: null,
    },
    second: {
      enabled: false,
      step: null,
    },
    meridian: {
      enabled: false,
    },
  },
  dayPicker: {
    enabled: true,
    titleFormat: 'YYYY MMMM',
  },
  monthPicker: {
    enabled: false,
    titleFormat: 'YYYY',
  },
  yearPicker: {
    enabled: false,
    titleFormat: 'YYYY',
  },
  responsive: true,
})
