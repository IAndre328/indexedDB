let indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
let IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;

let versaoBanco = 1;
// Abrir ou criar o banco de dados "TarefasData"
if ("indexedDB" in window){
    let request = indexedDB.open("TarefasData", `${versaoBanco}`);

    // Manipulador de evento de atualização chamado quando o banco de dados precisa ser criado ou atualizado
    request.onupgradeneeded = function(event) {
        let db = event.target.result;


        if (!db.objectStoreNames.contains('tarefas')) {
            // Cria uma tabela chamada "tarefas" com um índice automático
            let tarefasStore = db.createObjectStore("tarefas", { keyPath: "id", autoIncrement: true });

            // Define os campos que você deseja armazenar na tabela
            tarefasStore.createIndex("tarefa", "tarefa", { unique: true });
            tarefasStore.createIndex("sublinhado", "sublinhado", { unique: false });
            tarefasStore.createIndex("alarme","alarme",{unique:false})
        }


        console.log("Banco de dados 'TarefasData' criado com sucesso.");
        // interface amigável para autorizar o indexeddb
        exibirAlerta("Obrigado por autorizar o indexeddb, iremos usar =)")

    };

// Manipulador de evento de sucesso chamado quando a conexão com o banco de dados é estabelecida
    request.onsuccess = function(event) {
        let db = event.target.result;

        

    // Agora você pode começar a usar o banco de dados para inserir, recuperar, atualizar ou excluir dados.
    };

// Manipulador de evento de erro chamado em caso de falha na abertura ou criação do banco de dados
    request.onerror = function(event) {
        console.error("Erro ao abrir/criar o banco de dados 'TarefasData': " + event.target.error);
        exibirAlerta("Erro ao abrir/criar o banco de dados 'TarefasData': " + event.target.error);
    };
    } else{
        exibirAlerta("IndexedDb não está disponível =( precisaríamos dele");
    }







function DB_adicionarTarefa(tarefa, sublinhado = false, alarme = null) {
    let request = indexedDB.open("TarefasData", `${versaoBanco}`);

    request.onsuccess = function (event) {
        let db = event.target.result;

        let transaction;
        if (window.webkitIDBTransaction && IDBTransaction.READ_WRITE) {
            transaction = db.transaction(["tarefas"], IDBTransaction.READ_WRITE);
        } else {
            transaction = db.transaction(["tarefas"], "readwrite");
        }

        let store = transaction.objectStore("tarefas");

        let novaTarefa = {
            tarefa: tarefa,
            sublinhado: sublinhado,
            alarme: alarme,
        };
        console.log(novaTarefa.alarme)
        let addRequest = store.add(novaTarefa);

        addRequest.onsuccess = function (event) {
            console.log("Tarefa adicionada com sucesso.");
            DB_buscarTarefaPorNome(tarefa);
        };

        addRequest.onerror = function (event) {
            console.error("Erro ao adicionar a tarefa: " + event.target.error);
        };
    };
}




// função para atualizar algum dado 
function DB_atualizarTarefa(id, novaTarefa, novoSublinhado, novoAlarme) {

    if (novaTarefa){
        if (novaTarefa.trim() == ""){
        exibirAlerta("Não deixe um campo de tarefa vazio!!");
        return;
        }
    }

    let request = indexedDB.open("TarefasData", `${versaoBanco}`);

    request.onsuccess = function(event) {
        let db = event.target.result;
        
        let transaction;
        if (window.webkitIDBTransaction && IDBTransaction.READ_WRITE) {
            transaction = db.transaction(["tarefas"], IDBTransaction.READ_WRITE);
        } else {
            transaction = db.transaction(["tarefas"], "readwrite");
        }
        
        let store = transaction.objectStore("tarefas");
        let getRequest = store.get(id);

        getRequest.onsuccess = function(event) {
            let tarefa = event.target.result;
            if (tarefa) {

                if (novaTarefa)tarefa.tarefa = novaTarefa;
                if (novoSublinhado)tarefa.sublinhado = novoSublinhado;
                if (novoAlarme){
                    tarefa.alarme = novoAlarme;
                    alarmes.push({
                        corpo:novaTarefa,
                        alarme:novoAlarme,
                    });
                }
                    
                let updateRequest = store.put(tarefa);

                updateRequest.onsuccess = function(event) {
                    console.log("Tarefa atualizada com sucesso.");
                };

                updateRequest.onerror = function(event) {
                    exibirAlerta("Não coloque tarefas inválidas ou repetidas. Essas não serão salvas!")
                    console.error("Erro ao atualizar a tarefa: " + event.target.error);
                };
            } 
            else {
                console.error("Tarefa não encontrada.");
            }
        };

        getRequest.onerror = function(event) {
            console.error("Erro ao buscar a tarefa: " + event.target.error);
        };
    };
}


function DB_removerTarefa(id) {
    let request = indexedDB.open("TarefasData", `${versaoBanco}`);

    request.onsuccess = function(event) {
        let db = event.target.result;
        
        let transaction;
        if (window.webkitIDBTransaction && IDBTransaction.READ_WRITE) {
            transaction = db.transaction(["tarefas"], IDBTransaction.READ_WRITE);
        } else {
            transaction = db.transaction(["tarefas"], "readwrite");
        }
        
        let store = transaction.objectStore("tarefas");
        let deleteRequest = store.delete(id);

        deleteRequest.onsuccess = function(event) {
            console.log("Tarefa removida com sucesso.");
        };

        deleteRequest.onerror = function(event) {
            console.error("Erro ao remover a tarefa: " + event.target.error);
        };
    };
}



function DB_visualizarTodasTarefas(logonly = false) {
    let request = indexedDB.open("TarefasData", `${versaoBanco}`);

    request.onsuccess = function(event) {
        let db = event.target.result;

        // Inicie uma transação de leitura na tabela "tarefas"
        let transaction;
        if (window.webkitIDBTransaction && IDBTransaction.READ_ONLY) {
            transaction = db.transaction(["tarefas"], IDBTransaction.READ_ONLY);
        } else {
            transaction = db.transaction(["tarefas"], "readonly");
        }
        
        let store = transaction.objectStore("tarefas");

        // Abra um cursor para iterar pelos registros
        let cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function(event) {
            let cursor = event.target.result;
            if (cursor) {
                let tarefa = cursor.value;

                let objetoTarefa = {
                    id: cursor.key,
                    tarefa:tarefa.tarefa,
                    sublinhado:tarefa.sublinhado,
                    alarme:tarefa.alarme,
                }

                if (logonly == true){

                    console.table(objetoTarefa)

                } else {

                    adicionarTarefa(objetoTarefa.id, objetoTarefa.tarefa, objetoTarefa.sublinhado);
                    arrayTarefas.push(objetoTarefa.tarefa);

                    if(objetoTarefa.alarme){

                        alarmes.push({
                            corpo:objetoTarefa.tarefa,
                            alarme:objetoTarefa.alarme,
                        });
                        
                    }

                }

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



function DB_buscarTarefaPorNome(nomeTarefa) {
    let request = indexedDB.open("TarefasData", `${versaoBanco}`);
    
    
    request.onsuccess = function(event) {
        let db = event.target.result;

        // Inicie uma transação de leitura na tabela "tarefas"
        let transaction;
        if (window.webkitIDBTransaction && IDBTransaction.READ_ONLY) {
            transaction = db.transaction(["tarefas"], IDBTransaction.READ_ONLY);
        } else {
            transaction = db.transaction(["tarefas"], "readonly");
        }
        let store = transaction.objectStore("tarefas");

        // Use o índice "indice_tarefa" para buscar pelo nome da tarefa
        let index = store.index("tarefa");
        let getRequest = index.get(nomeTarefa);

        
        

        getRequest.onsuccess = function(event) {
          let tarefa = event.target.result;
            if (tarefa) {

                // console.log("ID: " + tarefa.id);
                // console.log("Tarefa: " + tarefa.tarefa);
                // console.log("Sublinhado: " + tarefa.sublinhado);
                // console.log(tarefa)

                let resultado = {
                    id:tarefa.id,
                    tarefa:tarefa.tarefa,
                    sublinhado:tarefa.sublinhado,
                    }

                    adicionarTarefa(resultado.id,resultado.tarefa,resultado.sublinhado)

                } 
                else {
                console.log("Tarefa com nome '" + nomeTarefa + "' não encontrada.");
            }
            
        };
        
        getRequest.onerror = function(event) {
            console.error("Erro ao buscar a tarefa por nome: " + event.target.error);
        };
        
    };
    request.onerror = function(event) {
        console.error("Erro ao abrir o banco de dados 'TarefasData': " + event.target.error);
    };
     
}

function DB_buscarTarefaPorId(id){
    // Abra a conexão com o IndexedDB e abra o object store
const request = indexedDB.open('TarefasData', `${versaoBanco}`);

request.onerror = function(event) {
    console.error("Erro ao abrir a base de dados: " + event.target.errorCode);
};

request.onsuccess = function(event) {
    const db = event.target.result;
     
    let transaction;
        if (window.webkitIDBTransaction && IDBTransaction.READ_ONLY) {
            transaction = db.transaction(["tarefas"], IDBTransaction.READ_ONLY);
        } else {
            transaction = db.transaction(["tarefas"], "readonly");
        }
        let store = transaction.objectStore("tarefas");

    const getRequest = store.get(id);

    getRequest.onsuccess = function(event) {
        const resultado = event.target.result;
        if (resultado) {
            console.log("Dado encontrado:", resultado);
            
        } else {
            console.log("Dado com ID " + id + " não encontrado.");
        }
    };

    getRequest.onerror = function(event) {
        console.error("Erro ao buscar o dado: " + event.target.error);
    };
};

}


function DB_apagarBancoDeDados(){
    const nomeDoBancoDeDados = "TarefasData";

    const request = indexedDB.deleteDatabase(nomeDoBancoDeDados);

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

