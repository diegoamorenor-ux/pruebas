$ErrorActionPreference = 'Stop'

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
        return 'mvn'
    }

    $toolsPath = Join-Path $PSScriptRoot '.tools'
    $mavenVersion = '3.9.11'
    $mavenHome = Join-Path $toolsPath "apache-maven-$mavenVersion"
    $mavenCmd = Join-Path $mavenHome 'bin/mvn.cmd'

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
    if (Test-Path 'package-lock.json') {
        & npm.cmd ci
    } else {
        & npm.cmd install
    }
    Assert-LastExitCode 'npm install/ci'
}

function Invoke-Project {
    param(
        [int]$Number,
        [string]$Name,
        [string]$Path,
        [scriptblock]$Action,
        [ref]$Results
    )

    Write-Host "`n[$Number] $Name" -ForegroundColor Yellow
    Write-Host "  Ruta: $Path" -ForegroundColor DarkGray

    Push-Location $Path
    try {
        & $Action
        if ($LASTEXITCODE -ne 0) {
            throw "Ejecucion con codigo $LASTEXITCODE"
        }
        Write-Host '  PASS' -ForegroundColor Green
        $Results.Value += [pscustomobject]@{ Number = $Number; Name = $Name; Status = 'PASS' }
    } catch {
        Write-Host "  FAIL: $($_.Exception.Message)" -ForegroundColor Red
        $Results.Value += [pscustomobject]@{ Number = $Number; Name = $Name; Status = 'FAIL' }
    } finally {
        Pop-Location
    }
}

Write-Host @"
=====================================================================
VALIDACION COMPLETA POKEAPI + E2E
Selenium, Playwright y Cypress
=====================================================================
"@ -ForegroundColor Cyan

$base = $PSScriptRoot
$mavenCommand = Resolve-MavenCommand
$results = @()

$projects = @(
    @{ Number = 1; Name = 'Selenium Maven E2E'; Path = (Join-Path $base 'Selenium\Java\maven\curso\e2e'); Action = { & $mavenCommand test } },
    @{ Number = 2; Name = 'Selenium Maven API'; Path = (Join-Path $base 'Selenium\Java\maven\curso\api'); Action = { & $mavenCommand test } },
    @{ Number = 3; Name = 'Selenium Clean E2E'; Path = (Join-Path $base 'Selenium\Java\clean\curso'); Action = { & powershell -ExecutionPolicy Bypass -File '.\run-e2e.ps1' } },
    @{ Number = 4; Name = 'Selenium Clean API'; Path = (Join-Path $base 'Selenium\Java\clean\curso'); Action = { & powershell -ExecutionPolicy Bypass -File '.\run-api.ps1' } },
    @{ Number = 5; Name = 'Playwright Java E2E'; Path = (Join-Path $base 'Playwright\Java\maven\curso\e2e'); Action = { & $mavenCommand test } },
    @{ Number = 6; Name = 'Playwright Java API'; Path = (Join-Path $base 'Playwright\Java\maven\curso\api'); Action = { & $mavenCommand test } },
    @{ Number = 7; Name = 'Playwright JavaScript E2E'; Path = (Join-Path $base 'Playwright\javascript\npm\curso\e2e'); Action = { Ensure-NpmDependencies; & npm.cmd test } },
    @{ Number = 8; Name = 'Playwright JavaScript API'; Path = (Join-Path $base 'Playwright\javascript\npm\curso\api'); Action = { Ensure-NpmDependencies; & npm.cmd test } },
    @{ Number = 9; Name = 'Playwright TypeScript E2E'; Path = (Join-Path $base 'Playwright\TypeScript\npm\curso\e2e'); Action = { Ensure-NpmDependencies; & npm.cmd test } },
    @{ Number = 10; Name = 'Playwright TypeScript API'; Path = (Join-Path $base 'Playwright\TypeScript\npm\curso\api'); Action = { Ensure-NpmDependencies; & npm.cmd test } },
    @{ Number = 11; Name = 'Cypress E2E'; Path = (Join-Path $base 'Cypress\JavaScript\npm\curso\e2e'); Action = { Ensure-NpmDependencies; & npm.cmd test } },
    @{ Number = 12; Name = 'Cypress API'; Path = (Join-Path $base 'Cypress\JavaScript\npm\curso\api'); Action = { Ensure-NpmDependencies; & npm.cmd test } }
)

foreach ($project in $projects) {
    Invoke-Project -Number $project.Number -Name $project.Name -Path $project.Path -Action $project.Action -Results ([ref]$results)
}

$passed = ($results | Where-Object Status -eq 'PASS').Count
$failed = $results.Count - $passed

Write-Host "`n=====================================================================" -ForegroundColor Cyan
Write-Host 'RESUMEN' -ForegroundColor Cyan
Write-Host '=====================================================================' -ForegroundColor Cyan
Write-Host "Total: $($results.Count)" -ForegroundColor White
Write-Host "Pasaron: $passed" -ForegroundColor Green
Write-Host "Fallaron: $failed" -ForegroundColor $(if ($failed -eq 0) { 'Green' } else { 'Red' })

foreach ($result in $results) {
    $color = if ($result.Status -eq 'PASS') { 'Green' } else { 'Red' }
    Write-Host ("[{0}] {1} - {2}" -f $result.Number, $result.Status, $result.Name) -ForegroundColor $color
}

if ($failed -gt 0) {
    exit 1
}

exit 0
