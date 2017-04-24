var hashsection = new Hashids('compoanionsection', 4, '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
hashsection.encode(1);
var hashitem = new Hashids('companionitem', 4, '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
hashitem.encode(1);



items = src.split("\n");
JSON.stringify(items.map(function(item){
  return {
    "id": item,
    "read": false,
    "available": false,
  }
}));

