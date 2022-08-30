const Yup = require("yup");

exports.pointValidationSchema = Yup.object().shape({
  result: Yup.string().required("نتیجه الزامی می باشد"),
});
