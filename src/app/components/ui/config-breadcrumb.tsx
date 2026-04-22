import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

type ConfigBreadcrumbProps =
  | {
      /**
       * Label do menu de configuração
       * Ex: "Empresas", "Feriados e horários"
       */
      menuLabel: string;

      /**
       * Callback para navegar de volta para Configurações
       */
      onNavigateToConfig: () => void;

      // 2-level breadcrumb: no itemLabel
      itemLabel?: never;
      onNavigateToMenu?: never;
    }
  | {
      /**
       * Label do menu de configuração
       * Ex: "Empresas", "Feriados e horários"
       */
      menuLabel: string;

      /**
       * Label do item específico
       * Ex: "Acme Corp", "João Silva"
       */
      itemLabel: string;

      /**
       * Callback para navegar de volta para Configurações
       */
      onNavigateToConfig: () => void;

      /**
       * Callback para navegar de volta ao menu (lista)
       * Obrigatório quando itemLabel está presente
       */
      onNavigateToMenu: () => void;
    };

export function ConfigBreadcrumb({
  menuLabel,
  itemLabel,
  onNavigateToConfig,
  onNavigateToMenu,
}: ConfigBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Nível 1: Configurações (sempre clicável) */}
        <BreadcrumbItem>
          <BreadcrumbLink onClick={onNavigateToConfig}>
            Configurações
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {/* Nível 2: Menu - clicável SE itemLabel existe, senão é página atual */}
        <BreadcrumbItem>
          {itemLabel ? (
            <BreadcrumbLink onClick={onNavigateToMenu}>
              {menuLabel}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{menuLabel}</BreadcrumbPage>
          )}
        </BreadcrumbItem>

        {/* Nível 3: Item (condicional, sempre página atual) */}
        {itemLabel && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{itemLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
