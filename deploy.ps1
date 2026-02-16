# --- CONFIGURACIÓN (EDITA ESTO) ---
$RemoteUser = "usuario_cpanel"      # Tu usuario de cPanel / SSH
$RemoteHost = "dev.mayaadrenaline.com.mx" # Tu dominio o IP del servidor
$RemotePort = "22"                  # Puerto SSH (a veces es 2222 en SiteGround/Hostinger)
$RemotePath = "./public_html"       # Carpeta pública en tu servidor (revisar ruta exacta)
$KeyPath    = ""                    # (Opcional) Ruta a tu llave privada .pem o .ppk si usas una
# ----------------------------------

# 1. Construir el proyecto
Write-Host "🔨 Construyendo proyecto..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Error en el build. Abortando."
    exit 1
}

# 2. Comprimir la carpeta 'out'
Write-Host "📦 Comprimiendo archivos..." -ForegroundColor Cyan
$BuildFile = "deploy_build.tar.gz"
if (Test-Path $BuildFile) { Remove-Item $BuildFile }

# Usamos tar porque es nativo en Linux y Windows 10+, y conserva permisos mejor que zip
tar -czf $BuildFile -C out .

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Error al comprimir."
    exit 1
}

# 3. Subir al servidor
Write-Host "🚀 Subiendo al servidor ($RemoteHost)..." -ForegroundColor Cyan
$ScpArgs = @()
if ($KeyPath) { $ScpArgs += "-i", $KeyPath }
$ScpArgs += "-P", $RemotePort
$ScpArgs += $BuildFile
$ScpArgs += "$($RemoteUser)@$($RemoteHost):~/$BuildFile"

Write-Host "   (Si pide contraseña, ingrésala ahora)"
scp @ScpArgs

if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Error al subir el archivo."
    exit 1
}

# 4. Desplegar en el servidor (Descomprimir)
Write-Host "✨ Desplegando en el servidor..." -ForegroundColor Cyan

# Comandos remotos:
# 1. Crear carpeta destino si no existe
# 2. Descomprimir el archivo (sobrescribiendo)
# 3. Borrar el archivo comprimido
$RemoteCommands = "mkdir -p $RemotePath && tar -xzf ~/$BuildFile -C $RemotePath && rm ~/$BuildFile"

$SshArgs = @()
if ($KeyPath) { $SshArgs += "-i", $KeyPath }
$SshArgs += "-p", $RemotePort
$SshArgs += "$($RemoteUser)@$($RemoteHost)"
$SshArgs += $RemoteCommands

ssh @SshArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ ¡Despliegue completado con éxito!" -ForegroundColor Green
    Write-Host "🌍 Tu sitio debería estar actualizado en unos instantes."
} else {
    Write-Error "❌ Hubo un error al ejecutar los comandos en el servidor."
}
