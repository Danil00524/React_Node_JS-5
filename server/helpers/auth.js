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

const authenticate = (req, res, next) => {
    try {
        let userId = null;
        const token = req.headers.authorization;

        userId = jwt.verify(token, constants.secretKey).user.id;
        const user = User.findOne({ where: { id: userId } });

        if (!user) {
            res.json({ success: false, message: 'Пользователь не существует.' });
        };

        req.user = user;
        next();
    } catch (error) {
        res.json({
            success: false,
            text: 'Срой действия токена истек.'
        })
    };
};

module.exports = {
  createTokens,
  refreshTokens,
  authenticate,
}
