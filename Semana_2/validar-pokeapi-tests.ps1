$ErrorActionPreference = "Stop"

if ($PSVersionTable.PSVersion.Major -ge 7) {
    $PSNativeCommandUseErrorActionPreference = $true
}

function Assert-LastExitCode {
    param([string] $CommandName)
    if ($LASTEXITCODE -ne 0) {
        throw "El comando '$CommandName' finalizo con codigo $LASTEXITCODE"
    }
}

function Resolve-MavenCommand {
    $mvn = Get-Command mvn -ErrorAction SilentlyContinue
    if ($mvn) {
        return "mvn"
    }

    $toolsPath = Join-Path $PSScriptRoot ".tools"
    $mavenVersion = "3.9.11"
    $mavenHome = Join-Path $toolsPath "apache-maven-$mavenVersion"
    $mavenCmd = Join-Path $mavenHome "bin/mvn.cmd"

    if (!(Test-Path $mavenCmd)) {
        New-Item -ItemType Directory -Force -Path $toolsPath | Out-Null
        $zipPath = Join-Path $toolsPath "apache-maven-$mavenVersion-bin.zip"
        if (!(Test-Path $zipPath)) {
            Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip" -OutFile $zipPath
        }
        Expand-Archive -Path $zipPath -DestinationPath $toolsPath -Force
    }

    return $mavenCmd
}

function Ensure-NpmDependencies {
    if (Test-Path "package-lock.json") {
        & npm.cmd ci
    } else {
        & npm.cmd install
    }
    Assert-LastExitCode "npm install/ci"
}

function Invoke-Project {
    param(
        [int]$Number,
        [string]$Name,
        [string]$Path,
        [scriptblock]$Action
    )

    Write-Host "`n[$Number/6] $Name" -ForegroundColor Yellow
    Write-Host "  Ruta: $Path" -ForegroundColor DarkGray

    Push-Location $Path
    try {
        & $Action
        if ($LASTEXITCODE -ne 0) {
            throw "Ejecucion con codigo $LASTEXITCODE"
        }
        Write-Host "  PASS" -ForegroundColor Green
        return [pscustomobject]@{ Name = $Name; Status = "PASS" }
    } catch {
        Write-Host "  FAIL: $($_.Exception.Message)" -ForegroundColor Red
        return [pscustomobject]@{ Name = $Name; Status = "FAIL" }
    } finally {
        Pop-Location
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "INICIANDO TESTS API - POKEAPI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$mavenCommand = Resolve-MavenCommand
$base = $PSScriptRoot
$results = @()

$results += Invoke-Project -Number 1 -Name "Selenium Java Maven API" -Path (Join-Path $base "Selenium\Java\maven\curso\api") -Action { & $mavenCommand test }
$results += Invoke-Project -Number 2 -Name "Playwright Java Maven API" -Path (Join-Path $base "Playwright\Java\maven\curso\api") -Action { & $mavenCommand test }
$results += Invoke-Project -Number 3 -Name "Playwright JavaScript API" -Path (Join-Path $base "Playwright\javascript\npm\curso\api") -Action { Ensure-NpmDependencies; & npm.cmd test }
$results += Invoke-Project -Number 4 -Name "Playwright TypeScript API" -Path (Join-Path $base "Playwright\TypeScript\npm\curso\api") -Action { Ensure-NpmDependencies; & npm.cmd test }
$results += Invoke-Project -Number 5 -Name "Cypress API" -Path (Join-Path $base "Cypress\JavaScript\npm\curso\api") -Action { Ensure-NpmDependencies; & npm.cmd test }
$results += Invoke-Project -Number 6 -Name "Selenium Java Clean API" -Path (Join-Path $base "Selenium\Java\clean\curso") -Action { & powershell -ExecutionPolicy Bypass -File ".\run-api.ps1" }

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE RESULTADOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$failed = 0
foreach ($result in $results) {
    if ($result.Status -eq "PASS") {
        Write-Host ("{0}: ✓ PASS" -f $result.Name) -ForegroundColor Green
    } else {
        Write-Host ("{0}: ✗ FAIL" -f $result.Name) -ForegroundColor Red
        $failed++
    }
}

if ($failed -gt 0) {
    exit 1
}

exit 0
