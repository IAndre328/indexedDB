// Selecionar os elementos do DOM
const btn_adicionar = document.querySelector("button#adicionar");
const btn_limpar = document.querySelector("#limpar");
const txt = document.querySelector("input#txt");
const res = document.querySelector("#res");
const dataAtual = new Date();

// Array para armazenar os alarmes
let alarmes = [];

// Array para armazenar as tarefas
let arrayTarefas = [];

// Função para extrair o valor de um elemento de entrada (input)
const extrairValorInput = (input) => input.value;

// Função para extrair o elemento p pai de um item
const extrairPDoItem = (item) => item.parentElement.querySelector("p");



// Função para verificar e adicionar uma nova tarefa
function verificarTarefa() {
  const valorInput = extrairValorInput(txt);

  if (valorInput.length > 0 && !arrayTarefas.includes(valorInput)) {
    DB_adicionarTarefa(valorInput,false);
    arrayTarefas.push(valorInput);

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

    tarefaParagrafo.contentEditable = true;
    tarefaParagrafo.spellcheck = false;

    if(sublinhado)tarefaParagrafo.classList.add("sublinhado");
    
    tarefaParagrafo.addEventListener("input",()=>{
      DB_atualizarTarefa(id,tarefaParagrafo.textContent,sublinhado)
    }) 
  
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

    let id = Number(itemP.querySelector("data").value);
    DB_removerTarefa(id);

    itemP.remove();

}


// Função para lidar com a configuração do alarme
function configAlarme(e) {
  
    const item = e.target;
   
    const idItem = Number(item.parentElement.querySelector("data").value);
  
  
      const txtDate = criarElemento("input", ["txtDate"]);
      txtDate.type = "datetime-local";
  
      const usoDate = criarElemento("label");
      usoDate.htmlFor = "btn_date";
      usoDate.textContent = "Clique no símbolo da agenda para definir a data!";
  
      const btn_date = criarElemento("button", ["btn_date"],()=>{
      
        const txtDate = document.querySelector(".txtDate");
          let datatxt = new Date(txtDate.value);

          if (!txtDate.value == "" || datatxt - dataAtual > 0 ){
            DB_buscarTarefaPorId(idItem);
          } else return;

        
      });
      btn_date.textContent = "Configurar";
  
       usePopup([usoDate, txtDate, btn_date], idItem);
      
    
  }

// Função para inserir alarme


  // Função para limpar o conteúdo e redefinir o armazenamento local
function limpar() {
    res.innerHTML = "";

    DB_apagarBancoDeDados();

    window.location.reload();

  }



  function usePopup(item = [],id = "") {
    const divPopUp = criarElemento("div", ["popup"]);
    const blurPopUp = criarElemento("div", ["blur"]);

    if (id != "")blurPopUp.setAttribute("value",id)
  
    const sair = () => {
      desusePopup(blurPopUp);
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
  
    adicionarElementos(document.querySelector("body"), [blurPopUp]);
    adicionarElementos(blurPopUp, [divPopUp]);
    adicionarElementos(divPopUp, [btn_fechar]);
    adicionarElementos(divPopUp, [...item]);
  
    
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