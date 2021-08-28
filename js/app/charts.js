export class Grafica {

  constructor(datos) {
    this.datos = datos;
  }

  iniciarGrafica() {

    /** SETUP **/
    const labels = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      // 'Septiembre',
      // 'Octubre',
      // 'Noviembre',
      // 'Diciembre',
    ];
  
    const data = {
    labels: labels,
    datasets: [{
      label: 'No. de casos por mes',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      //labelColor: '#B5FFD9',
      data: this.datos,
    }]
    };
  
  
    /** CONFIG **/
    const config = {
    type: 'bar',
    data: data,
    options: {
      legend: {
        labels: {
          fontColor: '#B5FFD9',
          fontSize: 12
        }
      },
      scales: {
        xAxes: [{gridLines: {color: '#B5FFD9'},
        ticks: {
          fontColor: '#B5FFD9',
          fontSize: 12,
          stepSize: 1,
          beginAtZero: true
        }}],
      
        yAxes: [{gridLines: {color: '#B5FFD9'},
        ticks: {
          fontColor: '#B5FFD9',
          fontSize: 12,
          beginAtZero: true
        
        }}],
      },
      animation: {
        onComplete: () => {
          //delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 300 + context.datasetIndex * 1000;
          }
          return delay;
        },
      },
    }
    };


  let chartContainer = document.querySelector('#grafica-casos');

  while(chartContainer.firstChild) {
    chartContainer.removeChild(chartContainer.firstChild);
  }


  let chartContent = document.createElement('canvas');
  chartContent.setAttribute("id", "myChart");
  chartContainer.appendChild(chartContent)

  let chart = new Chart(
      chartContent,
      config
    );

  }

    
  
}


