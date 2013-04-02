import java.io.*;
import java.net.*;
import java.util.*;
import java.text.*;
import org.json.simple.*;
import org.json.simple.parser.*;
import java.lang.StringBuffer;
import java.util.logging.Logger;
import java.util.logging.Level;
import java.util.concurrent.*;
import java.util.zip.*;

//simpleframework
import org.simpleframework.transport.connect.Connection;
import org.simpleframework.transport.connect.SocketConnection;
import org.simpleframework.http.core.Container;
import org.simpleframework.http.Response;
import org.simpleframework.http.Request;
import org.simpleframework.http.Query;
import javax.net.ssl.SSLContext;
import javax.net.ssl.KeyManagerFactory;
import java.security.KeyStore;


public class TsdbShim implements Container {
    protected static Logger logger = Logger.getLogger("TsdbShim");

    //localport
    private String bindAddress = "166.78.31.162";
    private static int localport = 1338;
    private static final String rootPath = "/";

    protected static Connection connection = null;
    //protected static Connection connectionHttps = null;
    public static ExecutorService executor=null;

    //opentsdb
    private static String tsdbHome = "/Users/jortiz/work/opentsdb/";
    private static String crtMetric = "tsdb mkmetric ";
    private static String tsdbUrl = "http://localhost:4242";
    private static String metricsq = "/suggest?type=metrics&q=";
    private static String dataq = "/q?start=2013/01/30-12:55:49&end=2013/01/30-12:59:00&m=avg:sbs.user.id&ascii";

    public TsdbShim(){
        try {
            //http
            logger.info("Address=" + bindAddress + "; port=" + localport);
            connection = new SocketConnection((Container)this);
            SocketAddress address = new InetSocketAddress(bindAddress, localport);
            connection.connect(address);
            logger.info("Listening for connection on " + bindAddress + ":" + localport);
            executor = Executors.newCachedThreadPool();
        } catch(Exception e){
            e.printStackTrace();
        }
    }

    public static void main(String[] args){
        TsdbShim shim = new TsdbShim();
    }

    public void handle(Request request, Response response){
        logger.info("Heard something");
        AsyncTask t = new AsyncTask(request, response);
        System.out.println("Async task initalized");
        executor.submit(t);
        //executor.execute(t);
    }

    public class AsyncTask implements Runnable{
        private Request request = null;
        private Response response = null;
        public AsyncTask(Request req, Response resp){
            request = req;
            response =resp;
            logger.info("Async task created: path=" + request.getPath().getPath());
        }
        
        public void run(){
            logger.info("Running async task");
            try {
                Query query = request.getQuery();
                logger.info("query_string=" + query.toString());
                JSONArray data = runTsdbQuery(request);
                sendResponse(request, response, 200, data.toString(), false, null);
            } catch(Exception e){
                logger.log(Level.WARNING, "", e);
            }
        }
    }

    public static JSONArray runTsdbQuery(Request request){
        URLConnection conn=null;
        BufferedReader reader = null;
        JSONArray data = new JSONArray();
        try {
            String path = request.getPath().getPath();

            Query query  = request.getQuery();

            String startTimeStr = query.get("start");
            String endTimeStr = query.get("end");
            //  format_exampe:: 2011/06/18-04:50:06
            SimpleDateFormat sdf  = new SimpleDateFormat("yyyy/MM/dd-HH:mm:ss");
            Date startTime = sdf.parse(startTimeStr, new ParsePosition(0));
            Date endTime = sdf.parse(endTimeStr, new ParsePosition(0));
            logger.info("start=[" + startTimeStr + "," + startTime.getTime()/1000 + "]");
            logger.info("end=[" + endTimeStr + "," + endTime.getTime()/1000 + "]");
            long start = startTime.getTime()/1000;
            long end = endTime.getTime()/1000;

            StringBuffer tsdbRestQueryBuf = new StringBuffer().append(tsdbUrl).append(path).append("?").
                append(query.toString());
            if(!query.containsKey("ascii"))
                tsdbRestQueryBuf.append("&ascii");
            String tsdbRestQuery = tsdbRestQueryBuf.toString();

            tsdbRestQuery = URLDecoder.decode(tsdbRestQuery, "UTF-8");
            logger.info("opentsdb url=" + tsdbRestQuery);

            URL url = new URL(tsdbRestQuery);
            conn= url.openConnection();
            conn.setDoInput(true);
            conn.setConnectTimeout(5000);
            reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line= null;
            StringTokenizer tokenizer = null;
            while((line=reader.readLine())!=null){
                tokenizer = new StringTokenizer(line, " ");
                if(tokenizer.hasMoreTokens()){
                    String metric = tokenizer.nextToken();
                    String tsStr = tokenizer.nextToken();
                    String valStr = tokenizer.nextToken();
                    String hostStr = tokenizer.nextToken();
                    //String labelStr = tokenizer.nextToken();

                    long thisTs = Long.parseLong(tsStr);
                    double val = Double.parseDouble(valStr);
                    if(thisTs>=start && thisTs<=end){
                        JSONArray pair = new JSONArray();
                        pair.add(thisTs);
                        pair.add(val);
                        data.add(pair);
                        //logger.info(pair.toString());
                    }
                }
            }

        } catch(Exception e){
            e.printStackTrace();
        } finally {
            try {
                if(reader!=null)
                    reader.close();
            } catch(Exception e){
                e.printStackTrace();
            }
        }
        return data;
    }

    public static void sendResponse(Request m_request, Response m_response, int code, String data, boolean internalCall, JSONObject internalResp){
        GZIPOutputStream gzipos = null; 
        PrintStream body = null;
        logger.info("Sending: " + data + "\tcode=" + code);
        try{
            if(internalCall){
                return;
            }

            logger.info("Sending Response: " + data);
            long time = System.currentTimeMillis();
            String enc = m_request.getValue("Accept-encoding");
            boolean gzipResp = false;
            if(enc!=null && enc.indexOf("gzip")>-1)
                gzipResp = true;
            m_response.set("Content-Type", "application/json");
            m_response.set("Server", "OpenTSDB Shim");
            m_response.set("Connection", "close");
            m_response.setDate("Date", time);
            m_response.setDate("Last-Modified", time);
            m_response.setCode(code);
            body = m_response.getPrintStream();
            if(data!=null && !gzipResp)
                body.println(data);
            else if(data!=null && gzipResp){
                m_response.set("Content-Encoding", "gzip");
                gzipos = new GZIPOutputStream((OutputStream)body);
                gzipos.write(data.getBytes());
                gzipos.close();
            }
        } catch(Exception e) {
            logger.log(Level.WARNING, "Exception thrown while sending response, closing exchange object",e);
        } finally {
            if(body!=null)
                body.close();
        }

    }
}
