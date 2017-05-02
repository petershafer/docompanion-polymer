// A sample actions file.
var shortcuts = (function(){
    var API = {
        'getCounts': function() {
            data = plux.getState("shared");
            if(!data.databaseReady){
                return [];
            }
            counts = {};
            for(var i = 0; i < data.database.content.sections.length; i++){
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
            for(var i = 0; i < data.database.content.sections.length; i++){
                sections.push({
                    "name": data.database.content.sections[i].name,
                    "id": data.database.content.sections[i].id
                });
            }
            return sections;
        },
        'getBookmarks': function() {
            var data = plux.getState("shared");
            var bookmarks = [];
            for(var i = 0; i < data.database.content.sections.length; i++){
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
            var state = plux.getState("shared");
            var section = state.database.content.sections.filter(function(s){
                var item = s.items.filter(function(i){
                    return i.id == id;
                });
                return item.length > 0;
            }).pop();
            var item = section.items.filter((i) => i.id == id).pop();
            return Object.assign({'parent': {'id': section.id, 'name': section.name}, 'content': data.content[id]}, item)
        },
        'getContent': function(id) {
            data = plux.getState("shared");
            return data.content[id] || null;
        },
        'getSection': function(id) {
            var state = plux.getState("shared");
            var section = state.database.content.sections.filter(function(s){
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
                var state = plux.getState("shared");
                if(state.databaseReady){
                     resolve();
                }else{
                    var subscription = plux.subscribe("shared", function(state) { 
                        if(state.databaseReady){
                            subscription.unsubscribe();
                            resolve();
                        }
                    });
                }
            });
        },
        'percentComplete': function() {
            var totals = {'grand': {'available': 0, 'unlocked': 0, 'read': 0}};
            var state = plux.getState("shared");
            state.database.content.sections.forEach(function(section){
                var count = section.items.length;
                var unlocked = section.items.filter((item) => item.available).length;
                var read = section.items.filter((item) => item.available && item.read).length;
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
            var state = plux.getState("shared");
            var context = {
                'prev': {'type': null, 'id': null},
                'next': {'type': null, 'id': null},
                'parent': {'type': 'section', 'id': null, 'name': null}
            };
            var unreadOnly = state.database.settings.onlyUnread;
            var filteredLists = {};
            for(var i = 0; i < state.database.content.sections.length; i++){
                var section = state.database.content.sections[i];
                var filtered = section.items.filter((item) => {
                    if(unreadOnly){
                        return item.available && !item.read;
                    }else{
                        return item.available;
                    }
                });
                // state.database.content.sections[i].items = filtered;
                filteredLists[section.id] = filtered;
            }
            for(var i = 0; i < state.database.content.sections.length; i++){
                var section = state.database.content.sections[i];
                var list = filteredLists[section.id];
                for(var j = 0; j < list.length; j++){
                    var item = list[j];
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
