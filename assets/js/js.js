const ancho_pantalla = $(window).width();
const year           = new Date().getFullYear();
const alto_cabecera  = $('header').outerHeight(true);

$(document).ready(function(){

    altos_hovers_cartelera();

    /** CARRUSEL/SLIDER - PROXIMAMENTE */
    $('.carrousel__proximamente_container').owlCarousel({
        autoplay       : true,
        autoplayTimeout: 10000,
        loop           : true,
        margin         : 0,
        mouseDrag      : false,
        touchDrag      : false,
        pullDrag       : false,
        nav            : true,
        dots           : false,
        center         : true,
        items          : 5,
    });

    /** CARRUSEL/SLIDER - CINE */
    $('.backgrounded__content_carrousel').owlCarousel({
        autoplay       : true,
        autoplayTimeout: 6000,
        loop           : true,
        margin         : 0,
        animateIn      : 'fadeIn',
        animateOut     : 'fadeOut',
        mouseDrag      : false,
        touchDrag      : false,
        pullDrag       : false,
        nav            : true,
        navContainer   : '.nav_cine',
        dots           : false,
        items          : 1,
    });

    // Activar/Desactivar galería
    $('.toggle_gallery').click(function(){
        if( $('#cine').hasClass('gallery_mode') )
        {
            $(this).removeClass('on');
            $('#cine').removeClass('gallery_mode');
        }
        else
        {
            $(this).addClass('on');
            $('#cine').addClass('gallery_mode');
        }
    });

    // Cambio de formatos en comestibles
    $('#comestibles .format').click(function(){

        let parent      = $(this).parent();
        let caja_precio = parent.siblings('.inner').children('.price');
        let precio      = $(this).attr('data-price');

        parent.children('.format').removeClass('sel');
        $(this).addClass('sel');
        caja_precio.html(precio+'€');

    });

    // Fijamos el año
    $('#year').html(year);

    // Opciones del menú cabecera
    $('.menu li').click(function(){
        id      = $(this).attr('id');
        destino = id.substr(3);

        smoothScrollTo(destino);

        if( ancho_pantalla < 768 )
            $('.menu').removeClass('on');
    });

    // Submit contacto
    $('#submit').click(function(){
        validarContacto();
    });

    // Pop política
    $('#abrir_politica').click(function(e){
        // // Para evitar que abrir la política marque/desmarque el check
        e.stopPropagation();
        e.preventDefault();

        $('body').addClass('popuped');
    });

    $('.cerrar_popup').click(function(){
        $('body').removeClass('popuped');
    });

    // PARA MÓVIL
    if( ancho_pantalla < 768 )
    {
        /** CARRUSEL/SLIDER - SERVICIOS */
        // $('.contiene_artistas').addClass('owl-carousel');
        // $('.contiene_artistas').owlCarousel({
        //     autoplay       : true,
        //     autoplayTimeout: 7000,
        //     loop           : true,
        //     margin         : 0,
        //     nav            : false,
        //     dots           : true,
        //     items          : 1,
        // });

        $('.toggle_menu').click(function(){
            $('.menu').addClass('on');
        });

        $('.cerrar_menu').click(function(){
            $('.menu').removeClass('on');
        });
    }
    else
        $('.menu').removeClass('on');

});

$(window).on('load', function(){ 
    setTimeout(function(){
        $('.loader').fadeOut('slow');
    }, 900);
});

$(window).scroll(function (event) {
    // // HSCROLL
    // let max_scroll     = $(document).height() - $(window).height();
    // let current_scroll = $(window).scrollTop();
    // let perc_fill      = (current_scroll * 100) / max_scroll;
    // $('.hscroll').css('width', perc_fill + '%');
});

$(window).on('orientationchange', function(){
    altos_hovers_cartelera();
});

$(window).on('resize', function(){
    altos_hovers_cartelera();
});

const smoothScrollTo = (destino) => {

    scroll = $('#'+destino).position().top;

    $('html, body').animate({
        scrollTop: scroll
    }, 800);
}

const altos_hovers_cartelera = () => {

    $('#cartelera .matriz__v1 .matriz__item').each(function(index){

        // Cogemos los altos y vamos calculando, tendremos en cuenta padding
        let alto_info     = $(this).height() - 50;
        let item_info     = $(this).children('.matriz__item_info');
        let alto_title    = item_info.children('.title').outerHeight(true);
        let alto_sessions = item_info.children('.sessions').outerHeight(true);
        let alto_duracion = item_info.children('.info_line').outerHeight(true);

        let max_alto_sinopsis = alto_info - alto_title - alto_sessions - alto_duracion;

        // Lo pasamos por el line-height para que cuadre el número de líneas
        let max_lineas = Math.floor(max_alto_sinopsis / 20);
        max_alto_sinopsis = (max_lineas * 20) + 15;
        item_info.children('.sinopsis').css('max-height', max_alto_sinopsis+'px');
    });
}

const validarContacto = () => {

    let nombre   = $('#contacto input[name="nombre"]');
    let telefono = $('#contacto input[name="telefono"]');
    let email    = $('#contacto input[name="email"]');
    let mensaje  = $('#contacto textarea[name="mensaje"]');
    let politica = $('#contacto input[name="politica"]');

    // Nombre
    if( nombre.val() == '' || nombre.val().length < 2 )
    {
        nombre.addClass('errored');
        nombre.parent().append('<span class="error_form">Introduce tu nombre</span>');
    }
    else
        nombre.removeClass('errored');

    // Teléfono
    if( telefono.val().length > 0 && telefono.val().length < 9 )
    {
        telefono.addClass('errored');
        telefono.parent().append('<span class="error_form">El teléfono no es válido</span>');
    }
    else
        telefono.removeClass('errored');

    // Email
    if( email.val() == '' )
    {
        email.addClass('errored');
        email.parent().append('<span class="error_form">Introduce tu email</span>');
    }
    else
    {
        emailValido = validEmail(email.val());
        if( !emailValido.valid )
        {
            email.parent().append('<span class="error_form">'+ emailValido.msg +'</span>');
            email.addClass('errored');
        }
        else
            email.removeClass('errored'); 
    }

    // Mensaje
    if( mensaje.val() == '' && mensaje.val().length < 5 )
    {
        mensaje.addClass('errored');
        mensaje.parent().append('<span class="error_form">El mensaje es obligatorio (Min. 5 caracteres)</span>');
    }
    else
        mensaje.removeClass('errored');

    // Política
    if( !politica.prop('checked') )
        politica.siblings('.checkbox').addClass('errored');
    else
        politica.siblings('.checkbox').removeClass('errored');

    // Limpiamos los errores flotantes al cabo de 4 segundos
    if( $('.error_form').length > 0 )
    {
        setTimeout(function(){
            $('.error_form').remove();
            $('#contacto input').removeClass('errored');
            $('#contacto textarea').removeClass('errored');
            $('#contacto .checkbox').removeClass('errored');
        }, 4000);
    }
    else
        $('#form_contacto').submit();
}

const validEmail = (email) => {

    let resp = {
        valid: true,
        msg  : ''
    };

    if( email.length < 7 )
        resp.valid = false;
    else
    {
        let index_arroba = email.indexOf('@');
        let index_punto  = email.indexOf('.');

        if( index_arroba === -1 || index_punto === -1 )
            resp.valid = false;
        else
        {
            let division = email.split('@');
            if( division[1].indexOf('.') === -1 )
                resp.valid = false;
        }
    }

    if( !resp.valid )
        resp.msg = 'Email no válido';

    return resp;
}