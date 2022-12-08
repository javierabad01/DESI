
/**
 * @file Archivo sobre la pestaña 2, el mapa
 * @author Javier Abad Hernández
 */


// Definimos area de dibujo
const WIDTH = window.innerWidth*0.70;
const HEIGHT = window.innerHeight*0.75;

// Creamos zona para el mapa
var svgWidth = WIDTH;
var svgHeight = HEIGHT - 60;

var actualTermino;
var guardaMes;

/**
 * 
 * @param {JSON} data Datos de los que se quiere obtener el subconjunto
 * @param {String []} terminos Terminos a seleccionar de los datos
 * @returns 
 */
async function lecturaComunidades(terminos,actualYear, actualMonth){
    var dataSelec = [];
    var nombreComunidad;
    var nombreBien;
    for (var i=0; i<19; i++){
        switch(i){
            case 0:
                nombreComunidad = "andalucia";
                nombreBien = "Andalucía";
                break;
            case 1:
                nombreComunidad = "aragon";
                nombreBien = "Aragón";
                break;
            case 2:
                nombreComunidad = "asturias,_principado_de";
                nombreBien="Principado de Asturias";
                break;
            case 3:
                nombreComunidad = "canarias";
                nombreBien="Canarias";
                break;
            case 4:
                nombreComunidad = "cantabria";
                nombreBien="Cantabria";
                break;
            case 5:
                nombreComunidad = "castilla_-_la_mancha";
                nombreBien="Castilla-La Mancha";
                break;
            case 6:
                nombreComunidad = "castilla_y_leon";
                nombreBien= "Castilla y León";
                break;
            case 7:
                nombreComunidad = "cataluña";
                nombreBien= "Cataluña";
                break;
            case 8:
                nombreComunidad = "ceuta";
                nombreBien= "Ceuta";
                break;
            case 9:
                nombreComunidad = "comunidad_de_madrid";
                nombreBien= "Comunidad de Madrid";
                break;
            case 10:
                nombreComunidad = "comunidad_valenciana";
                nombreBien="Comunidad Valenciana";
                break;
            case 11:
                nombreComunidad = "extremadura";
                nombreBien="Extremadura";
                break;
            case 12:
                nombreComunidad = "galicia";
                nombreBien="Galicia";
                break;
            case 13:
                nombreComunidad = "islas_baleares";
                nombreBien="Islas Baleares";
                break;
            case 14:
                nombreComunidad = "la_rioja";
                nombreBien= "La Rioja";
                break;
            case 15:
                nombreComunidad = "melilla";
                nombreBien= "Melilla";
                break;
            case 16:
                nombreComunidad = "murcia,_region_de";
                nombreBien= "Región de Murcia";
                break;
            case 17:
                nombreComunidad = "navarra,_comunidad_foral_de";
                nombreBien= "Navarra";
                break;
            case 18:
                nombreComunidad = "pais_vasco";
                nombreBien= "País Vasco";
                break;
        }
        //var datosComunidades = 
        await d3.csv("./data/evolucion_del_consumo_de_carburante_en_"+ nombreComunidad+"__.csv").then(function (data){
            dataSelec=getDatosMesAño(data, terminos, actualYear,actualMonth, dataSelec, nombreBien);
        })
    }

    return dataSelec;
}

function cambiar2(){
    actualYear = d3.select('#year2').property('value');
    
    d3.select('#actYear2').text(actualYear);
    d3.select("#mapa").selectAll("svg").remove();
    dibujarGrafico2mio(actualTermino, guardaMes);
}
function cambiarMes(actualMonth){
    actualYear = d3.select('#year2').property('value');
    
    d3.select('#actYear2').text(actualYear);
    d3.select("#mapa").selectAll("svg").remove();
    dibujarGrafico2mio(actualTermino, actualMonth);
}
/**
 * 
 * @param {JSON} data Datos de los que se quiere obtener el subconjunto
 * @param {String []} terminos Terminos a seleccionar de los datos
 * @returns 
 */
function getDatosMesAño(data,terminos, actualYear, actualMonth, dataSelec, nombreBien){
        data.forEach(function (d) {
        if(d.Año==actualYear && d.Periodo == actualMonth){

            a={ comunidad : nombreBien, año: d.Año,  mes : d.Periodo, Diesel : d.Diesel , Gasolina95 : d.Gasolina95}
            dataSelec.push(a);
            /*if(terminos.includes("Diesel")){
                a={ comunidad : nombreBien, año: d.Año,  mes : d.Periodo, tipo : "Diesel" , valor : d.Diesel}
                dataSelec.push(a);
            }
            if(terminos.includes("Gasolina 95")){
                a={ comunidad : nombreBien, año: d.Año,  mes : d.Periodo, tipo : "Gasolina95" , valor : d.Gasolina95}
                dataSelec.push(a);
            }*/
        }
    })
    return dataSelec;
}


/**
 * Dibuja el gráfico de la pestaña 2, correspondiente al mapa que el interes en la busqueda del termino
 * @param {String} termino Termino del que queremos mostrar los datos
 */
async function dibujarGrafico2mio(termino, actualMonth) {
    //con async y await hacemos que se espere el programa a que se hayan cargados los datos y el mapa
    
    var actualYear = d3.select('#year2').property('value');
    //var actualMonth = d3.select('#mes').property('value');
    actualTermino=termino;
    guardaMes=actualMonth;
    var datosMapa = await d3.json("./data/mapaEsp.json");
    var datosComunidades = lecturaComunidades(["Diesel", "Gasolina 95"],actualYear,actualMonth);
    
    d3.select('#actYear2').text(actualYear);

    d3.select("#actYear2").text(d3.select("#year2").property("value"));

    
    //seleccionamos termino y paleta de coleres segun termino
    var dataSeleccionado;
    if(termino==1){   
        document.getElementById("titulo4").style.color = "green";      
    }     
    else{           
        document.getElementById("titulo4").style.color = "#ff4800";      

    }
    datosComunidades.then(value => {
        dataSeleccionado = value;
        var colorScale;
        if(termino==1){   
            colorScale = d3.scaleThreshold()         
            .domain([5000, 30000, 75000, 100000, 120000,155000, 189000, 210000, 270000])         
            .range(d3.schemeGreens[9]);   
  
        }     
        else{         
            colorScale = d3.scaleThreshold()         
            .domain([5000, 10000, 20000, 30000, 40000,50000, 60000, 70000, 80000])         
            .range(d3.schemeOranges[9]);   
  
        }


        // Añadimos el svg al HTML
        var svg = d3.select("#mapa")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        //Para ver los tipos de proyecciones predefinidas en D3 acceder a:
        //   https://d3-wiki.readthedocs.io/zh_CN/master/Geo-Projections/
        //   https://github.com/d3/d3-geo-projection/
        //   https://github.com/rveciana/d3-composite-projections
        var projection = d3.geoConicConformalSpain();  // nos acerca las islas canarias
        var geoPath = d3.geoPath().projection(projection);
        

        const mapageojson=topojson.feature(
            datosMapa,datosMapa.objects.autonomous_regions
        );

        //ajustamos al ancho y largo del espacion
        projection.fitSize(
            [svgWidth, svgHeight],
            mapageojson
            );

        // Tooltip, para mostrar info cuando pasamos el ratón
        var div = d3.select('#mapa').append('div')
        .attr('class', 'tooltip')
        .style('display', 'none');
        

        svg.selectAll("path")
            .data(mapageojson["features"])
            .enter()
            .append("path")
            .style("stroke", "#000")
            .style("stroke-width", "0.5px")
            .attr("class", "comunidad")
            .attr("d",geoPath)             
            // Cambio de colores dependiendo del interes de busqueda según la paleta
            .attr("fill", function(d) {
                var dato = [];
                for (var i = 0; i <dataSeleccionado.length; i++) {
                    if(dataSeleccionado[i].comunidad==d.properties.NAMEUNIT && termino==1){
                        dato=dataSeleccionado[i].Diesel
                    }
                    else if(dataSeleccionado[i].comunidad==d.properties.NAMEUNIT && termino!=1){
                        dato=dataSeleccionado[i].Gasolina95
                    }
                }
                return colorScale(dato);
            })
            
            // Cuando pasamos por encima el ratón, desvanecemos las demás comunidades y coloreamos
            // la que tiene el ratón
            .on("mouseover", function(d) {
                // desvanecer
                d3.selectAll(".comunidad")
                    .transition()
                    .duration(200)
                    .style("opacity", .5);
                // colorear
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1);
                // tooltip
                div.style('display', 'inline');
            })
            // Volvemos al estado inicial cuando quitamos ratón
            .on("mouseleave", function(d) {
                d3.selectAll(".comunidad")
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                d3.select(this)
                    .transition()
                    .duration(200);
                div.style('display', 'none');
            })
            // Mostrar el tooltip con la comunidad y su interes de busqueda
            .on("mousemove", function(event) {
                var d = d3.select(this).data()[0]
                var dato;
                var comunidad;
                for (var i = 0; i <dataSeleccionado.length; i++) {

                    if(dataSeleccionado[i].comunidad==d.properties.NAMEUNIT && termino==1){
                        dato=dataSeleccionado[i].Diesel
                        comunidad=dataSeleccionado[i].comunidad
                    }
                    else if(dataSeleccionado[i].comunidad==d.properties.NAMEUNIT && termino!=1){
                        dato=dataSeleccionado[i].Gasolina95
                        comunidad=dataSeleccionado[i].comunidad
                    }
                }
                div
                    .html(comunidad + "<br>" + "Consumo de combustible: "+dato + " toneladas/mes")
                    .style('left', (event.pageX - 24) + 'px')
                    .style('top', (event.pageY - 24) + 'px');
            });
            // añadimos un recuadro para las islas Canarias
            svg
            .append("path")
              .style("fill","none")
              .style("stroke","#000")
              .attr("d", projection.getCompositionBorders());

        }).catch(err => {
            console.log(err);
        });
    
}


