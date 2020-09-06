


var array = ['link1','link2','link3','etc','...','...','linkN'] ;
spreadsheetlink = "YOUR SPREADSHEET LINK HERE!"
formlink = "YOUR FORM LINK HERE!"
// number of questions!
globalN = 6

// randomLinkGenerator
function getRandom(arr, n) {
  var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
    }
  return result;
}

//Builder Function
function buildForm() {
  var randomElements = getRandom(array,globalN)
  var form = FormApp.openByUrl(formlink);

  //----effective building--------
  for (var i=0; i<globalN; i++){
    form.addVideoItem()
    .setTitle(`pregunta ${i+1} de ${globalN}`)
    .setVideoUrl(randomElements[i]);
    var item = form.addCheckboxItem();
    item.setTitle("Question Title");
    item.setChoices([
        item.createChoice('Opt1'),
        item.createChoice('Opt2'),
        item.createChoice('Opt3'),
        item.createChoice('Opt4'),
    ]);
    var checkBoxValidation = FormApp.createCheckboxValidation()
      .requireSelectExactly(1)
      .build();
    item.setValidation(checkBoxValidation);
    item = item.setRequired(true);
    if (i<=3){
      form.addPageBreakItem().setTitle(`Pag ${i+2}`)
    }
  }
  //--------fourth: end--------------------
  form.addPageBreakItem().setTitle('LAST PAGE OF THE FORM!');
  //--------end of the building state------
  //-
  //open GoogleSpreadsheet
  var sheet = SpreadsheetApp.openByUrl(spreadsheetlink)
  var ss = sheet.getSheetByName("Sheet1");
  //save randomly selected correctAnswers
  ss.insertRows(1,1);
  var d = new Date();
  var s_ = d.getSeconds();
  var m_ = d.getMinutes();
  var h_ = d.getHours();
  var da_ = d.getDate();
  var mo_ = d.getMonth()+1;
  var saver = [`${mo_}/${da_} ${h_}:${m_}:${s_}`]
  for (var i=0; i<globalN;i++){
    saver.push(randomElements[i]);
  }
  ss.getRange(1,1,1,globalN+1)
   .setValues([saver]);    
  //end

  return
}


// Answers are sent to GoogleSpreadhseet ->
function AlwaysOn(){
 var form = FormApp.openByUrl(formlink);
 var sheet = SpreadsheetApp.openByUrl(spreadsheetlink)
 form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
}
  

// Random Questions -->
function updateVideos(){
  //open form
  var form = FormApp.openByUrl(formlink);
  //update globalN videos 
  var randomElements = getRandom(array,globalN)
  var j = 0
  var items = form.getItems();
  for (var i=0; i<items.length; i++){
    if (items[i].getType() == 'VIDEO') {
      var videoItem = items[i].asVideoItem();      
      videoItem.setVideoUrl(randomElements[j]);
      j++;
    }
  }  
  //open GoogleSpreadsheet
  var sheet = SpreadsheetApp.openByUrl(spreadsheetlink)
  var ss = sheet.getSheetByName("Data");
  //save (new) correctAnswers(t)
  ss.insertRows(1,1);
  var d = new Date();
  var s_ = d.getSeconds();
  var m_ = d.getMinutes();
  var h_ = d.getHours();
  var da_ = d.getDate();
  var mo_ = d.getMonth()+1;
  var saver = [`${mo_}/${da_} ${h_}:${m_}:${s_}`]
  for (var i=0; i<globalN;i++){
    saver.push(randomElements[i])
  }
  ss.getRange(1,1,1,globalN+1)
   .setValues([saver]);    
}



// A Dangerous Function, 
// Able to clear the entire form!
function clearForm(){
  var form = FormApp.openByUrl(formlink);
  var items = form.getItems();
  while(items.length > 0){
    form.deleteItem(items.pop());
  }
  return
}


//       ---THE END----
