/*
 * Copyright (c) 2023, Thayse Marques Solis.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const fs = require('fs');

class CPF {
    constructor(cpfDeEntrada) {
        this.cpfLimpo = cpfDeEntrada.replace(/\D+/g, ''); // tudo que não é número é removido
    }

    valida() {
        if (this.cpfLimpo.length !== 11) return false;
        if (this.sequencial()) return false;
        const cpfParcial = this.cpfLimpo.slice(0, -2);
        const digitoVerificador1 = this.geraDigitoVerificador(cpfParcial);
        const digitoVerificador2 = this.geraDigitoVerificador(cpfParcial + digitoVerificador1);
        const novoCPF = cpfParcial + digitoVerificador1 + digitoVerificador2;
        return novoCPF === this.cpfLimpo;
    }

    geraDigitoVerificador(cpfParcial) {
        const cpfArray = Array.from(cpfParcial);
        let multiplicador = cpfArray.length + 1;
        let soma = cpfArray.reduce((ac, val) => {
            ac += Number(val) * multiplicador;
            multiplicador--;
            return ac;
        }, 0);
        const digito = 11 - (soma % 11);
        return digito <= 9 ? String(digito) : '0';
    }

    sequencial() {
        const sequencia = this.cpfLimpo[0].repeat(this.cpfLimpo.length);
        return sequencia === this.cpfLimpo;
    }
}

if (process.argv.length == 2 || process.argv[2] == '-h') {
    console.log('Modo de uso:');
    console.log(`    node ${process.argv[1]} <arquivo_com_lista_de_cpfs>`);
    console.log('O arquivo deve ter um CPF por linha.');
    process.exit(0);
}

const allFileContents = fs.readFileSync(process.argv[2], 'utf-8');

allFileContents.split(/\r?\n/).forEach(cpf =>  {
  if(!new CPF(cpf).valida()) {
	  console.log(`O CPF ${cpf} é inválido.`);
  }
});
