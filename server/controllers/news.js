const New = require('../db').models.news;

const allNews = async (req, res) => {
  try {
    const news = await New.findAll();

    res.json(news);
  } catch (error) {
    res.json({
      success: false,
      error
    })
  }
};

const checkExistingNew = async (title, res) => {
  const checkTheSameNew = await New.findOne({ where: { title } });

  if (checkTheSameNew) res.json({
    success: false,
    error: 'Статья с таким именем уже существует.',
  })
}

module.exports = {
  list: async (req, res) => {
    allNews(req, res);
  },
  create: async (req, res) => {
    try {
      const { text, title } = req.body;
      if (!text || !title) res.json({
        success: false,
        error: 'Заполните все поля!',
      })

      checkExistingNew(title, res);

      const status = await New.create({ text, title });
      if (!status) res.json({
        success: false,
        error: 'Сохранение статьи не удалось!',
      })

      allNews(req, res);
    } catch (error) {
      res.json({
        success: false,
        error
      })
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { text, title } = req.body;

      checkExistingNew(title, res);

      const status = await New.update({ text, title }, { where: { id } });
      if (!status) res.json({
        success: false,
        error: 'Обновление статьи не удалось!',
      })

      allNews(req, res);
    } catch (error) {
      res.json({
        success: false,
        error
      })
    }

  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const status = New.destroy({ where: { id } });
      if (!status) res.json({
        success: false,
        error: 'Удаление статьи не удалось!',
      })

      allNews(req, res);
    } catch (error) {
      res.json({
        success: false,
        error
      })
    }
  },
}
