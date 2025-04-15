# Script para matar processos em portas específicas
# Portas comuns que podem estar em uso
$ports = @(
    3000,  # Porta padrão do backend
    3001,  # Porta alternativa
    3002,  # Porta alternativa
    3003,  # Porta alternativa
    3004,  # Porta atual do backend
    5173   # Porta do frontend Vite
)

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

Write-Host "Todas as portas foram verificadas. Você pode iniciar o servidor agora."
