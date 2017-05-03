var shortcuts = (function(){
  let API = {
    'getCounts': function() {
      data = plux.getState("shared");
      if(!data.databaseReady){
        return [];
      }
      counts = {};
      for(let i = 0; i < data.database.content.sections.length; i++){
        counts[data.database.content.sections[i].id] = data.database.content.sections[i].unread;
      }
      return counts;
    },
    'getSections': function() {
      data = plux.getState("shared");
      if(!data.databaseReady){
        return [];
      }
      sections = [];
      for(let i = 0; i < data.database.content.sections.length; i++){
        sections.push({
          "name": data.database.content.sections[i].name,
          "id": data.database.content.sections[i].id
        });
      }
      return sections;
    },
    'getBookmarks': function() {
      let data = plux.getState("shared");
      let bookmarks = [];
      for(let i = 0; i < data.database.content.sections.length; i++){
        bookmarks = bookmarks.concat(data.database.content.sections[i].items.filter(function(item){
          return item.bookmark;
        }));
      }
      bookmarks = bookmarks.map(function(item){
        item.content = data.content[item.id];
        return item;
      });
      return bookmarks;
    },
    'getItem': function(id) {
      let state = plux.getState("shared");
      let section = state.database.content.sections.filter(function(s){
        let item = s.items.filter(function(i){
          return i.id == id;
        });
        return item.length > 0;
      }).pop();
      let item = section.items.filter((i) => i.id == id).pop();
      return Object.assign({'parent': {'id': section.id, 'name': section.name}, 'content': data.content[id]}, item)
    },
    'getContent': function(id) {
      data = plux.getState("shared");
      return data.content[id] || null;
    },
    'getSection': function(id) {
      let state = plux.getState("shared");
      let section = state.database.content.sections.filter(function(s){
        return s.id == id;
      }).shift();
      section.items = section.items.map(function(item){
        item.content = state.content[item.id];
        return item;
      });
      return section;
    },
    'databaseLoaded': function() {
      return new Promise((resolve, reject) => {
        let state = plux.getState("shared");
        if(state.databaseReady){
          resolve();
        }else{
          let subscription = plux.subscribe("shared", function(state) { 
            if(state.databaseReady){
              subscription.unsubscribe();
              resolve();
            }
          });
        }
      });
    },
    'percentComplete': function() {
      let totals = {'grand': {'available': 0, 'unlocked': 0, 'read': 0}};
      let state = plux.getState("shared");
      state.database.content.sections.forEach(function(section){
        let count = section.items.length;
        let unlocked = section.items.filter((item) => item.available).length;
        let read = section.items.filter((item) => item.available && item.read).length;
        totals.grand.available += count;
        totals.grand.unlocked += unlocked;
        totals.grand.read += read;
        totals[section.id] = {
          'available': count, 
          'unlocked': unlocked, 
          'read': read, 
          'percentUnlocked': Math.floor((unlocked/count)*100),
          'percentRead': Math.floor((read/count)*100)
        };
      });
      totals.grand.percentUnlocked = Math.floor((totals.grand.unlocked/totals.grand.available)*100);
      totals.grand.percentRead = Math.floor((totals.grand.read/totals.grand.available)*100);
      return totals;
    },
    'itemContext': function(id) {
      let state = plux.getState("shared");
      let context = {
        'prev': {'type': null, 'id': null},
        'next': {'type': null, 'id': null},
        'parent': {'type': 'section', 'id': null, 'name': null}
      };
      let unreadOnly = state.database.settings.onlyUnread;
      let filteredLists = {};
      for(let i = 0; i < state.database.content.sections.length; i++){
        let section = state.database.content.sections[i];
        let filtered = section.items.filter((item) => {
          if(unreadOnly){
            return item.available && !item.read;
          }else{
            return item.available;
          }
        });
        filteredLists[section.id] = filtered;
      }
      for(let i = 0; i < state.database.content.sections.length; i++){
        let section = state.database.content.sections[i];
        let list = filteredLists[section.id];
        for(let j = 0; j < list.length; j++){
          let item = list[j];
          // Find Prev
          if(item.id == id && j == 0){
            context.prev.type = "section";
            context.prev.id = section.id;
          }else if(item.id == id){
            context.prev.type = "item";
            context.prev.id = list[j-1].id;
          }
          // Find Next
          if(item.id == id && j + 1 == list.length && i + 1 < state.database.content.sections.length){
            context.next.type = "section";
            context.next.id = state.database.content.sections[i+1].id;
          }else if(item.id == id && j + 1 < list.length){
            context.next.type = "item";
            context.next.id = list[j+1].id;
          }
          // Add parent info
          if(item.id == id){
            context.parent.id = section.id;
            context.parent.name = section.name;
          }
        }
      }
      return context;
    }
  };
  return API;
})();
