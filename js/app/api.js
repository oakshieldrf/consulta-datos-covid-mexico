//Aqui se declaran metodo para hacer requests a APIs

export class API {

    constructor(nombre){
        this.nombre = nombre;
    }

    async getDataConfirmados() {

        try {

            const respuesta = await fetch('../../api/data-confirmados.json');
            const resultado = await respuesta.json();

            return resultado;        

        }catch(error){
            console.log(error);
        }
    } 

    async  getDataDefunciones() {

        try {

            const respuesta = await fetch('../../api/data-defunciones.json');
            const resultado = await respuesta.json();

            return resultado;          

        }catch(error){
            console.log(error);
        }
    } 


    async  getDataNegativos() {

        try {

            const respuesta = await fetch('../../api/data-negativos.json');
            const resultado = await respuesta.json();

            return resultado;           

        }catch(error){
            console.log(error);
        }
    } 

    async  getDataSospechosos() {

        try {

            const respuesta = await fetch('../../api/data-sospechosos.json');
            const resultado = await respuesta.json();

            return resultado;           

        }catch(error){
            console.log(error);
        }
    }


}
