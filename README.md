<p align="center">
  <strong>Serveruler Client</strong>
</p>

<p align="center">
  <strong>IPs e serviços da rede local, num painel só.</strong><br />
  Status online, copiar endereço, abrir no browser — com sync da tabela AGX quando houver.
</p>

---

## Por que existe

Em escritório e em casa os IPs mudam e os serviços se espalham. Abrir planilha ou caçar `.env` não escala. O Serveruler Client mostra a lista útil, diz se está no ar e encurta o caminho até o serviço.

## O que você ganha

| | |
|---|---|
| **Lista clara** | Serviços, IPs e portas |
| **Status** | Checagem online |
| **Atalhos** | Copiar IP ou abrir no navegador |
| **Sync AGX** | Atualiza a partir do repo `ips` no startup |
| **Avatares** | Membros ativos da org AGX |

## Como funciona

```text
Startup  →  sync opcional da tabela ips
    ↓
UI Vite/React  →  ping / status  →  copiar ou abrir URL
```

Companion: [`serveruler-redirect`](https://github.com/RafaelHDSV/serveruler-redirect) escolhe empresa vs casa pelo dia da semana. IPs nos arquivos podem ser atualizados por [`sync-local-ip`](https://github.com/RafaelHDSV/sync-local-ip).

## Posicionamento

| Serveruler é | Serveruler não é |
|---|---|
| Painel de LAN | Cloud inventory |
| Atalho para o serviço | Alterar a placa de rede |
| Cliente Vite | O redirect por dia da semana |

## Stack (em uma linha)

Vite + React (porta típica 5173) · sync com repo `ips`.

Detalhes: [`docs/context.md`](docs/context.md) · especificação: [`docs/especificacao.md`](docs/especificacao.md).

## Começar

Install e scripts: [`docs/ambiente-e-operacao.md`](docs/ambiente-e-operacao.md).

Contribuição: [`CONTRIBUTING.md`](CONTRIBUTING.md) · conduta: [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) · mudanças: [`CHANGELOG.md`](CHANGELOG.md).
