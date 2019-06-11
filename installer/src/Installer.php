<?php

namespace abryrath\installer;

use League\Container\Container;
use Psr\Log\LoggerInterface;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

class Installer
{
    public $container;

    /** @var bool $linux */
    public $linux = true;

    public function __construct()
    {
        $this->logger = new Logger('installer');
        $this->logger->pushHandler(new StreamHandler('php://stdout', Logger::DEBUG));

        $this->container = new Container();
        $this->container->add(Linker::class)->addArgument(LoggerInterface::class);
        $this->container->add(LoggerInterface::class, $this->logger);

        // $this->container->add(LoggerInterface::class, Logger::class)->addArgument('logger');        
    }

    public function run()
    {
        $output = [];
        exec('uname -a', $output);

        if (strpos(implode(' ', $output), 'Darwin') !== false) {
            $this->linux = false;
        }

        echo "Linux: " . ($this->linux ? 'Y' : 'N') . PHP_EOL;

        $commonLinker = $this->container->get(Linker::class);
        $commonLinker->setSrcDir(__DIR__ . '/../../common');
        $commonLinker->link();

        if ($this->linux) {
            $linuxLinker = $this->container->get(Linker::class);
            $linuxLinker->setSrcDir(__DIR__ . '/../../dots-linux');
            $linuxLinker->link();
        } else {
            $macLinker = $this->container->get(Linker::class);
            $macLinker->setSrcDir(__DIR__ . '/../../dots-mac');
            $macLinker->link();
        }
    }
}
