if (document.readyState === "complete") {

    document.getElementById('btnConsultar').addEventListener('click', async (e) => {
        e.preventDefault();

        let data = await GetAllNFeByPeriod(dataDe.value, dataAte.value);

        if (data == null)
            console.log('-> erro no upload');
        else {
            popularTableXmlNfe(data);
        }
    })

}

function popularTableXmlNfe(data) {

    clearTable('tableXmlNfe');
    let tbody = document.querySelector('#tbodyXmlNfe');

    for (let i = 0; i < data.itens.length; i++) {
        let tr = tbody.insertRow();
        let td_chave = tr.insertCell();
        let td_emissao = tr.insertCell();
        let td_destinatario = tr.insertCell();
        let td_natOper = tr.insertCell();
        let td_valor_nf = tr.insertCell();
        let td_valor_icms = tr.insertCell();
        let td_valor_ipi = tr.insertCell();
        let td_valor_pis = tr.insertCell();
        let td_valor_cofins = tr.insertCell();
        let td_status = tr.insertCell();
        let td_manifest = tr.insertCell();

        td_emissao.className = 'text-center';
        td_valor_nf.className = 'text-end';
        td_valor_icms.className = 'text-end';
        td_valor_ipi.className = 'text-end';
        td_valor_pis.className = 'text-end';
        td_valor_cofins.className = 'text-end';
        td_status.className = 'text-center';

        let chave = '';
        if (data.itens[i].chNFe.length == 44) {
            chave += String(data.itens[i].chNFe).substring(0, 6);
            chave += '<span class="text-primary fw-bold">' + String(data.itens[i].chNFe).substring(6, 20) + '</span>';
            chave += String(data.itens[i].chNFe).substring(20, 22) + '<br>'
            chave += String(data.itens[i].chNFe).substring(22, 25)
            chave += '<span class="text-primary fw-bold">' + String(data.itens[i].chNFe).substring(25, 34) + '</span>';
            chave += String(data.itens[i].chNFe).substring(34, 44)
        } else {
            chave = data.itens[i].chNFe;
        }

        td_chave.innerHTML = chave; //data.itens[i].numeroNfe; 
        td_chave.title = data.itens[i].chNFe;

        let date = data.itens[i].dataEmissao.split('-');
        td_emissao.innerHTML = date[2] + '/' + date[1] + '/' + date[0];

        td_destinatario.innerHTML = data.itens[i].nomeDestinatario + '<br />' + data.itens[i].cnpjCpf;
        td_natOper.innerHTML = data.itens[i].naturezaOperacao;

        td_valor_nf.innerHTML = formatDecimal(data.itens[i].valorTotalNF, 2);
        td_valor_nf.title = "Valor da NFe";
        td_valor_icms.innerHTML = formatDecimal(data.itens[i].valorTotalIcms, 2);
        td_valor_icms.title  ="Valor do ICMS"
        td_valor_ipi.innerHTML = formatDecimal(data.itens[i].valorTotalPis, 2);
        td_valor_ipi.title = "Valor do IPI";
        td_valor_pis.innerHTML = formatDecimal(data.itens[i].valorTotalCofins, 2);
        td_valor_pis.title = "Valor do PIS";
        td_valor_cofins.innerHTML = formatDecimal(data.itens[i].valorTotalIPI, 2);
        td_valor_cofins.title = "Valor do COFINS";

        td_status.innerHTML = data.itens[i].status;
    }

    if (data != null) {
        console.log('-> ' + data.total.valorTotalIPI);
        nfeQtde.value = data.total.qtdeNFe;
        nfeValorNfe.value = formatDecimal(data.total.valorTotalNF, 2);
        nfeValorIcms.value = formatDecimal(data.total.valorTotalIcms, 2);
        nfeValorIpi.value = formatDecimal(data.total.valorTotalIPI, 2);
        nfeValorPis.value = formatDecimal(data.total.valorTotalPis, 2);
        nfeValorCofins.value = formatDecimal(data.total.valorTotalCofins, 2);
    }
}


// APIs
async function GetAllNFeByPeriod(dataDe, dataAte) {
    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

    var options = {
        method: 'GET',
        myHeaders
    };

    const response = await fetch(urlBase + 'NfeXml/GetAllNFeByDate?dataDe=' + dataDe + '&dataAte=' + dataAte, options);
    return await response.json();
}



