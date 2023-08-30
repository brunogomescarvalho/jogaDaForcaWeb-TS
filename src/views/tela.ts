import { jogo } from "../dominio/jogo"
import './stylesheet.css'

export class tela {
    imagens: String[] = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png',];
    imagem = document.getElementById('imagem') as HTMLImageElement;
    tecladoVirtual = document.getElementById('teclado') as HTMLDivElement;
    quadroLetras = document.getElementById('quadroLetras') as HTMLElement;
    txtMensagem = document.getElementById('txtMensagem') as HTMLElement;
    btnRefresh = document.getElementById('btnRefresh') as HTMLButtonElement;
    pnlLetrasJogadas = document.getElementById('letrasJogadas') as HTMLDivElement;
    jogo!: jogo;
    indexImagem!: Number;
    letraInformada: String = "";
    palavraOculta!: String[];
    acentuacao!: boolean;
    tipoAcento!: String;
    btnAcento!: HTMLButtonElement;
    letrasJogadas: String[];

    constructor() {
        this.iniciar();
        this.btnRefresh.addEventListener('click', () => this.iniciar());

    }

    private construirTecladoVirtual() {
        this.criarTeclas();
        this.criarTeclaCedilha();
        this.criarTeclasAcentuacao();
    }

    private criarTeclas() {
        const letraInicialEmDec = 65;
        const letraFinalEmDec = 90;
        for (let i = letraInicialEmDec; i <= letraFinalEmDec; i++) {
            this.adicionarEvento(this.criarLetra(i));
        }
    }

    private criarTeclaCedilha() {
        let cedilha = this.criarLetra(231);
        cedilha.setAttribute('name', "cedilla");
        cedilha.textContent = "Ç";
        this.adicionarEvento(cedilha);
    }

    private criarTeclasAcentuacao() {
        const simbolos = ["´", "^", "~"];
        const nomes = ["agudo", "circunflexo", "till"]
        const acentosEmDec = [225, 226, 243];
        for (let i = 0; i < acentosEmDec.length; i++) {
            let tecla = this.criarLetra(acentosEmDec[i]);
            tecla.textContent = simbolos[i];
            tecla.setAttribute("nome", nomes[i]);
            tecla.addEventListener("click", (sender) => this.acentuar(sender));
        }
    }

    private criarLetra(cod: number): HTMLButtonElement {
        let tecla = document.createElement('button') as HTMLButtonElement;
        tecla.textContent = String.fromCharCode(cod);
        tecla.classList.add('tecla');
        return this.tecladoVirtual.appendChild(tecla);
    }

    private adicionarEvento(tecla: HTMLButtonElement) {
        tecla.addEventListener('click', (sender) => {
            this.enviarPalpite(sender);
        });
    }

    private construirPainelLetras() {
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

    private enviarPalpite(event: Event) {
        const button = (event.target) as HTMLButtonElement;
        this.letraInformada = button.innerText;

        let letraJogada = this.letrasJogadas.find(x => x == this.letraInformada) as string;

        if (letraJogada)
            return

        if (this.acentuacao == true) {
            this.letraInformada = this.obterAcentuacao(this.letraInformada)!;
            this.acentuacao = false;
            this.btnAcento.classList.remove('teclaAcento');
        }

        this.letrasJogadas.push(this.letraInformada);
        this.pnlLetrasJogadas.textContent = `Jogadas: ${this.letrasJogadas.join(' - ')}`

        const acertou = this.verificarPalpite(this.letraInformada);
        this.atualizarJogada(acertou);
        this.verificarStatusJogo();

    }

    private verificarStatusJogo() {
        if (this.jogo.fimDeJogo()) {
            this.enviarMensagem(false);
            this.atualizarImagem(this.imagens.length - 2);
        }

        if (this.jogo.palavraCompleta(this.palavraOculta)) {
            this.enviarMensagem(true);
            this.atualizarImagem(this.imagens.length - 1);
        }
    }

    private atualizarJogada(acertou: Boolean) {
        if (acertou) {
            for (let i = 0; i < this.jogo.posicoes.length; i++) {
                let posicao = this.jogo.posicoes[i].toString();
                let quadro = document.getElementById(posicao) as HTMLInputElement;
                quadro.value = String(this.letraInformada);
                this.palavraOculta[Number(posicao)] = this.letraInformada;
            }
            return;
        }

        let index = this.indexImagem.valueOf();
        this.atualizarImagem(++index);
        this.indexImagem = index;
    }

    private verificarPalpite(letra: String): Boolean {
        return this.jogo.verificarJogada(letra);
    }

    private atualizarImagem(index: Number) {
        this.imagem.src = `./assets/${this.imagens[Number(index)]}`;
    }

    private enviarMensagem(venceu: boolean) {
        this.txtMensagem.classList.add(venceu ? 'venceu' : 'fim-de-jogo');
        let msg = venceu ? 'Parabéns você venceu!' : `Fim de jogo, a palavra era ${this.jogo.palavraSecreta}`;
        this.txtMensagem.textContent = msg;
        this.tecladoVirtual.hidden = true;
    }

    private iniciar(): void {
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
        this.pnlLetrasJogadas.textContent = "Jogadas:";
        this.letrasJogadas = [];
    }

    private acentuar(sender: Event): void {
        this.acentuacao = true;
        const acento = sender.target as HTMLButtonElement;
        acento.classList.add('teclaAcento');
        this.tipoAcento = acento.getAttribute("nome")!;
        this.btnAcento = acento;
    }

    private obterAcentuacao(letra: String): String {
        const possiveis = ["A", "E", "I", "O", "U"] as String[];
        const agudos = ["Á", "É", "Í", "Ó", "Ú"];
        const circunflexos = ["Â", "Ê", "I", "Ô", "U"];
        const till = ["Ã", "E", "I", "Õ", "U"];

        let letraParaAcentuar = possiveis.find(x => x == letra);

        if (!letraParaAcentuar)
            return letra;

        let posicao = possiveis.indexOf(letra as string)!;

        let letraAcentuada!: String;

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
