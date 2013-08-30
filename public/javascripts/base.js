 /*! http://mths.be/noselect v1.0.3 by @mathias */
  jQuery.fn.noSelect = function() {

  // Since the string 'none' is used three times, storing it in a variable gives better results after minification
  var none = 'none';

  // onselectstart and ondragstart for WebKit & IE
  // onmousedown for WebKit & Opera
  return this.bind('selectstart dragstart', function() {
    return false;
  }).css({
    'MozUserSelect': none,
    'msUserSelect': none,
    'webkitUserSelect': none,
    'userSelect': none
  });
  };

// function doQuery(queryString)
// {
//   $.post('/query', 'query='+queryString, 
//     function(data){
//       console.log(data);
//       $('.results').append(data);
//       // return false;
//     });
//   return false;
// }

function doQuery()
{
  $.post('/query', 'query='+' %2Btype:component %2Bsubjcode:'+$('#coursebox').val()+' %2Bcourseno:'+$('#numbox').val(),
      function(data){
        console.log(data);
        var lecture = [];
        var other = [];
        $('.results').append(data);
        var jsonNode = $.parseJSON(data);
        if(jsonNode.responseHeader.status  == 0)
        {
          jsonNode = jsonNode.response.docs;
          for(var i = 0; i < jsonNode.length; i++)
          {
            if(jsonNode[i].doctype === 'LE')
            {
              lecture.push(jsonNode[i]);
            }
            else
            {
              other.push(jsonNode[i]);
            }
          }
        }
        drawSelectChart(lecture,other);
      });
  return false;
}

function drawSelectChart(lectureList, otherList)
{
  var tablestarter = document.createElement("div");
  $(tablestarter).addClass('selectionChart');
  var root = $("#tables")[0];
  root.appendChild(tablestarter);
  var table = document.createElement("table");
  for(var i = 0; i < lectureList.length; i++)
  {
    var tr = document.createElement("tr");
    for(var k in lectureList[i])
    {
      var td = document.createElement("td");
      $(td).addClass("sc"+k);
      td.innerHTML = lectureList[i][k];
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  tablestarter.appendChild(table);
}

function startAutoComplete()
{
  $.get('/query/subjCodes',
    function(data){
      console.log(data);
      var subj_ac = [];
      var jsonNode = $.parseJSON(data);
      jsonNode = jsonNode.facet_counts.facet_fields.subjcode;
      for(var i = 0; i < jsonNode.length; i++)
      {
        if(i%2 == 0)
        {
          subj_ac.push(jsonNode[i]);
          console.log(jsonNode[i]);
        }
      }
      subj_ac.sort();
      $('#coursebox').autocomplete({
        source: subj_ac
      });
    });
}

function drawTable(root)
{
  var dateArr = ["Times", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  var tablestarter = document.createElement("div");
  root.appendChild(tablestarter);
      // var tablecorner = document.createElement("div");
      // tablecorner.className="corner";
      // tablestarter.appendChild(tablecorner);
      // $("body").append("<div class='corner'></div>")
      for(var x = 0; x < dateArr.length; x++)
      {
        var tablecorner = document.createElement("div");
        tablecorner.className="tableheader";
        if(x===0)
        {
          tablecorner.className="tableheader first";
        }
        tablecorner.innerHTML = dateArr[x];
        $(tablecorner).noSelect();
        tablestarter.appendChild(tablecorner);
        // $("body").append("<div class='tableheader'>"+dateArr[x]+ "</div>");
      }
      var timeArr = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30"];
      var tabledata = document.createElement("div");
      root.appendChild(tabledata);
      for(var y = 0; y < timeArr.length; y++)
      {
        var odd = y%4;
        var ele;
        if(odd < 2)
        {
          ele = document.createElement("div");
          ele.className="tablerow odd";
          tabledata.appendChild(ele);
          // $("body").append("<div class='tablerow odd'>");
        }
        else
        {
          ele = document.createElement("div");
          ele.className="tablerow even";
          tabledata.appendChild(ele);
        }
        var tstart = document.createElement("div");
        tstart.className="tablestart";
        tstart.innerHTML = timeArr[y];
        $(tstart).noSelect();
        ele.appendChild(tstart);
        // $("body").append("<div class='tablestart'>"+timeArr[y]+"</div>");
        for(var z = 0; z < 5; z++)
        {
          var tcol = document.createElement("div");
          tcol.className="tablecol";
          tcol.innerHTML= "";
          addUpDownListener(tcol);
          $(tcol).noSelect();
          ele.appendChild(tcol);
          // $("body").append("<div class='tablecol'>..."+ "</div>");
        }
        // var tend = document.createElement("div");
        // tend.className="endcol";
        // tend.innerHTML="...";
        // ele.appendChild(tend);
        // $("body").append("</div>");
      }
    }

    function selectTableElement(row, col)
    {
      var elmt = $($($("#tables").children()[1]).children()[row]).children()[col];
      return elmt;
    }
    function coverElement(toCover, toEnd)
    {
      var elmt = document.createElement("div");
      $(elmt).css({
        "position": "absolute",
        "left": $($($($("#tables").children()[1]).children()[0]).children()[1]).position().left + 1,
        "top": $(toCover).position().top,
        "height": ($(toEnd).position().top- $(toCover).position().top ) + "px",
        // "height" : "3em",
        "width": ($($($($("#tables").children()[1]).children()[0]).children()[1]).position().left - $(toCover).position().left) + "px",
        "z-index": "60",
        "background-color": "orange",

      });
      console.log($(toCover));
      console.log($(toCover).position().left);
      console.log($(toCover).position().top);
      console.log(($(toCover).position().top - $(toEnd).position().top) + "px");
      console.log($($($("#tables").children()[1]).children()[0]).children()[1]);
      console.log($($($("#tables").children()[1]).children()[0]).children()[1] === selectTableElement(0,1));
      document.body.appendChild(elmt);
    }

    var up = true;
    function assignDocListeners()
    {
      document.addEventListener('mousedown', function(evt)
      {
        up = false;
      });
      document.addEventListener('mouseup', function(evt)
      {
        up = true;
      });
    }

    function addUpDownListener(elmt)
    {
      elmt.addEventListener('mouseover', function(evt)
      {
        if(up === false && $(elmt).hasClass('restrict'))
        {
          $(elmt).removeClass("restrict");
        }
        else if(up === false)
        {
          $(elmt).addClass("restrict");
        }
      }, true);
      elmt.addEventListener('click', function(evt)
      {
        if($(elmt).hasClass('restrict'))
        {
          $(elmt).removeClass("restrict");
        }
        else
        {
          $(elmt).addClass("restrict");
        }
      }, true)
    }

    function splitClassString(time)
    {
      var stringArr = time.split(";");
      var result = [];
    }




