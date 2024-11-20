"use strict";

var tabs = {
  biotech: {
    '0': null,
    '1': null,
    '2': null,
    '3': null,
    '4': null
  },
  finance: {
    '0': null,
    '1': null,
    '2': null,
    '3': null,
    '4': null
  },
  manufacturing: {
    '0': null,
    '1': null,
    '2': null,
    '3': null,
    '4': null
  },
  retail: {
    '0': null,
    '1': null,
    '2': null,
    '3': null,
    '4': null
  }
};
var industryArray = ['biotech', 'finance', 'manufacturing', 'retail']; //snap svg

var canvas = Snap("#matrix-area-1");
var selectedTab = 'biotech',
    allSelected = false,
    colors = {
  biotech: ['#004c9c', 'blue'],
  finance: ['#375251', 'green'],
  manufacturing: ['#e12f11', 'orange'],
  retail: ['#D17D00', 'orange-acc']
},
    coord = [],
    strokeWidth = 4;
var shadows = {
  biotech: canvas.filter(Snap.filter.shadow(1, 1, '#001a36', 0.75)),
  finance: canvas.filter(Snap.filter.shadow(1, 1, '#0e1515', 0.75)),
  manufacturing: canvas.filter(Snap.filter.shadow(1, 1, '#821b0a', 0.75)),
  retail: canvas.filter(Snap.filter.shadow(1, 1, '#6b4000', 0.75))
};

function nullCheck() {
  var nullCount = 0;

  for (var prop in tabs) {
    for (var prop2 in tabs[prop]) {
      if (tabs[prop][prop2] === null) {
        nullCount++;
      }
    }
  }

  if (nullCount === 0) {
    $('.btn-submit').show();
    return true;
  } else {
    $('.btn-submit').hide();
    return false;
  }
}

$(document).ready(function () {
  nullCheck();
});

function getCoord(height, width) {
  height = Math.ceil(strokeWidth / 2) + height;
  width = Math.ceil(strokeWidth / 2) + width; //coordinates

  coord = [[[Math.ceil(strokeWidth / 2), height * 3], [Math.ceil(strokeWidth / 2), height * 2], [Math.ceil(strokeWidth / 2), height], [Math.ceil(strokeWidth / 2), Math.ceil(strokeWidth / 2)]], [[width, height * 3], [width, height * 2], [width, height], [width, Math.ceil(strokeWidth / 2)]], [[width * 2, height * 3], [width * 2, height * 2], [width * 2, height], [width * 2, Math.ceil(strokeWidth / 2)]], [[width * 3, height * 3], [width * 3, height * 2], [width * 3, height], [width * 3, Math.ceil(strokeWidth / 2)]], [[width * 4 + strokeWidth, height * 3], [width * 4 + strokeWidth, height * 2], [width * 4 + strokeWidth, height], [width * 4 + strokeWidth, Math.ceil(strokeWidth / 2)]]];
  return coord;
} // result prev and next in that order


function check(col) {
  var colArray = [col - 1, col + 1];
  var colCheck = [];

  for (var i = 0; i < colArray.length; i++) {
    if (colArray[i] > 5 || colArray[i] < 0) {
      colCheck[i] = false;
    } else {
      var $radioCheck = $('input[name=column-' + colArray[i] + ']:checked');

      if ($radioCheck.length === 1) {
        colCheck[i] = true;
      } else {
        colCheck[i] = false;
      }
    }
  }

  return colCheck;
}

function emptyMatrix(matrixArea) {
  var lines = matrixArea.children('line').remove();
  var elements = $('input[type=radio]:checked');

  for (var i = 0; i < elements.length; i++) {
    elements[i].checked = false;
  }
}

function eraseLine(colX, colY) {
  var string = colX > colY ? colX + '-' + colY : colY + '-' + colX;
  $('#matrix-area-1 .' + string).remove();
  return string;
}

function drawLine(colX, colY, string, val) {
  //redraw that line
  var $xVal = $('input[name=column-' + colY + ']:checked').val().split('-');
  var line = canvas.line( //x1,y1
  coord[colX][val[0]][0], coord[colX][val[0]][1], //x2, y2
  coord[colY][$xVal[0]][0], coord[colY][$xVal[0]][1]);

  if (/MSIE 10/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) {
    line.attr({
      'stroke': colors[selectedTab][0],
      'stroke-width': '4',
      'class': string,
      'x2': coord[colX][val[0]][0],
      'y2': coord[colX][val[0]][1]
    });
  } else {
    line.attr({
      'stroke': colors[selectedTab][0],
      'stroke-width': '4',
      'class': string,
      'x2': coord[colX][val[0]][0],
      'y2': coord[colX][val[0]][1],
      'filter': shadows[selectedTab]
    });
  }

  line.animate({
    'x2': coord[colY][$xVal[0]][0],
    'y2': coord[colY][$xVal[0]][1]
  }, 250);
}

function drawGraph(tabsObj, snapObj) {
  var tabs = Object.keys(tabsObj).length;
  var shift = 0;

  for (var i = 0; i < tabs; i++) {
    var currentTabArray = tabsObj[industryArray[i]];
    var selTab = industryArray[i];
    var currentTabCount = Object.keys(tabsObj[industryArray[i]]).length - 1;

    for (var ii = 0; ii < currentTabCount; ii++) {
      var currentVal = [currentTabArray[ii], ii];

      if (currentTabArray[ii] !== null && currentTabArray[ii + 1] !== null) {
        var line = snapObj.line( //x1,y1
        coord[ii][currentVal[0]][0], coord[ii][currentVal[0]][1] + shift, //x2, y2
        coord[ii + 1][currentTabArray[ii + 1]][0], coord[ii + 1][currentTabArray[ii + 1]][1] + shift);

        if (/MSIE 10/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) {
          line.attr({
            'stroke': colors[selTab][0],
            'stroke-width': 3,
            'x2': coord[ii][currentVal[0]][0],
            'y2': coord[ii][currentVal[0]][1] + shift
          });
        } else {
          line.attr({
            'stroke': colors[selTab][0],
            'stroke-width': 3,
            'x2': coord[ii][currentVal[0]][0],
            'y2': coord[ii][currentVal[0]][1] + shift,
            'filter': shadows[selTab]
          });
        }

        line.animate({
          'x2': coord[ii + 1][currentTabArray[ii + 1]][0],
          'y2': coord[ii + 1][currentTabArray[ii + 1]][1] + shift
        }, 250);
      }
    }

    shift = shift + 4;
  }
}

function createGraph() {
  var selectedValues = Object.values(tabs[selectedTab]); //selecting answers

  for (var i = 0; i < selectedValues.length; i++) {
    if (selectedValues[i] !== null) {
      $("input[value=" + selectedValues[i] + "-" + i + "]").prop('checked', true);
    }
  } // drawing lines


  for (var i = 0; i < selectedValues.length - 1; i++) {
    if (selectedValues[i] !== null && selectedValues[i + 1] !== null) {
      //skip
      var current = [selectedValues[i], i];
      var className = eraseLine(i, i + 1);
      drawLine(i, i + 1, className, current);
    }
  }
}

getCoord($('#industry-matrix tbody td:nth-child(2)').height(), $('#industry-matrix tbody td:nth-child(2)').width()); //rebuild svg

$(window).resize(function () {
  getCoord($('#industry-matrix tbody td:nth-child(2)').height(), $('#industry-matrix tbody td:nth-child(2)').width());
  var $svgCount = $('svg').length;

  if ($svgCount > 1) {
    var $svgNodeArray = $('svg');

    for (var i = 0; i < $svgNodeArray.length; i++) {
      emptyMatrix($($svgNodeArray[i]));
    }
  } else {
    emptyMatrix($("#industry-matrix #matrix-area-1"));
  }

  if (allSelected == false) {
    createGraph(tabs, selectedTab);
  } else {
    drawGraph(tabs, canvas);
  }
});
$('#industry-matrix input[type=radio]').change(function (e) {
  e.preventDefault();

  if (allSelected !== true) {
    var $val = e.currentTarget.value.split('-');
    var col = parseInt($val[1]); //update tabs

    tabs[selectedTab][col] = parseInt($val[0]);
    var colArray = [col - 1, col + 1];
    var colCheckArray = check(col);

    for (var i = 0; i < colCheckArray.length; i++) {
      if (colCheckArray[i] === true) {
        var className = eraseLine(col, colArray[i]);
        drawLine(col, colArray[i], className, $val);
      }
    }
  }

  nullCheck();

  if (nullCheck() === true) {
    emptyMatrix($("#industry-matrix #matrix-area-1"));
    allSelected = true;
    $('.tab-links--all').focus();
    $('#industry-matrix').addClass('allSelected');
    $('#industry-matrix .tab-links--all').focus();
    $('#industry-matrix .tab-links.active').removeClass('active');
    $('#industry-matrix .tab-links--all').addClass('active');
    var graphRadios = $('#industry-matrix label.graph-button-radio');

    for (var i = 0; i < graphRadios.length; i++) {
      $(graphRadios[i]).removeClass('graph-button-radio--' + colors[selectedTab][1]);
    } //just draw


    drawGraph(tabs, canvas);
    $('.industry-matrix--message-box p').fadeTo(250, 0, function () {
      $(this).delay(250);
      $(this).html('Submit your results to see the class average.');
      $(this).fadeTo(250, 1);
    });
  }
});
$('#industry-matrix .tab-links').click(function (e) {
  $('#industry-matrix .tab-links.active').removeClass('active');
  $(this).addClass('active');

  if ($(this).hasClass('tab-links--all')) {
    e.preventDefault();
    emptyMatrix($("#industry-matrix #matrix-area-1"));
    allSelected = true;
    $('#industry-matrix').addClass('allSelected');
    var graphRadios = $('#industry-matrix label.graph-button-radio');

    for (var i = 0; i < graphRadios.length; i++) {
      $(graphRadios[i]).removeClass('graph-button-radio--' + colors[selectedTab][1]);
    } //just draw


    drawGraph(tabs, canvas);
    var isValid = nullCheck();

    if (isValid !== true) {
      //notify student to finish creating the graph in the other industries      
      $('.industry-matrix--message-box p').fadeTo(250, 0, function () {
        $(this).delay(250);
        $(this).html('Finish your predictions before submitting your results!');
        $(this).fadeTo(250, 1);
      });
    } else {
      $('.industry-matrix--message-box p').fadeTo(250, 0, function () {
        $(this).delay(250);
        $(this).html('Submit your graph to see your peers results.');
        $(this).fadeTo(250, 1);
      });
    }
  } else {
    e.preventDefault();
    emptyMatrix($("#industry-matrix #matrix-area-1"));
    allSelected = false;
    $('#industry-matrix').removeClass('allSelected');
    var graphRadios = $('#industry-matrix label.graph-button-radio');

    for (var i = 0; i < graphRadios.length; i++) {
      $(graphRadios[i]).removeClass('graph-button-radio--' + colors[selectedTab][1]);
      $(graphRadios[i]).addClass('graph-button-radio--' + colors[e.currentTarget.getAttribute('id')][1]);
    }

    selectedTab = '';
    selectedTab = e.currentTarget.getAttribute('id');
    var selectedValues = Object.values(tabs[selectedTab]); //selecting answers

    for (var i = 0; i < selectedValues.length; i++) {
      if (selectedValues[i] !== null) {
        $("#industry-matrix input[value=" + selectedValues[i] + "-" + i + "]").prop('checked', true);
      }
    } // drawing lines


    for (var i = 0; i < selectedValues.length - 1; i++) {
      if (selectedValues[i] !== null && selectedValues[i + 1] !== null) {
        //skip
        var current = [selectedValues[i], i];
        var className = eraseLine(i, i + 1);
        drawLine(i, i + 1, className, current);
      }
    }
  }
});
$('.btn-submit').click(function () {
  $.ajax({
    method: "POST",
    url: "db/interactive_data.php",
    data: {
      submission: JSON.stringify(tabs),
      interactive_name: interactive_name
    },
    success: function success(data) {
      Cookies.set(interactive_name, JSON.stringify(tabs));
      showResults();
    }
  }).done(function () {});
});

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var interactive_name = getParameterByName("name");

if (interactive_name === null || interactive_name === "") {
  $('.container').html("You must specify an interactive name.");
}

var class_results = getParameterByName("class_results");

if (class_results === "yes" || Cookies.get(interactive_name) !== undefined) {
  showResults();
}

function showResults() {
  $('.industry-matrix .heading-h4').text('Industry Matrix - Class Average');
  $('.industry-matrix--footer').hide();
  $('.industry-matrix-results').show();
  $('.btn-activity.btn-compare').show();
  $.ajax({
    method: "GET",
    url: "db/interactive_data.php",
    data: {
      interactive_name: interactive_name
    },
    success: function success(data) {
      data = JSON.parse(data);
      var allData = data["data"];

      for (var i = 0; i < allData.length; i++) {
        allData[i] = JSON.parse(allData[i]);
      }

      var allDataLength = allData.length;
      var allDataIdx = 0;

      while (allDataIdx < allDataLength) {
        for (var industryIdx = 0; industryIdx < industryArray.length; industryIdx++) {
          for (var column = 0; column < 5; column++) {
            var sum = 0;

            for (var i = 0; i < allDataLength; i++) {
              sum += allData[i][industryArray[industryIdx]][column];
            }

            tabs[industryArray[industryIdx]][column] = Math.round(sum / allDataLength);
          }
        }

        allDataIdx += 1;
      } //for each svg draw graph


      drawGraph(tabs, canvas);
      $('.industry-matrix :input').prop("disabled", true);
    }
  });
  $('.btn-activity.btn-compare').click(function () {
    $(this).hide();
    $('.industry-matrix').children().clone().appendTo('#industry-results_all .industry-results_single');
    $('#industry-matrix').appendTo('#industry-results_all .industry-results_class');
    $('<div class="industry-results_placeholder"></div>').prependTo('.industry-results_single .industry-matrix--task-wrapper');
    $('.industry-results_single').find('a').removeAttr('href');
    $('.industry-results_single :input').prop("disabled", true);
    $('.industry-results_single').find('.heading-h4').text('Industry Matrix - Your Results');
    getCoord($('#industry-results_all .industry-results_single tbody td:nth-child(2)').height(), $('#industry-results_all .industry-results_single tbody td:nth-child(2)').width());
    canvas = Snap(".industry-results_single #matrix-area-1");
    emptyMatrix($(".industry-results_single #matrix-area-1"));
    drawGraph(JSON.parse(Cookies.get(interactive_name)), canvas); // set drawing events back to original graph so tabs work on that one only

    getCoord($('#industry-matrix tbody td:nth-child(2)').height(), $('#industry-matrix tbody td:nth-child(2)').width());
    canvas = Snap(".industry-results_class #matrix-area-1");
    emptyMatrix($(".industry-results_class #matrix-area-1"));
    drawGraph(tabs, canvas);
    $('#industry-results_all').children('[class^="industry-results_"]:not([class$="_placeholder"])').hide();
    $('#industry-results_all').children('[class^="industry-results_"]:not([class$="_placeholder"])').first().show();
    $('#graph-nav').show();
    $('.industry-results_class').find('.tab-links.active').removeClass('active');
    $('.industry-results_placeholder').html($('.industry-matrix--industries').html());
  });
}

$('[data-toggle]').on('click', function (event) {
  var targ = $(this).attr('id');
  event.preventDefault();
  $('[class^="industry-results_"]:not([class$="_placeholder"])').hide();
  $('.industry-results_' + targ).show();
});