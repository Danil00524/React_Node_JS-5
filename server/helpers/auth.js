const jwt = require('jsonwebtoken');
const constants = require('../../constans');
const User = require('../db').models.users;

const createTokens = async (user) => {
  const createAccessToken = jwt.sign({
    user: user.id,
  }, constants.secretKey, {
    expiresIn: '10m',
  });

  const createRefreshToken = jwt.sign({
    user: user.id,
  }, constants.secretKey, {
    expiresIn: '7d',
  });

  const verifyAccess = jwt.verify(createAccessToken, constants.secretKey);
  const verifyRefresh = jwt.verify(createRefreshToken, constants.secretKey);

  return {
    accessToken: createAccessToken,
    refreshToken: createRefreshToken,
    accessTokenExpiredAt: verifyAccess.exp * 1000,
    refreshTokenExpiredAt: verifyRefresh.exp * 1000,
  };
};

const refreshTokens = async (refreshToken) => {
  let userId = -1;

  try {
    userId = jwt.verify(refreshToken, constants.secretKey).user.id;
  } catch (error) {
    return {
      success: false,
      text: 'Время жизни refresh token истекло.',
      error,
    };
  };

  const user = await User.findOne({ where: { id: userId } })

  if (user) {
    return (await createTokens(user))
  } else {
    return {
      success: false,
      text: 'Пользователь не найден.',
    };
  }
}

module.exports = {
  createTokens,
  refreshTokens,
}
