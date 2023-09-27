const banco = {
    nome:"BancoEstudos",
    versao:1
}

const request = window.indexedDB.open(banco.nome,banco.versao);
const atalhoDB = event => event.target.result;

request.onupgradeneeded = function (event){
    const db = atalhoDB(event);

    // criando um lugar para guardar meus dados
    const tarefasStore = db.createObjectStore("tarefas",{ keyPath:"Id", autoIncrement:true});

    // criando as tabelas
    tarefasStore.createIndex("tarefa","tarefa",{ unique:true });
    tarefasStore.createIndex("sublinhado","sublinhado",{unique:false});
    tarefasStore.createIndex("alarme","alarme",{unique:false});

    console.log("Banco criado com sucesso");
    
}
// caso a conexão dê certo
request.onsuccess = function(event){
    var db = atalhoDB(event);
    console.log(db)
    console.log("Deu certo ao abrir =)");
}
// caso a conexão dê errado
request.onerror = function(event){
    console.error("Deu errado, olha só: "+event.target.error)
}

function adicionarTarefaDB(tarefa,sublinhado = false){
    const requerir = window.indexedDB.open(banco.nome,banco.versao);

    requerir.onsuccess = function(event){
        const db = atalhoDB(event);

        // criando uma transação de ler e escrever
        const transaction = db.transaction(["tarefas"],"readwrite");

        // atribuindo a transação ao objectStore tarefas
        const store = transaction.objectStore("tarefas");

        // o que será guardado
        var novaTarefa = {
            tarefa: tarefa,
            sublinhado: sublinhado
        };

        // guardar em uma varíavel para manipular erro e acerto
       let addRequest = store.add(novaTarefa)

       addRequest.onsuccess = function(event) {
        console.log("Tarefa adicionada com sucesso.");
        console.table(db);
    };

    addRequest.onerror = function(event) {
        console.error("Erro ao adicionar a tarefa: " + event.target.error);
    };
    }

}