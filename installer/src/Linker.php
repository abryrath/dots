<?php

namespace abryrath\installer;

use Psr\Log\LoggerInterface;

class Linker
{
    private $logger;
    public $srcDir = '';
    public $targetDir = '';

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
        $this->targetDir = getenv('HOME');
    }

    public function setSrcDir($srcDir)
    {
        $this->srcDir = $srcDir;
        $this->logger->debug("Setting src directory: $srcDir");
    }

    public function setTargetDir($targetDir)
    {
        $this->targetDir = $targetDir;
        $this->logger->debug("Setting target directory: $targetDir");

        if (!file_exists($targetDir)) {
            $this->logger->warning("Target directory does not exist");
        }

        if (!\is_dir($targetDir)) {
            $this->logger->warning("Target directory path is not a directory");
        }
    }

    public function link($relativeDir = '')
    {
        $dir = $this->srcDir;
        if ($relativeDir !== '') {
            $dir = $this->srcDir . DIRECTORY_SEPARATOR . $relativeDir;
        }

        $files = $this->getSrcFiles($dir);
        foreach ($files as $file) {
            $filePath = $dir . DIRECTORY_SEPARATOR . $file;
            
            $relativeFile = $relativeDir . DIRECTORY_SEPARATOR . $file;
            if (\is_dir($filePath)) {
                $this->logger->debug("src file is a directory. Dropping in recursively [$relativeFile]");
                $this->link($relativeFile);
            } else {
                $this->logger->debug("src file is a file. Linking [$relativeFile]");
                $this->linkFile($file, $relativeDir);
            }
        }
    }

    public function linkFile($file, $relativeDir)
    {
        $this->logger->debug("linking file $file [relativeDir: $relativeDir]");
        $src = $this->srcDir . $relativeDir . DIRECTORY_SEPARATOR . $file;
        $target = $this->targetDir . $relativeDir . DIRECTORY_SEPARATOR . $file;
        // \symlink()
        
        $targetDir = $this->targetDir . $relativeDir;
        if (!is_dir($targetDir)) {
            // $this->logger->debug("mkdir($targetDir, 644, true)");
            $output = [];
            $user = getenv('USER');
            $cmd = "sudo mkdir -p $targetDir && sudo chown -R $user $targetDir && chmod 644 $targetDir";
            $this->logger->debug("cmd: $cmd");
            exec($cmd, $output);
            $this->logger->debug('output: ' . json_encode($output));
        }

        if (file_exists($target)) {
            $output = [];
            $cmd = "sudo rm $target";
            $this->logger->debug("cmd: $cmd");
            exec($cmd, $output);
            $this->logger->debug("file existed - removed [$target]");
        }

        $output = [];
        $cmd = "ln -s $src $target";
        $this->logger->debug("cmd: $cmd");
        exec($cmd, $output);
        $this->logger->debug("output: " . json_encode($output));
    }

    private function getSrcFiles($dir)
    {
        $files = \scandir($dir);
        $files = array_filter(
            $files,
            /**
             * @param string $file
             * @return bool
             */
            function ($file) {
                if ($file === ".") {
                    return false;
                } elseif ($file === "..") {
                    return false;
                }
                return true;
            }
        );
        return $files;
    }
}
