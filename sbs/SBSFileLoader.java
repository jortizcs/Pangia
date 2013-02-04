import java.io.*;
import java.nio.*;
import java.nio.channels.*;
import java.util.*;

public class SBSFileLoader {
    protected static File filesDir = new File("files");
    protected static Stack<File> filesToProcess = new Stack<File>();
    
    public static void main(String[] args){
        try {
            while(true){
                File f = null;
                try {
                    f = filesToProcess.pop();
                } catch(Exception e){}

                if(f==null){
                    Thread.sleep(60*1000);
                    loadNewFiles();
                } else {
                    MappedByteBuffer pages = new RandomAccessFile(f, "r").
                                getChannel().map(FileChannel.MapMode.READ_ONLY, 0, f.length());
                    while(true){
                        StringBuffer line = new StringBuffer();
                        char c;
                        boolean done=false;
                        try {
                            while((c=(char)pages.get())!='\n')
                                line.append(c);
                        } catch(Exception e){
                            done=true;
                        }
                        StringTokenizer tokenizer = new StringTokenizer(line.toString(), ",");
                        Vector<String> tokens = new Vector<String>();
                        while(tokenizer.hasMoreTokens())
                            tokens.add(tokenizer.nextToken().replaceAll("\\s+", ""));
                        if(tokens.size()==3)
                            System.out.println("put user.id " + tokens.elementAt(0) + " "  + tokens.elementAt(1) + " user=" + 
                                tokens.elementAt(2));
                    
                        if(done){
                            f.renameTo(new File(filesDir.getName() + "/" + f.getName() + ".pd"));
                            break;
                        }
                    }
                }
            }
        } catch(Exception e){
            e.printStackTrace();
        }
    }

    public static void loadNewFiles(){
        try {
            File[] uploadedFiles = filesDir.listFiles();
            for(int i=0; i<uploadedFiles.length; i++){
                File thisFile= uploadedFiles[i];
                if(thisFile.isFile() && (thisFile.getName().endsWith(".csv") || thisFile.getName().endsWith(".txt")))
                    filesToProcess.push(thisFile);
            }
        } catch(Exception e){
            e.printStackTrace();
        }
        
    }
}
