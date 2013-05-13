Contains SBS file

1.  After starting OpenTSDB, start the tsdb shim with the following steps
2.  javac -classpath .:lib/commons-logging-1.1.jar:lib/json-simple-1.1.1.jar:lib/simple.jar TsdbShim.java
3.  nohup java -classpath .:lib/commons-logging-1.1.jar:lib/json-simple-1.1.1.jar:lib/simple.jar TsdbShim &

You should get an empty json array when you go to the following URL:
http://166.78.31.162:1338/
