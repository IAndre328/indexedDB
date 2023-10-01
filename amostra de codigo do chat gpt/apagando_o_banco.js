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

