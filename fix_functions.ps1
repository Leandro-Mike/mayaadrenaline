$Path = "c:\Users\leand\Local Sites\mayaadrenaline\app\public\wp-content\themes\MayaAdrenalineTheme\functions.php"
$NewPath = "c:\Users\leand\Local Sites\mayaadrenaline\app\public\wp-content\themes\MayaAdrenalineTheme\functions_fixed.php"

$Lines = Get-Content $Path
$NewLines = @()
$Found = $false

foreach ($Line in $Lines) {
    if ($Line -match "function maya_adrenaline_handle_deploy_ajax") {
        $Found = $true
        break
    }
    # Also break if we see corruption indicators like "= wp_remote_retrieve_"
    if ($Line -match "= wp_remote_retrieve_") {
        $Found = $true 
        break
    }
    $NewLines += $Line
}

# If we didn't find the function start, maybe we cut it off previously.
# But we must append the clean function now.

$NewLines | Set-Content $NewPath -Encoding UTF8

$FunctionCode = @"

/**
 * AJAX Handler for GitHub Deploy Trigger
 */
add_action( 'wp_ajax_maya_adrenaline_trigger_deploy', 'maya_adrenaline_handle_deploy_ajax' );

function maya_adrenaline_handle_deploy_ajax() {
    check_ajax_referer( 'ma_deploy_nonce', 'security' );

    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( 'No tienes permisos.' );
    }

    `$repo = get_option( 'ma_github_repo' );
    `$token = get_option( 'ma_github_token' );

    if ( ! `$repo || ! `$token ) {
        wp_send_json_error( 'Configuración de GitHub incompleta. Revisa la pestaña Deploy.' );
    }

    `$url = 'https://api.github.com/repos/' . `$repo . '/dispatches';
    
    `$body = json_encode( array(
        'event_type' => 'deploy_trigger'
    ) );

    `$args = array(
        'body'        => `$body,
        'headers'     => array(
            'Authorization' => 'token ' . `$token,
            'Accept'        => 'application/vnd.github.v3+json',
            'User-Agent'    => 'WordPress/' . get_bloginfo( 'version' ),
        ),
        'method'      => 'POST',
        'data_format' => 'body',
    );

    `$response = wp_remote_post( `$url, `$args );

    if ( is_wp_error( `$response ) ) {
        wp_send_json_error( `$response->get_error_message() );
    }

    `$code = wp_remote_retrieve_response_code( `$response );

    if ( `$code === 204 ) {
        wp_send_json_success( 'Despliegue iniciado correctamente.' );
    } else {
        `$msg = wp_remote_retrieve_body( `$response );
        wp_send_json_error( 'Error de GitHub (' . `$code . '): ' . `$msg );
    }
}
"@

Add-Content -Path $NewPath -Value $FunctionCode -Encoding UTF8

Move-Item -Path $NewPath -Destination $Path -Force
Write-Host "Fixed functions.php"
