// src/app/data/mock-timesheet.ts
import { TimeEntry } from '../types/timesheet';

/**
 * Mock de entries de tempo para desenvolvimento
 */
export const mockTimeEntries: TimeEntry[] = [
  {
    id: 'e001',
    tarefaId: 1,
    tarefaNome: 'DCTF Ago/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Fernanda',
    data: '2026-04-14', // Segunda
    duracao: '02:30:00',
    duracaoSegundos: 9000,
    origem: 'timer'
  },
  {
    id: 'e002',
    tarefaId: 1,
    tarefaNome: 'DCTF Ago/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Fernanda',
    data: '2026-04-15', // Terça
    duracao: '03:00:00',
    duracaoSegundos: 10800,
    origem: 'manual'
  },
  {
    id: 'e003',
    tarefaId: 1,
    tarefaNome: 'DCTF Ago/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Fernanda',
    data: '2026-04-16', // Quarta
    duracao: '04:00:00',
    duracaoSegundos: 14400,
    origem: 'manual'
  },
  {
    id: 'e004',
    tarefaId: 1,
    tarefaNome: 'DCTF Ago/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Fernanda',
    data: '2026-04-17', // Quinta (hoje)
    duracao: '02:00:00',
    duracaoSegundos: 7200,
    origem: 'timer'
  },
  {
    id: 'e005',
    tarefaId: 1,
    tarefaNome: 'DCTF Ago/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Fernanda',
    data: '2026-04-18', // Sexta
    duracao: '01:30:00',
    duracaoSegundos: 5400,
    origem: 'manual'
  },
  {
    id: 'e006',
    tarefaId: 4,
    tarefaNome: 'REINF Out/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Maria Silva',
    data: '2026-04-14', // Segunda
    duracao: '01:00:00',
    duracaoSegundos: 3600,
    origem: 'timer'
  },
  {
    id: 'e007',
    tarefaId: 4,
    tarefaNome: 'REINF Out/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Maria Silva',
    data: '2026-04-15', // Terça
    duracao: '02:15:00',
    duracaoSegundos: 8100,
    origem: 'manual'
  },
  {
    id: 'e008',
    tarefaId: 4,
    tarefaNome: 'REINF Out/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Maria Silva',
    data: '2026-04-16', // Quarta
    duracao: '08:30:00', // > 8h (warning test case)
    duracaoSegundos: 30600,
    origem: 'timer'
  },
  {
    id: 'e009',
    tarefaId: 4,
    tarefaNome: 'REINF Out/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Maria Silva',
    data: '2026-04-17', // Quinta
    duracao: '05:45:00',
    duracaoSegundos: 20700,
    origem: 'timer'
  },
  {
    id: 'e010',
    tarefaId: 4,
    tarefaNome: 'REINF Out/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Maria Silva',
    data: '2026-04-18', // Sexta
    duracao: '05:00:00',
    duracaoSegundos: 18000,
    origem: 'manual'
  },
  {
    id: 'e011',
    tarefaId: 4,
    tarefaNome: 'REINF Out/25',
    clienteNome: 'Empresa ABC Ltda',
    responsavel: 'Maria Silva',
    data: '2026-04-19', // Sábado
    duracao: '02:00:00',
    duracaoSegundos: 7200,
    origem: 'timer'
  },
];
