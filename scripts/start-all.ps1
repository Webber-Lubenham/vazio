# Script para iniciar todos os servidores
# Primeiro, mata todos os processos em portas específicas
$ports = @(3000, 3001, 3002, 3003, 3004, 5173)

foreach ($port in $ports) {
    try {
        $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
            Where-Object State -EQ "Listen" | 
            Select-Object -ExpandProperty OwningProcess

        if ($process) {
            Write-Host "Matar processo na porta $port"
            Stop-Process -Id $process -Force
        }
    }
    catch {
        Write-Host "Nenhum processo encontrado na porta $port"
    }
}

# Inicia o servidor backend
Write-Host "Iniciando servidor backend..."
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "node_modules/.bin/ts-node --esm src/index.ts"

# Aguarda um pouco para o backend iniciar
Start-Sleep -Seconds 2

# Inicia o servidor frontend
Write-Host "Iniciando servidor frontend..."
Set-Location -Path "frontend"
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "node_modules/vite/bin/vite.js"

Write-Host "Servidores iniciados! Acesse http://localhost:5173 para ver a aplicação."
Write-Host "Para parar os servidores, pressione Ctrl+C em cada terminal ou feche os terminais."

# Mantém o script rodando para não fechar o terminal
while ($true) {
    Start-Sleep -Seconds 1
}
