const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const decodeJwt = require('./JwtDecoder');
const cors = require('cors');

const apikey = 'e251cb9930b6f010cbb6122c5dd755a54409018125050dd8aa1b09737d99983f';
const pushApiUrl = 'https://api.pushy.me/push?api_key=' + apikey;
const secret = 'yo-pwyWMMkM77H_Ms-3UCJxNnybmGOeNFjdovkl6bodESDtjcZwhlAWes3yGd_JEnL1Wg7WJ0C3UhNjCixHUjbafTRlGpcUdu_zsUxAERafyjnU0UUGhSM5DXYdOggyIRoYZaBTeTtcdMWqChqP4YswWcJoTzo-UMSODSbtsIvf9JttWmAVA4IONiObompk0zjZdWfnmz-ebFyaEO6xzFter1K6wchTnwCHFE9x8Dvatp3ay3L7WEh84sZ2VSg2';

// Define the CORS options
const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000', 'https://cloud.mensajes.payway.com.ar'] // Whitelist the domains you want to allow
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.raw({ type: 'application/jwt' }));
app.use(cors(corsOptions));

app.post('/save', (req, res) => {
    console.log('Save route');
    const decoded = decodeJwt(req.body.toString('utf8'), secret);
    console.log('Decoded JWT:', decoded);
    res.status(200).send('Save');
});

app.post('/publish', (req, res) => {
    console.log('Publish route');
    const decoded = decodeJwt(req.body.toString('utf8'), secret);
    console.log('Decoded JWT:', decoded);
    res.status(200).send('Publish');
});

app.post('/validate', (req, res) => {
    console.log('Validate route');
    const decoded = decodeJwt(req.body.toString('utf8'), secret);
    console.log('Decoded JWT:', decoded);
    res.status(200).send('Validate');
});

app.post('/stop', (req, res) => {
    console.log('Stop route');
    const decoded = decodeJwt(req.body.toString('utf8'), secret);
    console.log('Decoded JWT:', decoded);
    res.status(200).send('Stop');
});


app.post('/execute', async (req, res) => {
    console.log('Execute route');
    const decoded = decodeJwt(req.body.toString('utf8'), secret);
    console.log('Decoded JWT:', decoded);

    const inArguments = decoded.inArguments;
    if (!Array.isArray(inArguments) || inArguments.length === 0) {
        res.status(400).send('No inArguments provided');
        return;
    }
    const ToColumn = inArguments.find(arg => 'ToColumn' in arg)?.ToColumn;
    const TitleColumn = inArguments.find(arg => 'TitleColumn' in arg)?.TitleColumn;
    const MessageColumn = inArguments.find(arg => 'MessageColumn' in arg)?.MessageColumn;
    const TimeToLiveColumn = inArguments.find(arg => 'TimeToLiveColumn' in arg)?.TimeToLiveColumn;
    const idlink1 = inArguments.find(arg => 'idlink1' in arg)?.idlink1;
    const idnome1 = inArguments.find(arg => 'idnome1' in arg)?.idnome1;
    const idlink2 = "smartlapos://mobile.smartlapos.help/question/9";
    const idnome2 = "Ver Ayuda";

    console.log('ToColumn', ToColumn);
    console.log('TitleColumn', TitleColumn);
    console.log('MessageColumn', MessageColumn);
    console.log('TimeToLiveColumn', TimeToLiveColumn);
    console.log('idlink1', idlink1);
    console.log('idnome1', idnome1);
    console.log('idlink2', idlink2);
    console.log('idnome2', idnome2);

    try {
        console.log('Enviando mensagem de push para a API do Pushy...');
        const response = await axios.post(pushApiUrl, 
         {
             to: ToColumn,
             data: {
                notification: {
                    time_to_live : 2592000,
                    timestamp: 1647284262000,
                    category: "services_center",
                    title: TitleColumn,
                    short_description: MessageColumn,
                    call_to_action: {
                        url: idlink1,
                        label: idnome1
                    },
                    secondary_call_to_action: {
                        url: idlink2,
                        label: idnome2
                    }
                }
            }           

        }, {
            headers: {
                'Content-Type': 'application/json',
            },        
        });

        console.log('Resposta do envio:', JSON.stringify(response.data));

        if (response.status >= 200 && response.status < 300) {
            res.status(200).send('Mensagem de push enviada com sucesso');
        } else {
            res.status(response.status).send(response.statusText);
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem de push:', error.message);
        res.status(500).send('Erro ao enviar mensagem de push');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
