function removerTarefa(id) {
    var request = indexedDB.open("TarefasData", 1);

    request.onsuccess = function(event) {
        var db = event.target.result;
        
        var transaction = db.transaction(["tarefas"], "readwrite");
        var store = transaction.objectStore("tarefas");

        var deleteRequest = store.delete(id);

        deleteRequest.onsuccess = function(event) {
            console.log("Tarefa removida com sucesso.");
        };

        deleteRequest.onerror = function(event) {
            console.error("Erro ao remover a tarefa: " + event.target.error);
        };
    };
}
