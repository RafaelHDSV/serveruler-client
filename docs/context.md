# Serveruler Client — contexto

> **Para que serve:** hub `ai-context` do inspetor de IPs da rede local.
> **Fonte da verdade:** app Vite/React deste repositório.
> **Relacionados:** [especificacao](especificacao.md) · [ambiente-e-operacao](ambiente-e-operacao.md)

## Objetivo

Interface local para ver serviços e IPs da rede, checar status online, copiar endereços e abrir no navegador — com sync opcional da tabela AGX `ips` e avatares de membros ativos.

## Stack

| Camada | Tecnologia |
|---|---|
| Front | Vite + React (porta típica 5173) |
| Dados | Sync com repositório `ips` / config local |

## Índice

| Documento | Conteúdo | Quando ler |
|---|---|---|
| [context.md](context.md) | Este hub | Sempre |
| [especificacao.md](especificacao.md) | Features | Antes de mudar UI/comportamento |
| [ambiente-e-operacao.md](ambiente-e-operacao.md) | Install e scripts | Antes de rodar |
| [README.md](../README.md) | Pitch | Onboarding |
| [CHANGELOG.md](../CHANGELOG.md) | Mudanças | Release |
