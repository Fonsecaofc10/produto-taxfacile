// base Api's
let urlBase = 'http://localhost:44373/api/';  // 'https://orc.net.br/apidev/api/';  'http://localhost:44373/api/';  'http://localhost:88/api/';

if (document.getElementById('login-send-link-form') != null) {
    btnSendLinkPasswordForm = document.getElementById('login-send-link-form');

    btnSendLinkPasswordForm.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'login-send-link-reset-password.html';
    });
}

if (document.getElementById('btn-send-link-password') != null) {
    btnSendLinkPassword = document.getElementById('btn-send-link-password');

    btnSendLinkPassword.addEventListener('click', function (e) {
        e.preventDefault();

        sendLinkPassword(document.getElementById('userName').value);
        
    });
}

if (document.getElementById('btn-reset-password') != null) {
    btnResetPassword = document.getElementById('btn-reset-password');

    btnResetPassword.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('btn-reset-password ');

        const key = window.location.href.split('?')[1];
        const password1 = document.getElementById('password1').value;
        const password2 = document.getElementById('password2').value;

        resetPassword(key, password1, password2);
    });
}

if (document.getElementById('btn-login') != null) {
    btnLogin = document.getElementById('btn-login');

    btnLogin.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        console.log('-> ' + e.target.value);

        if (e.target.matches('#btn-login')) {
            let company = document.getElementById('company').value;
            let userName = document.getElementById('username').value;
            let password = document.getElementById('password').value;
            login(company, userName, password);

        } else if (e.target.matches('#btn-send-link-password')) {
            alert('enviar link para alterar a senha');
        }

    });
}

function login(company, userName, password) {
    
    const data = {
        Id: 0,
        UserName: userName,
        FirstName: '',
        LastName: '',
        IsAtive: 0,
        IdCompany: company,
        Password: password,
        Authorized: ''
    };

    fetch(urlBase + 'auth/GetByname',
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(function (response) {
            if (!response.ok)
                throw new Error('Erro ao executar a requisição! Status ' + response.status)

            return response.json();
        })
        .then(function (data) {
            if (data.Authorized == 'ok' && data.Token != null) {
                setCookie('token', data.Token, 600);
                let cookie = data.UserName + '/' + data.IdCompany + '/true';
                setCookie('username', cookie, 600);
                setCookie('companyname', data.Company.Name, 600);
                setCookie('companylogo', data.Company.Logo, 600);
                console.log('-> ' + data.Company.Logo);
                window.location.href = '/'; // '/appdev' local '/';
            } else {
                document.getElementById('alert').innerHTML = alertMsg(data.Authorized , 'warning');
            }

            return data;
        })
        .catch(function (error) {
            console.log("error");
            if (document.getElementById('alert'))
                document.getElementById('alert').innerHTML = alertMsg(error.message, 'danger');
        })
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    //d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000)); // dias

    d.setTime(d.getTime() + (exdays * 60 * 1000)); // minutos
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function sendLinkPassword(userName) {
    console.log('=> ' + userName);

    const data = {
        'UserName': userName
    };

    fetch(urlBase + 'auth/CreateLinkResetPassword',
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(function (response) {
            if (!response.ok)
                throw new Error('Erro ao executar a requisição! Status ' + response.status)

            return response.json();
        })
        .then(function (data) {
            console.log('-> ' + data);
            document.getElementById('alert').innerHTML = alertMsg(data, 'warning');
        })
        .catch(function (error) {
            console.log("error");
            if (document.getElementById('alert'))
                document.getElementById('alert').innerHTML = alertMsg(error.message, 'danger');
        })
}

function resetPassword(key, password1, password2) {
    console.log('=> ' + key);

    const data = {
        'Key': key,
        'Password1': password1,
        'Password2': password2
    };

    fetch(urlBase + 'auth/ResetPassword',
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(function (response) {
            if (!response.ok)
                throw new Error('Erro ao executar a requisição! Status ' + response.status)

            return response.json();
        })
        .then(function (data) {
            console.log('-> ' + data);
            document.getElementById('alert').innerHTML = alertMsg(data, 'warning');
        })
        .catch(function (error) {
            console.log("error");
            if (document.getElementById('alert'))
                document.getElementById('alert').innerHTML = alertMsg(error.message, 'danger');
        })
}

document.body.addEventListener('keypress', keypress);
function keypress(e) {
    if (e.target.matches('#company')) {
        const regex = /^[0-9]+$/;
        if (!regex.test(e.key)) {
            e.preventDefault();
            return false;
        } else
            return true;

    }
}