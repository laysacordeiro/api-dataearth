import { Component, type OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { EspecieService } from "../../../services/especie.service";
import { TaxonomiaService } from "../../../services/taxonomia.service";

import type { Especie } from "../../../models/especie.model";
import type { Taxonomia } from "../../../models/taxonomia.model";

interface TaxonomiaEditavel {
  id: number;
  nome: string;
  nivel: string;
  confirmado: boolean;
  nomeOriginal: string;
}

@Component({
  selector: "app-especie-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./form-editar-especie.component.html",
  styleUrls: ["./form-editar-especie.component.scss"],
})
export class FormEditarEspecieComponent implements OnInit {

  especieId!: number;

  formEspecie!: FormGroup;
  taxonomias: { [key: string]: TaxonomiaEditavel } = {};
  carregando = true;
  erroCarregamento = "";

  // ordem hierárquica
  nivelsTaxonomia = ["reino", "filo", "classe", "ordem", "familia", "genero"];

  // tabela que indica o parent de cada nível
  private parentDe: any = {
    genero: "familia",
    familia: "ordem",
    ordem: "classe",
    classe: "filo",
    filo: "reino",
    reino: null
  };

  constructor(
    private fb: FormBuilder,
    private especieService: EspecieService,
    private taxonomiaService: TaxonomiaService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormEditarEspecieComponent>
  ) {
    this.especieId = data.especieId;

    this.criarFormulario();
  }

  ngOnInit(): void {
    if (this.especieId) {
      this.carregarDados();
    }
  }

  fechar(): void {
    this.dialogRef.close();
  }

  private criarFormulario(): void {
    this.formEspecie = this.fb.group({
      nome: ["", Validators.required],
      nomeCientifico: ["", Validators.required],
      ano: ["", [Validators.required, Validators.min(1)]],
      descricao: [""],
      reinoNome: [""],
      filoNome: [""],
      classeNome: [""],
      ordemNome: [""],
      familiaNome: [""],
      generoNome: [""],
    });
  }

  private normalizarNivel(nivel: string): string {
    return nivel
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  private carregarDados(): void {
    this.carregando = true;

    this.especieService.buscarPorId(this.especieId).subscribe({
      next: (especie: Especie) => {
        this.preencherFormulario(especie);
        this.carregarTaxonomias(especie);
        this.carregando = false;
      },
      error: () => {
        this.erroCarregamento = "Erro ao carregar os dados da espécie";
        this.carregando = false;
      },
    });
  }

  private preencherFormulario(especie: Especie): void {
    this.formEspecie.patchValue({
      nome: especie.nome,
      nomeCientifico: especie.nomeCientifico,
      ano: especie.ano,
      descricao: especie.descricao,
    });
  }

  private carregarTaxonomias(especie: Especie): void {
    const taxInicial = (especie as any).taxonomia;

    this.nivelsTaxonomia.forEach((nivel) => {
      this.taxonomias[nivel] = {
        id: 0,
        nome: "",
        nivel,
        confirmado: false,
        nomeOriginal: "",
      };
    });

    if (!taxInicial) return;

    const hierarquia: Taxonomia[] = [];
    let atual: any = taxInicial;

    while (atual) {
      hierarquia.unshift(atual);
      atual = atual.parent;
    }

    hierarquia.forEach((item) => {
      const nivelNormal = this.normalizarNivel(item.nivel);

      if (!this.taxonomias[nivelNormal]) return;

      this.taxonomias[nivelNormal] = {
        id: Number(item.id),
        nome: item.nome,
        nivel: item.nivel,
        confirmado: true,
        nomeOriginal: item.nome,
      };

      const campo = nivelNormal + "Nome";
      const controle = this.formEspecie.get(campo);
      controle?.setValue(item.nome);
      controle?.disable();
    });
  }

  editarTaxonomia(nivel: string): void {
    this.taxonomias[nivel].confirmado = false;
    const controle = this.formEspecie.get(nivel + "Nome");
    controle?.enable();
  }

  confirmarTaxonomia(nivel: string): void {
    const controle = this.formEspecie.get(nivel + "Nome");
    const nomeDigitado = controle?.value?.toString()?.trim();

    if (!nomeDigitado) {
      alert(`Digite um nome para ${nivel}`);
      return;
    }

    const t = this.taxonomias[nivel];

    if (!t?.id || t.id === 0) {
      alert("Taxonomia não encontrada para atualização.");
      return;
    }

    const nivelParent = this.parentDe[nivel];
    let parent = null;

    if (nivelParent && this.taxonomias[nivelParent]?.id) {
      parent = { id: this.taxonomias[nivelParent].id };
    }

    const atualizacao: Taxonomia = {
      id: t.id,
      nome: nomeDigitado,
      nivel: t.nivel,
      parent
    };

    this.taxonomiaService.atualizar(t.id, atualizacao).subscribe({
      next: () => {
        t.confirmado = true;
        t.nome = nomeDigitado;
        t.nomeOriginal = nomeDigitado;
        controle?.disable();
      },
      error: () => alert("Erro ao salvar taxonomia"),
    });
  }

  salvarEspecie(): void {
    if (this.formEspecie.invalid) {
      alert("Preencha tudo corretamente");
      return;
    }

    const raw = this.formEspecie.getRawValue();

    const especieAtualizada: Especie = {
      nome: raw.nome,
      nomeCientifico: raw.nomeCientifico,
      ano: raw.ano,
      descricao: raw.descricao,
      taxonomia: { id: this.taxonomias["genero"]?.id ?? 0 }
    };

    this.especieService.atualizar(this.especieId, especieAtualizada).subscribe({
      next: () => {
        alert("Espécie salva com sucesso!");
        this.dialogRef.close(true);
      },
      error: () => alert("Erro ao salvar espécie"),
    });
  }

  isConfirmado(nivel: string): boolean {
    return this.taxonomias[nivel]?.confirmado;
  }
}
