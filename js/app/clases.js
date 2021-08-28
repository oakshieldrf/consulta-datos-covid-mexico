/***** ARCHIVO DE TODAS LAS CLASES DE LA APP *****/

//Clase para mostrar los diferentes tipos de datos dependiendo la ubicacion
export class Informacion {


    constructor(data){
        this.datos = data;
    }
//METODO PARA DARLE FORMATO A NUMEROS
    formatCantidad(cantidad){

        let options= {style: 'decimal'};
        let numberFormat = new Intl.NumberFormat('es-MX', options);
        cantidad = numberFormat.format(cantidad);

        return cantidad;
    }

// METODO PARA CALCULAR TOTAL DE C/MES DE LOS ULTIMOS 6 MESES
    calcularTotalMes(datosestado) {
        let listaDates = datosestado[0];
        let val, obj;
        let recentDates = {
            "Enero":0,
            "Febrero":0,
            "Marzo":0,
            "Abril":0,
            "Mayo":0,
            "Junio":0,
            "Julio":0,
            "Agosto":0,
        };
        let valuesDates;

        for ( var property in listaDates) {
            
            let prop = property.split("-").reverse().join("-")

            if(prop >= '2021-01-01' && prop != 'cve_ent' && prop != 'poblacion' && prop != 'nombre'){
               
                val =  Number(listaDates[property])
                obj = {[property]:val}

                if(prop >= '2021-01-01' && prop <= '2021-01-31') {

                    recentDates['Enero'] += val;
                }

                if(prop >= '2021-02-01' && prop <= '2021-02-28') {

                    recentDates['Febrero'] += val;
                }

                if(prop >= '2021-03-01' && prop <= '2021-03-31') {

                    recentDates['Marzo'] += val;
                }

                if(prop >= '2021-04-01' && prop <= '2021-04-30') {

                    recentDates['Abril'] += val;
                }


                if(prop >= '2021-05-01' && prop <= '2021-05-31') {

                    recentDates['Mayo'] += val;
                }


                if(prop >= '2021-06-01' && prop <= '2021-06-31') {

                    recentDates['Junio'] += val;
                }


                if(prop >= '2021-07-01' && prop <= '2021-07-31') {

                    recentDates['Julio'] += val;
                }

                if(prop >= '2021-08-01' && prop <= '2021-08-30') {

                    recentDates['Agosto'] += val;
                }

            }
        }

        valuesDates = Object.values(recentDates);
  
        return valuesDates;
    }

// METODO PARA ORDENAR POR TOTALES ASCENDENTE
    ordenarPorCantidad(){

        var copiaData = this.datos;

        copiaData =  copiaData.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
        
        return copiaData;
    }

}