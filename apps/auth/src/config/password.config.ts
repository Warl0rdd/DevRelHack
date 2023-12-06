export const passwordConfig = (): any => {
    return {
        password: {
            salt: process.env.SALT,
        },
    };
};