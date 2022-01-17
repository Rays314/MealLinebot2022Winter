:: There must be a command line argument as the description
:: Usage:
::   deploy.bat "The description of this version to be deployed"
@echo off
if "%~1"=="" (
    echo The description must be supplied as a command line argument.
) else (
    :: Deploy on Google with a consistent id
    echo clasp deploy -i "deployment ID" -d ^"%~1^"
    clasp deploy -i "deployment ID" -d ^"%~1^"
)
exit /B %errorlevel%