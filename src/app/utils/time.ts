import { ParsedTime, ValidationResult, WeekView } from '../types/timesheet';
import { startOfWeek, addDays, format } from 'date-fns';

/**
 * Converte segundos para formato HH:MM:SS
 */
export function formatDuration(segundos: number): string {
  // Issue 2: Add validation for negative numbers
  if (segundos < 0) return '00:00:00';

  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = segundos % 60;

  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
}

/**
 * Converte HH:MM:SS para segundos
 */
export function parseDuration(hhmmss: string): number {
  // Issue 2: Add NaN and negative validation
  const parts = hhmmss.split(':').map(p => parseInt(p, 10));

  if (parts.length !== 3 || parts.some(p => isNaN(p) || p < 0)) {
    return 0;
  }

  const [h, m, s] = parts;
  return h * 3600 + m * 60 + s;
}

/**
 * Soma duas durações em formato HH:MM:SS
 */
export function addDurations(d1: string, d2: string): string {
  const s1 = parseDuration(d1);
  const s2 = parseDuration(d2);
  return formatDuration(s1 + s2);
}

/**
 * Parseia input flexível de tempo
 * Aceita: "230" -> 02:30:00, "2:30" -> 02:30:00, "2:30:15" -> 02:30:15
 */
export function parseTimeInput(input: string): ParsedTime | null {
  if (!input || input.trim() === '') return null;

  const cleaned = input.trim();

  // Formato completo: HH:MM:SS
  if (cleaned.includes(':')) {
    const parts = cleaned.split(':').map(p => parseInt(p, 10));

    if (parts.length === 2) {
      // HH:MM
      const [h, m] = parts;
      if (isNaN(h) || isNaN(m) || h < 0 || m < 0) return null;
      return {
        horas: h,
        minutos: m,
        segundos: 0,
        totalSegundos: h * 3600 + m * 60
      };
    }

    if (parts.length === 3) {
      // HH:MM:SS
      const [h, m, s] = parts;
      if (isNaN(h) || isNaN(m) || isNaN(s) || h < 0 || m < 0 || s < 0) return null;
      return {
        horas: h,
        minutos: m,
        segundos: s,
        totalSegundos: h * 3600 + m * 60 + s
      };
    }

    return null;
  }

  // Issue 1: Apenas números: trata como formato HHMM (ex: 230 = 0230 = 02:30)
  const num = parseInt(cleaned, 10);
  if (isNaN(num) || num < 0) return null;

  // Interpreta como HHMM format: 230 -> 02:30, 145 -> 01:45, 2 -> 00:02
  const horas = Math.floor(num / 100);
  const minutos = num % 100;

  // Validar que minutos não excedam 59
  if (minutos > 59) return null;

  return {
    horas,
    minutos,
    segundos: 0,
    totalSegundos: horas * 3600 + minutos * 60
  };
}

/**
 * Valida e normaliza input de tempo
 */
export function validateTimeInput(valor: string): ValidationResult {
  if (!valor || valor.trim() === '' || valor === '00:00:00') {
    return { valid: true, normalized: '00:00:00' };
  }

  const parsed = parseTimeInput(valor);

  if (!parsed) {
    return { valid: false, error: 'Formato inválido. Use HH:MM:SS' };
  }

  if (parsed.horas > 23) {
    return { valid: false, error: 'Horas devem ser entre 00-23' };
  }

  if (parsed.minutos > 59) {
    return { valid: false, error: 'Minutos devem ser entre 00-59' };
  }

  if (parsed.segundos > 59) {
    return { valid: false, error: 'Segundos devem ser entre 00-59' };
  }

  return {
    valid: true,
    normalized: formatDuration(parsed.totalSegundos)
  };
}

/**
 * Gera objeto WeekView para semana atual ou navegada
 * @param offset - Número de semanas para avançar/retroceder (0 = semana atual)
 */
export function getWeek(offset: number = 0): WeekView {
  const hoje = new Date();
  const inicioSemanaAtual = startOfWeek(hoje, { weekStartsOn: 1 }); // 1 = Segunda
  const inicioSemanaDesejada = addDays(inicioSemanaAtual, offset * 7);

  const dias: Date[] = [];
  for (let i = 0; i < 6; i++) {
    // Seg, Ter, Qua, Qui, Sex, Sáb (6 dias)
    dias.push(addDays(inicioSemanaDesejada, i));
  }

  return {
    inicio: inicioSemanaDesejada,
    fim: dias[5], // Sábado
    dias
  };
}

/**
 * Formata data para exibição (ex: "14/04")
 */
export function formatDayHeader(date: Date): string {
  return format(date, 'dd/MM');
}

/**
 * Formata intervalo de semana (ex: "14/04 - 19/04/2026")
 */
export function formatWeekRange(week: WeekView): string {
  const inicio = format(week.inicio, 'dd/MM');
  const fim = format(week.fim, 'dd/MM/yyyy');
  return `${inicio} - ${fim}`;
}
