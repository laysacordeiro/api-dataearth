import { Component, OnInit, Inject } from "@angular/core";
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

  nivelsTaxonomia = [
    "reino", "filo", "classe", "subclasse", 
    "ordem", "subordem", "familia", "subfamilia", 
    "genero", "subgenero", "epiteto"
  ];

  private parentDe: any = {
    epiteto: "subgenero",
    subgenero: "genero",
    genero: "subfamilia",
    subfamilia: "familia",
    familia: "subordem",
    subordem: "ordem",
    ordem: "subclasse",
    subclasse: "classe",
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
      autor: ["", Validators.required],
      nomeCientifico: ["", Validators.required],
      ano: ["", [Validators.required, Validators.min(1)]],
      descricao: [""],
      reinoNome: [""], filoNome: [""], classeNome: [""], subclasseNome: [""],
      ordemNome: [""], subordemNome: [""], familiaNome: [""], subfamiliaNome: [""],
      generoNome: [""], subgeneroNome: [""], epitetoNome: [""]
    });
  }

  private normalizarNivel(nivel: string): string {
    return nivel.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace("í", "i").replace("ê", "e");
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
        this.erroCarregamento = "Erro ao carregar os dados";
        this.carregando = false;
      },
    });
  }

  private preencherFormulario(especie: Especie): void {
    this.formEspecie.patchValue({
      nome: especie.nome,
      autor: especie.autor, 
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
        confirmado: true, 
        nomeOriginal: "" 
      };
    });

    if (!taxInicial) return;
    
    let atual: any = taxInicial;
    while (atual) {
      const nivelNormal = this.normalizarNivel(atual.nivel);
      if (this.taxonomias[nivelNormal]) {
        this.taxonomias[nivelNormal] = {
          id: Number(atual.id),
          nome: atual.nome,
          nivel: atual.nivel,
          confirmado: true,
          nomeOriginal: atual.nome,
        };
        const controle = this.formEspecie.get(nivelNormal + "Nome");
        controle?.setValue(atual.nome);
        controle?.disable();
      }
      atual = atual.parent;
    }
  }

  editarTaxonomia(nivel: string): void {
    if (!nivel) return;
    this.taxonomias[nivel].confirmado = false;
    this.formEspecie.get(nivel + "Nome")?.enable();
  }

  confirmarTaxonomia(nivel: string): void {
    const controle = this.formEspecie.get(nivel + "Nome");
    const nomeDigitado = controle?.value?.toString()?.trim();
    if (!nomeDigitado) return;

    const t = this.taxonomias[nivel];
    const nivelParent = this.parentDe[nivel];
    let parentObj = null;

    if (nivelParent && this.taxonomias[nivelParent]?.id) {
      parentObj = { id: this.taxonomias[nivelParent].id };
    }

    const atualizacao: any = {
      id: t.id > 0 ? t.id : undefined,
      nome: nomeDigitado,
      nivel: t.nivel,
      parent: parentObj
    };

    const acao$ = (t.id > 0) 
      ? this.taxonomiaService.atualizar(t.id, atualizacao) 
      : this.taxonomiaService.salvar(atualizacao);

    acao$.subscribe({
      next: (res: Taxonomia) => {
        this.taxonomias[nivel].id = res.id!;
        this.taxonomias[nivel].confirmado = true;
        this.taxonomias[nivel].nome = res.nome;
        this.taxonomias[nivel].nomeOriginal = res.nome;
        controle?.disable();
      },
      error: () => alert("Erro ao salvar nível")
    });
  }

  salvarEspecie(): void {
    if (this.formEspecie.invalid) return;

    const raw = this.formEspecie.getRawValue();
    const idsDisponiveis = this.nivelsTaxonomia
      .map(nivel => this.taxonomias[nivel]?.id)
      .filter(id => id !== undefined && id > 0);

    const idTaxonomiaFinal = idsDisponiveis.length > 0 ? idsDisponiveis[idsDisponiveis.length - 1] : null;

    if (!idTaxonomiaFinal) {
      alert("Confirme ao menos um nível taxonômico.");
      return;
    }

    const especieAtualizada: any = {
      id: this.especieId,
      nome: raw.nome,
      autor: raw.autor, 
      nomeCientifico: raw.nomeCientifico,
      ano: raw.ano,
      descricao: raw.descricao,
      taxonomia: { id: idTaxonomiaFinal }
    };

    this.especieService.atualizar(this.especieId, especieAtualizada).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => alert("Erro ao atualizar espécie")
    });
  }

  isConfirmado(nivel: string): boolean {
    return this.taxonomias[nivel]?.confirmado;
  }
}