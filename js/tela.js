import { jogo } from "./jogo.js";
export class tela {
    constructor() {
        this.imagens = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png',];
        this.imagem = document.getElementById('imagem');
        this.tecladoVirtual = document.getElementById('teclado');
        this.quadroLetras = document.getElementById('quadroLetras');
        this.txtMensagem = document.getElementById('txtMensagem');
        this.btnRefresh = document.getElementById('btnRefresh');
        this.letraInformada = "";
        this.iniciar();
        this.btnRefresh.addEventListener('click', () => this.iniciar());
    }
    construirTecladoVirtual() {
        this.criarTeclas();
        this.criarTeclaCedilha();
        this.criarTeclasAcentuacao();
    }
    criarTeclas() {
        const letraInicialEmDec = 65;
        const letraFinalEmDec = 90;
        for (let i = letraInicialEmDec; i <= letraFinalEmDec; i++) {
            this.adicionarEvento(this.criarLetra(i));
        }
    }
    criarTeclaCedilha() {
        let cedilha = this.criarLetra(231);
        cedilha.setAttribute('name', "cedilla");
        cedilha.textContent = "Ç";
        this.adicionarEvento(cedilha);
    }
    criarTeclasAcentuacao() {
        const simbolos = ["´", "^", "~"];
        const nomes = ["agudo", "circunflexo", "till"];
        const acentosEmDec = [225, 226, 243];
        for (let i = 0; i < acentosEmDec.length; i++) {
            let tecla = this.criarLetra(acentosEmDec[i]);
            tecla.textContent = simbolos[i];
            tecla.setAttribute("nome", nomes[i]);
            tecla.addEventListener("click", (sender) => this.acentuar(sender));
        }
    }
    criarLetra(cod) {
        let tecla = document.createElement('button');
        tecla.textContent = String.fromCharCode(cod);
        tecla.classList.add('tecla');
        return this.tecladoVirtual.appendChild(tecla);
    }
    adicionarEvento(tecla) {
        tecla.addEventListener('click', (sender) => {
            this.enviarPalpite(sender);
        });
    }
    construirPainelLetras() {
        let palavra = this.jogo.palavraSecreta;
        for (let i = 0; i < palavra.length; i++) {
            let quadro = document.createElement('input');
            quadro.id = String(i);
            quadro.type = 'text';
            quadro.readOnly = true;
            quadro.classList.add('letra');
            this.palavraOculta.push('-');
            this.quadroLetras.appendChild(quadro);
        }
    }
    enviarPalpite(event) {
        const button = (event.target);
        this.letraInformada = button.innerText;
        if (this.acentuacao == true) {
            this.letraInformada = this.obterAcentuacao(this.letraInformada);
            this.acentuacao = false;
        }
        else {
            button.classList.add('letraJogada');
            button.disabled = true;
        }
        console.log(this.letraInformada);
        const acertou = this.verificarPalpite(this.letraInformada);
        this.atualizarJogada(acertou);
        this.verificarStatusJogo();
    }
    verificarStatusJogo() {
        if (this.jogo.fimDeJogo()) {
            this.enviarMensagem(false);
            this.atualizarImagem(this.imagens.length - 2);
        }
        if (this.jogo.palavraCompleta(this.palavraOculta)) {
            this.enviarMensagem(true);
            this.atualizarImagem(this.imagens.length - 1);
        }
    }
    atualizarJogada(acertou) {
        if (acertou) {
            for (let i = 0; i < this.jogo.posicoes.length; i++) {
                let posicao = this.jogo.posicoes[i].toString();
                let quadro = document.getElementById(posicao);
                quadro.value = String(this.letraInformada);
                this.palavraOculta[Number(posicao)] = this.letraInformada;
            }
            return;
        }
        let index = this.indexImagem.valueOf();
        this.atualizarImagem(++index);
        this.indexImagem = index;
    }
    verificarPalpite(letra) {
        return this.jogo.verificarJogada(letra);
    }
    atualizarImagem(index) {
        this.imagem.src = `./assets/${this.imagens[Number(index)]}`;
    }
    enviarMensagem(venceu) {
        this.txtMensagem.classList.add(venceu ? 'venceu' : 'fim-de-jogo');
        let msg = venceu ? 'Parabéns você venceu!' : `Fim de jogo, a palavra era ${this.jogo.palavraSecreta}`;
        this.txtMensagem.textContent = msg;
        this.tecladoVirtual.hidden = true;
    }
    iniciar() {
        this.jogo = new jogo();
        this.quadroLetras.innerHTML = "";
        this.tecladoVirtual.innerHTML = "";
        this.txtMensagem.textContent = "";
        this.tecladoVirtual.hidden = false;
        this.indexImagem = 0;
        this.palavraOculta = [];
        this.construirTecladoVirtual();
        this.construirPainelLetras();
        this.atualizarImagem(this.indexImagem);
    }
    acentuar(sender) {
        this.acentuacao = true;
        const acento = sender.target;
        this.tipoAcento = acento.getAttribute("nome");
    }
    obterAcentuacao(letra) {
        const possiveis = ["A", "E", "I", "O", "U"];
        const agudos = ["Á", "É", "Í", "Ó", "Ú"];
        const circunflexos = ["Â", "Ê", "I", "Ô", "U"];
        const till = ["Ã", "E", "I", "Õ", "U"];
        if (!possiveis.includes(letra))
            return letra;
        let posicao = possiveis.indexOf(letra);
        console.log(posicao);
        console.log(this.tipoAcento);
        let letraAcentuada;
        switch (this.tipoAcento) {
            case "agudo":
                letraAcentuada = agudos[posicao];
                break;
            case "circunflexo":
                letraAcentuada = circunflexos[posicao];
                break;
            case "till":
                letraAcentuada = till[posicao];
                break;
        }
        return letraAcentuada;
    }
}
