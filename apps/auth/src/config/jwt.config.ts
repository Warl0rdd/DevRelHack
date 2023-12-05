export const jwtConfig = (): any => {
  return {
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  };
};
