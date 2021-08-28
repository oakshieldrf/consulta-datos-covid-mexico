/**** ARCHIVO PARA MANEJO DE INTERFACES GRAFICAS ****/

export const seccionResumen = document.querySelector('#seccion-resumen');
export const cardConfirmados = document.querySelector('#card-confirmados');
export const cardDefunciones = document.querySelector('#card-defunciones');
export const cardNegativos = document.querySelector('#card-negativos');
export const cardSospechosos = document.querySelector('#card-sospechosos');
export const selectEstado = document.querySelector('#select-estado');
export const selectMapa = document.querySelector('#select-mapa');
export const selectGrafica = document.querySelector('#select-grafica');
export const selectTabla = document.querySelector('#select-tabla');
export const loadingOverlay = document.querySelector('.loading');
export const titleResumen = document.querySelector('#titulo-resumen');
export const titleMapa = document.querySelector('#titulo-mapa');
export const titleGrafica = document.querySelector('#titulo-grafica');
export const titleTabla = document.querySelector('#titulo-tabla');
export const divTabla = document.querySelector('#tabla-casos');
export const divTbody = document.querySelector('#tabla-casos-body');


export default class UI {

    mostrarInfoGeneral(totales){


        const {totalconfirmados, totaldefunciones, totalnegativos, totalsospechosos} = totales;
 
        const cantConfirm =  cardConfirmados.children[1].children[1];
        cantConfirm.textContent = totalconfirmados;

        const cantDefunciones =  cardDefunciones.children[1].children[1];
        cantDefunciones.textContent = totaldefunciones;

        const cantNegativos =  cardNegativos.children[1].children[1];
        cantNegativos.textContent = totalnegativos;

        const cantSospechosos =  cardSospechosos.children[1].children[1];
        cantSospechosos.textContent = totalsospechosos;
        
    }

    loadOverlay(e){

        loadingOverlay.classList.remove('hidden');

        setTimeout(()=>{
                            
            document.activeElement.blur();

            loadingOverlay.classList.add('hidden');
   
        },2000);
    
    
    }

    mostrarDatosTabla(dataSorted){

        divTbody.innerHTML = '';

        dataSorted.forEach( (estado, index) => {
    
        let row =   divTbody.insertRow();
        row.innerHTML = 
                        `<tr>
                            <th scope="row">${index}</th>
                            <td>${estado.nombre} </td>
                            <td>${estado.poblacion}</td>
                            <td>${estado.total}</td>
                        </tr>`
        });

    }

   
}