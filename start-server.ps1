$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Server started at http://localhost:8080"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $localPath = $request.Url.LocalPath
    if ($localPath -eq "/") {
        $localPath = "/index.html"
    }
    
    $filePath = Join-Path -Path $PSScriptRoot -ChildPath $localPath.TrimStart("/")
    
    if (Test-Path $filePath -PathType Leaf) {
        $extension = [System.IO.Path]::GetExtension($filePath)
        $contentType = switch ($extension) {
            ".html" { "text/html" }
            ".css" { "text/css" }
            ".js" { "application/javascript" }
            ".png" { "image/png" }
            ".jpg" { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".gif" { "image/gif" }
            ".webp" { "image/webp" }
            ".ico" { "image/x-icon" }
            ".svg" { "image/svg+xml" }
            ".woff" { "font/woff" }
            ".woff2" { "font/woff2" }
            ".ttf" { "font/ttf" }
            ".json" { "application/json" }
            ".mp3" { "audio/mpeg" }
            ".wav" { "audio/wav" }
            ".ogg" { "audio/ogg" }
            default { "application/octet-stream" }
        }
        
        $response.ContentType = $contentType
        $fileContent = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $fileContent.Length
        $response.OutputStream.Write($fileContent, 0, $fileContent.Length)
    } else {
        $response.StatusCode = 404
        $response.ContentType = "text/html"
        $errorContent = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1>")
        $response.ContentLength64 = $errorContent.Length
        $response.OutputStream.Write($errorContent, 0, $errorContent.Length)
    }
    
    $response.Close()
}

$listener.Stop()
$listener.Close()