import snaq.db.*;

import java.sql.*;
import java.io.*;
import java.net.*;
import java.util.*;
import org.json.simple.*;
import org.json.simple.parser.*;
import java.util.logging.Logger;
import java.util.logging.Level;
import java.lang.StringBuffer;
import javax.sql.rowset.serial.*;

public class SBSTablesLib{
    private static String HOST = "localhost";
	private static int PORT = 3306;
	private static String LOGIN = "root";
	private static String PW = "root";
	private static String dbName = "sbs";
	public static ConnectionPool pool = null;

    //opentsdb
    private static String tsdbHome = "/Users/jortiz/work/opentsdb/";
    private static String crtMetric = "tsdb mkmetric ";
    private static String tsdbUrl = "http://localhost:4242";
    private static String metricsq = "/suggest?type=metrics&q=";
    private static String dataq = "/q?start=2013/01/30-12:55:49&end=2013/01/30-12:59:00&m=avg:sbs.user.id&ascii";

    private static JSONParser parser =new JSONParser();
    
    public SBSTablesLib(){
        setupdb();
    }

    public void setupdb(){
		try {
			if(pool == null){
				String url = "jdbc:mysql://localhost/" + dbName;
				Driver driver = (Driver)Class.forName ("com.mysql.jdbc.Driver").newInstance ();
				DriverManager.registerDriver(driver);
                pool = new ConnectionPool("pangia_sbs",            /*poolname*/
                                            5,              /*minpool*/ 
                                            150,  /*maxpool: mysql has a max of 151 connections*/
                                            150,            /*maxsize*/
                                            500,           /*timeout*/ 
                                            url, LOGIN, PW);
                if(pool == null){
                    System.out.println("couldn't create a pool");
                    System.exit(1);
                } 
                pool.setCaching(true);
                pool.setAsyncDestroy(true);
                AutoCommitValidator validator = new AutoCommitValidator();
                pool.setValidator(validator);
                ConnectionPoolManager.registerGlobalShutdownHook();
			} else {
                System.out.println("pool already made");
			}
		} catch (Exception e){
            e.printStackTrace();
            System.exit(1);
		}
    }

    // returns: [id, username], both as strings
    public List<String> getUsernameId(String filepath){
        Connection conn = null;
        PreparedStatement ps = null;
        ArrayList<String> res = null;
        try  {
            conn = pool.getConnection(1000);
            String query = "select `id`,`username` from `data` where `filepath`=?";
            System.out.println(query.replaceFirst("\\?",filepath));
            ps= conn.prepareStatement(query);
            ps.setString(1, filepath);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                res = new ArrayList<String>(2);
                String id = new Long(rs.getLong("id")).toString();
                String username = rs.getString("username");
                res.add(id);
                res.add(username);
            }
        } catch(Exception e){
            e.printStackTrace();
        } finally {
            try {
                ps.close();
            } catch(Exception e){
                e.printStackTrace();
            }
        }
        return res;
    }

    public boolean containsMetric(String metric){
        URLConnection conn=null;
        BufferedReader reader = null;
        try {
            String query = new StringBuffer().append(metricsq).append(metric).toString();
            String tsdbRestQuery = new StringBuffer().append(tsdbUrl).append(query).toString();
            URL url = new URL(tsdbRestQuery);
            conn= url.openConnection();
            conn.setDoInput(true);
            conn.setConnectTimeout(5000);
            reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line= null;
            StringBuffer linesBuffer  = new StringBuffer();
            while((line=reader.readLine())!=null)
                linesBuffer.append(line);
            JSONArray response = (JSONArray)parser.parse(linesBuffer.toString());
            return response.contains(metric);
        } catch(Exception e){
            e.printStackTrace();
        } finally{
            try {
                reader.close();
            } catch(Exception e){
                e.printStackTrace();
            }
        }
        return false;
    }

    public boolean createMetric(String metric){
        try {
            String c = new StringBuffer().append(tsdbHome).append(crtMetric).
                append(metric).toString();
            Process p=Runtime.getRuntime().exec(c);
            p.waitFor();
            return true;
        } catch(Exception e){
            e.printStackTrace();
        }
        return false;
    }

}
