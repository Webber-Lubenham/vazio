# Script para iniciar o servidor de desenvolvimento
# Primeiro, mata todos os processos do Node.js
try {
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
} catch {
    Write-Host "Nenhum processo Node.js encontrado"
}

# Em seguida, inicia o servidor de desenvolvimento
Write-Host "Iniciando o servidor de desenvolvimento..."
npm run dev
