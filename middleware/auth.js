exports.auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Personal Blog"');
        return res.status(401).send('Authorization required.');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Replace this validation logic with your own
    const validUsername = 'admin';
    const validPassword = 'admin';

    if (username === validUsername && password === validPassword) {
        return next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Personal Blog"');
        return res.status(401).send('Invalid credentials.');
    }
}