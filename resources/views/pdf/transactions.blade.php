<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Transaksi</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #333;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 12px;
        }
        th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #fafafa;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 12px;
            color: #666;
        }
        .total {
            margin-top: 20px;
            text-align: right;
            font-weight: bold;
        }
        .grade {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            color: white;
            font-weight: bold;
            font-size: 11px;
            text-align: center;
        }
        .grade-a { background-color: #22c55e; }
        .grade-b { background-color: #3b82f6; }
        .grade-c { background-color: #eab308; }
        .grade-d { background-color: #ef4444; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Transaksi</h1>
        <p>Periode: {{ $dateRange }}</p>
        <p>Tanggal Export: {{ $exportTime->setTimezone('Asia/Jakarta')->format('d/m/Y H:i') }} WIB</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Nama</th>
                <th>Jurusan</th>
                <th>Produk</th>
                <th>Jumlah</th>
                <th>Total Omzet</th>
                <th>Nilai</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $index => $transaction)
                @php
                    $omzetValue = (int) preg_replace('/[^0-9]/', '', $transaction->formatted_omzet);
                    if ($omzetValue >= 300000) {
                        $grade = 'A';
                        $gradeClass = 'grade-a';
                    } elseif ($omzetValue >= 200000) {
                        $grade = 'B';
                        $gradeClass = 'grade-b';
                    } elseif ($omzetValue >= 100000) {
                        $grade = 'C';
                        $gradeClass = 'grade-c';
                    } else {
                        $grade = 'D';
                        $gradeClass = 'grade-d';
                    }
                @endphp
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($transaction->tanggal)->format('d/m/y') }}</td>
                    <td>{{ $transaction->user->name }}</td>
                    <td>{{ $transaction->user->major ?? 'Belum diisi' }}</td>
                    <td>{{ $transaction->product->nama_produk }}</td>
                    <td>{{ $transaction->jumlah_omzet }}</td>
                    <td>{{ $transaction->formatted_omzet }}</td>
                    <td><div class="grade {{ $gradeClass }}">{{ $grade }}</div></td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">
        Total Omzet: {{ 'Rp ' . number_format($transactions->sum('total_omzet'), 0, ',', '.') }}
    </div>

    <div class="footer">
        <p>* Laporan ini di-generate secara otomatis oleh sistem</p>
    </div>
</body>
</html> 