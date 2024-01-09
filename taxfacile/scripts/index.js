// base Api's
let urlBase = 'https://localhost:7071/api/' //'https://localhost:7071/api/'  'https://orc.net.br/apitax/api/' 'http://localhost:89/api/'

let bodyInjectEventListener = false;
let userName = '';
let backButton = false;
let dataTransfer = '';

const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }
  
function MenuControl() {
    if (getWidth() < 1200) 
        select('body').classList.toggle('toggle-sidebar');
}

function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    //d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

    d.setTime(d.getTime() + (exdays * 60 * 1000)); // minutos
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

function clearTable(idTable) {
    var myTable = document.getElementById(idTable);
    var rowCount = myTable.rows.length;
    for (var x = rowCount - 1; x > 0; x--) {
        myTable.deleteRow(x);
    }
}
//====================================================
function cepMask(mask, char, event, cursor, cep) {
    const vetMask = mask.split('')
    const onlyNumbers = cep.value.split('').filter(value => !isNaN(value) && value != ' ')
    const key = event.keyCode || event.which
    const backspaceAndArrowKeys = [8, 37, 38, 39, 40] //code backspace and arrow keys
    const clickedOnTheBackspaceOrArrowsKeys = backspaceAndArrowKeys.indexOf(key) >= 0
    const charNoMod = ['-'] //characters that do not change
    const cursorIsCloseToCharNoMod = charNoMod.indexOf(vetMask[cursor]) >= 0

    onlyNumbers.forEach((value) => vetMask.splice(vetMask.indexOf(char), 1, value)) //change '#' to numbers

    cep.value = vetMask.join('')

    if (!clickedOnTheBackspaceOrArrowsKeys && cursorIsCloseToCharNoMod) { //increment the cursor if it is close to characters that do not change
        cep.setSelectionRange(cursor + 1, cursor + 1)
    } else {
        cep.setSelectionRange(cursor, cursor)
    }
}

function horarioMask(mask, char, event, cursor, horario) {

    const vetMask = mask.split('') //transform mask into vector to use specific functions, like filter()
    const onlyNumbers = horario.value.split('').filter(value => !isNaN(value) && value != ' ')
    const key = event.keyCode || event.which
    const backspaceAndArrowKeys = [8, 37, 38, 39, 40] //code backspace and arrow keys
    const clickedOnTheBackspaceOrArrowsKeys = backspaceAndArrowKeys.indexOf(key) >= 0
    const charNoMod = [':'] //characters that do not change
    const cursorIsCloseToCharNoMod = charNoMod.indexOf(vetMask[cursor]) >= 0

    onlyNumbers.forEach((value) => vetMask.splice(vetMask.indexOf(char), 1, value)) //change '#' to numbers

    horario.value = vetMask.join('')

    if (!clickedOnTheBackspaceOrArrowsKeys && cursorIsCloseToCharNoMod) { //increment the cursor if it is close to characters that do not change
        horario.setSelectionRange(cursor + 1, cursor + 1)
    } else {
        horario.setSelectionRange(cursor, cursor)
    }
}

function decimalMask(inputTextId, event, places) {
    const el = document.getElementById(inputTextId).value;
    if ((event.keyCode < 48 || event.keyCode > 57) && event.key != ',') {
        event.preventDefault();
        return false;

    } else {
        let res = true;
        const part = el.split(',');
        if (part[1] != undefined && part[1].length >= places)
            res = false;
        else if (event.key == ',' && el.indexOf(',') > 0)
            res = false;

        if (!res)
            event.preventDefault();

        return res;
    }
}

function cnpjMask(inputTextId, event) {
    let el = document.getElementById(inputTextId);

    if ((event.keyCode < 48 || event.keyCode > 57)) {
        el.value = el.value.substring(0, el.value.length -1)
    } else {
        if (el.value.length == 2 || el.value.length == 6) 
            el.value += '.';
        else if (el.value.length == 10)
            el.value += '/';
        else if (el.value.length == 15)
            el.value += '-';
    }
}

function cpfMask(inputTextId, event) {
    let el = document.getElementById(inputTextId);

    if ((event.keyCode < 48 || event.keyCode > 57)) {
        el.value = el.value.substring(0, el.value.length - 1)
    } else {
        if (el.value.length == 3 || el.value.length == 7)
            el.value += '.';
        else if (el.value.length == 11)
            el.value += '-';
    }
}

function formatDecimal(value, places) {
    let valueStr = value.toString().replace(',', '.');

    if (valueStr === '' || valueStr === '0')
        valueStr = '0.0'

    let n = 10 ** places;
    valueStr = (Math.round(parseFloat(valueStr) * n) / n).toString();

    let part = valueStr.split('.');
    if (part[0] === '')
        part[0] = '0';

    if (part[1] == undefined || part[1] === '')
        part[1] = '0';

    let rev = "";
    let x = 0;

    for (let i = part[0].length - 1; i >= 0; i--) {

        if (x == 3) {
            rev += '.';
            x = 1;
        } else
            x++;
        
        rev += part[0][i];
    }

    part[0] = '';
    for (let i = rev.length - 1; i >= 0; i--) {
        part[0] += rev[i];
    }

    part[1] += '0'.repeat(places);
    part[1] = part[1].substring(0, places);

    return part[0] + ',' + part[1];
}

function formatCurrency(value) {
    value = parseFloat(value);
    return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

// load page html 
async function getHtml(pageHtml, destinationId) {
    const response = await fetch(pageHtml);
    await response.text()
        .then(html => {
            document.getElementById(destinationId).innerHTML = html;
            return true;
        })
}

// include javascript file
function includeScript(file) {
    var script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    script.defer = true;

    console.log('include js: ' + file);

    //check exist script
    let exist = false;
    let tags = document.getElementsByTagName('script');
    for (let i = tags.length; i >= 0; i--) {
        if (tags[i] && tags[i].getAttribute('src') != null && tags[i].getAttribute('src').indexOf(file) != -1) {
            //  exist = true;
            tags[i].parentNode.removeChild(tags[i]); // não remove o código apenas a tag script
            break;
        }
    }

    if (!exist) {
        document.getElementsByTagName('body').item(0).appendChild(script);
    }
}

function checkLogin() {
    let cookie = getCookie('username').split('/');
    userName = cookie[0];
    if (userName == '') {
//        window.location.href = 'login.html'; // retirar o comentário
    } else {
        //console.log('-> ' + userName)
        document.getElementById('username').innerText = userName;
    }
}

//=========================================================
// menu events
document.addEventListener('DOMContentLoaded', (e) => {
    checkLogin(e);
    document.getElementById('company-logo').src = getCookie('companylogo');
    console.log('-> ' + getCookie('companylogo'));
});


// Left menu
document.getElementById('dashboard').addEventListener('click', (e) => {
    window.location.reload(true);
});

// Nfe
document.getElementById('nfe-emitente-upload').addEventListener('click', async (e) => {
    e.preventDefault();
    await getHtml('views/nfe-xml-emitente/nfe-emitente-upload.html', 'page');
    includeScript('scripts/nfe-xml-emitente/nfe-emitente-upload.js');
});
document.getElementById('nfe-terceiros-upload').addEventListener('click', async (e) => {
    e.preventDefault();
    await getHtml('views/nfe-xml-terceiros/nfe-terceiros-upload.html', 'page');
    includeScript('scripts/nfe-xml-terceiros/nfe-terceiros-upload.js');
});

// Nfe admin
document.getElementById('nfe-emitente-admin').addEventListener('click', async (e) => {
    e.preventDefault();
    await getHtml('views/nfe-xml-emitente-admin/nfe-emitente-admin.html', 'page');
    includeScript('scripts/nfe-xml-emitente-admin/nfe-emitente-admin.js');
});

document.getElementById('goto-top').addEventListener('click', () => {
    location.href = '#page';
    window.location.hash = '#page';
    console.log('goto-top');
});

window.addEventListener('popstate', detectHistory)
    
function detectHistory() {
    window.history.pushState(null, '', window.location.href);

    if (backButton) {
        //const modal = bootstrap.Modal.getOrCreateInstance('#staticBackdropNotice');
        //document.getElementById('description-modal-notice').innerHTML = 'Use apenas o menu e os botões da aplicação para navegar.';
        //modal.show();
        backButton = false;
    } else
        backButton = true;

    //window.onpopstate = () => {
    //    window.history.pushState(null, '', window.location.href)
    //}
}


