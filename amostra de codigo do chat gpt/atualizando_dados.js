function atualizarTarefa(id, novaTarefa, novoSublinhado) {
    var request = indexedDB.open("TarefasData", 1);

    request.onsuccess = function(event) {
        var db = event.target.result;
        
        var transaction = db.transaction(["tarefas"], "readwrite");
        var store = transaction.objectStore("tarefas");

        var getRequest = store.get(id);

        getRequest.onsuccess = function(event) {
            var tarefa = event.target.result;
            if (tarefa) {
                tarefa.tarefa = novaTarefa;
                tarefa.sublinhado = novoSublinhado;
                var updateRequest = store.put(tarefa);

                updateRequest.onsuccess = function(event) {
                    console.log("Tarefa atualizada com sucesso.");
                };

                updateRequest.onerror = function(event) {
                    console.error("Erro ao atualizar a tarefa: " + event.target.error);
                };
            } else {
                console.error("Tarefa não encontrada.");
            }
        };

        getRequest.onerror = function(event) {
            console.error("Erro ao buscar a tarefa: " + event.target.error);
        };
    };
}
