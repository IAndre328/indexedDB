function visualizarTodasTarefas() {
    var request = indexedDB.open("TarefasData", 1);

    request.onsuccess = function(event) {
        var db = event.target.result;

        // Inicie uma transação de leitura na tabela "tarefas"
        var transaction = db.transaction(["tarefas"], "readonly");
        var store = transaction.objectStore("tarefas");

        // Abra um cursor para iterar pelos registros
        var cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                var tarefa = cursor.value;
                console.log("ID: " + cursor.key);
                console.log("Tarefa: " + tarefa.tarefa);
                console.log("Sublinhado: " + tarefa.sublinhado);
                console.log("-----------");
                cursor.continue(); // Continue para o próximo registro
            } else {
                console.log("Fim da lista de tarefas.");
            }
        };

        cursorRequest.onerror = function(event) {
            console.error("Erro ao abrir o cursor: " + event.target.error);
        };
    };

    request.onerror = function(event) {
        console.error("Erro ao abrir o banco de dados 'TarefasData': " + event.target.error);
    };
}

// Chame a função para visualizar as tarefas
visualizarTodasTarefas();
