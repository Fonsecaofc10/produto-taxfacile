document.body.addEventListener('click', click);

async function click(e) {

    document.getElementById('xmlFile').addEventListener('click', (e) => { 
        console.log('---> input');
    })

    document.getElementById('search').addEventListener('click', (e) => {
        console.log('---> search');
    })

    if (e.target == undefined || e.target.matches('#btn-xmlFile') || e.target.matches('#xmlFile')) {
        return;
    }

    e.preventDefault();
    e.stopPropagation();
    bodyInjectEventListener = true;
    checkLogin();

    if (e.target.matches('#search')) {
        console.log('search');
     //   getManpowerByName();
    }

}

document.body.addEventListener('keypress', keypress);
function keypress(e) {
    if (e.target.matches('#people_per_team')) {
        const regex = /^[0-9]+$/;
        if (!regex.test(e.key)) {
            e.preventDefault();
            return false;
        } else
            return true;

    } else if (e.target.matches('#cost_per_day_team')) {
        decimalMask('cost_per_day_team', e, 3);
    } else if (e.target.matches('#unit_per_day_team')) {
        decimalMask('unit_per_day_team', e, 3);
    }
}