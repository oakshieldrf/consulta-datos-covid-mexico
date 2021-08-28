import { API } from './api.js';
import UI, * as uiItem from './ui.js'
import {Informacion} from './clases.js';
import {iniciarMapa, cargarDataMapa} from './mapa.js';
import {statesData} from './data-mapa.js';
import {Grafica} from './charts.js'

// Archivo principal donde se integra todo el codigo
/*

    Secuencia de actividades:

    1) Usuario entra a pag principal y se cargan toda la info general (datos, graficas, tablas) al DOM
       1.1) Solicitud a api para obtener datos
       1.2) Devuelve una respuesta y muestra los datos en todas las secciones del dom
    
    2) Se cargan todos los listeners en el DOM 
        2.1) Click listener en cards para mostrar info segun el tipo de dato
        2.2) Click Listener en layers de estados para mostrar info segun el estado seleccionado
        2.3) Click listener en select de tabla para mostrar info segun el tipo de dato
    3) 

*/

// VARIABLES
let resConfirmados, resDefunciones, resNegativos, resSospechosos; //Para obtener respuestas de API
let defuncionesObj, confirmadosObj, sospechososObj, negativosObj; //Objetos tipo Informacion
let datosConfirmadosAll, datosDefuncionesAll, datosNegativosAll, datosSospechososAll; //Para obtener datos de respuestas
let datosUbicacionConfirmados, datosUbicacionDefunciones, datosUbicacionNegativos, datosUbicacionSospechosos; //Listas de datos por estado
let poblaciones, noTotales, dataMapa; //Parametros para obtener datos y cargar el mapa
let confirmadosSorted, defuncionesSorted, negativosSorted, sospechososSorted;//Datos generales ordenados ascendente
let recentDatesGraph; //Lista de fechas recientes para grafica
let ui, api, grafica; //Para declarar objetos de clase
let dataResolve; //
let totales= { //Para mostrarlos en cards
    totalconfirmados:0,
    totaldefunciones:0,
    totalnegativos:0,
    totalsospechosos:0,
};


//LISTENER PARA PAGINA CARGADA
document.addEventListener('DOMContentLoaded', () => {
 
    api = new API("api");
    ui = new UI();

    cargarListeners();
    cargarDatosAPI();
    iniciarMapa(statesData);

});

// CARGA LISTENERS PARA SELECTS
function cargarListeners() {

// LISTENER PARA DATOS GENERALES CARDS
    uiItem.selectEstado.addEventListener('change', e => {

        let id = Number(e.target.value);
        uiItem.titleResumen.textContent =  e.target.options[id+1].text;

        ui.loadOverlay();
        cargarDatosAPI(Number(id));

    });

// LISTENER PARA MAPA
    uiItem.selectMapa.addEventListener('change', e => {

        ui.loadOverlay();

        let tipo = e.target.value;

        switch(tipo){

            case 'confirmados':

                uiItem.titleMapa.textContent = " de casos confirmados";
                poblaciones = datosConfirmadosAll.map(estado => estado.poblacion );
                noTotales = datosConfirmadosAll.map(estado => estado.total );

                dataMapa = cargarDataMapa(poblaciones, noTotales);
                iniciarMapa(dataMapa);

                break;

            case 'defunciones':

                uiItem.titleMapa.textContent = " de defunciones";
                poblaciones = datosDefuncionesAll.map(estado => estado.poblacion );
                noTotales = datosDefuncionesAll.map(estado => estado.total );

                dataMapa = cargarDataMapa(poblaciones, noTotales);
                iniciarMapa(dataMapa);

                break;

            case 'negativos':

                uiItem.titleMapa.textContent = " de casos negativos";
                poblaciones = datosNegativosAll.map(estado => estado.poblacion );
                noTotales = datosNegativosAll.map(estado => estado.total );

                dataMapa = cargarDataMapa(poblaciones, noTotales);
                iniciarMapa(dataMapa);

                break;

            case 'sospechosos':

                uiItem.titleMapa.textContent = " de casos sospechosos";
                poblaciones = datosSospechososAll.map(estado => estado.poblacion );
                noTotales = datosSospechososAll.map(estado => estado.total );

                dataMapa = cargarDataMapa(poblaciones, noTotales);
                iniciarMapa(dataMapa);

                break;
        }
   

    });

// LISTENER PARA GRAFICA
    uiItem.selectGrafica.addEventListener('change', e => {

        ui.loadOverlay();

        let tipo = e.target.value;

        switch(tipo) {
            case "confirmados":
                recentDatesGraph = confirmadosObj.calcularTotalMes(datosUbicacionConfirmados);
                grafica = new Grafica(recentDatesGraph);
                grafica.iniciarGrafica();
                uiItem.titleGrafica.textContent = "Casos confirmados";
                break;

            case "defunciones":
                recentDatesGraph = confirmadosObj.calcularTotalMes(datosUbicacionDefunciones);
                grafica = new Grafica(recentDatesGraph);
                grafica.iniciarGrafica();
                uiItem.titleGrafica.textContent = "Defunciones";
                break;

            case "negativos":
                recentDatesGraph = confirmadosObj.calcularTotalMes(datosUbicacionNegativos);
                grafica = new Grafica(recentDatesGraph);
                grafica.iniciarGrafica();
                uiItem.titleGrafica.textContent = "Casos negativos";
                break;  

            case "sospechosos":
                recentDatesGraph = confirmadosObj.calcularTotalMes(datosUbicacionSospechosos);
                grafica = new Grafica(recentDatesGraph);
                grafica.iniciarGrafica();
                uiItem.titleGrafica.textContent = "Casos sospechosos";
                break;                              
        }
            
    });

// LISTENER PARA TABLAS
    uiItem.selectTabla.addEventListener('change', e => {
        
        ui.loadOverlay();
        let tipo = e.target.value;

        switch(tipo) {

            case "confirmados":
                ui.mostrarDatosTabla(confirmadosSorted);
                uiItem.titleTabla.textContent = "Confirmados";
                break;

            case "defunciones":
                ui.mostrarDatosTabla(defuncionesSorted);
                uiItem.titleTabla.textContent = "Defunciones";
                break;

            case "negativos":
                ui.mostrarDatosTabla(negativosSorted);
                uiItem.titleTabla.textContent = "Negativos";
                break;

            case "sospechosos":
                ui.mostrarDatosTabla(sospechososSorted);
                uiItem.titleTabla.textContent = "Sospechosos";
                break;

        }

    });

}


//CARGA DATOS DE API SEAN GENERALES O POR ESTADO Y LOS MUESTRA EN LOS CARDS PRINCIPALES
function cargarDatosAPI(id=0) {


//GET DATA CONFIRMADOS
    resConfirmados = api.getDataConfirmados();
    dataResolve = Promise.resolve(resConfirmados);

    dataResolve.then(value => {

        datosConfirmadosAll = value;

        datosConfirmadosAll.push({tipo:"confirmados"});
        datosUbicacionConfirmados  = datosConfirmadosAll.filter( entidad => entidad.cve_ent == id);


        confirmadosObj = new Informacion(datosConfirmadosAll);
        recentDatesGraph = confirmadosObj.calcularTotalMes(datosUbicacionConfirmados);
        confirmadosSorted = confirmadosObj.ordenarPorCantidad();

        totales['totalconfirmados'] = confirmadosObj.formatCantidad(datosUbicacionConfirmados[0]['total']);
        ui.mostrarInfoGeneral(totales);

        grafica = new Grafica(recentDatesGraph);
        grafica.iniciarGrafica();

        ui.mostrarDatosTabla(confirmadosSorted);

    });

// GET DATA DEFUNCIONES 
    resDefunciones = api.getDataDefunciones();
    dataResolve = Promise.resolve(resDefunciones);

    dataResolve.then(value => {

        datosDefuncionesAll = value;
        datosUbicacionDefunciones  = datosDefuncionesAll.filter( entidad => entidad.cve_ent == id);

        defuncionesObj = new Informacion(datosDefuncionesAll);
        defuncionesSorted = defuncionesObj.ordenarPorCantidad();

        totales['totaldefunciones'] = defuncionesObj.formatCantidad(datosUbicacionDefunciones[0]['total']) ;

        ui.mostrarInfoGeneral(totales);

    });

// GET DATA NEGATIVOS
    resNegativos = api.getDataNegativos();
    dataResolve = Promise.resolve(resNegativos);

    dataResolve.then(value => {

        datosNegativosAll = value;
        datosUbicacionNegativos  = datosNegativosAll.filter( entidad => entidad.cve_ent == id);

        negativosObj = new Informacion(datosNegativosAll);
        negativosSorted = negativosObj.ordenarPorCantidad();

        totales['totalnegativos'] = negativosObj.formatCantidad(datosUbicacionNegativos[0]['total']) ;

        ui.mostrarInfoGeneral(totales);

    });

// GET DATA SOSPECHOSOS
    resSospechosos = api.getDataSospechosos();
    dataResolve = Promise.resolve(resSospechosos);

    dataResolve.then(value => {

        datosSospechososAll = value;
        datosUbicacionSospechosos  = datosSospechososAll.filter( entidad => entidad.cve_ent == id);

        sospechososObj = new Informacion(datosSospechososAll);
        sospechososSorted = sospechososObj.ordenarPorCantidad();

        totales['totalsospechosos'] = sospechososObj.formatCantidad(datosUbicacionSospechosos[0]['total']) ;

        ui.mostrarInfoGeneral(totales);

    });
}

