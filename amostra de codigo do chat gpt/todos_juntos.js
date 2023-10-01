// Abrir ou criar o banco de dados "TarefasData"
var request = indexedDB.open("TarefasData", 1);

// Manipulador de evento de atualização chamado quando o banco de dados precisa ser criado ou atualizado
request.onupgradeneeded = function(event) {
    var db = event.target.result;

    // Cria uma tabela chamada "tarefas" com um índice automático
    var tarefasStore = db.createObjectStore("tarefas", { keyPath: "id", autoIncrement: true });

    // Define os campos que você deseja armazenar na tabela
    tarefasStore.createIndex("tarefa", "tarefa", { unique: true });
    tarefasStore.createIndex("sublinhado", "sublinhado", { unique: false });
    tarefasStore.createIndex("alarme","alarme",{unique:false})

    console.log("Banco de dados 'TarefasData' criado com sucesso.");
};

// Manipulador de evento de sucesso chamado quando a conexão com o banco de dados é estabelecida
request.onsuccess = function(event) {
    var db = event.target.result;
    console.log("Conexão com o banco de dados 'TarefasData' estabelecida com sucesso.");

    // Agora você pode começar a usar o banco de dados para inserir, recuperar, atualizar ou excluir dados.
};

// Manipulador de evento de erro chamado em caso de falha na abertura ou criação do banco de dados
request.onerror = function(event) {
    console.error("Erro ao abrir/criar o banco de dados 'TarefasData': " + event.target.error);
};


function adicionarTarefa(tarefa,alarme ,sublinhado = false) {
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


function atualizarTarefa(id, novaTarefa, novoSublinhado = false) {
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
                console.table(tarefa);
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

// apagando o banco de dados

function apagarBancoDeDados(){
    var nomeDoBancoDeDados = "TarefasData";

var request = indexedDB.deleteDatabase(nomeDoBancoDeDados);

request.onsuccess = function(event) {
    console.log("Banco de dados '" + nomeDoBancoDeDados + "' excluído com sucesso.");
};

request.onerror = function(event) {
    console.error("Erro ao excluir o banco de dados '" + nomeDoBancoDeDados + "': " + event.target.error);
};

request.onblocked = function(event) {
    console.warn("O banco de dados '" + nomeDoBancoDeDados + "' está bloqueado por outra transação.");
};


}



// Chame a função para visualizar as tarefas
visualizarTodasTarefas();
