// função para adicionar uma tarefa para o banco de dados
function DB_adicionarTarefa(tarefa, alarme,sublinhado = false) {
    var request = indexedDB.open("TarefasData", 1);

    request.onsuccess = function(event) {
        var db = event.target.result;
        
        var transaction = db.transaction(["tarefas"], "readwrite");
        var store = transaction.objectStore("tarefas");

        var novaTarefa = {
            tarefa: tarefa,
            sublinhado: sublinhado,
            alarme:alarme
        };

        var addRequest = store.add(novaTarefa);

        addRequest.onsuccess = function(event) {
            console.log("Tarefa adicionada com sucesso.");
        };

        addRequest.onerror = function(event) {
            console.error("Erro ao adicionar a tarefa: " + event.target.error);
        };
    };
}
