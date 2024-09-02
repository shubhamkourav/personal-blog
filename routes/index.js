const express = require('express');
const { findAllArticles, findArticleById, createArticle, updateArticle, deleteArticle } = require('../utils/util');
const { auth } = require('../middleware/auth');
const router = express.Router();

// GET home page
router.get('/', async (req, res, next) => {
  try {
    const articles = await findAllArticles();
    res.render('index', { title: 'Personal Blogs', articles, isAuthenticated: false });
  } catch (error) {
    next(error);
  }
});

// GET single article
router.get('/article/:id', async (req, res, next) => {
  try {
    const article = await findArticleById(req.params.id);
    if (!article) return res.status(404).send('Article not found');
    res.render('single', { ...article });
  } catch (error) {
    next(error);
  }
});

// GET admin page
router.get('/admin', auth, async (req, res, next) => {
  try {
    const articles = await findAllArticles();
    res.render('index', { title: 'Personal Blogs', articles, isAuthenticated: true });
  } catch (error) {
    next(error);
  }
});

// GET new article form
router.get('/new', auth, (req, res) => {
  res.render('add');
});

// POST create new article
router.post('/new', auth, async (req, res, next) => {
  try {
    const { title, publish_date, content } = req.body;
    const newArticle = await createArticle(title, publish_date, content);
    res.redirect(`/article/${newArticle.id}`);
  } catch (error) {
    next(error);
  }
});

// GET edit article form
router.get('/edit/:id', auth, async (req, res, next) => {
  try {
    const article = await findArticleById(req.params.id);
    if (!article) return res.status(404).send('Article not found');
    res.render('edit', { ...article });
  } catch (error) {
    next(error);
  }
});

// POST update article
router.post('/edit/:id', auth, async (req, res, next) => {
  try {
    const { title, publish_date, content } = req.body;
    await updateArticle(req.params.id, title, publish_date, content);
    res.redirect(`/article/${req.params.id}`);
  } catch (error) {
    next(error);
  }
});

// POST delete article
router.get('/delete/:id', auth, async (req, res, next) => {
  try {
    await deleteArticle(req.params.id);
    res.redirect('/admin');
  } catch (error) {
    next(error);
  }
});

module.exports = router;