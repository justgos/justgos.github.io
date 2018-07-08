$(() => {
  let welcomeText = [
    'Hello, dear traveller',
    'i\'m GoS, and here\'s stuff i love and do'
  ]
  let revealTime = 50
  let welcomeProgress = 0
  let gradualReveal = (id, text) => {
    $(id).html(
      text.substr(0, welcomeProgress+1)
      + '<span style="opacity: 0;">' + text.substr(welcomeProgress+1) + '</span>'
    )
    welcomeProgress++
    return welcomeProgress < text.length
  }
  let logoTalk = () => {
    if(welcomeProgress % 4 != 0)
      return
    // if(Math.random() < 0.5)
    //   return
    let op = parseFloat($('#logo').css('opacity'))
    let top = parseFloat($('#logo').css('top'))
    let left = parseFloat($('#logo').css('left'))
    let stepSize = 0.1
    // $('#logo').css({'opacity': op+(((Math.random() < 0.5 ? 0.3 : 1)-op)*stepSize)})
    let maxOffset = 8
    // $('#logo').css({'top': top+(((Math.random() < 0.5 ? -maxOffset : maxOffset)-top)*stepSize)})
    // $('#logo').css({'left': left+(((Math.random() < 0.5 ? -maxOffset : maxOffset)-left)*0.1)})
    // $('#logo').stop()
    $('#logo').animate({
      opacity: op+((Math.random() < 0.5 ? 0.3 : 1)-op)*stepSize,
      top: top+((Math.random() < 0.5 ? -maxOffset : maxOffset)-top)*stepSize,
      left: left+((Math.random() < 0.5 ? -maxOffset : maxOffset)-left)*0.1
    }, revealTime*4)
  }
  let logoSilence = () => {
    $('#logo').animate({
      opacity: 1,
      top: 0,
      left: 0
    }, 400)
  }
  let welcomeStep1 = () => {
    if(gradualReveal('#welcome-text-1', welcomeText[0])) {
      // $('#logo').css({'opacity': Math.min(Math.max(parseFloat($('#logo').css('opacity'))+(Math.random()-0.5)*0.5, 0), 1)})
        logoTalk()
      setTimeout(welcomeStep1, revealTime)
    } else {
      logoSilence()
      welcomeProgress = 0
      setTimeout(welcomeStep2, 1000)
    }
  }
  let welcomeStep2 = () => {
    if(gradualReveal('#welcome-text-2', welcomeText[1])) {
      logoTalk()
      setTimeout(welcomeStep2, revealTime)
    } else {
      logoSilence()
    }
  }
  setTimeout(welcomeStep1, 1000)
  // let welcome = $('#welcome')
  // let logo = $('#logo')
  // console.log($(window).height())
  // let rgb = (r, g, b) => {
  //   return "rgb("+r+","+g+","+b+")"
  // }
  // $(window).scroll(() => {
  //   var st = $(this).scrollTop()
  //   let welcomeP = Math.max(1-st/($(window).height()-200), 0)
  //   welcome.css({'background-color': rgb((1-welcomeP)*255, (1-welcomeP)*255, (1-welcomeP)*255)})
  //   logo.css({'filter': 'invert('+Math.max((welcomeP)*100, 0)+'%)'})
  // })
})
