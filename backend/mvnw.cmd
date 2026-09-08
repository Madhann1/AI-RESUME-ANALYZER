@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------

@IF "%OPTION_BYPASS_SEARCH%"=="1" GOTO :start

@SETLOCAL

@SET MAVEN_CMD_LINE_ARGS=%*

@IF NOT "%JAVA_HOME%"=="" GOTO :checkJavaHome

:checkJavaHome
@IF EXIST "%JAVA_HOME%\bin\java.exe" GOTO :init

:init
@SET MAVEN_PROJECTBASEDIR=%~dp0
@IF NOT "%MAVEN_PROJECTBASEDIR%"=="" GOTO :strip

:strip
@SET MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

:start
@SET MAVEN_JAVA_EXE="%JAVA_HOME%\bin\java.exe"
@IF "%JAVA_HOME%"=="" SET MAVEN_JAVA_EXE=java.exe

%MAVEN_JAVA_EXE% -classpath "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
