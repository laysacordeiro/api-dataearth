import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { EspecieService, Especie } from '../../services/especie.service';
import { EspecieComponent} from './especies.component';
import { MatTableDataSource } from '@angular/material/table';

// Mock de um Paginator
class MockMatPaginator {}

describe('EspecieComponent', () => { // Nome do componente corrigido
  let component: EspecieComponent;
  let fixture: ComponentFixture<EspecieComponent>;
  let mockEspecieService: jasmine.SpyObj<EspecieService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockEspecies: Especie[] = [];

  beforeEach(async () => {
   mockEspecieService = jasmine.createSpyObj('EspecieService', [
  'listarTodas', 
  'criar',       
  'atualizar',  
  'deletar'      
]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    mockEspecieService.listarTodas.and.returnValue(of(mockEspecies));

    await TestBed.configureTestingModule({
      // EspecieComponent é standalone, por isso é importado aqui
      // Os módulos de UI (Material, Router) não precisam ser importados se forem mockados ou se o componente não for interagir com eles no teste.
      imports: [EspecieComponent], 
providers: [
        { provide: EspecieService, useValue: mockEspecieService },
        { provide: Router, useValue: mockRouter }, // Provendo o mock do Router
        // Não é necessário prover o MatPaginator pois ele é acessado via @ViewChild
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EspecieComponent);
    component = fixture.componentInstance;
    
    // Configura o dataSource para ter dados de teste
    component.dataSource = new MatTableDataSource<Especie>(mockEspecies);
    
    // Configura o paginator mockado para evitar erro no ViewChild
    component.paginator = new MockMatPaginator() as any; 
    
    fixture.detectChanges(); // Chama ngOnInit e vincula a view
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // --- Testes de Navegação ---
  
  it('should navigate to /nova-especie when novaEspecie() is called', () => {
    component.novaEspecie();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/nova-especie']);
  });
  
  it('should navigate to /mainpage and set rotaAtiva when irParaMainpage() is called', () => {
    component.irParaMainpage();
    expect(component.rotaAtiva).toBe('mainpage');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/mainpage']);
  });
  
  it('should navigate to /login and reset rotaAtiva when logout() is called', () => {
    component.logout();
    expect(component.rotaAtiva).toBe('');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
  
  // --- Testes de Tabela/Filtro ---
  
  it('should filter the dataSource when applying a filter', () => {
    // Simula o evento de input para a função aplicarFiltro
    const mockEvent = { target: { value: 'especie A' } } as unknown as Event;
    
    component.aplicarFiltro(mockEvent);
    
    // Verifica se o filtro foi aplicado
    expect(component.dataSource.filter).toBe('especie a');
    
    // Verifica se a filtragem ocorreu (aqui dependemos do comportamento real do MatTableDataSource)
    // Para um teste mais robusto, você verificaria o filteredData
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].nome).toBe('Especie A');
  });

  // --- Testes de Ação na Linha ---
  
  it('should log "Editar" when editar() is called', () => {
    spyOn(console, 'log');
    const especie = mockEspecies[0];
    component.editar(especie);
    expect(console.log).toHaveBeenCalledWith('Editar', especie);
  });
  
  it('should log "Deletar" when deletar() is called', () => {
    spyOn(console, 'log');
    const especie = mockEspecies[0];
    component.deletar(especie);
    expect(console.log).toHaveBeenCalledWith('Deletar', especie);
  });
});