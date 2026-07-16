<?php

namespace App\Console\Commands;

use Illuminate\Foundation\Console\ServeCommand;

use function Illuminate\Support\php_binary;

class ServeWithUploadsCommand extends ServeCommand
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'serve';

    /**
     * Start the local PHP server with the upload limits required by the admin CMS.
     *
     * @return list<string>
     */
    protected function serverCommand(): array
    {
        $server = file_exists(base_path('server.php'))
            ? base_path('server.php')
            : dirname(__DIR__, 3).'/vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php';

        return [
            php_binary(),
            '-d',
            'upload_max_filesize=12M',
            '-d',
            'post_max_size=16M',
            '-S',
            $this->host().':'.$this->port(),
            $server,
        ];
    }
}
