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
        responsive: {
            0   : { items: 1 },
            600 : { items: 2 },
            768 : { items: 3 },
            1280: { items: 4 },
            1440: { items: 5 }
        }
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

    // Alto gallery
    let alto_cine = $('#cine').outerHeight();
    $('#cine img').css('height', alto_cine+'px');

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

        if( ancho_pantalla < 767 )
        {
            $('.menu').removeClass('on');
            $('.toggle_menu').removeClass('off');
        }
    });

    // Pop de películas de cartelera
    $('#cartelera .matriz__item').click(function(){

        $('.loader').fadeIn('slow');

        let img      = $(this).attr('data-img');
        let title    = $(this).attr('data-title');
        let sessions = $(this).attr('data-sessions');
        let length   = $(this).attr('data-length');
        let sinopsis = $(this).find('.sinopsis').html();

        let splitted_sessions = sessions.split('-');
        let html_sessions = "";
        if( splitted_sessions.length > 0 )
        {
            splitted_sessions.forEach(function(entry){
                html_sessions += "<span class='session'>"+entry+"</span>";
            });
        }
        let html_length = "<strong>Duración:</strong> "+length+"min";

        $('#pop_cartelera_img').attr('src', img);
        $('#pop_cartelera_title').html(title);
        $('#pop_cartelera_sessions').html(html_sessions);
        $('#pop_cartelera_duracion').html(html_length);
        $('#pop_cartelera_sinopsis').html(sinopsis);

        setTimeout(function(){
            $('.loader').fadeOut('slow');
            $('body').addClass('pop_cartelera_opened');
        }, 1000);
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
        $('body').removeClass('pop_cartelera_opened');
        limpiar_pop_cartelera();
    });

    // SUBIR AL TOP DE LA PÁGINA DESDE EL PIE
    $('.btn_top').click(function() { 
        $('html, body').animate({scrollTop:0}, 1000);
        return false;
    });

    carrouselCarteleraMovil(false);

});

$(window).on('load', function(){ 
    setTimeout(function(){
        $('.loader').fadeOut('slow');
    }, 900);
});

let lastScrollTop = 0;
$(window).scroll(function (event) {

    let scroll         = $(window).scrollTop();
    let max_scroll     = $(document).height() - $(window).height();
    let current_scroll = $(window).scrollTop();
    let perc_scroll    = (current_scroll * 100) / max_scroll;

    // Para mostrar el botón de subir al top
    if( perc_scroll > 25 )
        $('.btn_top').addClass('on');
    else
        $('.btn_top').removeClass('on');

    lastScrollTop = scroll;
});

let previousOrientation = '';
$(window).on('resize', function(){

    let orientation = ( $(window).width() > $(window).height() ? 'landscape':'portrait' );
    if( previousOrientation == '' )
        previousOrientation = orientation;

    altos_hovers_cartelera();

    carrouselCarteleraMovil(true);
});

const carrouselCarteleraMovil = (delayed) => {

    let delayTime = ( delayed === true ? 1500:0 );
    if( delayed )
        $('.loader').fadeIn('slow');

    setTimeout(function(){
        if( $(window).width() <= 1024 )
        {
            /** CARRUSEL/SLIDER - SERVICIOS */
            $('#cartelera .matriz__v1 .limpia').remove();
            $('#cartelera .matriz__v1').addClass('owl-carousel');
            $('#cartelera .matriz__v1').owlCarousel({
                autoplay       : true,
                autoplayTimeout: 10000,
                loop           : true,
                margin         : 0,
                mouseDrag      : false,
                touchDrag      : true,
                pullDrag       : false,
                nav            : true,
                dots           : false,
                items          : 3,
                responsive: {
                    0   : { items: 1 },
                    768 : { items: 2 },
                    1024: { items: 3 }
                }
            });

            $('.toggle_menu').click(function(){
                $('.menu').addClass('on');
                $(this).addClass('off');
            });

            $('.cerrar_menu').click(function(){
                $('.menu').removeClass('on');
                $('.toggle_menu').removeClass('off');
            });
        }
        else
        {
            if( $('#cartelera .matriz__v1').hasClass('owl-carousel') )
            {
                $('#cartelera .matriz__v1').trigger('destroy.owl.carousel');
                $('#cartelera .matriz__v1').removeClass('owl-carousel')
                $('#cartelera .matriz__v1').append('<span class="limpia"></span>');
            }

            $('.menu').removeClass('on');
        }

        if( delayed )
            $('.loader').fadeOut('slow');
    }, delayTime);
}

const smoothScrollTo = (destino) => {

    scroll = $('#'+destino).position().top;

    $('html, body').animate({
        scrollTop: scroll
    }, 800);
}

const limpiar_pop_cartelera = () => {
    $('#pop_cartelera_img').attr('src', '');
    $('#pop_cartelera_title').html('');
    $('#pop_cartelera_sessions').html('');
    $('#pop_cartelera_duracion').html('');
    $('#pop_cartelera_sinopsis').html('');
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