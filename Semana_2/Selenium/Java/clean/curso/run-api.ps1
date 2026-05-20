$ErrorActionPreference = 'Stop'

Push-Location $PSScriptRoot
try {
    javac -encoding UTF-8 -cp "lib/*" -d "api/bin" (Get-ChildItem -Recurse "api/src" -Filter *.java).FullName
    java -cp "api/bin;lib/*" org.junit.platform.console.ConsoleLauncher execute --scan-class-path --details-theme=ascii
} finally {
    Pop-Location
}
