const operacoes = ['+', '-', '*', '/'];
let tentativas = 0;
let acertosTotais = 0;
let respostaGlobal; // Variável para a função de verificação enxergar

// Elementos do DOM
const contaElemento = document.getElementById('continhas');
const opcoesElemento = document.getElementById('opcoes');
const modal = document.getElementById('modal-game-over');
const textoAcertos = document.getElementById('total-acertos');
const textoRecorde = document.getElementById('recorde-pessoal');

function gerarConta() {
    opcoesElemento.innerHTML = ''; // Limpa botões antigos
    const op = operacoes[Math.floor(Math.random() * operacoes.length)];
    let n1, n2;

    if (op === '+') {
        n1 = Math.floor(Math.random() * 101);
        n2 = Math.floor(Math.random() * 101);
        respostaGlobal = n1 + n2;
        contaElemento.innerHTML = `${n1} + ${n2}`;
    } 
    else if (op === '-') {
        n1 = Math.floor(Math.random() * 101);
        n2 = Math.floor(Math.random() * 101);
        if (n1 < n2) [n1, n2] = [n2, n1]; 
        respostaGlobal = n1 - n2;
        contaElemento.innerHTML = `${n1} - ${n2}`;
    } 
    else if (op === '*') {
        n1 = Math.floor(Math.random() * 11);
        n2 = Math.floor(Math.random() * 11);
        respostaGlobal = n1 * n2;
        contaElemento.innerHTML = `${n1} x ${n2}`;
    }
    else if (op === '/') {
        let resTemp = Math.floor(Math.random() * 10) + 1;
        n2 = Math.floor(Math.random() * 10) + 1;
        n1 = resTemp * n2;
        respostaGlobal = resTemp;
        contaElemento.innerHTML = `${n1} ÷ ${n2}`;
    }

    criarBotoes(respostaGlobal);
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
        if(somAcerto) somAcerto.play();
        
        // Bloqueia cliques nos outros botões para não clicar duas vezes
        opcoesElemento.style.pointerEvents = 'none';

        setTimeout(() => {
            opcoesElemento.style.pointerEvents = 'all';
            gerarConta();
        }, 2000);
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
    tentativas = 0;
    acertosTotais = 0;
    modal.style.display = 'none';
    gerarConta();
}

// Inicia o jogo
gerarConta();