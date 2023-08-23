export class jogo {
    palavras = ['ABACATE', 'ABACAXI', 'ACEROLA', 'AÇAÍ', 'ARAÇA', 'BACABA', 'BACURI', 'BANANA', 'CAJÁ', 'CAJÚ',
        'CARAMBOLA', 'CUPUAÇU', 'GRAVIOLA', 'GOIABA', 'JABUTICABA', 'JENIPAPO', 'MAÇÃ', 'MANGABA', 'MANGA', 'MARACUJÁ',
        'MURICI', 'PEQUI', 'PITANGA', 'PITAYA', 'SAPOTI', 'TANGERINA', 'UMBU', 'UVA', 'UVAIA']

    palavraSecreta!: String;

    tentativas: Number = 0;

    posicoes!: Number[];

    constructor() {
        this.palavraSecreta = this.obterPalavraSecreta();

    }

    obterPalavraSecreta(): String {
        let index = Math.floor(Math.random() * this.palavras.length);
        return this.palavras[index];
    }

    verificarJogada(letraInformada: String): Boolean {

        let acertou = false;
        this.posicoes = [];

        for (let i = 0; i < this.palavraSecreta.length; i++) {
            if (String(letraInformada) === (this.palavraSecreta[i])) {
                this.posicoes.push(i);
                acertou = true;
            }
        }

        if (!acertou)
            this.adicionarErro();

        return acertou;
    }

    palavraCompleta(arrayLetras: String[]): Boolean {
        return this.palavraSecreta == arrayLetras.join('');
    }

    fimDeJogo(): Boolean {
        return this.tentativas === 7;
    }

    adicionarErro() {
        let tentativas = this.tentativas.valueOf();
        tentativas++;
        this.tentativas = tentativas;
    }
}