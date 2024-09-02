const fs = require('fs').promises;
const path = require('path');
const dir = path.join(__dirname, '../db/articles');

// Helper function to get the file path for an article
const getArticleFilePath = (id) => path.join(dir, `${id}.json`);

// Find all articles
exports.findAllArticles = async () => {
    try {
        const fileList = await fs.readdir(dir);
        const articles = await Promise.all(
            fileList.map(async (file) => {
                const name = getArticleFilePath(file.replace('.json', ''));
                const data = await fs.readFile(name, 'utf8');
                let parsedData = JSON.parse(data);
                parsedData.id = file.replace('.json', '');
                return parsedData;
            })
        );
        return articles;
    } catch (error) {
        console.error('Error reading articles:', error);
        return [];
    }
};

// Find an article by ID
exports.findArticleById = async (id) => {
    const file = getArticleFilePath(id);
    try {
        const data = await fs.readFile(file, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading article:', error);
        return null;
    }
};

// Create a new article
exports.createArticle = async (title, publish_date, content) => {
    const id = Date.now().toString();
    const file = getArticleFilePath(id);
    const newArticle = {
        title,
        publish_date,
        content
    };
    try {
        await fs.writeFile(file, JSON.stringify(newArticle));
        return { id, ...newArticle };
    } catch (error) {
        console.error('Error creating article:', error);
        return null;
    }
};

// Update an existing article
exports.updateArticle = async (id, title, publish_date, content) => {
    const file = getArticleFilePath(id);
    try {
        const data = await fs.readFile(file, 'utf8');
        let article = JSON.parse(data);
        article.title = title || article.title;
        article.publish_date = publish_date || article.publish_date;
        article.content = content || article.content;
        await fs.writeFile(file, JSON.stringify(article));
        return article;
    } catch (error) {
        console.error('Error updating article:', error);
        return null;
    }
};

// Delete an article
exports.deleteArticle = async (id) => {
    const file = getArticleFilePath(id);
    console.log("🚀 ~ exports.deleteArticle ~ file:", file)
    try {
        await fs.unlink(file);
        return true;
    } catch (error) {
        console.error('Error deleting article:', error);
        return false;
    }
};
