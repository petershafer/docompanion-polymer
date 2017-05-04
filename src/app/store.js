(function(){
  let myActionHandler = function(action, data, state){
    let code;
    switch(action){
      case "loadDatabase":
        state.loadingDB = true;
        let p1 = fetch('/src/app/database.json');
        let p2 = fetch('/src/app/prettycontent.json');
        Promise.all([p1, p2]).then((values) => {
          const p1 = values[0].json();
          const p2 = values[1].json();
          Promise.all([p1, p2]).then((objs) => {
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
        code = data;
        for(let i = 0; i < state.database.content.sections.length; i++){
          for(let j = 0; j < state.database.content.sections[i].items.length; j++){
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
        code = data;
        for(let i = 0; i < state.database.content.sections.length; i++){
          if(state.database.content.sections[i].id == code){
            for(let j = 0; j < state.database.content.sections[i].items.length; j++){
              state.database.content.sections[i].items[j].read = true;
              state.database.content.sections[i].unread--;
            }
          }
        }
        break;
      case "addItem":
        code = data;
        for(let i = 0; i < state.database.content.sections.length; i++){
          for(let j = 0; j < state.database.content.sections[i].items.length; j++){
            if(state.database.content.sections[i].items[j].id == code){
              state.database.content.sections[i].items[j].available = true;
              state.database.content.sections[i].unread++;
            }
          }
        }
        break;
      case "bookmark":
        code = data.item;
        const value = data.value;
        for(let i = 0; i < state.database.content.sections.length; i++){
          for(let j = 0; j < state.database.content.sections[i].items.length; j++){
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
        for(let i = 0; i < state.database.content.sections.length; i++){
          for(let j = 0; j < state.database.content.sections[i].items.length; j++){
            state.database.content.sections[i].items[j].available = true;
            state.database.content.sections[i].unread++;
          }
        }
        break;
      case "debugAddSection":
        code = data;
        for(let i = 0; i < state.database.content.sections.length; i++){
          if(state.database.content.sections[i].id == code){
            for(let j = 0; j < state.database.content.sections[i].items.length; j++){
              state.database.content.sections[i].items[j].available = true;
              state.database.content.sections[i].unread++;
            }
          }
        }
        break;
      case "updateFilter":
        const filter = data;
        state.database.settings.onlyUnread = filter;
        break;
    }
  };
  plux.createStore("shared", myActionHandler, { "databaseReady": false });    
})();
