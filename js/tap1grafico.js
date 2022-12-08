
/**
 * @file Archivo sobre la pestaÃ±a 1, el line chart
 * @author Javier Abad Hernández
 */


const COLORES = { "Gasolina95": '#e41a1c', "Diesel": '#12811b'};


/**
 * 
 * @param {JSON} data Datos de los que se quiere obtener el subconjunto
 * @param {String []} terminos Terminos a seleccionar de los datos
 * @returns 
 */
function seleccionarDatosProvincias(añoActual,data,terminos) {
    var dataSelec = [];
    data.forEach(function (d) {
        if(d.Año==añoActual){

            if(terminos.includes("Diesel")){
                a={ date : d3.timeParse("Semana %W")(d.Periodo), tipo : "Diesel" , value : d.Diesel}
                dataSelec.push(a);
            }
            if(terminos.includes("Gasolina 95")){
                a={ date : d3.timeParse("Semana %W")(d.Periodo) , tipo : "Gasolina95" , value : d.Gasolina95}
                dataSelec.push(a);
            }
        }
    })
    return dataSelec;
}

function seleccionarValores(añoActual, data, terminos){
    var dataSelec = [];
    data.forEach(function (d) {
        if(d.Año==añoActual){

            if(terminos.includes("Diesel")){
                a=d.Diesel
                dataSelec.push(a);
            }
            if(terminos.includes("Gasolina 95")){
                a=d.Gasolina95
                dataSelec.push(a);
            }
        }
    })
    return dataSelec;
}
//Cambiar los colores del mapa cuando se cambie el valor del slider
d3.select("Slider")
        .on("change",cambiar);



//$(document).on('input', '#Slider', cambiar );




function cambiar(){
    añoActual = d3.select('#year').property('value');
    d3.select('#actYear').text(añoActual);
    
}
function actualizar(){
    d3.select("#serie").selectAll("svg").remove();
    dibujarGrafico1mio(["Diesel", "Gasolina 95"]);
}



 /**
  * Animaciones del linechart, para que se vayan mostrando las lí­neas
  * gradualmente de izquierda a derecha
  * @param {*} path 
  */
  function transition(path) {
    path.transition()
        .duration(4000)
        .attrTween("stroke-dasharray", tweenDash)
        .on("end", () => { d3.select(this).call(transition); });
}

function tweenDash() {
    if (this instanceof Window)
        return;
    const l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function (t) { return i(t) };
}


   

/**
 * Dibuja el gráfico de la pestaña 1,correspondiente al line chart
 * @param {String[]} terminos Terminos de los cuales se quiere ver el gráfico
 */
function dibujarGrafico1mio(terminos) {
    d3.csv("./data/evolucion_del_precio_de_la_gasolina_y_el_diesel_en_españa.csv").then(function (data) {
        var w1 = parseInt(d3.select("#serie").style("width"));
        var margin = { top: 30, right: 40, bottom: 70, left: 120 },
            width = w1 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        
        // Añadimos el svg al HTML
        var svg = d3.select("#serie")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        
        //
        var añoActual = d3.select('#year').property('value');

        //Tratamiento de los datos
        var dataSel = seleccionarDatosProvincias(añoActual, data,terminos);
        let valorMaximo = d3.max(seleccionarValores(añoActual, data, terminos));
        let valorMinimo = d3.min(seleccionarValores(añoActual, data, terminos));


        d3.select('#actYear').text(añoActual);


        // Agrupamos los datos, queremos una línea por termino
        var agrupados = d3.nest() // usamos d3.nest, hay que importarlo aparte, otra librería
        .key(function (d) { return d.tipo; })
        .entries(dataSel);

        d3.select("#actYear").text(d3.select("#year").property("value"));


        // Añadimos el eje X el cual es un dato de fechas
        var x = d3.scaleTime()
            .domain(d3.extent(dataSel, function (d) { return d.date; }))
            .rangeRound([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("Semana %W")).ticks(16))
            // Giramos los labels del eje
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        // Añadimos el eje Y
        var y = d3.scaleLinear()
            .domain([valorMinimo-0.05, parseFloat(valorMaximo)+parseFloat(0.05)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Dibujamos las lí­neas
        svg.selectAll(".line")
            .data(agrupados)
            .enter()
            .append("path")
            .call(transition) // animación
            .attr("fill", "none")
            .attr("stroke", function (d) { return COLORES[d.key]}) // Elegimos los mismos colores
            .attr("stroke-width", 1.5)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x(d.date); })
                    .y(function (d) { return y(d.value); })
                    (d.values)
            });
 
        // Añadimos el grid del eje X
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(16) // queremos todas las marcas
                .tickSize(-height)
                .tickFormat("")
            );

        // Añadimos el grid del eje Y
        svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .tickSize(-width)
                .tickFormat("")
            );

        // Tí­tulo del eje Y
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 50 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Precio del combustible en €/L");

        // Etiquetas de los puntos con la fecha y valor de busqueda en cada uno, las creamos
        // pero no las mostramos (solo se mostrarÃ¡n cuando pasemos por encima)
        var tooltip = d3.select("body").append("div")
            .attr("class", "puntosSerie")
            .style("opacity", 0); // no se muestran
        
        var busqueda = svg.selectAll(".terminos")
            .data(agrupados)
            .enter().append("g")
            .attr("class", "terminos");
        
        

        // Añadimos los puntos
        busqueda.selectAll("circle")
            .data(function (d) { return d.values })
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("cx", function (d) {  return x(d.date); })
            .attr("cy", function (d) { return y(d.value); })
            .style("fill", function (d) { return COLORES[d.tipo]; })
            // cuando se pasa por encima, mostramos las etiquetas de los puntos y los hacemos grandes
            .on("mouseover", function (event) {
                d3.select(this).transition()
                    .duration('100')
                    .attr("r", 6);
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 1);

                var dia=((this.__data__.date.getDate()))
                var options = { month: 'long'};
                var mes1=(new Intl.DateTimeFormat('es-ES', options).format(this.__data__.date));
                var nueva_fecha=(this.__data__.date)
                nueva_fecha.setDate(nueva_fecha.getDate() + 6);
                var mes2=(new Intl.DateTimeFormat('es-ES', options).format(nueva_fecha));
                var dia_siguiente=nueva_fecha.getDate()
                nueva_fecha.setDate(nueva_fecha.getDate() - 6);
                tooltip.html( mes1===mes2 ?dia+"-"+dia_siguiente+" "+mes1+"<br>" +"Búsqueda "+this.__data__.tipo+": "+ this.__data__.value :dia+" "+mes1+"-"+dia_siguiente+" "+mes2+"<br>" +"Búsqueda "+this.__data__.tipo+": "+this.__data__.value)
                    .style("left", (event.pageX + 10))
                    .style("top", (event.pageY + 10))
                    .style("background", COLORES[this.__data__.tipo]);

            })
            // cuando se quita el puntero, quitamos las etiquetas que sean visibles y restablecemos
            // el tamaño del punto
            .on("mouseout", function () {
                d3.select(this).transition()
                    .duration('200')
                    .attr("r", 3);
                // desaparecer etiquetas
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 0)
            });
        
    })
}