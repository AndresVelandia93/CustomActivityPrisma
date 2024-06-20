const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const decodeJwt = require('./JwtDecoder');

const apikey = 'e251cb9930b6f010cbb6122c5dd755a54409018125050dd8aa1b09737d99983f';
const pushApiUrl = 'https://api.pushy.me/push?api_key=' + apikey;
const secret = 'SXIkZYjj9vayae8QOhvfL1cvzlJ1feAQTyiaNByPqnfCfufNTrwmtGH6thoIoP4hEbD-ObdKOI6npAwPTUFYCt6arOi0bBO8-ARmSGfLLS-6lw0TJtJnuIlEiqvzZ5sgYvF1QBy799nIvdTziIHWxZQat3rBoF3DcuQlVwlTf2qyOGL8SSIsRwd_JPIbvqnEhgwnCLkaqz43xLIxrPute0zVZllMITNej7NRu8joMTDENIlPI_5SEtU2MLcO9A2';

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.raw({ type: 'application/jwt' }));

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
    const SelectContacto = inArguments.find(arg => 'SelectContacto' in arg)?.SelectContacto;
    const IdCampana = inArguments.find(arg => 'IdCampana' in arg)?.IdCampana;
    const CallToAction = inArguments.find(arg => 'CallToAction' in arg)?.CallToAction;
    const TimeToLive = inArguments.find(arg => 'TimeToLive' in arg)?.TimeToLive;
    const Categoria = inArguments.find(arg => 'Categoria' in arg)?.Categoria;
    const Title = inArguments.find(arg => 'Title' in arg)?.Title;
    const ShortDescription = inArguments.find(arg => 'ShortDescription' in arg)?.ShortDescription;
    const LongDescription = inArguments.find(arg => 'LongDescription' in arg)?.LongDescription;
    const CallToActionLabel = inArguments.find(arg => 'CallToActionLabel' in arg)?.CallToActionLabel;
    const SecondaryCallToAction = inArguments.find(arg => 'SecondaryCallToAction' in arg)?.SecondaryCallToAction;
    const Nombre = inArguments.find(arg => 'Nombre' in arg)?.Nombre;
    const Modulo = inArguments.find(arg => 'Modulo' in arg)?.Modulo;

    try {
        console.log('Enviando mensage de push para a API de Pushy...');
        const response = await axios.post(pushApiUrl, 
         {
             to: SelectContacto,
             data: {
                notification: {
                    time_to_live : TimeToLive,
                    timestamp: TimeToLive,
                    category: Categoria,
                    title: Title,
                    short_description: ShortDescription,
                    call_to_action: {
                        url: CallToAction,
                        label: CallToActionLabel
                    },
                    secondary_call_to_action: {
                        url: SecondaryCallToAction,
                        label: CallToActionLabel
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
            res.status(200).send('Mensage de push enviado con Exito');
        } else {
            res.status(response.status).send(response.statusText);
        }
    } catch (error) {
        console.error('Error al enviar mensage de push:', error.message);
        res.status(500).send('Error al enviar mensage de push');
    }
});

app.get('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', 'https://cloud.mensajes.payway.com.ar');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
