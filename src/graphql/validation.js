export const isValid = (schema, args) => {
  const result = schema.validate(args, { abortEarly: false });

  if (result.error) {
    const messages = result.error.details.map((obj) => obj.message);
    throw new Error(messages, { cause: 400 });
  }
};
