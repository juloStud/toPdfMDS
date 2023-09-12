const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/convert', async (req, res) => {
    const { htmlContent, includeBootstrap } = req.body;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    if (includeBootstrap) {
        const bootstrapStyles = `<head><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"></head>`;
        await page.setContent(bootstrapStyles + htmlContent);
    } else {
        await page.setContent(htmlContent);
    }
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
})
