module.exports = {
  list: async (req, res) => {},
  create: async (req, res) => {
    const { text, title } = req.body;
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { text, title } = req.body;
  },
  delete: async (req, res) => {
    const { id } = req.params;
  },
}
