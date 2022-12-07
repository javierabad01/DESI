/**
 * @file Archivo principal, continene el punto de entrada de la web
 * @author Javier Abad Hernández
 */
var contador=0;
var pause=false;

 /**
  * Cuando se carga la pÃ¡gina
  */
  $(document).ready(function () {
    let terminos = ["Diesel", "Gasolina 95"];
    let actualMonth='Diciembre';
    
    // Manejador de tabs
    $('#tabs li a:not(:first)').addClass('inactive');
    $('.container').hide();
    $('.container:first').show();
    $('#tabs li a').click(function () {
        var t = $(this).attr('id');
        if ($(this).hasClass('inactive')) {
            $('#tabs li a').addClass('inactive');
            $(this).removeClass('inactive');

            $('.container').hide();
            $('#' + t + 'C').fadeIn('slow');

            // Cargamos cada tab solo cuando está seleccionada, no antes
            switch (t) {
                case "tab1":
                    d3.select("#serie").selectAll("svg").remove();
                    dibujarGrafico1mio(terminos);
                    break;
                case "tab2":
                    d3.select("#mapa").selectAll("svg").remove();
                    document.getElementById("radiosTerminos2").value = 1;
                    dibujarGrafico2mio(1, actualMonth);
                    break;
            }
        }
    });


    d3.select("#serie").selectAll("svg").remove();
    
    dibujarGrafico1mio(terminos);

    // Gráfico 1
    // Para la selección de los términos del line chart
    $("input[type=checkbox]").change(function () {
        if (this.checked) {
            terminos.push(this.name);
        } else {
            terminos.splice(terminos.indexOf(this.name), 1);
        }

        d3.select("#serie").selectAll("svg").remove();
        dibujarGrafico1mio(terminos);
        
    });

    $("input[type=range]").change(cambiar, actualizar)
        
    ;



    // Gráfico 2
    // Selección del termino a mostrar en mapa
    $("select").on('change', function () {
        d3.select("#mapa").selectAll("svg").remove();
        dibujarGrafico2mio(this.value,actualMonth);
        });
    $("input[type=range]")
        .change(cambiar2)
    ;
    $("input[type=radio][name=mes]").change(function () {
        actualMonth = $(this).val();
        d3.select("#mapa").selectAll("svg").remove();
        cambiarMes(actualMonth);
    });

    // Modo oscuro
    $("input[type=checkbox][name=oscuro]").change(function () {

        if (this.checked) {
            modoOscuro();
        } else {
            modoClaro();
        }
    });


    

    $('#play').click(function(){
        if(!pause){
            document.getElementById("year").value=2002
            cambiar();
            actualizar();
        }
        id=setInterval('contadorAño()',4000);
    });
    $('#pause').click(function(){
        for (i=0; i<contador; i++) {
            clearInterval(id);
        };
        pause=true;
    });
    $('#stop').click(function(){
        for (i=0; i<contador; i++) {
            clearInterval(id);
        };
        pause=false;
        
    });

});

/**
 * Activa el modo oscuro en la web, es decir, pone el fondo negro y todo lo demás
 * en colores claros
 */
function modoOscuro() {
    document.getElementsByTagName("html")[0].style.backgroundColor = "#2b2c2a";
    document.getElementsByTagName("html")[0].style.color = "white";
    document.getElementsByTagName("footer")[0].style.color = "white";
}

/**
 * Activa el modo claro en la web, es decir, pone el fondo blacno y todo lo demás
 * en colores oscuros
 */
function modoClaro() {
    document.getElementsByTagName("html")[0].style.backgroundColor = "white";
    document.getElementsByTagName("html")[0].style.color = "black";
    document.getElementsByTagName("footer")[0].style.color = "black";
}

function contadorAño(){
    if(contador>=20) 
        {
            for (i=0; i<this.contador; i++) {
                clearInterval(id);
             };
             pause=false;
        }
        document.getElementById("year").value = Number(document.getElementById("year").value) + 1;
        console.log(contador);

        this.contador++;
        cambiar();
        actualizar();
        
    
}
