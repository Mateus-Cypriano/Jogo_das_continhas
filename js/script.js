const operacoes = ['+', '-', '*', '/'];
let tentativas = 0;
let acertosTotais = 0;
let respostaGlobal; // Variável para a função de verificação enxergar
let nivelAtual = 1;
let questoesNoNivel = 0;
const metaQuestoes = 10;

// Elementos do DOM
const contaElemento = document.getElementById('continhas');
const opcoesElemento = document.getElementById('opcoes');
const modal = document.getElementById('modal-game-over');
const textoAcertos = document.getElementById('total-acertos');
const textoRecorde = document.getElementById('recorde-pessoal');

function gerarConta() {
    opcoesElemento.innerHTML = ''; // Limpa botões antigos
    let n1, n2, op;

    //Define a dificuldade baseada no Nível
    switch(nivelAtual) {
        case 1: // Soma e Subtração simples
            op = ['+', '-'][Math.floor(Math.random() * 2)];
            n1 = Math.floor(Math.random() * 20) + 1;
            n2 = Math.floor(Math.random() * 20) + 1;
            break;
        case 2: // Soma e Subtração até 50
            op = ['+', '-'][Math.floor(Math.random() * 2)];
            n1 = Math.floor(Math.random() * 50) + 1;
            n2 = Math.floor(Math.random() * 50) + 1;
            break;
        case 3: // Soma e Subtração até 100
            op = ['+', '-'][Math.floor(Math.random() * 2)];
            n1 = Math.floor(Math.random() * 101);
            n2 = Math.floor(Math.random() * 101);
            break;
        case 4: // Introdução a Multiplicação
            op = '*';
            n1 = Math.floor(Math.random() * 11);
            n2 = Math.floor(Math.random() * 11);
            break;
        case 5: // Introdução a Divisão;
            op = '/';
            let resTemp = Math.floor(Math.random() * 10) + 1;
            n2 = Math.floor(Math.random() * 10) + 1;
            n1 = resTemp * n2;
            respostaGlobal = resTemp;
            break;
        default: // Nivel 6+: Todas operações misturadas;
            op = operacoes[Math.floor(Math.random() * 4)];
            n1 = Math.floor(Math.random() * 101);
            n2 = Math.floor(Math.random() * 11);

    }

    if (op === '+') { respostaGlobal = n1 + n2; contaElemento.innerHTML = `${n1} + ${n2}`; }
    else if (op === '-') { 
        if (n1 < n2) [n1, n2] = [n2, n1];
        respostaGlobal = n1 - n2; 
        contaElemento.innerHTML = `${n1} - ${n2}`; 
    }
    else if (op === '*') { respostaGlobal = n1 * n2; contaElemento.innerHTML = `${n1} x ${n2}`; }
    else if (op === '/') { 
        if (nivelAtual < 4) { /* já calculado acima */ }
        else {
            let resT = Math.floor(Math.random() * 10) + 1;
            n2 = Math.floor(Math.random() * 10) + 1;
            n1 = resT * n2;
            respostaGlobal = resT;
        }
        contaElemento.innerHTML = `${n1} ÷ ${n2}`;
    }

    document.getElementById('level_display').innerText = `Nível ${nivelAtual}`;
    criarBotoes(respostaGlobal);
}

function atualizarBarra() { 
    const porcentagem = (questoesNoNivel / metaQuestoes) * 100;
    console.log("Progresso:", porcentagem + "%"); // Isso vai aparecer no F12 do navegador
    
    const elemento = document.getElementById('progress_bar');
    elemento.style.width = `${porcentagem}%`;
    
}

function criarBotoes(correta) {
    // Gerar as opções (Resposta, Invertido, Vizinho +1, Vizinho -1)
    let lista = [correta, correta + 1, correta - 1, correta, correta + 3];
    
    // Remove duplicados e embaralha
    lista = [...new Set(lista)].sort(() => Math.random() - 0.5);

    lista.forEach(valor => {
        const btn = document.createElement('button');
        btn.innerText = valor;
        btn.onclick = () => verificarResposta(valor, btn);
        opcoesElemento.appendChild(btn);
    });
}

function verificarResposta(selecionado, botao) {
    const somAcerto = document.getElementById('som-acerto');
    const somErro = document.getElementById('som-erro');

    if (selecionado === respostaGlobal) {
        botao.classList.add('btn-correto');
        acertosTotais++;
        questoesNoNivel++;
        atualizarBarra();
        if(somAcerto) somAcerto.play();

        if (questoesNoNivel >= metaQuestoes) {
            nivelAtual++;
            questoesNoNivel = 0;
            
            setTimeout(() => {
                alert(`Parabéns! Você subiu de Nível e agora está no Nível ${nivelAtual}`);
                atualizarBarra(); //Reseta Barra;
                opcoesElemento.style.pointerEvents = 'all';
                gerarConta(); // Gera a primeira conta do novo nível
            }, 1000);

        } else {
            setTimeout(() => {
                opcoesElemento.style.pointerEvents= 'all';
                gerarConta();
            }, 1500);
        }
        
    } else {
        tentativas++;
        botao.classList.add('btn-errado');
        botao.disabled = true; // Desativa o botão errado clicado
        if(somErro) somErro.play();

        if (tentativas >= 3) {
            finalizarJogo();

        }
    }
}

function finalizarJogo() {
    let recordeAtual = localStorage.getItem('recordeJoao') || 0;
    if (acertosTotais > recordeAtual) {
        localStorage.setItem('recordeJoao', acertosTotais);
        recordeAtual = acertosTotais;
    }
    modal.style.display = 'flex';
    textoAcertos.innerHTML = `Acertos: <strong>${acertosTotais}</strong>`;
    textoRecorde.innerHTML = `Melhor marca: <strong>${recordeAtual}</strong> 🏆`;
}
function reiniciarJogo() {
    acertosTotais = 0;
    tentativas = 0;
    questoesNoNivel = 0; 
    nivelAtual = 1;
    
    modal.style.display = 'none';
    atualizarBarra();
    
    gerarConta();
}

// Inicia o jogo
gerarConta();