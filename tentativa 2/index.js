const request = window.indexedDB.open("BancoEstudos",1)
const atalhoDB = event => event.target.result;

request.onupgradeneeded = function (event){
    const db = atalhoDB(event);

    const tarefasStore = db.createObjectStore("tarefas",{ keyPath:"Id", autoIncrement:true});

    tarefasStore.createIndex("tarefa","tarefa",{ unique:true });
    tarefasStore.createIndex("sublinhado","sublinhado",{unique:false});
    tarefasStore.createIndex("alarme","alarme",{unique:false});

    console.log("Banco criado com sucesso");
    
}

request.onsuccess = function(event){
    var db = atalhoDB(event);
    console.log(db)
    console.log("Deu certo ao abrir =)");
}

request.onerror = function(event){
    console.error("Deu errado, olha só: "+event.target.error)
}