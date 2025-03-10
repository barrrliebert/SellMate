<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Omzet</title>
    <style>
        table { width: 100%; border-collapse: collapse; }
        table, th, td { border: 1px solid #000; }
        th, td { padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <h2>Laporan Omzet</h2>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Jurusan</th>
                <th>Total Omzet</th>
                <th>Nilai</th>
                <th>Tanggal Omzet</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($omzetList as $index => $item)
            @php
                // Mengubah formatted omzet menjadi integer
                $value = (int) preg_replace('/\D/', '', $item->formatted_omzet);
                if ($value >= 300000) {
                    $grade = 'A';
                } elseif ($value >= 200000) {
                    $grade = 'B';
                } elseif ($value >= 100000) {
                    $grade = 'C';
                } else {
                    $grade = 'D';
                }
            @endphp
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $item->user->name ?? 'Data tidak tersedia' }}</td>
                <td>{{ $item->user->major ?? 'Belum diisi' }}</td>
                <td>{{ $item->formatted_omzet }}</td>
                <td>{{ $grade }}</td>
                <td>{{ $item->tanggal->format('d-m-Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
