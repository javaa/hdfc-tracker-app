## Setting up project

curl -s "https://laravel.build/hdfc-tracker-app" | bash
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate
./vendor/bin/sail down
./vendor/bin/sail npm run dev

## Technologies used
- Laravel
- MySQL
- Intertia.js
- Reactjs
- PrimeReact
- Tailwind CSS



