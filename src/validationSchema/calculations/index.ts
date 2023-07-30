import * as yup from 'yup';

export const calculationValidationSchema = yup.object().shape({
  result: yup.number().integer().required(),
  math_tool_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
