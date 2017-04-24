plux.subscribe("shared", function(state){
  console.log(state);
});

actions.loadDatabase()


data = plux.getState("shared");
counts = {};
for(var i = 0; i < data.database.content.sections.length; i++){
    counts[data.database.content.sections[i].id] = data.database.content.sections[i].unread;
}
console.log(counts);
