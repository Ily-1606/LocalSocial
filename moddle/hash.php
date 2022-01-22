<?php
function encrypt($text)
{

    // Store the cipher method 
    $ciphering = "aes-256-ctr";

    // Use OpenSSl Encryption method 
    $iv_length = openssl_cipher_iv_length($ciphering);
    $options = 0;

    // Non-NULL Initialization Vector for encryption 
    $encryption_iv = '1234567891011121';

    // Store the encryption key 
    $encryption_key = "localsocial.net_api";

    // Use openssl_encrypt() function to encrypt the data 
    $encryption = openssl_encrypt(
        $text,
        $ciphering,
        $encryption_key,
        $options,
        $encryption_iv
    );
    return base64_encode($encryption);
}
function decrypt($text)
{
    $text = base64_decode($text);
    $options = 0;
    $ciphering = "aes-256-ctr";
    $decryption_iv = '1234567891011121';

    // Store the decryption key 
    $decryption_key = "localsocial.net_api";

    // Use openssl_decrypt() function to decrypt the data 
    $decryption = openssl_decrypt(
        $text,
        $ciphering,
        $decryption_key,
        $options,
        $decryption_iv
    );
    return $decryption;
}
if (isset($_GET["action"]) && isset($_GET["text"])) {
    $text = $_GET["text"];
    if ($_GET["action"] == "encrypt") {
        echo encrypt($text);
    } else {
        echo decrypt($text);
    }
}
