var barNums = [11,18,23,65,5];
var barPrefs = [];
var bars = [];
for(var i=0; i<5; i++){
  barPrefs[i]={
    color: '#aaa',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 4,
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 1400,
    text: {
      autoStyleContainer: false
    },
    from: { color: '#aaa', width: 1 },
    to: { color: '#09F', width: 4 },
    // Set default step function for all animate calls
    step: function(state, circle) {
      circle.path.setAttribute('stroke', state.color);
      circle.path.setAttribute('stroke-width', state.width);
      var value = Math.round(circle.value() * barNums[circle._container.id[1]-1]);
      if (value === 0) {
        circle.setText('');
      } else {
        circle.setText(value);
      }

    }
  };
  bars[i]=new ProgressBar.Circle("#c"+(i+1), barPrefs[i]);
  bars[i].text.style.fontSize = '3rem';
  bars[i].text.style.color = '#000';

}

$(document).ready(function() {
    $('#fullpage').fullpage({
      menu: '#mainMenu',
      scrollOverflow: true,
      afterLoad: function(anchorLink, index){
        if(index === 2)
        {
          for(i=0;i<5;i++)
          {
            bars[i].animate(1.0);  // Number from 0.0 to 1.0
          }
        }
      }
    });

});
