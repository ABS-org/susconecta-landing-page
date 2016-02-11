$(function() {
  $mainmenu = $('#main-menu');

  setTimeout(function() {
    $('.opening-passo-1').removeClass('fadeInDown').addClass('fadeOut');

    setTimeout(function() {
      $('.opening-passo-2').css('visibility', 'visible').addClass('fadeInDown');
    }, 1000);

    setTimeout(function() {
      $('.opening-passo-3').css('visibility', 'visible').addClass('fadeInDown');

      setTimeout(function() {
        $('.opening-passo-3').removeClass('fadeInDown');
      }, 600);

    }, 1500);

  }, 3000);

  var instasvg = $('#instasvg').drawsvg();
  var susconectahashs = $('#susconectahashs').drawsvg();
  var instasvgcomplete = 0;
  var susconectahashscomplete = 0;


  $('#instasvg-trigger').waypoint({
    handler: function(direction) {
      if (direction == "down" && instasvgcomplete == 0) {
        instasvg.drawsvg('animate');
        instasvgcomplete = 1;
      }
    }
  })

  $('#susconectahashs-trigger').waypoint({
    handler: function(direction) {
      if (direction == "down" && susconectahashscomplete == 0) {
        susconectahashs.drawsvg('animate');
        susconectahashscomplete = 1;
      }
    }
  })

  // define a altura minima das seções principais
  $('body > section').not('.two').css('min-height',  window.innerHeight+'px');
  // menu affix
  $('#main-menu-section').affix({
    offset: {
      top: window.innerHeight,
      bottom: 0
    }
  })

  if (window.innerHeight < 980) {
    $mainmenu.addClass("mobile");
  } else {
    $mainmenu.removeClass('mobile');
  }

  // recalcula a altura minima caso a janela seja redimensionada
  $(window).resize(function() {

    if (window.innerHeight < 980) {
      $mainmenu.addClass("mobile");
    } else {
      $mainmenu.removeClass('mobile');
    }

    // define a altura minima das seções principais
    $('body > section').not('.two').css('min-height',  window.innerHeight+'px');
    // menu affix
    $('#main-menu-section').data('bs.affix').options.offset.top = window.innerHeight;
    $('#main-menu-section').data('bs.affix').options.offset.bottom = 0;
  });

  // ativa o scrollspy
  $('body').scrollspy({ target: '#main-menu' });

  // função que aplica os efeitos no menu
  function menuClick(el) {
    if (el.hasClass('slider')) {
      return;
    }
    $("#main-menu ul li").removeClass('active');
    el.addClass('active');
    var whatTab = el.index();
    var howFar = 0;
    if (whatTab > 0) {
      howFar += 4*whatTab;
      for (var i = 0; i < whatTab; i++) {
        howFar += $("#main-menu ul li").eq(i).width();
      }
    }
    $(".slider").css({
      left: (howFar + parseInt(el.children('a').css('padding-left')) ) + "px",
      width:  el.children('a').width() + "px"
    });

    var posX = el.offset().left,
        posY = el.offset().top,
        buttonWidth = el.width(),
        buttonHeight = el.height();

    if (buttonWidth >= buttonHeight) {
      buttonHeight = buttonWidth;
    } else {
      buttonWidth = buttonHeight;
    }

    //var x = e.pageX - posX - buttonWidth / 2;
    //var y = e.pageY - posY - buttonHeight / 2;
  }

  // aplica o efeito no menu no clique
  $("#main-menu ul li").click(function(e) {
    menuClick($(this));
  });
  // aplica o efeito do menu no scroll
  $('#main-menu').on('activate.bs.scrollspy', function (e) {

    menuClick($("#main-menu ul li.active"));

  })

  // smooth scroll
  $('a[href^="#"]').not('.no-scroll').not('.collapsed').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash;
	    var $target = $(target);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing', function () {
	        window.location.hash = target;
	    });
	});

  // navegacao de midia

  var $mediasection = $('.media-section');

  var $mainmedia = $mediasection.children('.main-media');

  var $mediathumbs = $mediasection.children('.media-thumbs').children('.media-thumb');

  $mediasection.each(function(i) {
    $mediasection.eq(i).addClass('main-section-'+i);
  })

  $mediathumbs.on('click', function(e) {
    el = $(this);
    galleryIndex = el.parent($mainmedia).parent($mediasection).attr('class').replace("row media-section main-section-", "");
    $mediathumbs.removeClass('active');
    el.addClass('active');

    if (el.children('img').hasClass('media-image')) {
      mediaToLoad = el.children('img').attr('data-url');
      $mainmedia.eq(galleryIndex).empty().append('<img src="'+mediaToLoad+'">');
    }

    if (el.children('img').hasClass('media-youtube')) {
      mediaToLoad = el.children('img').attr('data-url').replace("https://www.youtube.com/watch?v=", "");
      $mainmedia.eq(galleryIndex).empty().append('<iframe width="100%" height="480" src="https://www.youtube.com/embed/'+mediaToLoad+'" frameborder="0" allowfullscreen></iframe>');
    }

    if (el.children('img').hasClass('media-vimeo')) {
      mediaToLoad = el.children('img').attr('data-url').replace("https://vimeo.com/", "");
      $mainmedia.eq(galleryIndex).empty().append('<iframe src="https://player.vimeo.com/video/'+mediaToLoad+'" width="100%" height="480" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
    }

  })

  // animando os botões de links social-links
  $sociallinks = $('ul.social-links li img');
  $sociallinks.on('mouseover', function() {
    $(this).addClass('infinite pulse animated');
  })
  $sociallinks.on('mouseout', function() {
    $(this).removeClass('infinite pulse animated');
  })

  $('.hamburg-menu').on('click', function() {
    $(this).toggleClass("active");
    $mainmenu.children('ul').slideToggle('fast');
  })
  $mainmenu.children('ul').children('li').on('click', function() {
    $mainmenu.children('ul').slideToggle('fast');
    $('.hamburg-menu').removeClass('active');
  })
})
