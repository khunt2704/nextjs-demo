  $(document).on("click",".log_users",function(){
      $(".mob_none").slideToggle();
  });

// ===== Scroll to Top ==== 
$(window).on("scroll",function() {
  if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
    $('#stop').fadeIn(200);    // Fade in the arrow
  } else {
    $('#stop').fadeOut(200);   // Else fade out the arrow
  }
});
$(document).on('click','#stop',function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});

$(window).on("scroll",function() { 
    var scroll = $(window).scrollTop();
    if (scroll >= 300) {
        $("header").addClass("headerfixed");
    } else {
        $("header").removeClass("headerfixed");
    }

});

  $(document).on("click",".mobile-list",function(){
      $(".search-filter").slideToggle();
  });

    $(document).on("click",".mobile_filter",function(){
        $(".left-profle").slideToggle();
        
    });

    $(document).on("click",".mobile_filter",function(){
        $(".mobile_sh").slideToggle("slow",()=>{
            if($('.mobile_sh').css('display')==='none'){
              $('.mobile_filter p').html('Show Menu');
            }else{
              $('.mobile_filter p').html('Hide Menu');
            }
        });
    });

  $(document).on("click",".top_menu_click",function(){
		$(".aft_log_top_menu").slideToggle("slow");
	});

$(document).on('click', function () {
  var $target = $(event.target);
  if (!$target.closest('.aft_log_top_menu').length
    && !$target.closest('.top_menu_click').length
    && $('.aft_log_top_menu').is(":visible")) {
    $('.aft_log_top_menu').slideUp();
  }
  
});

	//toggle the componenet with class accordion_body
	$(document).on("click",".accordion_head",(function(){
		var id=$(this).data('id');
		if ($('.aa'+id).is(':visible')) {
			$(".aa"+id).slideUp(600);
			$(".plusminus"+id).text('+');
		}
		else
		{
			$(".accordion_body").slideUp(600);
			
			$(".plusminus").text('+');
			$(this).next(".accordion_body").slideDown(600); 
			$(this).children(".plusminus"+id).text('-');
		}
  }));



  $(document).on("click",".rvw-show",(function(){
        $(".rvw-box-more").slideToggle("slow",()=>{
          if($('.rvw-show').text() ==="Show all review +"){
            $('.rvw-show').text('Show less review -')
          }
          else{
            $('.rvw-show').text('Show all review +')
          }
      });
  }))


  $(document).on("click",".read_rvw",(function(){
        $(".more_rvw").slideToggle("slow",()=>{
          if($('.read_rvw').text() ==="Less review -"){
            $('.read_rvw').text('More review +')
          }
          else{
            $('.read_rvw').text('Less review -')
          }
      });
  }))

  $(document).on("click",".click_filter",function(){
      $(".left-bar").slideToggle("slow");
  });

// $(document).on('click', function () {
//   var $target = $(event.target);
//   if (!$target.closest('.left-bar').length
//     && !$target.closest('.click_filter').length
//     && $('.left-bar').is(":visible")) {
//     $('.left-bar').slideUp();
//   }
// });
// $(document).ready(function(){
//   $(document).on("click",".left-bar",function(){
//       $(".left-bar").slideToggle("slow");
//   });
// });

  $(document).on("click","#profidrop",function(){
      $("#profidropdid").slideToggle("slow");
  });



  $(document).on("click","#profidropdid",function(){
      $("#profidropdid").slideToggle("slow");
  });


$(document).on('click', function () {
  var $target = $(event.target);
  if (!$target.closest('#profidropdid').length
    && !$target.closest('#profidrop').length
    && $('#profidropdid').is(":visible")) {
    $('#profidropdid').slideUp();
  }
  
});



  $(document).on("click",".sort_open",function(){
      $(".sort_lst").slideToggle("slow");
  });

// $(document).ready(function(){
//   $(document).on("click",".sort_lst",function(){
//       $(".sort_lst").slideToggle("slow");
//   });
// });


  $(document).on("click",".toggler",function(){
      $(".toggler_show").slideToggle("slow");
  });


  $(document).on("click",".toggler_show",function(){
      $(".toggler_show").slideToggle("slow");
  });

$(document).on('click', function () {
  var $target = $(event.target);
  if (!$target.closest('.navbarNav').length
    && !$target.closest('.navbarNavbtn').length
    && $('.navbarNav').is(":visible")) {
    $('.navbarNav').slideUp();
  }
    
  });
  $(document).on('click', function () {
    var $target = $(event.target);
    if (!$target.closest('.sort_lst').length
      && !$target.closest('.sort_open').length
      && $('.sort_lst').is(":visible")) {
      $('.sort_lst').slideUp();
    }
    
});

if($(window).width() < 990){
    $(document).on("click","#openMenu",function(){
        $("#navbarNav").slideToggle("slow");
    });

    $(document).on("click","#navbarNav",function(){
        $("#navbarNav").slideToggle("slow");
    });

  $(document).on('click', function () {
    var $target = $(event.target);
    if (!$target.closest('#navbarNav').length
      && !$target.closest('#openMenu').length
      && $('#navbarNav').is(":visible")) {
      $('#navbarNav').slideUp();
    }
  });
}
