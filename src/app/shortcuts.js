// Shortcuts provide additional business logic needed to prepare data from
// the state for consumption by the frontend.  No data is manipulated outside
// of Plux, but these functions provide functionality that returns a value
// since actions don't strictly do this, and the raw state isn't always
// sufficient to determine how to act.  At the same time, this code only uses
// the state for data - the frontend does not affect how shortcuts operate.
// This eliminates duplicate code and consolidates it in a way that can be
// used pure JS environment (cross-platform).
var shortcuts = (function(){
  let API = {
    // Consolidates unread counts per section into a list.
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
    // Consolidates section metadata into a simple list.
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
    // Filters items that are bookmarked into a single list.
    'getBookmarks': function() {
      const data = plux.getState("shared");
      let bookmarks = [];
      for(let i = 0; i < data.database.content.sections.length; i++){
        bookmarks = bookmarks.concat(data.database.content.sections[i].items.filter((item) => item.bookmark ));
      }
      bookmarks = bookmarks.map((item) => {
        item.content = data.content[item.id];
        return item;
      });
      return bookmarks;
    },
    // Retrieves item data and content as a single object.
    'getItem': function(id) {
      const state = plux.getState("shared");
      const section = state.database.content.sections.filter((s) => {
        let item = s.items.filter((i) => i.id == id);
        return item.length > 0;
      }).pop();
      const item = section.items.filter((i) => i.id == id).pop();
      return Object.assign({'parent': {'id': section.id, 'name': section.name}, 'content': data.content[id]}, item)
    },
    // Retrieves content for a given item ID.
    'getContent': function(id) {
      data = plux.getState("shared");
      return data.content[id] || null;
    },
    // Retrieves a section and populates each item with its content.
    'getSection': function(id) {
      const state = plux.getState("shared");
      const section = state.database.content.sections.filter((s) => s.id == id).shift();
      section.items = section.items.map((item) => {
        item.content = state.content[item.id];
        return item;
      });
      return section;
    },
    // Returns a promise that resolves when the database has been loaded.
    'databaseLoaded': function() {
      return new Promise((resolve, reject) => {
        const state = plux.getState("shared");
        if(state.databaseReady){
          resolve();
        }else{
          const subscription = plux.subscribe("shared", (state) => { 
            if(state.databaseReady){
              subscription.unsubscribe();
              resolve();
            }
          });
        }
      });
    },
    // Calculates the percent of items unlocked and read per section.
    'percentComplete': function() {
      const totals = {'grand': {'available': 0, 'unlocked': 0, 'read': 0}};
      const state = plux.getState("shared");
      state.database.content.sections.forEach((section) => {
        const count = section.items.length;
        const unlocked = section.items.filter((item) => item.available).length;
        const read = section.items.filter((item) => item.available && item.read).length;
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
    // Retrieves information about an items siblings and parent.
    'itemContext': function(id) {
      const state = plux.getState("shared");
      const context = {
        'prev': {'type': null, 'id': null},
        'next': {'type': null, 'id': null},
        'parent': {'type': 'section', 'id': null, 'name': null}
      };
      const unreadOnly = state.database.settings.onlyUnread;
      const filteredLists = {};
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
        const section = state.database.content.sections[i];
        const list = filteredLists[section.id];
        for(let j = 0; j < list.length; j++){
          const item = list[j];
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
