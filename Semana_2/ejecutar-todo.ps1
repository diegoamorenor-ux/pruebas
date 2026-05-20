$ErrorActionPreference = "Stop"
$env:MAVEN_OPTS = "--enable-final-field-mutation=ALL-UNNAMED --sun-misc-unsafe-memory-access=allow"

if ($PSVersionTable.PSVersion.Major -ge 7) {
    $PSNativeCommandUseErrorActionPreference = $true
}

function Assert-LastExitCode {
    param([string] $CommandName)
    if ($LASTEXITCODE -ne 0) {
        throw "El comando '$CommandName' finalizo con codigo $LASTEXITCODE"
    }
}

function Write-Step {
    param([string] $Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Invoke-Maven {
    param(
        [string] $ProjectPath
    )

    $mvn = Get-Command mvn -ErrorAction SilentlyContinue
    if ($mvn) {
        Push-Location $ProjectPath
        try {
            & mvn test
            Assert-LastExitCode "mvn test"
        } finally {
            Pop-Location
        }
        return
    }

    $toolsPath = Join-Path $PSScriptRoot ".tools"
    $mavenVersion = "3.9.11"
    $mavenHome = Join-Path $toolsPath "apache-maven-$mavenVersion"
    $mavenCmd = Join-Path $mavenHome "bin/mvn.cmd"

    if (!(Test-Path $mavenCmd)) {
        New-Item -ItemType Directory -Force -Path $toolsPath | Out-Null
        $zipPath = Join-Path $toolsPath "apache-maven-$mavenVersion-bin.zip"
        if (!(Test-Path $zipPath)) {
            Invoke-WebRequest `
                -Uri "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip" `
                -OutFile $zipPath
        }
        Expand-Archive -Path $zipPath -DestinationPath $toolsPath -Force
    }

    Push-Location $ProjectPath
    try {
        & $mavenCmd test
        Assert-LastExitCode "mvn.cmd test"
    } finally {
        Pop-Location
    }
}

Write-Step "1. Framework: Selenium | Lenguaje: Java | Arquitectura: Clean (sin Maven)"
Push-Location "$PSScriptRoot\Selenium\Java\clean\curso"
try {
    & "$PSScriptRoot\Selenium\Java\clean\curso\run-e2e.ps1"
    Assert-LastExitCode "run-e2e.ps1"

    & "$PSScriptRoot\Selenium\Java\clean\curso\run-api.ps1"
    Assert-LastExitCode "run-api.ps1"
} finally {
    Pop-Location
}

Write-Step "2. Framework: Selenium | Lenguaje: Java | Arquitectura: Maven"
Invoke-Maven "$PSScriptRoot\Selenium\Java\maven\curso\e2e"

Write-Step "3. Framework: Playwright | Lenguaje: Java | Arquitectura: Maven"
Invoke-Maven "$PSScriptRoot\Playwright\Java\maven\curso\e2e"

Write-Step "4. Framework: Playwright | Lenguaje: JavaScript | Arquitectura: npm"
Push-Location "$PSScriptRoot\Playwright\javascript\npm\curso\e2e"
try {
    npm install
    Assert-LastExitCode "npm install"
    npm test
    Assert-LastExitCode "npm test"
} finally {
    Pop-Location
}

Write-Step "5. Framework: Playwright | Lenguaje: TypeScript | Arquitectura: npm + typecheck"
Push-Location "$PSScriptRoot\Playwright\TypeScript\npm\curso\e2e"
try {
    npm install
    Assert-LastExitCode "npm install"
    npm run typecheck
    Assert-LastExitCode "npm run typecheck"
    npm test
    Assert-LastExitCode "npm test"
} finally {
    Pop-Location
}

$cypressPath = Join-Path $PSScriptRoot "Cypress\JavaScript\npm\curso\e2e"
if (Test-Path $cypressPath) {
    Write-Step "6. Framework: Cypress | Lenguaje: JavaScript | Arquitectura: npm"
    Push-Location $cypressPath
    try {
        npm install
        Assert-LastExitCode "npm install"
        npm test
        Assert-LastExitCode "npm test"
    } finally {
        Pop-Location
    }
} else {
    Write-Step "6. Framework: Cypress"
    Write-Host "No se encontro proyecto Cypress en Cypress/JavaScript/npm/curso/e2e. Se omite esta etapa." -ForegroundColor Yellow
}

$seleniumApiMavenPath = Join-Path $PSScriptRoot "Selenium\Java\maven\curso\api"
if (Test-Path $seleniumApiMavenPath) {
    Write-Step "7. Framework: Selenium | Lenguaje: Java | Tipo: API | Arquitectura: Maven"
    Invoke-Maven $seleniumApiMavenPath
} else {
    Write-Step "7. Framework: Selenium API"
    Write-Host "No se encontro proyecto API en Selenium/Java/maven/curso/api. Se omite esta etapa." -ForegroundColor Yellow
}

$playwrightJavaApiPath = Join-Path $PSScriptRoot "Playwright\Java\maven\curso\api"
if (Test-Path $playwrightJavaApiPath) {
    Write-Step "8. Framework: Playwright | Lenguaje: Java | Tipo: API | Arquitectura: Maven"
    Invoke-Maven $playwrightJavaApiPath
} else {
    Write-Step "8. Framework: Playwright Java API"
    Write-Host "No se encontro proyecto API en Playwright/Java/maven/curso/api. Se omite esta etapa." -ForegroundColor Yellow
}

$playwrightJsApiPath = Join-Path $PSScriptRoot "Playwright\javascript\npm\curso\api"
if (Test-Path $playwrightJsApiPath) {
    Write-Step "9. Framework: Playwright | Lenguaje: JavaScript | Tipo: API | Arquitectura: npm"
    Push-Location $playwrightJsApiPath
    try {
        npm install
        Assert-LastExitCode "npm install"
        npm test
        Assert-LastExitCode "npm test"
    } finally {
        Pop-Location
    }
} else {
    Write-Step "9. Framework: Playwright JavaScript API"
    Write-Host "No se encontro proyecto API en Playwright/javascript/npm/curso/api. Se omite esta etapa." -ForegroundColor Yellow
}

$playwrightTsApiPath = Join-Path $PSScriptRoot "Playwright\TypeScript\npm\curso\api"
if (Test-Path $playwrightTsApiPath) {
    Write-Step "10. Framework: Playwright | Lenguaje: TypeScript | Tipo: API | Arquitectura: npm + typecheck"
    Push-Location $playwrightTsApiPath
    try {
        npm install
        Assert-LastExitCode "npm install"
        npm run typecheck
        Assert-LastExitCode "npm run typecheck"
        npm test
        Assert-LastExitCode "npm test"
    } finally {
        Pop-Location
    }
} else {
    Write-Step "10. Framework: Playwright TypeScript API"
    Write-Host "No se encontro proyecto API en Playwright/TypeScript/npm/curso/api. Se omite esta etapa." -ForegroundColor Yellow
}

$cypressApiPath = Join-Path $PSScriptRoot "Cypress\JavaScript\npm\curso\api"
if (Test-Path $cypressApiPath) {
    Write-Step "11. Framework: Cypress | Lenguaje: JavaScript | Tipo: API | Arquitectura: npm"
    Push-Location $cypressApiPath
    try {
        npm install
        Assert-LastExitCode "npm install"
        npm test
        Assert-LastExitCode "npm test"
    } finally {
        Pop-Location
    }
} else {
    Write-Step "11. Framework: Cypress API"
    Write-Host "No se encontro proyecto API en Cypress/JavaScript/npm/curso/api. Se omite esta etapa." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Todos los proyectos finalizaron correctamente." -ForegroundColor Green
