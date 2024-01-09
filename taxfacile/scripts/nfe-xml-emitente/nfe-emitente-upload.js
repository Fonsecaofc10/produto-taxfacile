var contentFile = '';
var filesRejected = [];
var filesUpload = new Object();

if (document.readyState === "complete") {

    document.getElementById('inputXmlFile').addEventListener('change', async (e) => {
        let tbody = document.querySelector('#tbodyXmlNfeProtocoladas');
        tbody.innerHTML = '';

        let fileInput = document.getElementById("inputXmlFile");
        await getXmlNfeProtocoladas(fileInput);

        filesUpload = e.target.files;

        statusMsg.innerHTML = filesUpload.length +  " arquivos encontrados.";
    })

    document.getElementById('btnUpload').addEventListener('click', async (e) => {
        e.preventDefault();

        let offset = 0;
        let elements = 50;

        if (filesUpload.length < 50)
            elements = filesUpload.length;

        while (true) {
            statusMsg.innerHTML = statusMessageSppiner("Enviando " + (offset + elements) + " arquivos de " + filesUpload.length);

            let result = await fileUpload(filesUpload, offset, elements);

            if (result[0].xmlFileName)
                ShowResultIntoTable(result);
            else
                notice(result);
           
            console.log('normal-2');
            offset += elements;
            let next = parseInt(offset) + parseInt(elements);
            
            if (next > filesUpload.length) {
                console.log('==>> ' + filesUpload.length + ' / ' + next);
                elements = (filesUpload.length - offset);
            }

            if (elements == 0)
                break;
        }

        statusMsg.innerHTML = filesUpload.length + " arquivos enviados.";
    })
}


async function getXmlNfeProtocoladas(fileInput) {
    let files = fileInput.files;
    let file;

    // percorre os arquivos para validar xml de nfe
    for (var i = 0; i < files.length; i++) {
        file = files.item(i);

        let fileName = file.name;

        file.toData(function (contentFile) {
            contentFile = contentFile.split(',')[1];

            if (contentFile != null && contentFile != '' ) {

                const encodedString = contentFile.replace('data:application/xml;base64,', '')
                const data = atob(encodedString);

                const nfeProc = new Object();
                const xmlDocument = new DOMParser().parseFromString(data, 'text/xml');

                let isValidXml = xmlValidated(fileName, xmlDocument);

                if (isValidXml) {
                    const infProt = xmlDocument.querySelector('protNFe').querySelector('infProt');

                    nfeProc.infProt_tpAmb = infProt.querySelector('tpAmb').innerHTML;
                    nfeProc.infProt_chNFe = infProt.querySelector('chNFe').innerHTML;
                    nfeProc.infProt_dhRecbto = infProt.querySelector('dhRecbto').innerHTML;
                    nfeProc.infProt_nProt = infProt.querySelector('nProt').innerHTML;
                    nfeProc.infProt_cStat = infProt.querySelector('cStat').innerHTML;

                    let NFe = xmlDocument.querySelector('NFe').querySelector('infNFe').querySelector('ide');
                    nfeProc.Nfe_infNFe_ide_natOp = NFe.querySelector('natOp').innerHTML;

                    NFe = xmlDocument.querySelector('NFe').querySelector('infNFe').querySelector('dest');
                    nfeProc.Nfe_infNFe_dest_xNome = NFe.querySelector('xNome').innerHTML;

                    NFe = xmlDocument.querySelector('NFe').querySelector('infNFe').querySelector('total').querySelector('ICMSTot');
                    nfeProc.Nfe_infNFe_total_ICMSTot_vNF = NFe.querySelector('vNF').innerHTML;

                    popularTableXmlNfeProtocolodas(fileName, nfeProc);
                }

            } else {
                invalidXmlAddRow(file.name, 'Não é um XML de NFe válido');
            }
        });
    }
}

function popularTableXmlNfeProtocolodas(fileName, nfeProc) {
    let tbody = document.querySelector('#tbodyXmlNfeProtocoladas');
    let tr = tbody.insertRow();
    let td_chave = tr.insertCell();
    let td_emissao = tr.insertCell();
    let td_destinatario = tr.insertCell();
    let td_natOper = tr.insertCell();
    let td_valor_nf = tr.insertCell();
    let td_status = tr.insertCell();
    let td_enviado = tr.insertCell();
    let td_file_name = tr.insertCell();

    td_emissao.className = "text-center";
    td_valor_nf.className = 'text-end';
    td_status.className = 'text-center';
    td_file_name.className = 'd-none';

    td_file_name.innerHTML = fileName;

    let chave = '';
    if (nfeProc.infProt_chNFe.length == 44) {
        chave += String(nfeProc.infProt_chNFe).substring(0, 6);
        chave += '<span class="text-primary fw-bold">' + String(nfeProc.infProt_chNFe).substring(6, 20) + '</span>';
        chave += String(nfeProc.infProt_chNFe).substring(20, 22) + '<br>'
        chave += String(nfeProc.infProt_chNFe).substring(22, 25)
        chave += '<span class="text-primary fw-bold">' + String(nfeProc.infProt_chNFe).substring(25, 34) + '</span>';
        chave += String(nfeProc.infProt_chNFe).substring(34, 44)
    } else {
        chave = nfeProc.infProt_chNFe;
    }

    td_chave.innerHTML = chave;
    td_chave.title = nfeProc.infProt_chNFe;

    let date = nfeProc.infProt_dhRecbto.substring(0,10).split('-');
    td_emissao.innerHTML = date[2] + '/' + date[1] + '/' + date[0];

    td_destinatario.innerHTML = nfeProc.Nfe_infNFe_dest_xNome;
    td_natOper.innerHTML = nfeProc.Nfe_infNFe_ide_natOp;
    td_valor_nf.innerHTML = formatCurrency(nfeProc.Nfe_infNFe_total_ICMSTot_vNF, 2);
    td_status.innerHTML = nfeProc.infProt_cStat;
    td_enviado.innerHTML = '';
}


function ShowResultIntoTable(result) {
    let table = document.getElementById("tableXmlNfeProtocoladas");
    let rows = table.getElementsByTagName("tr");

    for (var k = 0; k < result.length; k++) {
        for (var i = 1; i < rows.length; i++) {
            if (table.rows[i].cells[7].innerText == result[k].xmlFileName) {
                table.rows[i].cells[6].innerText = result[k].xmlResult;
                break;
            }
        }
    }
}

function xmlValidated(file, xmlDocument) {
    if (xmlDocument.querySelector('nfeProc') == null) {
        if (xmlDocument.querySelector('NFe') == null) {
            invalidXmlAddRow(file, 'Não é um XML de NFe');
            return false;
        } else {
            invalidXmlAddRow(file, 'Não é um XML processado pelo SEFAZ');
            return false;
        }
    }

    return true;
}

function invalidXmlAddRow(file, msg) {
    filesRejected.push(file);

    let tbody = document.querySelector('#tbodyXmlInvalidos');
    let tr = tbody.insertRow();
    let td_arquivo = tr.insertCell();
    let td_motivo = tr.insertCell();

    td_arquivo.innerHTML = '<span class="text-danger">' + file + '</span>';
    td_motivo.innerHTML = '<span class="text-danger">' + msg + '</span>';
}

File.prototype.toData = async function (cb) {
    var reader = new FileReader();
    reader.onload = function (e) {
        cb(e.target.result);
    };

    await reader.readAsDataURL(this);
}

function isRejectedXml(fileName) {
    for (let i = 0; i < filesRejected.length; i++) {
        if (fileName == filesRejected[i])
            return true;
    }

    return false;
}

// APIs
async function fileUpload(files, offset, elements) {
    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'multipart/form-data');

    let formData = new FormData();
    let lote = offset + elements;
    for (let i = offset; i < lote; i++) {
        if (!isRejectedXml(files[i].name))
            formData.append('files', files[i], files[i].name);
    }

    var options = {
        method: 'POST',
        body: formData
    };

    const response = await fetch(urlBase + 'File/UploadXmlNfe', options);
    if (!response.ok)
        return response.text();
    else
        return await response.json();
}


