$ErrorActionPreference = 'Stop'

Push-Location $PSScriptRoot
try {
    javac -encoding UTF-8 -cp "lib/*" -d "e2e/bin" (Get-ChildItem -Recurse "e2e/src" -Filter *.java).FullName
    java --enable-final-field-mutation=ALL-UNNAMED "-Djava.util.logging.config.file=./config/logging.properties" -cp "e2e/bin;lib/*" org.junit.platform.console.ConsoleLauncher execute --scan-class-path --details-theme=ascii
} finally {
    Pop-Location
}
