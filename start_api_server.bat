@echo off
cd vote-api
set RUBYOPT=-E UTF-8
ruby bin/rails server
