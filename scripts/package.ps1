#
# package.ps1
# Package binary file for release
#

# Exit script on first error
$ErrorActionPreference = "Stop"

# Path to the script
$WorkingDir = $PSScriptRoot
# Project directory
$ProjectDir = Resolve-Path "$WorkingDir\.."
# Package directory
$PackageDir = "$ProjectDir\release"
# Application name
$AppName = "dirstat"
# Generated .zip file
$ZipFile = "$PackageDir\$AppName.zip"
# Generated file containing checksum
$ChecksumFile = "$PackageDir\$AppName.zip.sha256"

# Clean previous generated files
Write-Host -ForegroundColor Yellow "Cleaning previous generated files"
if (Test-Path $PackageDir) {
    Remove-Item -Recurse $PackageDir
}

# Create Package directory
New-Item -Path $PackageDir -ItemType Directory | Out-Null

# Build
npm run build

# Compress binary into a .zip archive
Write-Host -ForegroundColor Yellow "Compressing files to $ZipFile"
Compress-Archive -LiteralPath "$ProjectDir\$AppName.exe" -CompressionLevel Optimal -DestinationPath $ZipFile

# Compute checksum
Write-Host -ForegroundColor Yellow "Computing and writing checksum to $ChecksumFile"
$Hash = (Get-FileHash -Algorithm SHA256 $ZipFile).Hash.ToLower()
Set-Content -Path $ChecksumFile -Value "$Hash *$AppName.zip`n" -Encoding ASCII -NoNewline

# Success message
Write-Host -ForegroundColor Green "Package successfully generated!"
Get-ChildItem $PackageDir
