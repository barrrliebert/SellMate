<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $greeting ?? 'Hello!' }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            color: #374151;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #DD661D 0%, #F4A261 100%);
            padding: 40px 24px;
            text-align: center;
            position: relative;
        }
        .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.2) 75%);
            animation: shimmer 2s infinite linear;
        }
        @keyframes shimmer {
            0% { background-position: -600px 0 }
            100% { background-position: 600px 0 }
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .content {
            padding: 32px;
            background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
        }
        .greeting {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #1f2937;
            border-bottom: 2px solid #DD661D;
            padding-bottom: 12px;
            display: inline-block;
        }
        .message {
            margin-bottom: 32px;
            color: #4b5563;
            font-size: 16px;
            line-height: 1.8;
        }
        .message p {
            margin: 16px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #DD661D 0%, #F4A261 100%);
            color: white;
            padding: 14px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 24px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(221, 102, 29, 0.2), 0 2px 4px -1px rgba(221, 102, 29, 0.1);
        }
        .button:hover {
            background: linear-gradient(135deg, #BB551A 0%, #E76F51 100%);
            transform: translateY(-1px);
            box-shadow: 0 6px 8px -1px rgba(221, 102, 29, 0.3), 0 4px 6px -1px rgba(221, 102, 29, 0.2);
        }
        .footer {
            padding: 24px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            background: #f8fafc;
        }
        .subcopy {
            margin-top: 32px;
            padding: 20px;
            border-radius: 8px;
            background: #f3f4f6;
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
        }
        .subcopy span {
            display: inline-block;
            margin-top: 8px;
            color: #DD661D;
            word-break: break-all;
        }
        .logo {
            width: 64px;
            height: 64px;
            margin-bottom: 16px;
            border-radius: 12px;
            background: white;
            padding: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            @if (config('app.logo'))
                <img src="{{ config('app.logo') }}" alt="Logo" class="logo">
@endif
            <h1>{{ config('app.name') }}</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                {{ $greeting ?? 'Hello!' }}
            </div>

            <div class="message">
@foreach ($introLines as $line)
                    <p style="margin: 0 0 20px 0; padding: 0;">{{ $line }}</p>
@endforeach

@isset($actionText)
                    <center style="margin: 32px 0;">
                        <a href="{{ $actionUrl }}" class="button" style="margin: 0;">{{ $actionText }}</a>
                    </center>
@endisset

@foreach ($outroLines as $line)
                    <p style="margin: 20px 0 0 0; padding: 0; font-size: 14px; color: #6b7280;">{{ $line }}</p>
@endforeach
            </div>

@isset($actionText)
                <div class="subcopy">
                    If you're having trouble clicking the "{{ $actionText }}" button, copy and paste the URL below into your web browser: <br>
                    <span>{{ $actionUrl }}</span>
                </div>
@endisset
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            <p style="margin-top: 8px; font-size: 12px;">This is an automated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>