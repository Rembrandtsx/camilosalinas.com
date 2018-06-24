var data = [];
$.getJSON("../json/data-timeline.json",  (jsonData)=> {

    data = jsonData;
    let elementos = data["events"];
    for(let key in elementos){
        console.log(elementos[key].src)
    }

});
