import 'dotenv/config';
import axios from 'axios';
import ping from 'ping';
import https from 'https'; // Подключаем модуль https
import NodeRSA from 'node-rsa';
import * as cheerio from 'cheerio';
import { before_login } from './router_legacy_updated.js';




// Настройки
const ROUTER_IP = process.env.ROUTER_IP; // IP-адрес вашего роутера
const ROUTER_USERNAME = process.env.ROUTER_USERNAME; // Имя пользователя роутера
global.ROUTER_PASSWORD = process.env.ROUTER_PASSWORD; // Пароль роутера
const PING_TARGET = process.env.PING_TARGET; // Адрес для проверки интернета (например, Google DNS)
const publicKeyPem = '';
const INTERNET_CHECK_INTERVAL =   30 * 1000; // Каждые 30 секунд
const REBOOT_INTERVAL = 8 * 60 * 1000; //  8 минут

let cookie = "";
global.priv_key = generatePrivateKey();
global.dp = '';
global.pwenc = '';
global.pub_key = '' ;
let Interval = null;

// Создаем кастомный httpsAgent, который игнорирует ошибки сертификата
const httpsAgent = new https.Agent({
    rejectUnauthorized: false // Игнорировать ошибки самоподписанных сертификатов
});

////////////////////////////////////////////////////////////////////////////////

/**
 * Генерация случайного приватного ключа (аналогично set_pvk())
 * @returns {string} - Случайный приватный ключ из 16 цифр
 */
function generatePrivateKey() {
    let privateKey = '';
    for (let i = 0; i < 16; i++) {
        privateKey += Math.floor(Math.random() * 10);
    }
    return privateKey;
}
////////////////////////////////////////////////////////////////////////////////

// Функция для проверки доступности интернета
async function checkInternet() {
    try {
        let result = false;
        for(let i = 0; i<10; i++)
        {
            await sleep(100);
            const res = await ping.promise.probe(PING_TARGET);
            console.log(res.alive);
            result = res.alive || result;
        }
        return result;
    } catch (error) {
        console.error('Ошибка при проверке интернета:', error);
        return false;
    }
}


// Функция для перезагрузки роутера
async function rebootRouter() {
    try {
        // Генерация временной метки
        const timestamp = Date.now();

        // Формирование URL для перезагрузки
        const rebootUrl = `https://${ROUTER_IP}/uir/rebo.htm?Nrd=0&ZT=${timestamp}`;

        // Отправка GET-запроса с авторизацией и игнорированием ошибок сертификата
        const response = await axios.get(rebootUrl, {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive',
                'Cookie': cookie,
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"'
            },
            httpsAgent: httpsAgent // Используем кастомный httpsAgent
        });

        console.log('Роутер успешно перезагружен:');
    } catch (error) {
        console.error('Ошибка при перезагрузке роутера:', error);
    }
}

async function getPubKey() {
    try {
        // Генерация временной метки
        const timestamp = Date.now();

        // Формирование URL для перезагрузки
        const Url = `https://${ROUTER_IP}/loginpage.htm`;

        // Отправка GET-запроса с авторизацией и игнорированием ошибок сертификата
        const response = await axios.get(Url, { httpsAgent: httpsAgent });
        const $ = cheerio.load(response.data);

        // Извлекаем элемент по id
        const divPemContent = $('#divpem').html();
        global.pub_key = divPemContent;



    } catch (error) {
        console.error('Ошибка при перезагрузке роутера:', error);
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Функция для
async function loginRouter() {
    try {
        // Генерация временной метки
        const timestamp = Date.now();

        // Формирование URL для перезагрузки
        const logInUrl = `https://${ROUTER_IP}/log/in`;

        // Отправка GET-запроса с авторизацией и игнорированием ошибок сертификата

        const response = await axios.post(logInUrl,
            {
                un: ROUTER_USERNAME,
                pw: global.pwenc,
                rd: '/uir/dwrhome.htm',
                rd2: '/uir/loginpage.htm',
                Nrd: 1,
                Nlmb:''
            },{
            headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
        //    'Cookie': cookie,
            'Sec-Fetch-Dest': 'frame',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            },
            httpsAgent: httpsAgent, // Используем кастомный httpsAgent
            maxRedirects: 0,
            validateStatus: function (status) {
                // Считаем успешными все коды 2xx и 303
                return (status >= 200 && status < 300) || status === 303;
            }
        });
        cookie = response.headers['set-cookie'][0];

        console.log('status:', response.status  );
        console.log('cookie:',response.headers['set-cookie'][0]);
    } catch (error) {
        console.error( 'Ошибка логина ');
        console.error( error);
    }
}

async function checkAndReboot()
{
    if(!Interval)
    {
        return;
    }
    let isInternetAlive = await checkInternet();
    if (!isInternetAlive) {
        rebootingInternet();
    }
    else
    {
        console.log('checkAndReboot');
        let timestamp = (new Date()).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        console.log( '[' + timestamp + ']' );
        console.log('Интернет доступен. Иди ка ты нахрен');
    }
}

async function rebootingInternet()
{
    let timestamp = (new Date()).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    console.log( '[' + timestamp + ']' );
    console.log('Интернет недоступен. Пытаюсь перезагрузить роутер...');
    await getPubKey();
    await sleep(500);
    await before_login();
    await loginRouter();
    await sleep(500);
    await rebootRouter();
    internetRebooted();
}

function internetRebooted()
{
    clearInterval(Interval);
    Interval = null;
    setTimeout(() => {
        Interval = setInterval(async () => checkAndReboot(), INTERNET_CHECK_INTERVAL);
    }, REBOOT_INTERVAL)
}


// Основная функция



// Запуск основной функции
async function main()
{
    Interval = setInterval(async () => checkAndReboot(), INTERNET_CHECK_INTERVAL);
    checkAndReboot();
    console.log(Interval);

}
main();

async function test_login()
{
    await getPubKey();
    await sleep(500);
    await before_login();
    await loginRouter();
}

//test_login();
