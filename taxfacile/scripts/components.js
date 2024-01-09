function alertMsg(msg, alert = 'danger') {
    return '<div class="alert alert-' + alert + ' alert-dismissible fade show" role="alert">' + msg + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
}

function tableBarPrintEditAddPhase(url, dataId, description = '') {
    return '<a href="' + url + '?' + dataId + '?print" class="btn btn-warning btn-sm bi bi-printer me-1 selectedLink" title="Imprimir"></a><a href = "' + url + ' ?' + dataId + '?edit" class="btn btn-success btn-sm bi bi-pencil me-1 selectedLink" title="Alterar"></a><a href="' + url + '?' + dataId + '?add" class="btn btn-primary btn-sm bi bi-text-center me-1 selectedLink" title="Descritivo"></a><a href = "' + url + ' ?' + dataId + '?farward?' + description + '" class="btn btn-info btn-sm bi bi-skip-forward me-1 selectedLink" title="Avançar p/ próxima fase"></a><a href = "' + url + ' ?' + dataId + '?reverse?' + description + '" class="btn btn-danger btn-sm bi bi-skip-backward selectedLink" title="Estornar p/ fase anterior"></a>';
}


//// deixar a de cima
//function tablePrintEditAdd(url, dataId) {
//    return '<a href = "' + url + ' ?' + dataId + '?edit" class="btn btn-success btn-sm bi bi-pencil mx-1 selectedLink" title="Alterar"></a><a href="' + url + '?' + dataId + '?add" class="btn btn-primary btn-sm bi bi-text-center selectedLink" title="Descritivo"></a>';
//}

function tableBarTypologyEditDelete(url, dataId, dataDescription = '', urlView = url) {
    return '<a href="' + urlView + '?' + dataId + '?typology" class="btn btn-primary btn-sm bi bi-text-center selectedLink" id="btn-table-view" title="Tipologia"></a><a href = "' + url + '?' + dataId + '?edit" class="btn btn-success btn-sm bi bi-pencil mx-1 selectedLink" title="Alterar"></a ><a href="' + url + '?' + dataId + '?delete?' + dataDescription + '" class="btn btn-danger btn-sm bi bi-trash selectedLink" data-bs-toggle="modal" data-bs-target="#staticBackdropDelete" title="Excluir"></a>';
}

function tableBarItemsDelete(url, dataId, dataDescription = '', urlView = url) {
    return '<a href="' + url + '?' + dataId + '?delete?' + dataDescription + '" class="btn btn-danger btn-sm bi bi-trash mx-1 selectedLink" data-bs-toggle="modal" data-bs-target="#staticBackdropDelete" title="Excluir"></a>';
}

function tableBarItemsViewDelete(url, dataId, dataDescription = '', urlView = url) {
    return '<a href="' + urlView + '?' + dataId + '?view?' + dataDescription + '" class="btn btn-primary btn-sm bi bi-text-center selectedLinkItems" data-bs-toggle="modal" data-bs-target="#modalShowItems" title="Ver itens"></a><a href="' + url + '?' + dataId + '?delete?' + dataDescription + '" class="btn btn-danger btn-sm bi bi-trash mx-1 selectedLink" data-bs-toggle="modal" data-bs-target="#staticBackdropDelete" title="Excluir"></a>';
}

function tableBarViewEditDelete(url, dataId, dataDescription = '', urlView = url) {
    return '<a href="' + urlView + '?' + dataId + '?view" class="btn btn-primary btn-sm bi bi-eye selectedLink" id="btn-table-view" title="Visualizar"></a><a href = "' + url + '?' + dataId + '?edit" class="btn btn-success btn-sm bi bi-pencil mx-1 selectedLink" title="Alterar"></a ><a href="' + url + '?' + dataId + '?delete?' + dataDescription + '" class="btn btn-danger btn-sm bi bi-trash selectedLink" data-bs-toggle="modal" data-bs-target="#staticBackdropDelete" title="Excluir"></a>';
}

function tableBarEditDelete(url, dataId, dataDescription = '', urlView = url) {
    return '<a href = "' + url + '?' + dataId + '?edit" class="btn btn-success btn-sm bi bi-pencil mx-1 selectedLink2" title="Alterar"></a ><a href="' + url + '?' + dataId + '?delete?' + dataDescription + '" class="btn btn-danger btn-sm bi bi-trash selectedLink2" data-bs-toggle="modal" data-bs-target="#staticBackdropDelete" title="Excluir"></a>';
}


function tableBarSelect(classButton, value, modalDismiss = false) {
    let dismiss = '';
    if (modalDismiss)
        dismiss = 'data-bs-dismiss="modal"';

    return '<a href="?' + value + '" class="btn btn-primary btn-sm bi bi-check-circle-fill ' + classButton + '" ' + dismiss + '></a>';
}

function tableBarEdit(url, dataId, dataDescription = '') {
    return '<a href="' + url + '?' + dataId + '?' + dataDescription + '" class="btn btn-success btn-sm bi bi bi-pencil btn-edit-selected" title="Alterar"></a>';
}

function tableBarView(url, dataId) {
    return '<a href="' + url + '?' + dataId + '?view" class="btn btn-primary btn-sm bi bi-eye selectedLink" title="Visualizar"></a>';
}


function tableBarDelete(url, dataId, dataDescription = '') {
    return '<a href="' + url + '?' + dataId + '?delete?' + dataDescription + '" class="btn btn-danger btn-sm bi bi-trash btn-delete-selected" data-bs-toggle="modal" data-bs-target="#staticBackdropDelete" title="Excluir"></a>';
}

function tableBarDeleteItem(url, dataId, dataDescription = '') {
    return '<a href="' + url + '?' + dataId + '?delete?' + dataDescription + '" class="btn btn-danger btn-sm bi bi-trash btn-delete-selected" title="Excluir"></a>';
}

function tableBarEditDeleteItem(url, dataId, dataDescription = '') {
    return '<a href = "' + url + '?' + dataId + '?edit?' + dataDescription + '" class="btn btn-success btn-sm bi bi-pencil mx-1 btn-edit-selected" title="Alterar"></a ><a href="' + url + '?' + dataId + '?delete?' + dataDescription + '" class="btn btn-danger btn-sm bi bi-trash btn-delete-selected" title="Excluir"></a>';
}

async function fillSelect(data, idSelected, idElement, msg){
    if (data != null && data.length > 0) {
        if (idSelected == 0)
            idElement.innerHTML = '<option value="0"> - Selecione ' + msg + ' -</option>';

        let selected = "";
        for(let i = 0; i < data.length; i++) {
           
            if (data[i].Id == idSelected)
                selected = 'selected';
            else
                selected = "";

            idElement.innerHTML += '<option ' + selected + ' value="' + data[i].Id + '">' + data[i].Name + '</option>';
        }
    }
}

function statusMessage(msg, result = 'S') {
    result = result.toUpperCase();
    let icon = '<i class="bi bi-hand-thumbs-up text-info"></i>';
    if (result == 'N')
        icon = '<i class="bi bi-hand-thumbs-down text-warning"></i>';

    return icon + ' ' + msg;
}

function statusMessageSppiner(msg) {
    return '<div><div class="spinner-border spinner-border-sm text-warning" role="status"><span class="visually-hidden">...</span></div><span> ' + msg + '</span></div>';
}


function modalDelete() {
    const html = '<div class="modal fade" id="modalDelete" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalDeleteLabel" aria-hidden="true">'
        + '<div class="modal-dialog">'
        + '<div class="modal-content">'
        + '<div class="modal-header">'
        + '<h5 class="modal-title" id="modalDeleteLabel">Excluir</h5>'
        + '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'
        + '</div>'
        + '<input type="hidden" id="id-modal-item-delete" value="0">'
        + '<div class="modal-body">'
        + '<p id="description-modal-item-delete"></p>'
        + 'Deseja execluir?'
        + '</div>'
        + '<div class="modal-footer">'
        + '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>'
        + '<button type="button" class="btn btn-danger" id="btn-modal-delete">Excluir</button>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'

}

function notice(message) {
    const modal = bootstrap.Modal.getOrCreateInstance('#staticBackdropNotice');
    document.getElementById('description-modal-notice').innerHTML = message;
    modal.show();
}

function createAccordion(idAccordion) {
    return `<div class="accordion show" id="` + idAccordion + `">
            </div>`
}

function accordionItemAdd(idAccordion, idElement, title, details) {
    return `<div class="accordion-item" id="` + idElement + `">
                <h2 class="accordion-header" id = "heading` + idElement + `" >
                    <button class="accordion-button text-danger" type="button" data-bs-toggle="collapse" data-bs-target="#collapse` + idElement + `" aria-expanded="true" aria-controls="collapse` + idElement + `"> `+
                        title
                + `</button>
                </h2 >
                <div id="collapse` + idElement + `" class="accordion-collapse collapse show" aria-labelledby="heading` + idElement + `">
                    <div class="accordion-body">` +
                        details
                 + `</div>
                </div>
            </div >`;
}

function treeViewAddStructure(ulIdDestination, titleStrucuture, idStrucuture) {
    
   // console.log('add dest => ' + ulIdDestination + ' name ' +  idStrucuture);

    let ul = document.getElementById(ulIdDestination);
    let li = document.createElement('li');
    let ul2 = document.createElement('ul');
    let span = document.createElement('span');

    ul2.className = 'active-node'; // retirar par deixar fechado
    li.className = 'mt-3';
    span.className = 'caret caret-down fw-bold text-primary'; // retirar caret-down p/ fechar
    span.setAttribute('id', 'caret-' + idStrucuture);
  //  let text = document.createTextNode(titleStrucuture);
  //  span.appendChild(text);

    span.innerHTML = titleStrucuture;

    ul2.setAttribute('id', idStrucuture);
    ul2.classList.add('nested');
    
    li.appendChild(span);
    ul.appendChild(li).appendChild(ul2);

    //console.log('finalizou');
}

function treeViewAddStructureItem(ulIdDestination, descriptionItem) {
    let ul = document.getElementById(ulIdDestination);
    let li = document.createElement('li');
   // let text = document.createTextNode(descriptionItem);
 //   li.appendChild(text);

    li.className = 'mt-1';
    li.innerHTML = descriptionItem;
    ul.appendChild(li);
}

