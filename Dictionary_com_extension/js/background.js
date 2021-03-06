var dic_prefs = {
  use_window		 : 'below',
  use_popupdbclick : {triggerKey : 'none', triggerValue : true},
  use_popupselect  : {triggerKey : 'none', triggerValue : false},
  use_definition   : {num : '1', synonyms : true},
  use_color_style	 : {fontType : 'Helvetica',fontSize : '13px', fontColor:'#000000', bubbleColor : '#ffffff'},
  use_search_result:  true
}				

localStorage.dic_prefs = JSON.stringify(dic_prefs);				
function sendSearch(selectedText, domainName) {
  if(domainName == 'thesaurus'){
    var serviceCall = 'http://thesaurus.com/browse/';
  }
  else if(domainName == 'reference'){
    var serviceCall = 'http://www.reference.com/browse/';
  }
  else if(domainName == 'reversedictionary'){
    var serviceCall = 'http://www.reference.com/reverseresults?db=reverse&q=';
  }
  else {
    var serviceCall = 'http://dictionary.com/browse/';
  }
  var serviceCall = serviceCall + selectedText;
  chrome.tabs.create({url: serviceCall});
}

chrome.contextMenus.create({
  title: "See '%s' on Dictionary.com", 
  contexts:["selection"],
  onclick: function(info, tab) {
    sendSearch(info.selectionText,'dictionary');
  }
});
/*chrome.contextMenus.create({
  title: "See '%s' on Thesaurus.com", 
  contexts:["selection"], 
  onclick: function(info, tab) {
  sendSearch(info.selectionText,'thesaurus');
  }
  });
  chrome.contextMenus.create({
  title: "See '%s' on Reference.com", 
  contexts:["selection"], 
  onclick: function(info, tab) {
  sendSearch(info.selectionText,'reference');
  }
  });
  chrome.contextMenus.create({
  title: "See '%s' on Reverse Dictionary", 
  contexts:["selection"], 
  onclick: function(info, tab) {
  sendSearch(info.selectionText,'reversedictionary');
  }
  });*/


function onRequest(request, sender, callback) {
  if (request.action == 'getSpel') {
    callback(chrome.tts.speak(request.pron));    					
  }
  else if (request.action == 'getOptions') {
    var serviceCall = chrome.extension.getURL("options.html");
    callback(chrome.tabs.create({url: serviceCall}));
  }
  else if (request.action == 'getLocalStorage') {
    var lStorage = window.localStorage.getItem('setLocalStorage');
    if(lStorage != " " && lStorage != null){
      localStorage.setItem("setLocalStorage", lStorage);
      callback(JSON.parse(lStorage));
    }else{
      callback(JSON.parse(localStorage.dic_prefs));
    }
  }
  else if (request.action == 'redirectUrl') {
    if(request.href.indexOf('http')!=-1)
      var serviceCall = request.href;
    else
      serviceCall = "http://dictionary.com"+ request.href;

    callback(chrome.tabs.create({url: serviceCall}));
  }
  else if (request.action == 'getSelection') {						
    callback({selection : String(window.getSelection())});
  }
  else if (request.action == 'getSearch') {						
    callback(localStorage.lastSearch);
  }
  else if (request.action == 'setSearch') {						
    localStorage.lastSearch = request.lastSearch;
    callback(localStorage.lastSearch);
  }
  else if (request.action == 'getReference') {
    if(request.href.indexOf('http')!=-1)
      var serviceCall = request.href;
    else
      serviceCall = "http://reference.com"+ request.href;

    callback(chrome.tabs.create({url: serviceCall}));
  }
}				

chrome.extension.onRequest.addListener(onRequest); 

