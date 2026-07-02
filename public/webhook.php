<?php
// webhook.php

// Keep this file secure
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit();
}

$input = @file_get_contents("php://input");
$event = json_decode($input);

if (!$event || !isset($event->event)) {
    http_response_code(400);
    exit();
}

// Verify event is successful payment
if ($event->event === 'charge.success') {
    $amount_raised = $event->data->amount / 100; // Paystack amount is in kobo/cents

    // Read current stats
    $stats_file = 'stats.json';
    if (!file_exists($stats_file)) {
        // Initialize default stats if it doesn't exist
        $stats = [
            'total' => 45231,
            'raised' => 452310,
            'today' => 1223
        ];
    } else {
        $stats = json_decode(file_get_contents($stats_file), true);
    }

    // Update stats
    $stats['total'] += 1;
    $stats['raised'] += $amount_raised;
    $stats['today'] += 1;

    // Save back to stats.json
    file_put_contents($stats_file, json_encode($stats));

    http_response_code(200);
    echo "Webhook received and processed";
} else {
    http_response_code(200);
    echo "Event ignored";
}
?>
