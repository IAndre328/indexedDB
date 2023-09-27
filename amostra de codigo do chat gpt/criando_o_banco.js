// Abrir ou criar o banco de dados "TarefasData"
var request = indexedDB.open("TarefasData", 1);

// Manipulador de evento de atualização chamado quando o banco de dados precisa ser criado ou atualizado
request.onupgradeneeded = function(event) {
    var db = event.target.result;

    // Cria uma tabela chamada "tarefas" com um índice automático
    var tarefasStore = db.createObjectStore("tarefas", { keyPath: "id", autoIncrement: true });

    // Define os campos que você deseja armazenar na tabela
    tarefasStore.createIndex("tarefa", "tarefa", { unique: false });
    tarefasStore.createIndex("sublinhado", "sublinhado", { unique: false });

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
