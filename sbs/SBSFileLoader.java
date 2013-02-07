import java.io.*;
import java.nio.*;
import java.nio.channels.*;
import java.util.*;
import java.net.*;

import org.json.simple.*;

public class SBSFileLoader {

    //params for tcollector (opentsdb feeder)
    private static String tsdb_address = "localhost";
    private static int tsdb_port = 1337;
    private static DatagramSocket dsock = null;
    private static String net = null;
    //////////////////////

    protected static File filesDir = new File("/Users/jortiz/pangia/Pangia.dev-anomaly/sbs/files");
    protected static Stack<File> filesToProcess = new Stack<File>();
    
    public static void main(String[] args){
        try {
            if(args.length==1 && args[0].equals("udp")){
                net = "udp";}
            else if(args.length==1){
                System.out.println("Unknown param=" + args[0]);
                System.exit(1);
            }
            loadNewFiles();
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
                        StringTokenizer tokenizer = null;
                        boolean isGutpData = false;
                        if(f.getName().endsWith(".dat") && f.getName().contains("tokyo")){
                            tokenizer = new StringTokenizer(line.toString(), "\t");
                            isGutpData = true;
                        } else {
                            tokenizer = new StringTokenizer(line.toString(), ",");
                        }
                        Vector<String> tokens = new Vector<String>();
                        while(tokenizer.hasMoreTokens())
                            tokens.add(tokenizer.nextToken().replaceAll("\\s+", ""));
                        if(tokens.size()==3 && net==null){
                            System.out.println("sbs.user.id " + tokens.elementAt(0) + " "  + tokens.elementAt(1) + " label=" + 
                                tokens.elementAt(2));
                        } else if(tokens.size()==3 && net.equals("udp")){
                            if(dsock ==null)
                                dsock = new DatagramSocket();
                            JSONObject obj = new JSONObject();
                            obj.put("metric", "sbs.user.id");
                            obj.put("ts", tokens.elementAt(0));
                            obj.put("value", tokens.elementAt(1));
                            obj.put("label", tokens.elementAt(2));
                            byte[] data = obj.toString().getBytes();
                            System.out.println(obj);
                            DatagramPacket packet = new DatagramPacket(data, data.length, InetAddress.getByName(tsdb_address), tsdb_port);
                            dsock.send(packet);
                        } 
                        //handle gutp data
                        else if(tokens.size()==2 && isGutpData){
                            String gutpFHdr = "http__fiap-gw.gutp.ic.i.u-tokyo.ac.jp_EngBldg2_";
                            String label = f.getName().replaceAll(gutpFHdr, "").replaceAll(".dat","");
                            label.replaceAll("\\s+","");
                            System.out.println("sbs.user.id " + tokens.elementAt(0) + " "  + tokens.elementAt(1) + " label=" + label);
                        }
                    
                        if(done){
                            if(!isGutpData)
                                f.renameTo(new File(filesDir.getPath() + "/" + f.getName() + ".pd"));
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
                else if(thisFile.isFile() && (thisFile.getName().endsWith(".dat") && thisFile.getName().contains("tokyo")))
                    filesToProcess.push(thisFile);
            }
        } catch(Exception e){
            e.printStackTrace();
        }
        
    }
}
