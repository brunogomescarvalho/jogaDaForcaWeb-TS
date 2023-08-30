var jogo = /** @class */ (function () {
    function jogo() {
        this.palavras = ['ABACATE', 'ABACAXI', 'ACEROLA', 'AÇAÍ', 'ARAÇA', 'BACABA', 'BACURI', 'BANANA', 'CAJÁ', 'CAJÚ',
            'CARAMBOLA', 'CUPUAÇU', 'GRAVIOLA', 'GOIABA', 'JABUTICABA', 'JENIPAPO', 'MAÇÃ', 'MANGABA', 'MANGA', 'MARACUJÁ',
            'MURICI', 'PEQUI', 'PITANGA', 'PITAYA', 'SAPOTI', 'TANGERINA', 'UMBU', 'UVA', 'UVAIA'];
        this.tentativas = 0;
        this.palavraSecreta = this.obterPalavraSecreta();
    }
    jogo.prototype.obterPalavraSecreta = function () {
        var index = Math.floor(Math.random() * this.palavras.length);
        return this.palavras[index];
    };
    jogo.prototype.verificarJogada = function (letraInformada) {
        var acertou = false;
        this.posicoes = [];
        for (var i = 0; i < this.palavraSecreta.length; i++) {
            if (String(letraInformada) === (this.palavraSecreta[i])) {
                this.posicoes.push(i);
                acertou = true;
            }
        }
        if (!acertou)
            this.adicionarErro();
        return acertou;
    };
    jogo.prototype.palavraCompleta = function (arrayLetras) {
        return this.palavraSecreta == arrayLetras.join('');
    };
    jogo.prototype.fimDeJogo = function () {
        return this.tentativas === 7;
    };
    jogo.prototype.adicionarErro = function () {
        var tentativas = this.tentativas.valueOf();
        tentativas++;
        this.tentativas = tentativas;
    };
    return jogo;
}());
export { jogo };
