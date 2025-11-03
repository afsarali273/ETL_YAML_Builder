# PowerShell script to prepare a portable distribution folder for React Vite app
# Usage: Run from project root in PowerShell

$ErrorActionPreference = "Stop"
$distFolder = "dist-app"
$nodejsVersion = "v20.11.1"
$nodejsZipUrl = "https://nodejs.org/dist/$nodejsVersion/node-$nodejsVersion-win-x64.zip"
$nodejsZip = "nodejs.zip"
$serverScript = "server.js"

Write-Host "╔═══════════════════════════════════════════════���════════╗" -ForegroundColor Cyan
Write-Host "║   ETL YAML Builder - Portable Build Generator        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Function to show progress
function Write-Progress-Message {
    param([string]$Message, [string]$Status = "INFO")
    $color = switch ($Status) {
        "SUCCESS" { "Green" }
        "ERROR" { "Red" }
        "WARNING" { "Yellow" }
        default { "White" }
    }
    Write-Host "[$Status] $Message" -ForegroundColor $color
}

try {
    # Step 1: Clean old build
    Write-Progress-Message "Cleaning old distribution folder..." "INFO"
    if (Test-Path $distFolder) {
        Remove-Item $distFolder -Recurse -Force
        Write-Progress-Message "Old distribution removed" "SUCCESS"
    }

    # Create dist folder
    New-Item -ItemType Directory -Path $distFolder | Out-Null
    Write-Progress-Message "Created new distribution folder" "SUCCESS"

    # Step 2: Build the React app
    Write-Host ""
    Write-Progress-Message "Building React application (this may take a minute)..." "INFO"
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed!"
    }
    Write-Progress-Message "React application built successfully" "SUCCESS"

    # Step 3: Copy built files
    Write-Host ""
    Write-Progress-Message "Copying built files..." "INFO"
    Copy-Item dist "$distFolder\dist" -Recurse
    Write-Progress-Message "Built files copied" "SUCCESS"

    # Step 4: Create simple HTTP server script
    Write-Progress-Message "Creating server script..." "INFO"
    $serverJs = @"
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.woff2': 'font/woff2',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm',
  '.yml': 'text/yaml',
  '.yaml': 'text/yaml'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = `.${'$'}{parsedUrl.pathname}`;
  
  // Default to index.html for SPA routing
  if (pathname === './') {
    pathname = './index.html';
  }
  
  const filePath = path.join(DIST_DIR, pathname);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found, serve index.html for SPA routing
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Error loading index.html');
          return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      });
      return;
    }
    
    // File exists, serve it
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error loading file');
        return;
      }
      
      const ext = path.parse(filePath).ext;
      const contentType = mimeTypes[ext] || 'text/plain';
      
      res.setHeader('Content-Type', contentType);
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════���════════╗');
  console.log('║         ETL YAML Builder - Server Started            ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🌐 Application URL: http://localhost:${'$'}{PORT}`);
  console.log('📝 Build YAML configurations visually');
  console.log('');
  console.log('⏹️  Press Ctrl+C to stop the server');
  console.log('');

  // Auto-open browser (Windows only)
  const { exec } = require('child_process');
  exec(`start http://localhost:${'$'}{PORT}`, (err) => {
    if (err) {
      console.log('⚠️  Could not auto-open browser. Please manually visit the URL above.');
    } else {
      console.log('✅ Opening browser automatically...');
    }
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('');
  console.log('👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped successfully');
    process.exit(0);
  });
});
"@

    Set-Content -Path "$distFolder\$serverScript" -Value $serverJs -Encoding UTF8
    Write-Progress-Message "Server script created" "SUCCESS"

    # Step 5: Download and extract portable Node.js
    Write-Host ""
    Write-Progress-Message "Downloading portable Node.js $nodejsVersion..." "INFO"
    Write-Host "   This may take a few minutes depending on your connection..." -ForegroundColor Gray

    # Use WebClient for better progress
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($nodejsZipUrl, $nodejsZip)

    Write-Progress-Message "Node.js downloaded successfully" "SUCCESS"

    Write-Progress-Message "Extracting Node.js..." "INFO"
    Expand-Archive -Path $nodejsZip -DestinationPath $distFolder -Force
    $extractedFolder = Get-ChildItem -Path $distFolder -Directory | Where-Object { $_.Name -like "node-*" } | Select-Object -First 1
    if ($extractedFolder) {
        Rename-Item -Path $extractedFolder.FullName -NewName "nodejs" -Force
    }
    Remove-Item $nodejsZip -Force
    Write-Progress-Message "Node.js extracted and configured" "SUCCESS"

    # Step 6: Create run.bat with enhanced features
    Write-Host ""
    Write-Progress-Message "Creating startup script..." "INFO"
    $runBat = @"
@echo off
chcp 65001 >nul
setlocal

title ETL YAML Builder - Starting...

echo.
echo ╔═══════════════════════════════════════���════════════════╗
echo ║       ETL YAML Builder - Portable Edition             ║
echo ╚═══════════════════════���════════════════════════════════╝
echo.
echo 🚀 Starting application...
echo.

REM Check if nodejs exists
if not exist "nodejs\node.exe" (
    echo ❌ ERROR: Node.js runtime not found!
    echo.
    echo Please ensure the 'nodejs' folder exists in this directory.
    echo.
    pause
    exit /b 1
)

REM Check if dist folder exists
if not exist "dist" (
    echo ❌ ERROR: Application files not found!
    echo.
    echo Please ensure the 'dist' folder exists in this directory.
    echo.
    pause
    exit /b 1
)

REM Set port (change this if 3000 is busy)
set PORT=3000

REM Start the server
title ETL YAML Builder - Running on port %PORT%
nodejs\node.exe server.js

if errorlevel 1 (
    echo.
    echo ❌ Server encountered an error!
    echo.
    pause
)

endlocal
"@

    Set-Content -Path "$distFolder\run.bat" -Value $runBat -Encoding UTF8
    Write-Progress-Message "Startup script created" "SUCCESS"

    # Step 7: Create README.txt
    Write-Progress-Message "Creating documentation..." "INFO"
    $readmeTxt = @"
╔════════════════════════════════════════════════════════════════════╗
║          ETL YAML Builder - Portable Distribution                 ║
║                    Version 1.0.0                                   ║
╚════════════════════════════════════════════════════════════════════╝

📦 ABOUT
--------
This is a portable version of ETL YAML Builder that runs without any
installation. It includes everything needed to run the application.

🚀 HOW TO RUN
-------------
1. Double-click 'run.bat' to start the application
2. The app will automatically open in your default browser at:
   http://localhost:3000
3. To stop the server, close the command window or press Ctrl+C

📁 FOLDER STRUCTURE
-------------------
dist-app/
├── dist/          - Built React application files
├── nodejs/        - Portable Node.js runtime ($nodejsVersion)
├── server.js      - Simple HTTP server
├── run.bat        - Windows startup script
└── README.txt     - This file

✨ FEATURES
-----------
• Visual YAML configuration builder for ETL pipelines
• Support for multiple validation types:
  - Row Count, Row Compare, Column Count
  - Null Check, Value Check, Duplicate Check
  - Schema Compare, Insert Existing Data
• Real-time YAML preview
• YAML editor with syntax highlighting
• Export configurations to .yml files
• No internet connection required after setup

💻 SYSTEM REQUIREMENTS
----------------------
• Windows 7 or later (64-bit)
• 100 MB free disk space
• No additional software installation required
• Internet browser (Chrome, Firefox, Edge, etc.)

🔧 TROUBLESHOOTING
------------------
Issue: Port 3000 is already in use
Solution: Edit run.bat and change "set PORT=3000" to another port number

Issue: Browser doesn't open automatically
Solution: Manually navigate to http://localhost:3000 in your browser

Issue: Windows Defender blocks the application
Solution: Allow nodejs.exe to run in Windows Defender settings

Issue: Application won't start
Solution: Ensure both 'nodejs' and 'dist' folders exist in this directory

🌐 USAGE TIPS
-------------
• Build configurations are created in-memory and not saved automatically
• Always download your YAML files before closing the browser
• The application runs locally - your data never leaves your computer
• You can run multiple instances on different ports

📞 SUPPORT
----------
For issues, questions, or feature requests:
• GitHub: https://github.com/your-repo/etl-yaml-builder
• Email: support@your-domain.com

📄 LICENSE
----------
Copyright © $(Get-Date -Format "yyyy") - All rights reserved

═══════════════════════════════════════════════���═══════════════════

Build Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Node.js Version: $nodejsVersion
"@

    Set-Content -Path "$distFolder\README.txt" -Value $readmeTxt -Encoding UTF8
    Write-Progress-Message "Documentation created" "SUCCESS"

    # Step 8: Create a version info file
    $versionInfo = @{
        version = "1.0.0"
        buildDate = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        nodeVersion = $nodejsVersion
        platform = "Windows x64"
    }
    $versionInfo | ConvertTo-Json | Set-Content -Path "$distFolder\version.json" -Encoding UTF8

    # Calculate distribution size
    $distSize = (Get-ChildItem $distFolder -Recurse | Measure-Object -Property Length -Sum).Sum
    $distSizeMB = [math]::Round($distSize / 1MB, 2)

    # Success message
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════���════════╗" -ForegroundColor Green
    Write-Host "║        ✅ PORTABLE BUILD CREATED SUCCESSFULLY!         ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════���════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Location:      " -NoNewline -ForegroundColor Cyan
    Write-Host "$((Get-Item $distFolder).FullName)" -ForegroundColor White
    Write-Host "📦 Total Size:    " -NoNewline -ForegroundColor Cyan
    Write-Host "$distSizeMB MB" -ForegroundColor White
    Write-Host "🚀 To Run:        " -NoNewline -ForegroundColor Cyan
    Write-Host "Double-click 'run.bat' inside the $distFolder folder" -ForegroundColor White
    Write-Host "🌐 Access URL:    " -NoNewline -ForegroundColor Cyan
    Write-Host "http://localhost:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Contents:" -ForegroundColor Yellow
    Write-Host "   • React Application (built)" -ForegroundColor Gray
    Write-Host "   • Node.js Runtime ($nodejsVersion)" -ForegroundColor Gray
    Write-Host "   • HTTP Server" -ForegroundColor Gray
    Write-Host "   • Startup Scripts" -ForegroundColor Gray
    Write-Host "   • Documentation" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Tip: You can copy the entire '$distFolder' folder to any Windows PC" -ForegroundColor Magenta
    Write-Host "        and run it without any installation!" -ForegroundColor Magenta
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════���════════╗" -ForegroundColor Red
    Write-Host "║                    ❌ BUILD FAILED                     ║" -ForegroundColor Red
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Stack Trace:" -ForegroundColor Yellow
    Write-Host $_.ScriptStackTrace -ForegroundColor Gray
    Write-Host ""
    exit 1
}
