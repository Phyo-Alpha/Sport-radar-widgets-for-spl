import express from "express";
import fetch from "node-fetch";

const app = express();
const port = 3000;

function handleRequest(req, res, url) {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5501');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
}

app.get('/', (req, res) => {
    const url = 'https://api.sportradar.com/soccer/trial/v4/en/sport_events/sr%3Asport_event%3A34151789/summary.json?api_key=KTmX50ecuz4V1DbugD3O9aENXSODlGdp2iAwluZB';
    handleRequest(req, res, url);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});