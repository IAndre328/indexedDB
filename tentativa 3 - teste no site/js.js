// Selecionar os elementos do DOM
const btn_adicionar = document.querySelector("button#adicionar");
const btn_limpar = document.querySelector("#limpar");
const txt = document.querySelector("input#txt");
const res = document.querySelector("#res");

// Array para armazenar as tarefas
let arrayTarefas = [];
// Array para armazenar os alarmes
let alarmes = [];


// Função para extrair o valor de um elemento de entrada (input)
const extrairValorInput = (input) => input.value;

// Função para extrair o elemento p pai de um item
const extrairPDoItem = (item) => item.parentElement.querySelector("p");




// Função para verificar e adicionar uma nova tarefa
function verificarTarefa() {
  const valorInput = extrairValorInput(txt);

  if (valorInput.length > 0 && !arrayTarefas.includes(valorInput)) {
    arrayTarefas.push(valorInput)
    DB_adicionarTarefa(valorInput,false);

  } else if (arrayTarefas.includes(valorInput)) {

    exibirAlerta("Essa tarefa já existe");

  } else if (valorInput.length === 0) {

    exibirAlerta("Insira uma tarefa!");

  }

  txt.value = "";
}





// Função para exibir um alerta em um popup
function exibirAlerta(mensagem) {

    const alerta = criarElemento("p", ["alerta"]);
  
    alerta.textContent = mensagem;
  
    usePopup([alerta]);
  }
  





  // Função para criar um elemento HTML
  function criarElemento(tag, classes = [], func) {
  
    const elemento = document.createElement(tag);
  
    elemento.classList.add(...classes);
  
    if (tag === "button") elemento.onclick = func;
  
    return elemento;
  }
  





  // Função para adicionar uma nova tarefa à lista de tarefas e ao arrayTarefas
  function adicionarTarefa(id,texto,sublinhado) {
    
    const tarefaDiv = criarElemento("div", ["CoisasTarefa"]);

    const tarefaData = criarElemento("data",["tarefa"]);
  
    const tarefaParagrafo = criarElemento("p", ["tarefa"]);
    
    tarefaData.value = id;
    tarefaParagrafo.textContent = texto;

    if(sublinhado)tarefaParagrafo.classList.add("sublinhado");
    
  
    const alarmeBtn = criarElemento("button", ["alarme"],configAlarme);
  
    const sublinharBtn = criarElemento("button", ["sublinhar"],sublinhar);
  
    const excluirBtn = criarElemento("button", ["excluir"],deletar);
  
    adicionarElementos(tarefaData,[tarefaParagrafo]);
    adicionarElementos(tarefaDiv, [tarefaData, alarmeBtn, sublinharBtn, excluirBtn]);
  
  
    res.appendChild(tarefaDiv);
  }





// Função para adicionar múltiplos elementos a um elemento pai
function adicionarElementos(elementoPai, elementosFilhos) {

    elementosFilhos.forEach((elementoFilho) => {
  
      elementoPai.appendChild(elementoFilho);
  
    });
  }



// Função para sublinhar uma tarefa
function sublinhar(e) {
 
    const item = e.target;
    const itemP = extrairPDoItem(item);
  
      itemP.classList.toggle("sublinhado");

    

      DB_atualizarTarefa(
        Number(item.parentElement.querySelector("data").value),
        itemP.textContent,
        itemP.classList.contains("sublinhado")
        )
    
  }



// Função para deletar uma tarefa
function deletar(e) {
    const item = e.target;
    const itemP = item.parentElement;
    console.log(itemP)
    let id = Number(itemP.querySelector("data").value);
    DB_removerTarefa(id);
    itemP.remove();

    // banco de dados aqui

}


// Função para lidar com a configuração do alarme
function configAlarme(e) {
  
    const item = e.target;
  
    const textoItem = extrairPDoItem(item).textContent;
  
    if (item.classList[0] == "alarme") {
  
      const txtDate = criarElemento("input", ["txtDate"]);
      txtDate.type = "datetime-local";
  
      const usoDate = criarElemento("label");
      usoDate.htmlFor = "btn_date";
      usoDate.textContent = "Clique no símbolo da agenda para definir a data!";
  
      const btn_date = criarElemento("button", ["btn_date"]);
      btn_date.textContent = "Configurar";
  
       usePopup([usoDate, txtDate, btn_date], textoItem);
      
    }
  }


  // Função para limpar o conteúdo e redefinir o armazenamento local
function limpar() {
    res.innerHTML = "";
    DB_apagarBancoDeDados();
    

  }




  function usePopup(item = [],nomeTarefa) {
    const divConfigAlarme = criarElemento("div", ["configAlarme"]);
    const popup = criarElemento("div", ["blur"]);
  
    const sair = () => {
      desusePopup(popup);
    };
  
    const esc = (e) => {
      if (e.key === "Escape") {
        sair();
      }
    };
  
    window.addEventListener("keydown", esc);
  
    const btn_fechar = criarElemento("button", ["btn_fechar"], () => {
      sair();
    });
  
    adicionarElementos(document.querySelector("body"), [popup]);
    adicionarElementos(popup, [divConfigAlarme]);
    adicionarElementos(divConfigAlarme, [btn_fechar]);
    adicionarElementos(divConfigAlarme, [...item]);
  
    
    
      const btn_date = item.find((element) => element.classList.contains("btn_date"));
      
      if (btn_date) {
        btn_date.addEventListener("click", () => {
          const txtDate = document.querySelector(".txtDate");
          console.log(txtDate)
          extrairDadosAlarme(txtDate.value, nomeTarefa, sair);
        });
      }
    
    }
  
  // Função para remover um popup
  function desusePopup(popup) {
    popup.remove();
  }




// addEventListeners

  // Função para verificar se a tecla Enter foi pressionada e chamar a função verificarTarefa()
const aoPressionarEnter = evento => {
    if (evento.key === "Enter") {
      verificarTarefa();
    }
  }
  
  // Adicionar eventos de pressionar tecla Enter ao elemento de entrada de texto (txt)
  txt.addEventListener("keydown", aoPressionarEnter);
  
  
  
  // Adicionar eventos de clique aos botões de limpar e adicionar
  btn_limpar.addEventListener("click", limpar);
  btn_adicionar.addEventListener("click", verificarTarefa);

// Adicionar listener para carregar as tarefas salvas
document.addEventListener("DOMContentLoaded",DB_visualizarTodasTarefas)