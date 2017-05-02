// A sample store file.
(function(){
  var myActionHandler = function(action, data, state){
    switch(action){
      case "loadDatabase":
        state.loadingDB = true;
        var p1 = fetch('/src/app/database.json');
        var p2 = fetch('/src/app/prettycontent.json');
        Promise.all([p1, p2]).then(function(values) {
            var p1 = values[0].json();
            var p2 = values[1].json();
            Promise.all([p1, p2]).then(function(objs){
                state.database = objs[0];
                state.content = objs[1];
                actions.loadComplete();
            });
        });
        break;
      case "restoreDatabase":
        state.database = data.database;
        state.content = data.content;
        state.loadingDB = false;
        state.databaseReady = true;
        actions.loadComplete();
        break;
      case "loadComplete":
        state.loadingDB = false;
        state.databaseReady = true;
        break;
      case "readItem":
        var code = data;
        for(var i = 0; i < state.database.content.sections.length; i++){
          for(var j = 0; j < state.database.content.sections[i].items.length; j++){
            if(state.database.content.sections[i].items[j].id == code){
              if(!state.database.content.sections[i].items[j].read){
                state.database.content.sections[i].unread--; 
              }
              state.database.content.sections[i].items[j].read = true;
            }
          }
        }
        break;
      case "markSectionRead":
        var code = data;
        for(var i = 0; i < state.database.content.sections.length; i++){
          if(state.database.content.sections[i].id == code){
            for(var j = 0; j < state.database.content.sections[i].items.length; j++){
              state.database.content.sections[i].items[j].read = true;
              state.database.content.sections[i].unread--;
            }
          }
        }
        break;
      case "addItem":
        var code = data;
        for(var i = 0; i < state.database.content.sections.length; i++){
          for(var j = 0; j < state.database.content.sections[i].items.length; j++){
            if(state.database.content.sections[i].items[j].id == code){
              state.database.content.sections[i].items[j].available = true;
              state.database.content.sections[i].unread++;
            }
          }
        }
        break;
      case "bookmark":
        var code = data.item;
        var value = data.value;
        for(var i = 0; i < state.database.content.sections.length; i++){
          for(var j = 0; j < state.database.content.sections[i].items.length; j++){
            if(state.database.content.sections[i].items[j].id == code){
              state.database.content.sections[i].items[j].bookmark = value;
            }
          }
        }
        break;
      case "debugReset":
        actions.loadDatabase();
        break;
      case "debugAddAll":
        for(var i = 0; i < state.database.content.sections.length; i++){
          for(var j = 0; j < state.database.content.sections[i].items.length; j++){
            state.database.content.sections[i].items[j].available = true;
            state.database.content.sections[i].unread++;
          }
        }
        break;
      case "debugAddSection":
        var code = data;
        for(var i = 0; i < state.database.content.sections.length; i++){
          if(state.database.content.sections[i].id == code){
            for(var j = 0; j < state.database.content.sections[i].items.length; j++){
              state.database.content.sections[i].items[j].available = true;
              state.database.content.sections[i].unread++;
            }
          }
        }
        break;
      case "updateFilter":
        var filter = data;
        state.database.settings.onlyUnread = filter;
        break;
    }
  };
  plux.createStore("shared", myActionHandler, { "databaseReady": false });    
})();
