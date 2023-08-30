import { jogo } from "../dominio/jogo";
var tela = /** @class */ (function () {
    function tela() {
        var _this = this;
        this.imagens = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png',];
        this.imagem = document.getElementById('imagem');
        this.tecladoVirtual = document.getElementById('teclado');
        this.quadroLetras = document.getElementById('quadroLetras');
        this.txtMensagem = document.getElementById('txtMensagem');
        this.btnRefresh = document.getElementById('btnRefresh');
        this.letraInformada = "";
        this.iniciar();
        this.btnRefresh.addEventListener('click', function () { return _this.iniciar(); });
    }
    tela.prototype.construirTecladoVirtual = function () {
        this.criarTeclas();
        this.criarTeclaCedilha();
        this.criarTeclasAcentuacao();
    };
    tela.prototype.criarTeclas = function () {
        var letraInicialEmDec = 65;
        var letraFinalEmDec = 90;
        for (var i = letraInicialEmDec; i <= letraFinalEmDec; i++) {
            this.adicionarEvento(this.criarLetra(i));
        }
    };
    tela.prototype.criarTeclaCedilha = function () {
        var cedilha = this.criarLetra(231);
        cedilha.setAttribute('name', "cedilla");
        cedilha.textContent = "Ç";
        this.adicionarEvento(cedilha);
    };
    tela.prototype.criarTeclasAcentuacao = function () {
        var _this = this;
        var simbolos = ["´", "^", "~"];
        var nomes = ["agudo", "circunflexo", "till"];
        var acentosEmDec = [225, 226, 243];
        for (var i = 0; i < acentosEmDec.length; i++) {
            var tecla = this.criarLetra(acentosEmDec[i]);
            tecla.textContent = simbolos[i];
            tecla.setAttribute("nome", nomes[i]);
            tecla.addEventListener("click", function (sender) { return _this.acentuar(sender); });
        }
    };
    tela.prototype.criarLetra = function (cod) {
        var tecla = document.createElement('button');
        tecla.textContent = String.fromCharCode(cod);
        tecla.classList.add('tecla');
        return this.tecladoVirtual.appendChild(tecla);
    };
    tela.prototype.adicionarEvento = function (tecla) {
        var _this = this;
        tecla.addEventListener('click', function (sender) {
            _this.enviarPalpite(sender);
        });
    };
    tela.prototype.construirPainelLetras = function () {
        var palavra = this.jogo.palavraSecreta;
        for (var i = 0; i < palavra.length; i++) {
            var quadro = document.createElement('input');
            quadro.id = String(i);
            quadro.type = 'text';
            quadro.readOnly = true;
            quadro.classList.add('letra');
            this.palavraOculta.push('-');
            this.quadroLetras.appendChild(quadro);
        }
    };
    tela.prototype.enviarPalpite = function (event) {
        var button = (event.target);
        this.letraInformada = button.innerText;
        if (button.classList.contains('letraJogada') && this.acentuacao == false)
            return;
        if (this.acentuacao == true) {
            this.letraInformada = this.obterAcentuacao(this.letraInformada);
            this.acentuacao = false;
            this.btnAcento.classList.remove('teclaAcento');
        }
        else {
            button.classList.add('letraJogada');
        }
        var acertou = this.verificarPalpite(this.letraInformada);
        this.atualizarJogada(acertou);
        this.verificarStatusJogo();
    };
    tela.prototype.verificarStatusJogo = function () {
        if (this.jogo.fimDeJogo()) {
            this.enviarMensagem(false);
            this.atualizarImagem(this.imagens.length - 2);
        }
        if (this.jogo.palavraCompleta(this.palavraOculta)) {
            this.enviarMensagem(true);
            this.atualizarImagem(this.imagens.length - 1);
        }
    };
    tela.prototype.atualizarJogada = function (acertou) {
        if (acertou) {
            for (var i = 0; i < this.jogo.posicoes.length; i++) {
                var posicao = this.jogo.posicoes[i].toString();
                var quadro = document.getElementById(posicao);
                quadro.value = String(this.letraInformada);
                this.palavraOculta[Number(posicao)] = this.letraInformada;
            }
            return;
        }
        var index = this.indexImagem.valueOf();
        this.atualizarImagem(++index);
        this.indexImagem = index;
    };
    tela.prototype.verificarPalpite = function (letra) {
        return this.jogo.verificarJogada(letra);
    };
    tela.prototype.atualizarImagem = function (index) {
        this.imagem.src = "./assets/".concat(this.imagens[Number(index)]);
    };
    tela.prototype.enviarMensagem = function (venceu) {
        this.txtMensagem.classList.add(venceu ? 'venceu' : 'fim-de-jogo');
        var msg = venceu ? 'Parabéns você venceu!' : "Fim de jogo, a palavra era ".concat(this.jogo.palavraSecreta);
        this.txtMensagem.textContent = msg;
        this.tecladoVirtual.hidden = true;
    };
    tela.prototype.iniciar = function () {
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
    };
    tela.prototype.acentuar = function (sender) {
        this.acentuacao = true;
        var acento = sender.target;
        acento.classList.add('teclaAcento');
        this.tipoAcento = acento.getAttribute("nome");
        this.btnAcento = acento;
    };
    tela.prototype.obterAcentuacao = function (letra) {
        var possiveis = ["A", "E", "I", "O", "U"];
        var agudos = ["Á", "É", "Í", "Ó", "Ú"];
        var circunflexos = ["Â", "Ê", "I", "Ô", "U"];
        var till = ["Ã", "E", "I", "Õ", "U"];
        var existe = false;
        possiveis.forEach(function (x) {
            if (x == letra) {
                existe = true;
                return;
            }
        });
        if (!existe)
            return letra;
        var posicao = possiveis.indexOf(letra);
        var letraAcentuada;
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
    };
    return tela;
}());
export { tela };
