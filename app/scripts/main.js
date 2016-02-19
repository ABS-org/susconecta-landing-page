/* global $ YPlaylist */

'use strict';

var YPlaylist = {
    init: function (config) {
        this.url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=' + config.playlist + '&key=' + config.apiKey + '&callback=?';
        this.container = config.container;
        this.shuffle = config.shuffle;
        this.fetch();
    },
    fetch: function () {
        var self = this,
            placeholder = $('<div class="video-placeholder col-md-8"></div>'),
            carousel = $('<div class="col-md-4 media-thumbs media-thumbs-3"></div>');

        $.getJSON(self.url, function (data) {
            var list = '',
                res = {},
                entries = data.items,
                i, len;

            if (self.shuffle) {
                entries.sort(function () {
                    return 0.5 - Math.random();
                });
            }

            $(self.container).append(placeholder);
            $(placeholder).html(function () {
                var mainVideo = entries[0].snippet.resourceId.videoId;
                return '<iframe width="100%" height="380" src="https://www.youtube.com/embed/' + mainVideo + '" frameborder="0" allowfullscreen></iframe>';
            });

            for (i = 0, len = entries.length; i < len; i += 1) {
                res = {
                    title: entries[i].snippet.title,
                    url: entries[i].snippet.resourceId.videoId,
                    thumb: entries[i].snippet.thumbnails.medium.url,
                    desc: entries[i].snippet.description
                };

                list += '<div class="media-thumb"><a href="https://www.youtube.com/watch?v=' + res.url + '" title="' + res.title + '" data-toggle="tooltip" data-placement="top"><img alt="' + res.title + '" src="' + res.thumb + '">';
                //list += '<span class="shadow"></span></a>';
                //list += '<h2>' + res.title + '</h2>';
                //list += '<span class="spacer"></span>';
                //list += '<p>' + self.truncate(res.desc, 90) + '</p>';
                list += '</div>';
            }

            $(self.container).append(carousel);
            $(list).appendTo('#main-media-yt .media-thumbs');
            $('.media-thumbs').find('div:first').addClass('active');

            //self.carousel();
            self.view($('.media-thumbs div'));
        });
    },
    truncate: function (text, limit) {
        var last;
        if (text.length > limit) {
            limit--;
            last = text.substr(limit - 1, 1);
            while (last !== ' ' && limit > 0) {
                limit--;
                last = text.substr(limit - 1, 1);
            }
            last = text.substr(limit - 2, 1);
            if (last === ',' || last === ';' || last === ':') {
                text = text.substr(0, limit - 2) + '...';
            } else if (last === '.' || last === '?' || last === '!') {
                text = text.substr(0, limit - 1);
            } else {
                text = text.substr(0, limit - 1) + '...';
            }
        }
        return text;
    },
    getId: function (url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
            match = url.match(regExp);

        if (match && match[2].length === 11) {
            return match[2];
        } else {
            throw new Error('Invalid video URL');
        }
    },
    view: function (el) {
        var self = this;
        $('[data-toggle="tooltip"]').tooltip();
        el.click(function (e) {
            e.preventDefault();
            var url = $(this).find('a').attr('href');
                //title = $(this).find('h2').text();

            if ($(this).hasClass('current')) {
                return;
            }

            $('.media-thumbs div').removeClass('active');
            $(this).addClass('active');
            $('.video-placeholder iframe').attr({'src': 'https://www.youtube.com/embed/' + self.getId(url) + '?autoplay=1'});
            //$('.placeholder h2').html(title);
            /*$('html, body').animate({
                scrollTop: $(".video-placeholder").offset().top
            }, 1000);*/
        });
    }/*,
    carousel: function () {
        var slider      = $('.slider'),
            itemWidth   = $('.slider li').outerWidth(true),
            left_indent = 0;

        $('.slider li:first').before($('.slider li:last'));

        $(document.body).on('click', '.carousel-container .controll', function () {
            if ($(this).hasClass('next')) {
                left_indent = parseInt(slider.css('left'), 10) - itemWidth;
                $('.slider:not(:animated)').animate({'left' : left_indent}, 500, function () {
                    $('.slider li:last').after($('.slider li:first'));
                    $('.slider').css({'left' : '-' + itemWidth + 'px'});
                });
            } else {
                left_indent = parseInt(slider.css('left'), 10) + itemWidth;
                $('.slider:not(:animated)').animate({'left' : left_indent}, 500, function () {
                    $('.slider li:first').before($('.slider li:last'));
                    $('.slider').css({'left' : '-' + itemWidth + 'px'});
                });
            }
        });
    }*/
};

YPlaylist.init({
    playlist: 'PLN15H24LA_CcjBPSzxHPByyN5Z_4DYRBh', // The ID of your Youtube Playlist
    apiKey: 'AIzaSyAl1FmmMeZDh47-Qgzl0CMVzZ3_EOdECr0',                    // Your API KEY
    container: $('#main-media-yt'),                     // domNode to attach to
    shuffle: false                                  // If true, Shuffle the playlist, default false
});

$(function() {

  var $mediasection = $('.media-section');
  var $mainmedia = $mediasection.children('.main-media');
  var $mediathumbs = $mediasection.children('.media-thumbs');

  // navegacao de midia

  $mediasection.each(function(i) {
    $mediasection.eq(i).addClass('main-section-' + i);
  });

  function mediaClick() {
    $mediathumbs.on('click', '.media-thumb', function() {
      var el = $(this);
      var mediaToLoad;
      var galleryIndex = el.parent($mainmedia).parent($mediasection).attr('class').replace('row media-section main-section-', '');
      var desc;
      $mediathumbs.children('.media-thumb').removeClass('active');
      el.addClass('active');

      if (el.children('img').hasClass('media-image')) {

        mediaToLoad = el.children('img').attr('data-url');
        desc = el.attr('title');
        $mediasection.eq(galleryIndex).children('.main-media').empty().append('<div class="insta-photo"><img src="' + mediaToLoad + '"></div><div class="insta-desc">' + desc + '</div>');

      }

      if (el.children('img').hasClass('media-youtube')) {
        mediaToLoad = el.children('img').attr('data-url').replace('https://www.youtube.com/watch?v=', '');
        $mediasection.eq(galleryIndex).children('.main-media').empty().append('<iframe width="100%" height="480" src="https://www.youtube.com/embed/' + mediaToLoad + '" frameborder="0" allowfullscreen></iframe>');
      }

      if (el.children('img').hasClass('media-vimeo')) {
        mediaToLoad = el.children('img').attr('data-url').replace('https://vimeo.com/', '');
        $mediasection.eq(galleryIndex).children('.main-media').empty().append('<iframe src="https://player.vimeo.com/video/' + mediaToLoad + '" width="100%" height="480" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
      }

    });

  }
  mediaClick();


  function createPhotoElement(photo, active) {
    var innerHtml = $('<img>')
      .addClass('media-image')
      .attr('data-url', photo.images.standard_resolution.url)
      .attr('src', photo.images.thumbnail.url);

    var html = $('<div>')
      .addClass('media-thumb')
      .attr('id', photo.id)
      .attr('title', photo.caption.text)
      .append(innerHtml);

    if (active === true) {
      html.addClass('active');
    }

    return html;
  }

  $('#instagram .media-thumbs').on('didLoadInstagram', function(event, response) {
    var that = this;
    $('#instagram .main-media').append('<div class="insta-photo"><img src="' + response.data[0].images.standard_resolution.url + '"></div><div class="insta-desc">' + response.data[0].caption.text + '</div>');
    $.each(response.data, function(i, photo) {
      if (i === 0){
        $(that).append(createPhotoElement(photo, true));
      }else{
        $(that).append(createPhotoElement(photo, false));
      }
    });
    //mediaClick();
  });

  $('#instagram .media-thumbs').instagram({
    hash: 'susconecta',
    clientId: 'baee48560b984845974f6b85a07bf7d9'
  });



  $('[data-toggle="tooltip"]').tooltip();
  var $mobilemainmenu, $sociallinks, $mainmenu = $('#main-menu');

  setTimeout(function() {
    $('.opening-passo-1').removeClass('fadeInDown').addClass('fadeOut');

    setTimeout(function() {
      $('.opening-passo-2').css('visibility', 'visible').addClass('fadeInDown');
    }, 1000);

    setTimeout(function() {
      $('.opening-passo-3').css('visibility', 'visible').addClass('fadeInDown');

      setTimeout(function() {
        $('.opening-passo-3').removeClass('fadeInDown');
        $('#typer').typer([
          'negr@s',
          'mulheres',
          'LGBT',
          'indígenas',
          'pop.rua',
          'tod@s'
        ]);
        setTimeout(function() {
          //$(document).scrollTop( $("#main-menu-section").offset().top )
          $('body, html').animate({scrollTop: $('#main-menu-section').offset().top}, 400);
        }, 8000);
      }, 600);

    }, 1500);

  }, 3000);

  var instasvg = $('#instasvg').drawsvg();
  var susconectahashs = $('#susconectahashs').drawsvg();
  var susconectalinhas = $('#susconectalinhas').drawsvg();
  var biggrafico1 = $('#biggrafico_1').drawsvg();
  var biggrafico2 = $('#biggrafico_2').drawsvg();
  var biggrafico3 = $('#biggrafico_3').drawsvg();
  var instasvgcomplete = 0;
  var susconectahashscomplete = 0;
  var biggraficocomplete = 0;

  $('#conexoes').waypoint({
    handler: function(direction) {
      if (direction === 'down' && biggraficocomplete === 0) {
        biggrafico1.drawsvg('animate');
        biggrafico2.drawsvg('animate');
        biggrafico3.drawsvg('animate');
        biggraficocomplete = 1;
      }
    }
  });

  $('#instasvg-trigger').waypoint({
    handler: function(direction) {
      if (direction === 'down' && instasvgcomplete === 0) {
        instasvg.drawsvg('animate');
        instasvgcomplete = 1;
      }
    }
  });

  $('#susconectahashs-trigger').waypoint({
    handler: function(direction) {
      if (direction === 'down' && susconectahashscomplete === 0) {
        susconectahashs.drawsvg('animate');
        susconectalinhas.drawsvg('animate');
        susconectahashscomplete = 1;
      }
    }
  });

  // define a altura minima das seções principais
  $('body > section').not('.two').css('min-height', window.innerHeight + 'px');
  // menu affix
  $('#main-menu-section').affix({
    offset: {
      top: window.innerHeight,
      bottom: 0
    }
  });

  if (window.innerHeight < 980) {
    $mainmenu.addClass('mobile');
  } else {
    $mainmenu.removeClass('mobile');
  }

  // recalcula a altura minima caso a janela seja redimensionada
  $(window).resize(function() {

    if (window.innerHeight < 980) {
      $mainmenu.addClass('mobile');
      $mobilemainmenu = $('#main-menu.mobile');
    } else {
      $mainmenu.removeClass('mobile');
    }

    // define a altura minima das seções principais
    $('body > section').not('.two').css('min-height', window.innerHeight + 'px');
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
    $('#main-menu ul li').removeClass('active');
    el.addClass('active');
    var whatTab = el.index();
    var howFar = 0;
    if (whatTab > 0) {
      howFar += 4 * whatTab;
      for (var i = 0; i < whatTab; i++) {
        howFar += $('#main-menu ul li').eq(i).width();
      }
    }
    $('.slider').css({
      left: (howFar + parseInt(el.children('a').css('padding-left')) ) + 'px',
      width: el.children('a').width() + 'px'
    });

    var buttonWidth = el.width(),
        buttonHeight = el.height();
        //posX = el.offset().left,
        //posY = el.offset().top,

    if (buttonWidth >= buttonHeight) {
      buttonHeight = buttonWidth;
    } else {
      buttonWidth = buttonHeight;
    }

    //var x = e.pageX - posX - buttonWidth / 2;
    //var y = e.pageY - posY - buttonHeight / 2;
  }

  // aplica o efeito no menu no clique
  $('#main-menu ul li').click(function() {
    menuClick($(this));
  });
  // aplica o efeito do menu no scroll
  $('#main-menu').on('activate.bs.scrollspy', function () {

    menuClick($('#main-menu ul li.active'));

  });

  // smooth scroll
  $('a[href^="#"]').not('.no-scroll').not('.collapsed').on('click', function (e) {
      e.preventDefault();

      var target = this.hash;
      var $target = $(target);

      $('html, body').stop().animate({
          'scrollTop': $target.offset().top
      }, 900, 'swing', function () {
          window.location.hash = target;
      });
  });

  // animando os botões de links social-links
  $sociallinks = $('ul.social-links li img');
  $sociallinks.on('mouseover', function() {
    $(this).addClass('infinite pulse animated');
  });
  $sociallinks.on('mouseout', function() {
    $(this).removeClass('infinite pulse animated');
  });

  if (window.innerHeight < 980) {
    $('.hamburg-menu').on('click', function() {
      $(this).toggleClass('active');
      $mobilemainmenu.children('ul').slideToggle('fast');
    });
    $mainmenu.children('ul').children('li').on('click', function() {
      $mobilemainmenu.children('ul').slideToggle('fast');
      $('.hamburg-menu').removeClass('active');
    });
  }

});
